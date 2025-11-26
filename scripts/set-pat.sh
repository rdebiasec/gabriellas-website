#!/usr/bin/env bash
set -euo pipefail

PAT_FILE=".github-pat"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PAT_FILE_PATH="$REPO_ROOT/$PAT_FILE"

# Check if PAT is provided as environment variable or argument
PAT="${1:-${GITHUB_PAT:-}}"

if [[ -f "$PAT_FILE_PATH" ]]; then
  if [[ -n "$PAT" ]]; then
    # Non-interactive mode with PAT provided
    echo "⚠️  PAT file already exists. Updating..."
  else
    # Interactive mode
    echo "⚠️  PAT file already exists."
    read -rp "Do you want to update it? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
      echo "Cancelled."
      exit 0
    fi
  fi
fi

# Get PAT if not provided
if [[ -z "${PAT// }" ]]; then
  read -rsp "Enter your GitHub Personal Access Token: " PAT
  echo
fi

if [[ -z "${PAT// }" ]]; then
  echo "❌ PAT cannot be empty."
  echo "Usage: ./scripts/set-pat.sh [PAT]"
  echo "   Or: GITHUB_PAT=your_token ./scripts/set-pat.sh"
  exit 1
fi

# Store PAT with restricted permissions
echo "$PAT" > "$PAT_FILE_PATH"
chmod 600 "$PAT_FILE_PATH"

echo "✅ PAT stored securely in $PAT_FILE"
echo "   This file is gitignored and will not be committed."

