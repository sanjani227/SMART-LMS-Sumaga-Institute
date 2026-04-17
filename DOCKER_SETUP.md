# Docker MySQL Setup Guide for Sumaga LMS

## Prerequisites
- Docker Desktop installed and running on your machine
- The project files including `docker-compose.yml` and `database_schema.sql`

## Step-by-Step Instructions

### Step 1: Verify Docker Installation
Open PowerShell and check if Docker is properly installed:
```powershell
docker --version
docker-compose --version
```
You should see version numbers for both commands.

### Step 2: Check for Port Conflicts
Before starting the container, verify that port 3306 is not already in use:
```powershell
netstat -ano | findstr :3306
```
- If no output appears: **Port 3306 is free** ✅ (proceed to Step 3)
- If a process is listed: Note the PID and stop that process before continuing

### Step 3: Navigate to Project Directory
```powershell
cd C:\Users\VIVO\Desktop\SDP\SMART-LMS-Sumaga-Institute
```
Verify the files exist:
```powershell
ls
```
You should see: `docker-compose.yml` and `database_schema.sql`

### Step 4: Create .env File in Backend
Copy the example environment file:
```powershell
cd backend
Copy-Item .env.example .env
```
Verify the `.env` file was created:
```powershell
cat .env
```

### Step 5: Build and Start the MySQL Container
Navigate back to the project root:
```powershell
cd ..
```
Start the container with docker-compose:
```powershell
docker-compose up -d
```

Expected output:
```
Creating network "smart-lms-sumaga-institute_lms-network" with driver "bridge"
Creating volume "smart-lms-sumaga-institute_mysql_data" with driver "local"
Creating sumaga-mysql ... done
```

### Step 6: Wait for MySQL to Initialize
The healthcheck will verify MySQL is ready. Check the status:
```powershell
docker-compose ps
```

Wait until the STATUS column shows "Up" with a healthy status (this takes 10-30 seconds).

### Step 7: Verify MySQL is Running
Test the MySQL container:
```powershell
docker exec sumaga-mysql mysql -u root -psanjani2001 -e "SELECT @@version;"
```

You should see the MySQL version number.

### Step 8: Verify Database and Tables
Check if the database and tables were created:
```powershell
docker exec sumaga-mysql mysql -u root -psanjani2001 -e "USE sumaga_lms; SHOW TABLES;"
```

You should see output listing all tables like:
- announcements
- assessments
- assignments
- assessment_results
- assignment_submissions
- etc.

### Step 9: Connect Backend to Docker MySQL
Verify the `.env` file in `backend/` has correct credentials:
```powershell
cat backend\.env
```
Should show:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sanjani2001
DB_NAME=sumaga_lms
```

### Step 10: Test Backend Connection
Start the backend:
```powershell
cd backend
npm start
```

In the console, you should see:
```
✅ Database connected successfully to: sumaga_lms
✅ Database sync complete
Server is running on port 3000
```

## Useful Docker Commands

### View Container Logs
```powershell
docker-compose logs mysql
```

### Stop the Container
```powershell
docker-compose down
```

### Stop Container but Keep Data
```powershell
docker-compose stop
```

### Restart the Container
```powershell
docker-compose restart
```

### Remove Container and Data
⚠️ **WARNING: This deletes all data!**
```powershell
docker-compose down -v
```

### Access MySQL Interactive Shell
```powershell
docker exec -it sumaga-mysql mysql -u root -psanjani2001
```
Then inside MySQL:
```sql
USE sumaga_lms;
SHOW TABLES;
SELECT COUNT(*) FROM announcements;
```

## Troubleshooting

### Port 3306 Already in Use
```powershell
# Find the process using port 3306
netstat -ano | findstr :3306

# Kill the process (replace PID with the actual PID)
taskkill /PID <PID> /F

# Or change docker-compose to use different port: 3307:3306
```

### MySQL Container Won't Start
```powershell
# Check logs
docker-compose logs mysql

# Remove and rebuild
docker-compose down
docker-compose up -d
```

### Database Tables Not Created
```powershell
# Check if init.sql was mounted correctly
docker exec sumaga-mysql ls /docker-entrypoint-initdb.d/

# Manually import the schema
docker exec -i sumaga-mysql mysql -u root -psanjani2001 sumaga_lms < database_schema.sql
```

### Backend Can't Connect to MySQL
1. Verify container is running: `docker-compose ps`
2. Verify .env file has correct credentials
3. Try connecting directly: `docker exec sumaga-mysql mysql -u root -psanjani2001 -e "SELECT 1;"`

## Summary

Your MySQL database is now:
✅ Running in a Docker container
✅ Persisted using named volumes (survives restarts)
✅ Initialized with your schema automatically
✅ Accessible on `localhost:3306`
✅ Connected to your Node.js backend

The database will automatically restore all tables and data every time you run `docker-compose up -d`.
