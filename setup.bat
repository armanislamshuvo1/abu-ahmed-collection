@echo off
echo ==================================================
echo   Abu Ahmed Collection - Local Windows Setup
echo ==================================================

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js detected.

REM Copy server .env if not exists
if not exist "server\.env" (
    echo [INFO] Creating server\.env from template...
    copy "server\.env.example" "server\.env"
    echo [OK] server\.env created.
) else (
    echo [OK] server\.env already exists.
)

REM Install server dependencies
echo.
echo [INFO] Installing backend dependencies...
cd server
call npm install
cd ..

REM Install client dependencies
echo.
echo [INFO] Installing frontend dependencies...
cd client
call npm install
cd ..

echo.
echo ==================================================
echo   Setup Complete!
echo ==================================================
echo.
echo 1. To populate database with sarees and admin user:
echo    cd server ^&^& npm run seed
echo.
echo 2. To start Backend:
echo    cd server ^&^& npm run dev
echo.
echo 3. To start Frontend:
echo    cd client ^&^& npm run dev
echo.
echo Visit: http://localhost:3000
echo Admin: http://localhost:3000/admin
echo Credentials: admin@abuahmedcollection.com / admin12345
pause
