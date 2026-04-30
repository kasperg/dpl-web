#!/bin/bash
# Test visual regression across commits after the baseline commit.
#
# This script:
# 1. Checks out the baseline commit and generates reference snapshots
# 2. For each subsequent commit, rebuilds the design system, deploys
#    CSS to the theme, and runs the visual regression comparison
# 3. Reports pass/fail for each commit
#
# Prerequisites:
# - CMS Docker environment running (task ci:reset)
# - Run from the repository root
#
# Usage: bash cms/scripts/test-visual-regression-per-commit.sh

set -euo pipefail

BASELINE_COMMIT="93563ec5b"
BRANCH="design-system-strict-bem-v2"
DS_DIR="design-system"
THEME_ASSETS="cms/web/themes/custom/novel/assets/dpl-design-system"
CMS_DIR="cms"

# Get commits after baseline
COMMITS=$(git log --reverse --format="%H %s" "${BASELINE_COMMIT}..${BRANCH}" | head -20)

if [ -z "$COMMITS" ]; then
  echo "No commits found after ${BASELINE_COMMIT}"
  exit 1
fi

echo "=== Commits to test ==="
echo "$COMMITS"
echo ""

# Save current branch
ORIGINAL_BRANCH=$(git branch --show-current)

# Function to build design system and deploy to theme
build_and_deploy() {
  echo "  Building design system..."
  (cd "$DS_DIR" && yarn build --stats errors-only 2>&1) || {
    echo "  ERROR: Design system build failed"
    return 1
  }
  echo "  Deploying CSS to theme..."
  mkdir -p "$THEME_ASSETS/css"
  cp -r "$DS_DIR/build/css/"* "$THEME_ASSETS/css/"
  echo "  Done."
}

# Step 1: Generate baselines at the baseline commit
echo "=== Generating baselines at ${BASELINE_COMMIT} ==="
git checkout "$BASELINE_COMMIT" --quiet
build_and_deploy
echo "  Generating baseline snapshots..."
(cd "$CMS_DIR" && task ci:cypress:visual-regression:update 2>&1 | tail -10)
echo ""

# Step 2: Test each subsequent commit
PASS=0
FAIL=0
RESULTS=""

while IFS= read -r line; do
  COMMIT_SHA=$(echo "$line" | cut -d' ' -f1)
  COMMIT_MSG=$(echo "$line" | cut -d' ' -f2-)
  SHORT_SHA=$(echo "$COMMIT_SHA" | cut -c1-10)

  echo "=== Testing commit ${SHORT_SHA}: ${COMMIT_MSG} ==="
  git checkout "$COMMIT_SHA" --quiet

  build_and_deploy

  echo "  Running visual regression comparison..."
  if (cd "$CMS_DIR" && task ci:cypress:visual-regression 2>&1 | tail -10); then
    echo "  PASS: No visual regressions"
    PASS=$((PASS + 1))
    RESULTS="${RESULTS}\n  PASS  ${SHORT_SHA} ${COMMIT_MSG}"
  else
    echo "  FAIL: Visual regressions detected!"
    FAIL=$((FAIL + 1))
    RESULTS="${RESULTS}\n  FAIL  ${SHORT_SHA} ${COMMIT_MSG}"
    # Copy diff images for review
    if [ -d "$CMS_DIR/cypress/snapshots/__diff_output__" ]; then
      mkdir -p "$CMS_DIR/cypress/snapshots/__diff_per_commit__/${SHORT_SHA}"
      cp -r "$CMS_DIR/cypress/snapshots/__diff_output__/"* \
        "$CMS_DIR/cypress/snapshots/__diff_per_commit__/${SHORT_SHA}/" 2>/dev/null || true
    fi
  fi
  echo ""
done <<< "$COMMITS"

# Restore original branch
git checkout "$ORIGINAL_BRANCH" --quiet 2>/dev/null || git checkout "$BRANCH" --quiet

echo "=== Summary ==="
echo "  Passed: ${PASS}"
echo "  Failed: ${FAIL}"
echo -e "$RESULTS"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "Diff images saved to: ${CMS_DIR}/cypress/snapshots/__diff_per_commit__/"
  exit 1
fi
