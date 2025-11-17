@echo off
echo ========================================
echo   Restarting Admin Panel with Styles
echo ========================================
echo.
echo Step 1: Stopping any running processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak > nul
echo.
echo Step 2: Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
echo.
echo Step 3: Starting Admin Panel...
start "Admin Panel" cmd /k "cd adminpanel && npm run dev"
echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo Backend: http://localhost:3000
echo Admin Panel: http://localhost:5173
echo.
echo IMPORTANT: After the browser opens:
echo 1. Press Ctrl+Shift+R to hard refresh
echo 2. Or press Ctrl+F5
echo.
echo This will load all the beautiful styles!
echo ========================================
pause
