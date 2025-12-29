# WinnerLens 프로젝트 구조

## 📁 디렉토리 구조

```
WinnerLens/
├── frontend/                    # 통합 풀스택 애플리케이션
│   ├── app/                     # Next.js App Router
│   │   ├── api/                 # API Routes (백엔드)
│   │   │   ├── health/          # 헬스 체크
│   │   │   └── v1/              # API v1
│   │   │       ├── auth/        # 인증 API
│   │   │       ├── products/    # 상품 관리 API
│   │   │       ├── trends/      # 트렌드 분석 API
│   │   │       ├── sourcing/    # 도매 소싱 API
│   │   │       └── ai/          # AI 리스팅 생성 API
│   │   ├── dashboard/           # 대시보드 페이지
│   │   ├── login/               # 로그인 페이지
│   │   ├── layout.tsx           # 루트 레이아웃
│   │   ├── page.tsx             # 랜딩 페이지
│   │   └── globals.css          # 글로벌 스타일
│   ├── src/                     # 백엔드 로직
│   │   ├── config/              # 설정 (DB 등)
│   │   ├── controllers/         # 컨트롤러
│   │   ├── services/            # 비즈니스 로직
│   │   ├── middleware/          # 미들웨어
│   │   ├── utils/               # 유틸리티
│   │   ├── types/               # 타입 정의
│   │   └── validators/          # 유효성 검사
│   ├── prisma/                  # Prisma 스키마 및 마이그레이션
│   ├── lib/                     # 프론트엔드 유틸리티
│   ├── components/              # React 컴포넌트
│   ├── store/                   # 상태 관리 (Zustand)
│   ├── .env.local               # 환경 변수
│   ├── .env.example             # 환경 변수 예제
│   ├── package.json             # 의존성
│   └── tsconfig.json            # TypeScript 설정
├── backend/                     # [아카이브] 구 백엔드 코드
│   └── README_ARCHIVED.md       # 아카이브 안내
├── docs/                        # 문서
├── docker-compose.yml           # Docker 설정
├── README.md                    # 프로젝트 README
├── prd.md                       # 제품 요구사항 문서
└── PROGRESS.md                  # 진행 상황

```

## 🏗️ 아키텍처

### 통합 풀스택 구조

WinnerLens는 **Next.js 14**를 기반으로 한 통합 풀스택 애플리케이션입니다.

```
┌─────────────────────────────────────────┐
│         WinnerLens (Port 3000)          │
├─────────────────────────────────────────┤
│  프론트엔드 (Next.js Pages)              │
│  - React 18                              │
│  - Tailwind CSS                          │
│  - Zustand (상태 관리)                   │
│  - Chart.js (데이터 시각화)              │
├─────────────────────────────────────────┤
│  백엔드 (Next.js API Routes)             │
│  - RESTful API                           │
│  - JWT 인증                              │
│  - Prisma ORM                            │
│  - Google Gemini AI                      │
│  - Puppeteer (크롤링)                    │
├─────────────────────────────────────────┤
│  데이터베이스                             │
│  - PostgreSQL (Docker)                   │
│  - Prisma Schema                         │
└─────────────────────────────────────────┘
```

## 🔄 데이터 흐름

```
사용자 요청
    ↓
Next.js 라우터
    ├→ 페이지 요청 → React 컴포넌트 렌더링
    └→ API 요청 → API Routes
                      ↓
                  컨트롤러
                      ↓
                  서비스 레이어
                      ↓
                  Prisma ORM
                      ↓
                  PostgreSQL
```

## 📡 API 엔드포인트

### 인증 (`/api/v1/auth`)
- `POST /register` - 회원가입
- `POST /login` - 로그인
- `POST /verify-send` - 인증 코드 발송
- `POST /verify-code` - 인증 코드 검증
- `GET /me` - 현재 사용자 정보
- `PATCH /me` - 프로필 수정

### 상품 (`/api/v1/products`)
- `GET /` - 상품 목록 조회
- `POST /` - 상품 생성
- `GET /:id` - 상품 상세 조회
- `PATCH /:id` - 상품 수정
- `DELETE /:id` - 상품 삭제

### 트렌드 (`/api/v1/trends`)
- `GET /` - 트렌드 데이터 조회

### 도매 소싱 (`/api/v1/sourcing`)
- `POST /search` - 도매 상품 검색

### AI (`/api/v1/ai`)
- `POST /generate-listing` - AI 리스팅 생성

## 🛠️ 기술 스택

### 프론트엔드
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Chart.js, Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React

### 백엔드
- **Runtime**: Node.js 20
- **Framework**: Next.js API Routes
- **ORM**: Prisma 5
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **AI**: Google Gemini 1.5
- **Crawling**: Puppeteer
- **Validation**: Zod

### DevOps
- **Containerization**: Docker
- **Database**: PostgreSQL (Docker)
- **Version Control**: Git

## 🚀 개발 워크플로우

1. **로컬 개발**
   ```bash
   cd frontend
   npm run dev
   ```

2. **데이터베이스 마이그레이션**
   ```bash
   npx prisma migrate dev
   ```

3. **Prisma Studio (DB 관리)**
   ```bash
   npx prisma studio
   ```

4. **빌드**
   ```bash
   npm run build
   ```

## 📝 주요 변경사항 (2025-12-29)

### 백엔드 통합
- Express 서버 제거
- 모든 API를 Next.js API Routes로 마이그레이션
- 단일 서버 구조로 통합 (Port 3000)

### 이점
- ✅ 배포 간소화 (하나의 애플리케이션)
- ✅ 타입 공유 용이
- ✅ 개발 환경 단순화
- ✅ Vercel 등 플랫폼 배포 가능

## 📚 추가 문서

- [PRD (제품 요구사항 문서)](../prd.md)
- [진행 상황](../PROGRESS.md)
- [도매 소싱 기능](../docs/WHOLESALE_SOURCING_FEATURE.md)
