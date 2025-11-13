@echo off
echo Testing Backend Server...
echo.

echo 1. Testing health endpoint...
curl -s http://localhost:3000/health
echo.
echo.

echo 2. Testing ad-rewards status endpoint...
curl -s http://localhost:3000/api/ad-rewards/status/test-wallet
echo.
echo.

echo 3. Testing ad-rewards claim endpoint...
curl -s -X POST http://localhost:3000/api/ad-rewards/claim -H "Content-Type: application/json" -d "{\"walletAddress\":\"test-wallet\"}"
echo.
echo.

echo Backend tests complete!
pause
