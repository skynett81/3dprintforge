#!/bin/bash
# Install 3DPrintForge as a systemd user service
# Starts automatically on login and restarts on crash/update
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SERVICE_NAME="3dprintforge"
SERVICE_FILE="$PROJECT_DIR/3dprintforge.service"
USER_SERVICE_DIR="$HOME/.config/systemd/user"

echo "Installing 3DPrintForge systemd user service..."

# Create user systemd directory
mkdir -p "$USER_SERVICE_DIR"

# Generate service file with correct paths
cat > "$USER_SERVICE_DIR/$SERVICE_NAME.service" << EOF
[Unit]
Description=3DPrintForge — Self-hosted 3D Printer Dashboard
Documentation=https://skynett81.github.io/3dprintforge/
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=$PROJECT_DIR
ExecStart=$(which node) server/index.js
Restart=always
RestartSec=3
StartLimitIntervalSec=300
StartLimitBurst=10
Environment=NODE_ENV=production
KillSignal=SIGTERM
TimeoutStopSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=3dprintforge

[Install]
WantedBy=default.target
EOF

# Enable lingering so service runs without active login session
loginctl enable-linger "$USER" 2>/dev/null || true

# Reload and enable
systemctl --user daemon-reload
systemctl --user enable "$SERVICE_NAME"
systemctl --user start "$SERVICE_NAME"

echo ""
echo "  ✅ 3DPrintForge service installed and started"
echo ""
echo "  Commands:"
echo "    systemctl --user status $SERVICE_NAME    — check status"
echo "    systemctl --user restart $SERVICE_NAME   — restart"
echo "    systemctl --user stop $SERVICE_NAME      — stop"
echo "    journalctl --user -u $SERVICE_NAME -f    — view logs"
echo ""
echo "  The service will:"
echo "    • Start automatically on boot (via lingering)"
echo "    • Restart automatically on crash (after 3 seconds)"
echo "    • Restart cleanly after in-app updates"
echo ""
