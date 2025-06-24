#!/bin/bash

# MongoDB Development Setup Script
# This script starts MongoDB using Docker for local development

echo "🐳 Starting MongoDB with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if MongoDB container already exists
if docker ps -a --format 'table {{.Names}}' | grep -q 'mumicah-mongodb'; then
    echo "📦 MongoDB container already exists. Starting..."
    docker start mumicah-mongodb
else
    echo "📦 Creating new MongoDB container..."
    docker run -d \
        --name mumicah-mongodb \
        -p 27017:27017 \
        -e MONGO_INITDB_DATABASE=mumicah-dev \
        -v mumicah-mongodb-data:/data/db \
        mongo:7.0
fi

echo "✅ MongoDB is now running on localhost:27017"
echo "🗄️ Database: mumicah-dev"
echo "🛑 To stop: docker stop mumicah-mongodb"
echo "🗑️ To remove: docker rm mumicah-mongodb && docker volume rm mumicah-mongodb-data"
