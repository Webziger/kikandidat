#!/usr/bin/env bash
# Ein-Befehl-Deploy für KIKANDIDAT
# Pusht alle Änderungen zu GitHub UND deployt sofort auf Vercel Production.
#
# Nutzung:
#   ./deploy.sh                 # Auto-Commit-Message
#   ./deploy.sh "Hero-Section geändert"   # Eigene Commit-Message

set -euo pipefail

cd "$(dirname "$0")"

MSG="${1:-Update $(date '+%Y-%m-%d %H:%M')}"

echo "▸ Git-Status..."
if [[ -z "$(git status --porcelain)" ]]; then
  echo "  Keine Änderungen — überspringe Commit & Push."
else
  echo "▸ Committe Änderungen..."
  git add -A
  git -c user.email="dev@kikandidat.local" -c user.name="KIKANDIDAT" commit -m "$MSG"
  echo "▸ Pushe nach GitHub (origin/main)..."
  git push origin main
fi

echo "▸ Deploye auf Vercel Production..."
vercel deploy --prod --yes

echo ""
echo "✓ Live: https://kikandidat.vercel.app"
