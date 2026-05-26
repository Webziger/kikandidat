#!/usr/bin/env bash
# Ein-Befehl-Deploy für KIKANDIDAT
#
# Nutzung:
#   ./deploy.sh                                      # Nur committen & deployen, was lokal liegt
#   ./deploy.sh "Commit-Nachricht"                   # Mit eigener Commit-Message
#   ./deploy.sh ~/Downloads/KIKANDIDAT-3             # Ordner austauschen + deploy
#   ./deploy.sh ~/Downloads/KIKANDIDAT-3.zip         # Zip austauschen + deploy
#   ./deploy.sh ~/Downloads/KIKANDIDAT-3 "Neue Hero" # Ordner + eigene Message

set -euo pipefail
cd "$(dirname "$0")"
REPO_DIR="$(pwd)"

SRC=""
MSG=""

# Argumente parsen: erstes Arg kann Pfad ODER Message sein
for arg in "$@"; do
  if [[ -d "$arg" || -f "$arg" ]]; then
    SRC="$arg"
  else
    MSG="$arg"
  fi
done

# Wenn Quelle angegeben → austauschen
if [[ -n "$SRC" ]]; then
  echo "▸ Tausche Website-Inhalte aus: $SRC"

  TMP_DIR=""
  if [[ -f "$SRC" && "$SRC" == *.zip ]]; then
    TMP_DIR="$(mktemp -d)"
    echo "  Entpacke Zip nach $TMP_DIR..."
    unzip -q "$SRC" -d "$TMP_DIR"
    SYNC_FROM="$TMP_DIR"
  elif [[ -d "$SRC" ]]; then
    SYNC_FROM="$SRC"
  else
    echo "✗ Quelle ist weder Ordner noch .zip: $SRC"
    exit 1
  fi

  # Wenn Zip nur einen einzelnen Unterordner enthält → in den reingehen
  if [[ -n "$TMP_DIR" ]]; then
    INNER_COUNT=$(find "$SYNC_FROM" -mindepth 1 -maxdepth 1 | wc -l | tr -d ' ')
    if [[ "$INNER_COUNT" == "1" ]]; then
      INNER=$(find "$SYNC_FROM" -mindepth 1 -maxdepth 1)
      if [[ -d "$INNER" ]]; then
        SYNC_FROM="$INNER"
      fi
    fi
  fi

  echo "  Synchronisiere $SYNC_FROM → $REPO_DIR"
  rsync -a --delete \
    --exclude '.git' \
    --exclude '.gitignore' \
    --exclude 'vercel.json' \
    --exclude 'README.md' \
    --exclude 'deploy.sh' \
    --exclude '.vercel' \
    "$SYNC_FROM/" "$REPO_DIR/"

  [[ -n "$TMP_DIR" ]] && rm -rf "$TMP_DIR"
fi

# Commit-Message Default
MSG="${MSG:-Update $(date '+%Y-%m-%d %H:%M')}"

echo "▸ Git-Status..."
if [[ -z "$(git status --porcelain)" ]]; then
  echo "  Keine Änderungen — überspringe Commit & Push."
else
  CHANGED=$(git status --porcelain | wc -l | tr -d ' ')
  echo "  $CHANGED Datei(en) geändert"
  echo "▸ Committe: \"$MSG\""
  git add -A
  git -c user.email="dev@kikandidat.local" -c user.name="KIKANDIDAT" commit -m "$MSG"
  echo "▸ Pushe nach GitHub (origin/main)..."
  git push origin main
fi

echo "▸ Deploye auf Vercel Production..."
vercel deploy --prod --yes

echo ""
echo "✓ Live: https://kikandidat.vercel.app"
