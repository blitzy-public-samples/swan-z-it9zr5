#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Setting up Swan-Z Style App development environment..."

# Check for required system dependencies
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install PostgreSQL and try again."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Set up environment variables
echo "Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo ".env file created from .env.example"
else
    echo ".env file already exists. Skipping..."
fi

# Initialize and seed the database
echo "Initializing database..."
npm run db:migrate || { echo "Database migration failed"; exit 1; }
echo "Seeding database..."
npm run db:seed || { echo "Database seeding failed"; exit 1; }

# Set up Redis
echo "Setting up Redis..."
if ! command -v redis-cli &> /dev/null; then
    echo "Redis is not installed. Please install Redis and try again."
    exit 1
fi
redis-cli ping > /dev/null 2>&1 || { echo "Redis server is not running. Please start Redis and try again."; exit 1; }

# Set up AI model dependencies
echo "Setting up AI model dependencies..."
pip install -r requirements.txt || { echo "Failed to install AI model dependencies"; exit 1; }

# Download AI model data
echo "Downloading AI model data..."
# Add commands to download necessary AI model data
# For example: wget https://example.com/ai-model-data.zip && unzip ai-model-data.zip -d ./ai-data

# Build the application
echo "Building the application..."
npm run build || { echo "Application build failed"; exit 1; }

echo "Setup complete! You can now start the development server with 'npm run dev'."

# Add cleanup option
if [ "$1" == "--cleanup" ]; then
    echo "Cleaning up development environment..."
    rm -rf node_modules
    rm -f .env
    # Add commands to drop database tables or delete the database
    # Add commands to remove downloaded AI model data
    echo "Cleanup complete."
fi