[CmdletBinding()]
param(
  [switch]$TouchDocker   # only touch Docker if you pass this
)

# --- helpers ---
function Ensure-Admin(){
  $id=[Security.Principal.WindowsIdentity]::GetCurrent()
  $p =New-Object Security.Principal.WindowsPrincipal($id)
  if(-not $p.IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)){
    throw "Run as Administrator."
  }
}
function Info($m){ Write-Host "[$(Get-Date -Format HH:mm:ss)] $m" -ForegroundColor Cyan }
function Warn($m){ Write-Host "[$(Get-Date -Format HH:mm:ss)] WARNING: $m" -ForegroundColor Yellow }
function Success($m){ Write-Host "[$(Get-Date -Format HH:mm:ss)] $m" -ForegroundColor Green }

# Wait for service to reach desired state with timeout
function Wait-ServiceState($Name, $DesiredState, $TimeoutSec = 10){
  $timer = [Diagnostics.Stopwatch]::StartNew()
  while($timer.Elapsed.TotalSeconds -lt $TimeoutSec){
    $svc = Get-Service -Name $Name -ErrorAction SilentlyContinue
    if($svc -and $svc.Status -eq $DesiredState){
      return $true
    }
    Start-Sleep -Milliseconds 500
  }
  return $false
}

Ensure-Admin
Info "WSL Reset starting…"

# 0) Optional: Docker cleanup
if($TouchDocker){
  Info "Forcing Docker down…"
  try{
    & "$Env:ProgramFiles\Docker\Docker\DockerCli.exe" -Shutdown 2>$null
    Stop-Service "com.docker.service" -Force -ErrorAction SilentlyContinue
    Get-Process -Name "com.docker.*","Docker Desktop","Docker","dockerd","vpnkit" -ErrorAction SilentlyContinue | 
      Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
  }catch{
    Warn "Docker cleanup had issues (may not be installed)"
  }
}

# 1) Terminate all WSL distributions explicitly
Info "Terminating all WSL distributions…"
try{
  $distros = wsl -l -q 2>$null | Where-Object { $_ -and $_.Trim() }
  foreach($distro in $distros){
    $name = $distro.Trim()
    if($name){
      wsl -t $name 2>$null | Out-Null
    }
  }
  Start-Sleep -Milliseconds 500
}catch{
  Warn "Could not enumerate distros"
}

# 2) Force WSL shutdown (give it a moment)
Info "Shutting down WSL…"
wsl --shutdown 2>$null | Out-Null
Start-Sleep -Seconds 2

# 3) Kill all WSL-related processes aggressively
Info "Killing WSL processes…"
$processesToKill = @('wsl','wslhost','wslservice','vmmem','vmmemWSL','vmwp')
foreach($procName in $processesToKill){
  Get-Process -Name $procName -ErrorAction SilentlyContinue | 
    Stop-Process -Force -ErrorAction SilentlyContinue
}
# Force kill vmwp.exe and any remaining WSL processes
taskkill /F /IM vmwp.exe 2>$null | Out-Null
taskkill /F /IM wsl.exe 2>$null | Out-Null
taskkill /F /IM wslhost.exe 2>$null | Out-Null
Start-Sleep -Seconds 1

# 4) Kill WslService by PID if it's stuck
$svc = Get-CimInstance Win32_Service -Filter "Name='WslService'" -ErrorAction SilentlyContinue
if($svc -and $svc.ProcessId -and $svc.ProcessId -gt 0){
  Info "Force killing WslService PID $($svc.ProcessId)…"
  taskkill /PID $($svc.ProcessId) /F 2>$null | Out-Null
  Start-Sleep -Seconds 1
}

# 5) Stop critical services (with retries)
Info "Stopping virtualization services…"
$servicesToStop = @('WslService', 'vmcompute', 'hns')
foreach($serviceName in $servicesToStop){
  try{
    $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
    if($service){
      Info "Stopping $serviceName..."
      Stop-Service -Name $serviceName -Force -ErrorAction Stop
      if(-not (Wait-ServiceState $serviceName 'Stopped' 5)){
        Warn "$serviceName did not stop cleanly"
        # Try harder - kill the service process
        $svc = Get-CimInstance Win32_Service -Filter "Name='$serviceName'" -ErrorAction SilentlyContinue
        if($svc -and $svc.ProcessId -and $svc.ProcessId -gt 0){
          taskkill /PID $($svc.ProcessId) /F 2>$null | Out-Null
        }
      }
    }
  }catch{
    Warn "Error stopping $serviceName : $_"
  }
}
Start-Sleep -Seconds 2

# 6) Clean up WSL HNS networks
Info "Cleaning WSL network state…"
try{
  # Check if HNS module is available
  $hnsAvailable = Get-Command Get-HnsNetwork -ErrorAction SilentlyContinue
  if($hnsAvailable){
    $wslNetworks = Get-HnsNetwork -ErrorAction SilentlyContinue | 
      Where-Object { $_.Name -like '*WSL*' -or $_.Name -like '*nat*' }
    foreach($net in $wslNetworks){
      try{
        Info "Removing HNS network: $($net.Name)"
        Remove-HnsNetwork $net -ErrorAction SilentlyContinue
      }catch{
        # Ignore errors - network might be in use
      }
    }
  }else{
    # Fallback: use netsh to reset network
    netsh int ipv4 reset 2>$null | Out-Null
  }
}catch{
  Warn "Network cleanup had issues (non-critical)"
}
Start-Sleep -Seconds 1

# 7) Start services in correct order
Info "Starting services…"
$servicesToStart = @('hns', 'vmcompute', 'WslService')
foreach($serviceName in $servicesToStart){
  try{
    $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
    if($service){
      Info "Starting $serviceName..."
      Start-Service -Name $serviceName -ErrorAction Stop
      if(Wait-ServiceState $serviceName 'Running' 10){
        Success "$serviceName started"
      }else{
        Warn "$serviceName may not have started properly"
      }
    }
  }catch{
    Warn "Error starting $serviceName : $_"
  }
}
Start-Sleep -Seconds 2

# 8) Verify hypervisor is enabled
try{
  $bcd = bcdedit /enum "{current}" 2>$null | Select-String -Pattern 'hypervisorlaunchtype'
  if($bcd -and $bcd.ToString().ToLower().Contains('off')){
    Warn "Hypervisor is OFF - enabling for next boot"
    bcdedit /set hypervisorlaunchtype auto | Out-Null
    Warn "You may need to reboot for WSL to work properly"
  }
}catch{
  Warn "Could not check hypervisor state"
}

# 9) Give WSL a moment to initialize
Info "Waiting for WSL to initialize…"
Start-Sleep -Seconds 3

# 10) Check WSL status
Info "WSL Status:"
try{
  wsl --status 2>&1
  wsl -l -v 2>&1
}catch{
  Warn "Could not get WSL status"
}

# 11) Test WSL with timeout
Info "Testing WSL connection…"
$testJob = Start-Job -ScriptBlock { 
  wsl -e echo "WSL connection OK" 
}
$completed = Wait-Job -Job $testJob -Timeout 10
if($completed){
  $result = Receive-Job -Job $testJob
  if($result -match "OK"){
    Success "WSL is responding!"
  }else{
    Warn "WSL test gave unexpected output"
  }
}else{
  Warn "WSL test timed out - may need another minute to fully start"
}
Remove-Job -Job $testJob -Force -ErrorAction SilentlyContinue

Success "WSL reset complete. If still frozen, try: 1) Reboot 2) Check Windows Updates 3) Run 'wsl --update'"




