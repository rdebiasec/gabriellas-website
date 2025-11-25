#!/usr/bin/env bash
set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "❌ Please run this script from inside the repository."
  exit 1
fi

COMMIT_MESSAGE=""
GITHUB_PAT=""

print_usage() {
  cat <<'EOF'
Usage: ./scripts/push.sh [-m "commit message"] [-t "github_pat"]

Flags:
  -m    Commit message (will prompt if omitted)
  -t    GitHub Personal Access Token (will prompt securely if omitted)
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

if [[ -z "${GITHUB_PAT// }" ]]; then
  read -rsp "GitHub Personal Access Token: " GITHUB_PAT
  echo
  if [[ -z "${GITHUB_PAT// }" ]]; then
    echo "❌ Personal Access Token cannot be empty."
    exit 1
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

