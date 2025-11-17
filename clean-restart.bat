@echo off
echo ========================================
echo   Clean Restart - Admin Dashboard
echo ========================================
echo.
echo Stopping all Node processes...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak > nul
echo.
echo Clearing Vite cache...
cd adminpanel
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist dist rmdir /s /q dist
echo.
echo Starting Backend Server...
cd ..
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
echo.
echo Starting Admin Panel...
start "Admin Panel" cmd /k "cd adminpanel && npm run dev"
echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo Backend: http://localhost:3000
echo Admin Panel: http://localhost:5173
echo.
echo WAIT for "ready in" message, then:
echo 1. Open http://localhost:5173
echo 2. Press Ctrl+Shift+R to hard refresh
echo.
echo ========================================
pause
