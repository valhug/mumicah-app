# MongoDB Setup Guide

This guide explains how to set up MongoDB for the Mumicah project.

## Option 1: Docker (Recommended for Development)

### Prerequisites
- Docker Desktop installed and running

### Setup Steps
1. **Start Docker Desktop** on your machine
2. **Run the MongoDB setup script**:
   ```bash
   pnpm run mongodb:start
   ```
   This will:
   - Create a MongoDB container named `mumicah-mongodb`
   - Expose it on port `27017`
   - Create a volume for data persistence
   - Set up the `mumicah-dev` database

3. **Initialize the database**:
   ```bash
   pnpm run db:init
   ```

4. **Seed with sample data** (optional):
   ```bash
   pnpm run db:seed
   ```

### MongoDB Management Commands
- **Start MongoDB**: `pnpm run mongodb:start`
- **Stop MongoDB**: `pnpm run mongodb:stop`
- **Remove MongoDB** (deletes all data): `pnpm run mongodb:remove`

## Option 2: MongoDB Atlas (Cloud)

### Setup Steps
1. **Create a MongoDB Atlas account** at https://www.mongodb.com/atlas
2. **Create a new cluster** (free tier available)
3. **Get your connection string** from the Atlas dashboard
4. **Update `.env.local`** with your Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mumicah-dev
   ```

## Option 3: Local MongoDB Installation

### Setup Steps
1. **Install MongoDB Community Edition** from https://www.mongodb.com/try/download/community
2. **Start MongoDB** service
3. **Ensure `.env.local`** has the local connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/mumicah-dev
   ```

## Database Scripts

After MongoDB is running, use these scripts to manage your database:

- **Initialize database and create indexes**: `pnpm run db:init`
- **Seed database with sample data**: `pnpm run db:seed`
- **Clean up old/test data**: `pnpm run db:cleanup`
- **Full setup (init + seed)**: `pnpm run db:setup`

## Connection String Format

The MongoDB URI should be in one of these formats:

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/mumicah-dev

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mumicah-dev

# Local MongoDB with authentication
MONGODB_URI=mongodb://username:password@localhost:27017/mumicah-dev
```

## Troubleshooting

### Docker Issues
- **"Docker is not running"**: Start Docker Desktop
- **Port 27017 already in use**: Stop other MongoDB instances or change the port in the script
- **Permission denied**: Make sure Docker Desktop is running with appropriate permissions

### Connection Issues
- **"ECONNREFUSED"**: MongoDB is not running
- **"Authentication failed"**: Check your username/password in the connection string
- **"Server selection timeout"**: Check network connectivity and MongoDB server status

### Database Issues
- **"Collection not found"**: Run `pnpm run db:init` to create collections and indexes
- **"Index already exists"**: This is usually a warning and can be ignored
- **Data inconsistency**: Run `pnpm run db:cleanup` followed by `pnpm run db:setup`

## Next Steps

Once MongoDB is set up and running:

1. **Test the connection** by running the initialization script
2. **Start the development server** with `pnpm dev`
3. **Check the logs** for any database connection issues
4. **Use MongoDB Compass** (optional) to visually inspect your database at `mongodb://localhost:27017`
