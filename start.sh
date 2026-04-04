#!/bin/bash
# Start 3DPrintForge
# Usage: ./start.sh           — normal mode
#        ./start.sh --demo    — demo mode with 3 mock printers
cd "$(dirname "$0")"
if [ "$1" = "--demo" ]; then
  shift
  export BAMBU_DEMO=true
fi
exec node server/index.js "$@"
