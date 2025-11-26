#!/usr/bin/env bash
set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "❌ Please run this script from inside the repository."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get repo root using git (more reliable than path manipulation)
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$SCRIPT_DIR")"
PAT_FILE="$REPO_ROOT/.github-pat"

COMMIT_MESSAGE=""
GITHUB_PAT=""

print_usage() {
  cat <<'EOF'
Usage: ./push.sh [-m "commit message"] [-t "github_pat"]

Flags:
  -m    Commit message (will prompt if omitted)
  -t    GitHub Personal Access Token (uses stored PAT if available, otherwise prompts)
  
To store your PAT for future use, run: ./scripts/set-pat.sh
EOF
}

while getopts ":m:t:h" opt; do
  case "$opt" in
    m) COMMIT_MESSAGE="$OPTARG" ;;
    t) GITHUB_PAT="$OPTARG" ;;
    h)
      print_usage
      exit 0
      ;;
    \?)
      echo "❌ Invalid option: -$OPTARG"
      print_usage
      exit 1
      ;;
    :)
      echo "❌ Option -$OPTARG requires an argument."
      print_usage
      exit 1
      ;;
  esac
done

shift $((OPTIND - 1))

if [[ -z "${COMMIT_MESSAGE// }" ]]; then
  read -rp "Commit message: " COMMIT_MESSAGE
  while [[ -z "${COMMIT_MESSAGE// }" ]]; do
    read -rp "Commit message cannot be empty. Please enter one: " COMMIT_MESSAGE
  done
fi

# Try to load PAT from file if not provided via flag
if [[ -z "${GITHUB_PAT// }" ]]; then
  if [[ -f "$PAT_FILE" ]]; then
    GITHUB_PAT="$(cat "$PAT_FILE")"
    echo "✅ Using stored PAT from .github-pat"
  else
    read -rsp "GitHub Personal Access Token (or run ./scripts/set-pat.sh to store it): " GITHUB_PAT
    echo
    if [[ -z "${GITHUB_PAT// }" ]]; then
      echo "❌ Personal Access Token cannot be empty."
      echo "💡 Tip: Run ./scripts/set-pat.sh to store your PAT for future use."
      exit 1
    fi
  fi
fi

git add -A

if git diff --cached --quiet; then
  echo "ℹ️  No changes staged. Skipping commit but will still push."
else
  git commit -m "$COMMIT_MESSAGE"
fi

REPO_URL="https://github.com/rdebiasec/gabriellas-website.git"
AUTH_REPO_URL="https://${GITHUB_PAT}@github.com/rdebiasec/gabriellas-website.git"

echo "🚀 Pushing to $REPO_URL..."
git push "$AUTH_REPO_URL" HEAD:main

unset GITHUB_PAT

echo "✅ Push complete. Token was used only for this command."

