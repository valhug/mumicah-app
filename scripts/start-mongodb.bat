@echo off
REM MongoDB Development Setup Script for Windows
REM This script starts MongoDB using Docker for local development

echo 🐳 Starting MongoDB with Docker...

REM Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker is not running. Please start Docker first.
    exit /b 1
)

REM Check if MongoDB container already exists
docker ps -a --format "table {{.Names}}" | findstr mumicah-mongodb >nul
if %ERRORLEVEL% equ 0 (
    echo 📦 MongoDB container already exists. Starting...
    docker start mumicah-mongodb
) else (
    echo 📦 Creating new MongoDB container...
    docker run -d --name mumicah-mongodb -p 27017:27017 -e MONGO_INITDB_DATABASE=mumicah-dev -v mumicah-mongodb-data:/data/db mongo:7.0
)

echo ✅ MongoDB is now running on localhost:27017
echo 🗄️ Database: mumicah-dev
echo 🛑 To stop: docker stop mumicah-mongodb
echo 🗑️ To remove: docker rm mumicah-mongodb ^&^& docker volume rm mumicah-mongodb-data
