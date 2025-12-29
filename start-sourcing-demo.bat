@echo off
echo ========================================
echo WinnerLens - 도매 소싱 자동화 데모
echo ========================================
echo.

echo [1/3] Docker 서비스 확인 중...
docker-compose up -d
timeout /t 3 /nobreak >nul

echo.
echo [2/3] 백엔드 서버 시작 중...
cd backend
start "WinnerLens Backend" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo [3/3] 프론트엔드 서버 시작 중...
cd ..\frontend
start "WinnerLens Frontend" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo 서버가 시작되었습니다!
echo ========================================
echo.
echo 백엔드: http://localhost:3000
echo 프론트엔드: http://localhost:3001
echo.
echo 브라우저에서 http://localhost:3001/dashboard/sourcing 접속하세요
echo.
echo 종료하려면 각 창에서 Ctrl+C를 누르세요
echo ========================================
pause
