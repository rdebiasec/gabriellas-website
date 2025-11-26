#!/usr/bin/env bash
set -euo pipefail

# Simple deployment script - just say "deploy" or "push" to trigger
# Usage: ./scripts/deploy.sh [commit message]
# Or say: "deploy with message: your message here"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_ROOT"

# Get commit message from argument
if [[ -z "${1:-}" ]]; then
  echo "❌ Commit message is required."
  echo ""
  echo "Usage: ./scripts/deploy.sh \"Your commit message\""
  echo ""
  echo "Or from Cursor, say: \"deploy with message: your description here\""
  exit 1
fi

COMMIT_MESSAGE="$1"

echo "🚀 Deploying to GitHub Pages..."
echo "📝 Commit message: $COMMIT_MESSAGE"
echo ""

# Run the push script
"$REPO_ROOT/push.sh" -m "$COMMIT_MESSAGE"

echo ""
echo "✅ Deployment initiated! Check GitHub Actions for build status."

