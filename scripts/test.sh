#!/bin/bash

# Environment Setup
set -e
export NODE_ENV=test
export PYTHON_ENV=test

# Frontend Tests
echo "Running Frontend Tests..."
cd src/frontend
npm run test -- --coverage
cd ../..

# Backend Tests
echo "Running Backend Tests..."
cd src/backend
npm run test -- --coverage
cd ../..

# AI Model Tests
echo "Running AI Model Tests..."
cd src/ai
python -m pytest tests/ --cov=models --cov=utils
cd ../..

# Integration Tests
echo "Running Integration Tests..."
npm run test:integration

# E2E Tests
echo "Running E2E Tests..."
npm run test:e2e

# Test Summary
echo "All tests completed successfully!"