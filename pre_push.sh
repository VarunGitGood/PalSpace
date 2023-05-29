#!/bin/bash

# Run format 
npm run format
FORMAT_CHECK_STATUS=$?

# Run lint 
npm run lint
LINT_CHECK_STATUS=$?


if [ $FORMAT_CHECK_STATUS -ne 0 ] || [ $LINT_CHECK_STATUS -ne 0 ]; then
    echo "Format or lint check failed. Please fix the issues before pushing."
    exit 1
fi