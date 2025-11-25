#!/usr/bin/env bash
set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "❌ Please run this script from inside the repository."
  exit 1
fi

read -rp "Commit message: " COMMIT_MESSAGE
while [[ -z "${COMMIT_MESSAGE// }" ]]; do
  read -rp "Commit message cannot be empty. Please enter one: " COMMIT_MESSAGE
done

read -rsp "GitHub Personal Access Token: " GITHUB_PAT
echo
if [[ -z "${GITHUB_PAT// }" ]]; then
  echo "❌ Personal Access Token cannot be empty."
  exit 1
fi

git add -A

if git diff --cached --quiet; then
  echo "ℹ️  No changes staged for commit. Exiting without pushing."
  exit 0
fi

git commit -m "$COMMIT_MESSAGE"

REPO_URL="https://github.com/rdebiasec/gabriellas-website.git"
AUTH_REPO_URL="https://${GITHUB_PAT}@github.com/rdebiasec/gabriellas-website.git"

echo "🚀 Pushing to $REPO_URL..."
git push "$AUTH_REPO_URL" HEAD:main

unset GITHUB_PAT

echo "✅ Push complete. Token was used only for this command."

