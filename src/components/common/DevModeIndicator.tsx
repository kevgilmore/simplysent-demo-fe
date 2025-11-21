import { useState, useEffect, useRef } from 'react';
import { 
  isDevModeEnabled, 
  isLocalModeEnabled, 
  isSandboxHeaderEnabled, 
  isProdMode,
  isMockRecommendationsEnabled,
  setLocalMode,
  setSandboxHeader,
  setProdMode,
  setMockRecommendations
} from '../../utils/apiConfig';

interface DevModeIndicatorProps {
  className?: string;
}

export function DevModeIndicator({ className = "" }: DevModeIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [devModeEnabled, setDevModeEnabledState] = useState(false);
  const [localModeEnabled, setLocalModeEnabledState] = useState(false);
  const [sandboxHeaderEnabled, setSandboxHeaderEnabledState] = useState(false);
  const [mockRecommendationsEnabled, setMockRecommendationsEnabledState] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update state when localStorage changes
  useEffect(() => {
    const updateState = () => {
      setDevModeEnabledState(isDevModeEnabled());
      setLocalModeEnabledState(isLocalModeEnabled());
      setSandboxHeaderEnabledState(isSandboxHeaderEnabled());
      setMockRecommendationsEnabledState(isMockRecommendationsEnabled());
    };

    updateState();
    const interval = setInterval(updateState, 100);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (!devModeEnabled) {
    return null; // Only show if dev mode is enabled
  }

  const prodModeActive = isProdMode();

  const getModeInfo = () => {
    if (localModeEnabled) {
      return { color: 'bg-yellow-500', text: 'Dev' };
    }
    if (sandboxHeaderEnabled) {
      return { color: 'bg-green-500', text: 'Dev' };
    }
    return { color: 'bg-red-500', text: 'Prod' };
  };

  const modeInfo = getModeInfo();

  const handleClearLocalStorage = () => {
    if (confirm('Are you sure you want to clear all local storage? This will reset all settings.')) {
      localStorage.clear();
      setIsOpen(false);
      window.location.reload();
    }
  };

  const handleLocalSelect = () => {
    setLocalMode(true);
    setIsOpen(false);
    window.location.reload();
  };

  const handleSandboxSelect = () => {
    setSandboxHeader(true);
    setIsOpen(false);
    window.location.reload();
  };

  const handleProdSelect = () => {
    setProdMode();
    setIsOpen(false);
    window.location.reload();
  };

  const handleMockRecommendationsToggle = (enabled: boolean) => {
    setMockRecommendations(enabled);
  };

  return (
    <div className={`fixed bottom-4 left-4 z-50 ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
        title="Dev Mode Settings"
      >
        <div className={`w-2 h-2 rounded-full ${modeInfo.color}`}></div>
        <span className="text-sm font-medium text-gray-700">{modeInfo.text}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
          <div className="py-1">
            <button
              onClick={handleLocalSelect}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
            >
              <span>Local</span>
              {localModeEnabled && <span className="text-green-600">✓</span>}
            </button>
            <button
              onClick={handleSandboxSelect}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
            >
              <span>Sandbox</span>
              {sandboxHeaderEnabled && <span className="text-green-600">✓</span>}
            </button>
            <button
              onClick={handleProdSelect}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
            >
              <span>Prod</span>
              {prodModeActive && <span className="text-green-600">✓</span>}
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <label className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between cursor-pointer">
              <span>Mock Recommender</span>
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={mockRecommendationsEnabled}
                  onChange={(e) => handleMockRecommendationsToggle(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-10 h-5 rounded-full transition-colors flex items-center ${
                    mockRecommendationsEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform transform shadow-sm ${
                      mockRecommendationsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  ></div>
                </div>
              </div>
            </label>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={handleClearLocalStorage}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center justify-between"
            >
              <span>Clear Local Storage</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

