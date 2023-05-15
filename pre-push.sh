#!/bin/bash

# Run format check
npm run format:check

# Run lint check
npm run lint

# If either of the checks fail, exit with a non-zero status
if [ $? -ne 0 ]; then
    echo "Format or lint check failed. Please fix the issues before pushing."
    exit 1
fi
