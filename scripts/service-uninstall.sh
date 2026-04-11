#!/bin/bash
# Remove 3DPrintForge systemd user service
set -e

SERVICE_NAME="3dprintforge"

echo "Removing 3DPrintForge systemd user service..."

systemctl --user stop "$SERVICE_NAME" 2>/dev/null || true
systemctl --user disable "$SERVICE_NAME" 2>/dev/null || true
rm -f "$HOME/.config/systemd/user/$SERVICE_NAME.service"
systemctl --user daemon-reload

echo "  ✅ Service removed"
