# WinnerLens 로컬 실행 가이드 🚀

이 가이드는 WinnerLens를 로컬 환경에서 실행하는 방법을 단계별로 안내합니다.

## 📋 사전 요구사항

실행하기 전에 다음 프로그램들이 설치되어 있어야 합니다:

- ✅ **Node.js 18+** (현재 설치됨)
- ✅ **Docker Desktop** (PostgreSQL, Redis 실행용)
- ✅ **Git** (이미 설치됨)

### Docker Desktop 설치 확인

```powershell
docker --version
docker-compose --version
```

설치되지 않았다면: https://www.docker.com/products/docker-desktop/

---

## 🚀 빠른 시작 (Quick Start)

### 1️⃣ 데이터베이스 시작

프로젝트 루트 디렉토리에서:

```powershell
# Docker 컨테이너 시작 (PostgreSQL + Redis)
docker-compose up -d

# 상태 확인
docker-compose ps
```

**예상 출력:**
```
NAME                    STATUS
winnerlens-postgres     Up
winnerlens-redis        Up
```

---

### 2️⃣ 백엔드 설정 및 실행

#### A. 환경 변수 설정

```powershell
cd backend

# .env.example을 .env로 복사
copy .env.example .env
```

#### B. `.env` 파일 수정 (중요!)

텍스트 에디터로 `backend/.env` 파일을 열고 다음 값들을 설정:

```env
# OpenAI API 키 (AI 기능 사용 시 필수)
OPENAI_API_KEY="sk-your-actual-openai-api-key"

# 나머지는 기본값 사용 가능
DATABASE_URL="postgresql://user:password@localhost:5432/winnerlens?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

> 💡 **OpenAI API 키 발급**: https://platform.openai.com/api-keys

#### C. 의존성 설치 및 데이터베이스 마이그레이션

```powershell
# 패키지 설치
npm install

# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션 실행
npx prisma migrate dev

# (선택) Prisma Studio로 DB 확인
npx prisma studio
```

#### D. 백엔드 서버 실행

```powershell
npm run dev
```

**성공 메시지:**
```
🚀 ====================================
🚀 WinnerLens API Server Started
🚀 Environment: development
🚀 Server: http://localhost:3000
🚀 Health: http://localhost:3000/health
🚀 API v1: http://localhost:3000/api/v1
🚀 ====================================
```

**테스트:**
브라우저에서 http://localhost:3000/health 접속 → `{"status":"ok"}` 확인

---

### 3️⃣ 프론트엔드 설정 및 실행

**새 터미널 창을 열고:**

#### A. 환경 변수 설정

```powershell
cd frontend

# .env.local 파일 생성
echo NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1 > .env.local
```

#### B. 의존성 설치 및 실행

```powershell
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

**성공 메시지:**
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3001
  - Network:      http://192.168.x.x:3001

 ✓ Ready in 2.5s
```

---

## 🎉 접속하기

### 프론트엔드
- **URL**: http://localhost:3001
- **로그인 페이지**: http://localhost:3001/login

### 백엔드 API
- **Health Check**: http://localhost:3000/health
- **API Docs**: http://localhost:3000/api/v1

### 데이터베이스 관리
- **Prisma Studio**: `npx prisma studio` (backend 폴더에서)
- **URL**: http://localhost:5555

---

## 📝 첫 사용자 생성

1. http://localhost:3001/login 접속
2. **회원가입** 탭 클릭
3. 정보 입력:
   - 이메일: `test@example.com`
   - 비밀번호: `password123` (8자 이상)
   - 이름: `테스트 사용자`
4. **회원가입** 버튼 클릭
5. 자동 로그인 → 대시보드로 이동

---

## 🛠️ 문제 해결 (Troubleshooting)

### ❌ "Docker daemon is not running"
```powershell
# Docker Desktop 실행 후 다시 시도
docker-compose up -d
```

### ❌ "Port 3000 is already in use"
```powershell
# 포트 사용 중인 프로세스 확인
netstat -ano | findstr :3000

# 프로세스 종료 (PID 확인 후)
taskkill /PID <PID> /F
```

### ❌ "Database connection failed"
```powershell
# Docker 컨테이너 재시작
docker-compose restart postgres

# 로그 확인
docker-compose logs postgres
```

### ❌ Prisma 마이그레이션 오류
```powershell
# 데이터베이스 초기화 (주의: 모든 데이터 삭제)
npx prisma migrate reset

# 다시 마이그레이션
npx prisma migrate dev
```

### ❌ "OpenAI API Error"
- `.env` 파일의 `OPENAI_API_KEY` 확인
- API 키 유효성 확인: https://platform.openai.com/api-keys
- 크레딧 잔액 확인

---

## 🔄 서버 재시작

### 모든 서비스 중지
```powershell
# 백엔드 서버: Ctrl + C
# 프론트엔드 서버: Ctrl + C

# Docker 컨테이너 중지
docker-compose down
```

### 다시 시작
```powershell
# 1. Docker 시작
docker-compose up -d

# 2. 백엔드 시작 (backend 폴더)
npm run dev

# 3. 프론트엔드 시작 (frontend 폴더, 새 터미널)
npm run dev
```

---

## 📚 추가 명령어

### 데이터베이스 관리
```powershell
# Prisma Studio 실행 (GUI)
npx prisma studio

# 데이터베이스 초기화
npx prisma migrate reset

# 새 마이그레이션 생성
npx prisma migrate dev --name migration_name
```

### 빌드 (프로덕션)
```powershell
# 백엔드 빌드
cd backend
npm run build
npm start

# 프론트엔드 빌드
cd frontend
npm run build
npm start
```

---

## 🎯 다음 단계

로컬 환경이 정상 작동하면:

1. ✅ 회원가입/로그인 테스트
2. ✅ 상품 생성 테스트
3. ✅ AI 기능 테스트 (OpenAI API 키 필요)
4. ✅ 대시보드 기능 탐색

---

## 💡 팁

- **개발 중 자동 재시작**: `npm run dev`는 파일 변경 시 자동으로 서버를 재시작합니다
- **로그 확인**: 터미널에서 실시간으로 로그를 확인할 수 있습니다
- **데이터베이스 GUI**: Prisma Studio를 사용하면 데이터를 쉽게 확인/수정할 수 있습니다

---

**문제가 발생하면 GitHub Issues에 문의하세요!**
🐛 https://github.com/minjae-488/WinnerLens/issues
