# WinnerLens 개발 서버 자동 실행 스크립트
# PowerShell 스크립트

Write-Host "🚀 WinnerLens 개발 환경 시작 중..." -ForegroundColor Cyan
Write-Host ""

# 1. Docker 컨테이너 확인 및 시작
Write-Host "📦 Step 1: Docker 컨테이너 확인 중..." -ForegroundColor Yellow
$dockerRunning = docker info 2>$null
if (-not $dockerRunning) {
    Write-Host "❌ Docker가 실행되지 않았습니다. Docker Desktop을 실행해주세요." -ForegroundColor Red
    Write-Host "   Docker Desktop 실행 후 다시 시도해주세요." -ForegroundColor Red
    pause
    exit 1
}

Write-Host "✅ Docker 실행 중" -ForegroundColor Green

# Docker Compose 시작
Write-Host "📦 PostgreSQL 및 Redis 시작 중..." -ForegroundColor Yellow
docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker 컨테이너 시작 실패" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✅ 데이터베이스 준비 완료" -ForegroundColor Green
Write-Host ""

# 2. 환경 변수 확인
Write-Host "🔧 Step 2: 환경 변수 확인 중..." -ForegroundColor Yellow

# 백엔드 .env 확인
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  backend\.env 파일이 없습니다. .env.example에서 복사합니다..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "⚠️  backend\.env 파일을 열어 OpenAI API 키를 설정해주세요!" -ForegroundColor Yellow
    Write-Host "   파일 위치: backend\.env" -ForegroundColor Yellow
}

# 프론트엔드 .env.local 확인
if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "⚠️  frontend\.env.local 파일이 없습니다. 생성합니다..." -ForegroundColor Yellow
    "NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1" | Out-File -FilePath "frontend\.env.local" -Encoding UTF8
}

Write-Host "✅ 환경 변수 준비 완료" -ForegroundColor Green
Write-Host ""

# 3. 의존성 확인
Write-Host "📚 Step 3: 의존성 확인 중..." -ForegroundColor Yellow

# 백엔드 node_modules 확인
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "📦 백엔드 패키지 설치 중... (시간이 걸릴 수 있습니다)" -ForegroundColor Yellow
    Push-Location backend
    npm install
    Pop-Location
}

# 프론트엔드 node_modules 확인
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "📦 프론트엔드 패키지 설치 중... (시간이 걸릴 수 있습니다)" -ForegroundColor Yellow
    Push-Location frontend
    npm install
    Pop-Location
}

Write-Host "✅ 의존성 준비 완료" -ForegroundColor Green
Write-Host ""

# 4. Prisma 설정
Write-Host "🗄️  Step 4: 데이터베이스 마이그레이션..." -ForegroundColor Yellow
Push-Location backend

# Prisma 클라이언트 생성
npx prisma generate 2>$null

# 마이그레이션 실행
Write-Host "   데이터베이스 스키마 적용 중..." -ForegroundColor Yellow
npx prisma migrate deploy 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "   초기 마이그레이션 실행 중..." -ForegroundColor Yellow
    npx prisma migrate dev --name init 2>$null
}

Pop-Location
Write-Host "✅ 데이터베이스 준비 완료" -ForegroundColor Green
Write-Host ""

# 5. 서버 시작
Write-Host "🎉 모든 준비가 완료되었습니다!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  🚀 WinnerLens 개발 서버를 시작합니다..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 접속 정보:" -ForegroundColor Yellow
Write-Host "   • 프론트엔드: http://localhost:3001" -ForegroundColor White
Write-Host "   • 백엔드 API: http://localhost:3000" -ForegroundColor White
Write-Host "   • API Health: http://localhost:3000/health" -ForegroundColor White
Write-Host ""
Write-Host "💡 서버를 종료하려면 Ctrl+C를 두 번 누르세요" -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# 백엔드와 프론트엔드를 동시에 실행
$backend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '🔧 백엔드 서버 시작 중...' -ForegroundColor Cyan; npm run dev" -PassThru
Start-Sleep -Seconds 3

$frontend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '🎨 프론트엔드 서버 시작 중...' -ForegroundColor Cyan; npm run dev" -PassThru

Write-Host "✅ 서버가 백그라운드에서 실행 중입니다!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 브라우저에서 http://localhost:3001 을 열어주세요!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to open browser..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# 브라우저 열기
Start-Process "http://localhost:3001"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  서버가 실행 중입니다. 이 창을 닫지 마세요!" -ForegroundColor Yellow
Write-Host "  종료하려면 각 서버 창에서 Ctrl+C를 누르세요" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# 스크립트 종료 대기
Write-Host "Press any key to exit this launcher..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
