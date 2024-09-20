#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Function to log messages with timestamps
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function to handle errors
handle_error() {
    log "Error occurred in build process. Exiting."
    exit 1
}

# Set up error handling
trap 'handle_error' ERR

log "Building Swan-Z Style App..."

# Install dependencies
log "Installing dependencies..."
npm ci

# Run linter
log "Running linter..."
npm run lint

# Run tests
log "Running tests..."
npm test

# Run integration tests (if implemented)
if [ -f "npm run test:integration" ]; then
    log "Running integration tests..."
    npm run test:integration
fi

# Build the application
log "Compiling the application..."
npm run build

# Generate source maps
log "Generating source maps..."
npm run build:sourcemaps

# Build mobile app (if applicable)
log "Building mobile app..."
npm run build:mobile

# Optimize and minify assets
log "Optimizing assets..."
npm run optimize-assets

# Generate API documentation
log "Generating API documentation..."
npm run docs

# Validate build output
log "Validating build output..."
npm run validate-build

# Tag the build (example using git tag)
BUILD_VERSION=$(node -p "require('./package.json').version")
git tag -a "v${BUILD_VERSION}" -m "Build version ${BUILD_VERSION}"
log "Tagged build as v${BUILD_VERSION}"

log "Build process completed successfully!"