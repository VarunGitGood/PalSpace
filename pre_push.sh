#!/bin/bash

# Run format check
npm run format:check
FORMAT_CHECK_STATUS=$?

# Run lint check
npm run lint:check
LINT_CHECK_STATUS=$?

# If either the format check or the lint check fails, exit with a non-zero status
if [ $FORMAT_CHECK_STATUS -ne 0 ] || [ $LINT_CHECK_STATUS -ne 0 ]; then
    echo "Format or lint check failed. Please fix the issues before pushing."
    exit 1
fi