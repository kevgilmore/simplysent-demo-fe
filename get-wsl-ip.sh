#!/bin/bash
# Get WSL2 IP address for accessing dev server from Windows Chrome
IP=$(hostname -I | awk '{print $1}')
echo "=========================================="
echo "WSL2 Dev Server URL:"
echo "http://${IP}:3000"
echo "=========================================="
echo ""
echo "Copy this URL to Chrome on Windows"


