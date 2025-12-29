# WinnerLens Technical Specification

## 문서 정보
- **버전**: 1.0
- **작성일**: 2025-12-26
- **작성자**: WinnerLens Engineering Team
- **상태**: Draft

---

## 목차
1. [시스템 아키텍처](#1-시스템-아키텍처)
2. [기술 스택](#2-기술-스택)
3. [데이터베이스 설계](#3-데이터베이스-설계)
4. [API 설계](#4-api-설계)
5. [핵심 모듈 설계](#5-핵심-모듈-설계)
6. [보안 및 인증](#6-보안-및-인증)
7. [인프라 및 배포](#7-인프라-및-배포)
8. [모니터링 및 로깅](#8-모니터링-및-로깅)
9. [성능 최적화](#9-성능-최적화)
10. [개발 환경 및 도구](#10-개발-환경-및-도구)

---

## 1. 시스템 아키텍처

### 1.1 전체 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web App    │  │  Mobile App  │  │   Admin      │      │
│  │  (React.js)  │  │  (Future)    │  │   Portal     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/WSS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  NGINX / AWS API Gateway                             │   │
│  │  - Rate Limiting                                      │   │
│  │  - Load Balancing                                     │   │
│  │  - SSL Termination                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth       │  │   Product    │  │   Trend      │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   AI/ML      │  │  Coupang     │  │   Billing    │      │
│  │   Service    │  │  Integration │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                    (Node.js / FastAPI)                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │    Redis     │  │  MongoDB     │      │
│  │  (Primary)   │  │   (Cache)    │  │  (Logs)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │      S3      │  │  ElasticSearch│                        │
│  │   (Storage)  │  │   (Search)   │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   OpenAI     │  │   Coupang    │  │   Google     │      │
│  │     API      │  │   Open API   │  │   Trends     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │   Payment    │  │   Email      │                         │
│  │   Gateway    │  │   Service    │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 마이크로서비스 구조

WinnerLens는 **모듈러 모놀리스**로 시작하여 점진적으로 마이크로서비스로 전환합니다.

**Phase 1 (MVP): 모놀리스**
- 단일 Node.js 애플리케이션
- 모듈별 명확한 경계 설정
- 향후 분리 용이한 구조

**Phase 2 (확장): 하이브리드**
- AI/ML 서비스 분리 (Python FastAPI)
- 나머지는 모놀리스 유지

**Phase 3 (스케일): 마이크로서비스**
- 각 도메인별 독립 서비스
- 이벤트 기반 통신 (Kafka/RabbitMQ)

---

## 2. 기술 스택

### 2.1 Frontend

#### Core Framework
```json
{
  "framework": "Next.js 14",
  "language": "TypeScript 5.3",
  "reason": "SSR/SSG 지원, SEO 최적화, 빠른 개발 속도"
}
```

#### UI/UX Libraries
```json
{
  "ui_framework": "shadcn/ui + Radix UI",
  "styling": "Tailwind CSS 3.4",
  "icons": "Lucide React",
  "charts": "Recharts / Chart.js",
  "forms": "React Hook Form + Zod",
  "tables": "TanStack Table (React Table v8)"
}
```

#### State Management
```json
{
  "global_state": "Zustand",
  "server_state": "TanStack Query (React Query)",
  "reason": "경량, 간단한 API, TypeScript 지원 우수"
}
```

#### Additional Tools
```javascript
// Package.json (Frontend)
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "axios": "^1.6.0",
    "date-fns": "^3.0.0",
    "recharts": "^2.10.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.1.0"
  }
}
```

---

### 2.2 Backend

#### Core Framework
```json
{
  "framework": "Node.js 20 LTS + Express.js",
  "language": "TypeScript 5.3",
  "alternative": "Fastify (성능 중요 시)",
  "reason": "생태계 풍부, 팀 숙련도, 빠른 개발"
}
```

#### API Design
```json
{
  "style": "RESTful API",
  "documentation": "OpenAPI 3.0 (Swagger)",
  "validation": "Joi / Zod",
  "future": "GraphQL (Phase 2)"
}
```

#### Key Libraries
```javascript
// Package.json (Backend)
{
  "dependencies": {
    "express": "^4.18.0",
    "typescript": "^5.3.0",
    "prisma": "^5.7.0",
    "@prisma/client": "^5.7.0",
    "ioredis": "^5.3.0",
    "bull": "^4.12.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "axios": "^1.6.0",
    "winston": "^3.11.0",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.0",
    "joi": "^17.11.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^20.10.0",
    "nodemon": "^3.0.0",
    "jest": "^29.7.0",
    "supertest": "^6.3.0"
  }
}
```

---

### 2.3 AI/ML Service

#### Framework
```json
{
  "framework": "FastAPI (Python 3.11)",
  "reason": "AI/ML 라이브러리 풍부, 비동기 지원, 빠른 성능"
}
```

#### AI/ML Stack
```python
# requirements.txt
fastapi==0.108.0
uvicorn==0.25.0
pydantic==2.5.0
openai==1.6.0
langchain==0.1.0
numpy==1.26.0
pandas==2.1.0
scikit-learn==1.3.0
transformers==4.36.0  # Optional: 자체 모델 사용 시
torch==2.1.0  # Optional
redis==5.0.0
celery==5.3.0
```

#### AI 모델 전략
```json
{
  "primary": "OpenAI GPT-4 API",
  "fallback": "GPT-3.5-turbo (비용 절감)",
  "future": "Fine-tuned model (자체 학습)",
  "embedding": "OpenAI text-embedding-ada-002"
}
```

---

### 2.4 Database

#### Primary Database: PostgreSQL 15
```json
{
  "use_case": "주요 비즈니스 데이터",
  "orm": "Prisma",
  "features": [
    "ACID 트랜잭션",
    "복잡한 쿼리 지원",
    "JSON 타입 지원",
    "Full-text search"
  ]
}
```

#### Cache: Redis 7
```json
{
  "use_case": [
    "세션 관리",
    "API 응답 캐싱",
    "Rate limiting",
    "실시간 데이터"
  ],
  "features": [
    "In-memory 속도",
    "Pub/Sub",
    "Sorted Sets (랭킹)"
  ]
}
```

#### Document Store: MongoDB (Optional)
```json
{
  "use_case": [
    "로그 저장",
    "크롤링 데이터",
    "비정형 데이터"
  ],
  "reason": "스키마 유연성"
}
```

#### Search Engine: Elasticsearch (Phase 2)
```json
{
  "use_case": [
    "상품 검색",
    "트렌드 키워드 분석",
    "로그 분석"
  ]
}
```

---

### 2.5 Infrastructure

#### Cloud Provider: AWS
```json
{
  "compute": "EC2 / ECS (Fargate)",
  "storage": "S3",
  "cdn": "CloudFront",
  "database": "RDS (PostgreSQL)",
  "cache": "ElastiCache (Redis)",
  "queue": "SQS / SNS",
  "monitoring": "CloudWatch"
}
```

#### Container & Orchestration
```json
{
  "containerization": "Docker",
  "orchestration": "Docker Compose (Dev) → ECS (Prod)",
  "future": "Kubernetes (대규모 확장 시)"
}
```

#### CI/CD
```json
{
  "version_control": "GitHub",
  "ci_cd": "GitHub Actions",
  "deployment": "AWS CodeDeploy / ECS Rolling Update",
  "infrastructure_as_code": "Terraform / AWS CDK"
}
```

---

## 3. 데이터베이스 설계

### 3.1 ERD (Entity Relationship Diagram)

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (PK)         │
│ email           │
│ password_hash   │
│ name            │
│ subscription_id │◄─────┐
│ created_at      │      │
│ updated_at      │      │
└─────────────────┘      │
        │                │
        │ 1:N            │
        ▼                │
┌─────────────────┐      │
│    Product      │      │
├─────────────────┤      │
│ id (PK)         │      │
│ user_id (FK)    │      │
│ status          │      │
│ coupang_id      │      │
│ category        │      │
│ name            │      │
│ options (JSON)  │      │
│ price           │      │
│ margin          │      │
│ score (JSON)    │      │
│ created_at      │      │
└─────────────────┘      │
        │                │
        │ 1:N            │
        ▼                │
┌─────────────────┐      │
│  Registration   │      │
├─────────────────┤      │
│ id (PK)         │      │
│ product_id (FK) │      │
│ user_id (FK)    │      │
│ status          │      │
│ error_msg       │      │
│ registered_at   │      │
└─────────────────┘      │
                         │
┌─────────────────┐      │
│  Subscription   │──────┘
├─────────────────┤
│ id (PK)         │
│ tier            │
│ price           │
│ features (JSON) │
│ limits (JSON)   │
└─────────────────┘

┌─────────────────┐
│   TrendData     │
├─────────────────┤
│ id (PK)         │
│ keyword         │
│ category        │
│ search_volume   │
│ growth_rate     │
│ date            │
│ source          │
└─────────────────┘

┌─────────────────┐
│   ApiUsage      │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ endpoint        │
│ count           │
│ month           │
└─────────────────┘
```

### 3.2 Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ User & Auth ============

model User {
  id              String   @id @default(uuid())
  email           String   @unique
  passwordHash    String   @map("password_hash")
  name            String?
  subscriptionId  String?  @map("subscription_id")
  
  subscription    Subscription? @relation(fields: [subscriptionId], references: [id])
  products        Product[]
  registrations   Registration[]
  apiUsage        ApiUsage[]
  
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  @@map("users")
}

model Subscription {
  id              String   @id @default(uuid())
  tier            String   // 'basic', 'pro', 'team'
  price           Int
  features        Json
  limits          Json     // { monthlyProducts: 50, aiGenerations: 100 }
  
  users           User[]
  
  @@map("subscriptions")
}

// ============ Product ============

model Product {
  id              String   @id @default(uuid())
  userId          String   @map("user_id")
  status          String   @default("draft") // draft, pending, registered, rejected
  coupangId       String?  @map("coupang_id")
  
  category        String
  name            String
  options         Json?    // [{ color: 'red', size: 'M', price: 10000 }]
  price           Int
  margin          Float?
  score           Json?    // { demand: 80, competition: 60, margin: 70, operability: 85 }
  
  images          String[] // Array of S3 URLs
  description     String?  @db.Text
  attributes      Json?    // 고시정보 등
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  registrations   Registration[]
  
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  @@index([userId])
  @@index([status])
  @@index([category])
  @@map("products")
}

// ============ Registration ============

model Registration {
  id              String   @id @default(uuid())
  productId       String   @map("product_id")
  userId          String   @map("user_id")
  status          String   // success, failed, pending
  errorMessage    String?  @map("error_message") @db.Text
  
  product         Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  registeredAt    DateTime @default(now()) @map("registered_at")
  
  @@index([userId])
  @@index([productId])
  @@map("registrations")
}

// ============ Trend Data ============

model TrendData {
  id              String   @id @default(uuid())
  keyword         String
  category        String?
  searchVolume    Int      @map("search_volume")
  growthRate      Float    @map("growth_rate")
  date            DateTime
  source          String   // 'google', 'naver', 'coupang'
  
  @@index([keyword])
  @@index([date])
  @@index([category])
  @@map("trend_data")
}

// ============ API Usage Tracking ============

model ApiUsage {
  id              String   @id @default(uuid())
  userId          String   @map("user_id")
  endpoint        String
  count           Int      @default(0)
  month           String   // '2024-01'
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, endpoint, month])
  @@map("api_usage")
}
```

### 3.3 Redis 데이터 구조

```javascript
// 세션 관리
// Key: session:{sessionId}
// Type: Hash
// TTL: 7 days
{
  "userId": "uuid",
  "email": "user@example.com",
  "tier": "pro"
}

// API Rate Limiting
// Key: ratelimit:{userId}:{endpoint}
// Type: String (counter)
// TTL: 1 hour
"15"  // 현재 요청 수

// 트렌드 캐시
// Key: trends:{category}:{date}
// Type: JSON String
// TTL: 1 hour
[
  { "keyword": "무선청소기", "score": 95 },
  { "keyword": "공기청정기", "score": 88 }
]

// 상품 스코어 캐시
// Key: product:score:{productId}
// Type: Hash
// TTL: 24 hours
{
  "demand": "80",
  "competition": "65",
  "margin": "70",
  "operability": "85",
  "total": "75"
}
```

---

## 4. API 설계

### 4.1 API 구조

**Base URL**: `https://api.winnerlens.com/v1`

**인증**: Bearer Token (JWT)

**응답 형식**: JSON

### 4.2 주요 엔드포인트

#### Authentication

```yaml
POST /auth/register
  Request:
    {
      "email": "user@example.com",
      "password": "SecurePass123!",
      "name": "홍길동"
    }
  Response:
    {
      "success": true,
      "data": {
        "userId": "uuid",
        "token": "jwt_token"
      }
    }

POST /auth/login
  Request:
    {
      "email": "user@example.com",
      "password": "SecurePass123!"
    }
  Response:
    {
      "success": true,
      "data": {
        "token": "jwt_token",
        "user": {
          "id": "uuid",
          "email": "user@example.com",
          "tier": "pro"
        }
      }
    }
```

#### Trend Discovery

```yaml
GET /trends/recommendations
  Query Params:
    - category: string (optional)
    - limit: number (default: 20)
    - minScore: number (default: 60)
  
  Response:
    {
      "success": true,
      "data": {
        "trends": [
          {
            "keyword": "무선청소기",
            "category": "가전",
            "searchVolume": 15000,
            "growthRate": 25.5,
            "score": 85,
            "recommendedProducts": [...]
          }
        ],
        "total": 45
      }
    }
```

#### Product Scoring

```yaml
POST /products/score
  Request:
    {
      "keyword": "무선청소기",
      "category": "가전",
      "targetPrice": 150000,
      "cost": 100000
    }
  
  Response:
    {
      "success": true,
      "data": {
        "score": {
          "demand": 80,
          "competition": 65,
          "margin": 70,
          "operability": 85,
          "total": 75
        },
        "insights": {
          "demandTrend": "상승 중",
          "competitorCount": 45,
          "avgPrice": 145000,
          "suggestions": [
            "가격 경쟁력 우수",
            "리뷰 관리 필요"
          ]
        }
      }
    }
```

#### AI Generation

```yaml
POST /ai/generate-listing
  Request:
    {
      "productInfo": {
        "keyword": "무선청소기",
        "category": "가전",
        "features": ["무선", "강력흡입", "2시간 사용"],
        "targetPrice": 150000
      }
    }
  
  Response:
    {
      "success": true,
      "data": {
        "productName": "프리미엄 무선청소기 강력흡입 2시간 사용 가능",
        "description": "...",
        "options": [
          { "color": "화이트", "price": 150000 },
          { "color": "블랙", "price": 155000 }
        ],
        "attributes": {
          "제조사": "...",
          "KC인증": "..."
        }
      }
    }
```

#### Product Registration

```yaml
POST /products
  Request:
    {
      "name": "프리미엄 무선청소기...",
      "category": "가전",
      "price": 150000,
      "options": [...],
      "description": "...",
      "images": ["s3://..."]
    }
  
  Response:
    {
      "success": true,
      "data": {
        "productId": "uuid",
        "status": "draft"
      }
    }

POST /products/:id/validate
  Response:
    {
      "success": true,
      "data": {
        "valid": false,
        "errors": [
          {
            "field": "productName",
            "message": "금지어 포함: '최고'"
          }
        ]
      }
    }

POST /products/:id/register
  Response:
    {
      "success": true,
      "data": {
        "registrationId": "uuid",
        "coupangId": "12345",
        "status": "success"
      }
    }
```

### 4.3 에러 응답 형식

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력 데이터가 유효하지 않습니다",
    "details": [
      {
        "field": "email",
        "message": "이메일 형식이 올바르지 않습니다"
      }
    ]
  }
}
```

**에러 코드 목록**:
- `VALIDATION_ERROR`: 입력 검증 실패
- `UNAUTHORIZED`: 인증 실패
- `FORBIDDEN`: 권한 없음
- `NOT_FOUND`: 리소스 없음
- `RATE_LIMIT_EXCEEDED`: 요청 한도 초과
- `EXTERNAL_API_ERROR`: 외부 API 오류
- `INTERNAL_ERROR`: 서버 내부 오류

---

## 5. 핵심 모듈 설계

### 5.1 Trend Analysis Engine

**책임**: 트렌드 데이터 수집, 분석, 추천

**구조**:
```typescript
// src/modules/trend/trend.service.ts

interface TrendSource {
  name: string;
  fetch(): Promise<TrendData[]>;
}

class TrendAnalysisEngine {
  private sources: TrendSource[];
  
  async collectTrends(): Promise<void> {
    // 1. 모든 소스에서 데이터 수집
    // 2. 정규화 및 저장
    // 3. 캐시 업데이트
  }
  
  async analyzeTrends(category?: string): Promise<TrendInsight[]> {
    // 1. 최근 트렌드 데이터 조회
    // 2. 성장률 계산
    // 3. 점수화
    // 4. 추천 생성
  }
  
  async getRecommendations(filters: TrendFilter): Promise<Recommendation[]> {
    // 필터링 및 정렬된 추천 반환
  }
}
```

**데이터 소스**:
1. Google Trends API
2. 네이버 쇼핑 트렌드 (크롤링)
3. 쿠팡 베스트셀러 (크롤링)

**수집 주기**: 매 6시간 (Cron Job)

---

### 5.2 Product Scoring Engine

**책임**: 상품 판매 가능성 점수 계산

**알고리즘**:
```typescript
// src/modules/scoring/scoring.service.ts

interface ScoreFactors {
  demand: number;      // 수요 점수
  competition: number; // 경쟁 점수
  margin: number;      // 마진 점수
  operability: number; // 운영 가능성 점수
}

class ScoringEngine {
  async calculateScore(product: ProductInput): Promise<ScoreResult> {
    const demand = await this.calculateDemandScore(product);
    const competition = await this.calculateCompetitionScore(product);
    const margin = this.calculateMarginScore(product);
    const operability = await this.calculateOperabilityScore(product);
    
    const total = this.weightedAverage({
      demand: { value: demand, weight: 0.30 },
      competition: { value: competition, weight: 0.25 },
      margin: { value: margin, weight: 0.25 },
      operability: { value: operability, weight: 0.20 }
    });
    
    return { demand, competition, margin, operability, total };
  }
  
  private async calculateDemandScore(product: ProductInput): Promise<number> {
    // 1. 검색량 트렌드 조회
    // 2. 카테고리 성장률 조회
    // 3. 시즌성 고려
    // 4. 0-100 점수 반환
  }
  
  private async calculateCompetitionScore(product: ProductInput): Promise<number> {
    // 1. 경쟁 상품 수 조회
    // 2. 가격 분포 분석
    // 3. 리뷰 수/평점 분석
    // 4. 로켓배송 비율
    // 5. 0-100 점수 반환 (높을수록 경쟁 낮음)
  }
}
```

---

### 5.3 AI Listing Generator

**책임**: AI 기반 상품 정보 생성

**구조**:
```typescript
// src/modules/ai/listing-generator.service.ts

class ListingGenerator {
  private openai: OpenAI;
  
  async generateProductName(input: ProductInput): Promise<string> {
    const prompt = this.buildProductNamePrompt(input);
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: PRODUCT_NAME_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 100
    });
    
    return this.extractAndValidate(response);
  }
  
  async generateDescription(input: ProductInput): Promise<string> {
    // 상품 설명 생성
  }
  
  async generateOptions(input: ProductInput): Promise<ProductOption[]> {
    // 옵션 생성
  }
  
  async generateAttributes(input: ProductInput): Promise<Attributes> {
    // 고시정보 생성
  }
  
  private buildProductNamePrompt(input: ProductInput): string {
    return `
      다음 정보를 바탕으로 쿠팡 상품명을 생성해주세요:
      - 카테고리: ${input.category}
      - 주요 키워드: ${input.keyword}
      - 특징: ${input.features.join(', ')}
      - 가격대: ${input.targetPrice}원
      
      요구사항:
      1. 50자 이내
      2. 주요 키워드 포함
      3. 금지어 사용 금지 (최고, 최저, 1위 등)
      4. SEO 최적화
    `;
  }
}
```

**프롬프트 관리**:
```typescript
// src/modules/ai/prompts.ts

export const PRODUCT_NAME_SYSTEM_PROMPT = `
당신은 쿠팡 상품명 작성 전문가입니다.
다음 규칙을 반드시 준수하세요:
1. 쿠팡 정책 준수 (금지어 사용 금지)
2. SEO 최적화된 키워드 배치
3. 명확하고 간결한 표현
4. 50자 이내
`;

export const DESCRIPTION_SYSTEM_PROMPT = `...`;
```

---

### 5.4 Validation & Guardrail System

**책임**: 등록 전 검수 및 정책 위반 탐지

**구조**:
```typescript
// src/modules/validation/validator.service.ts

interface ValidationRule {
  name: string;
  validate(product: Product): ValidationResult;
}

class ProductValidator {
  private rules: ValidationRule[];
  
  async validate(product: Product): Promise<ValidationReport> {
    const results = await Promise.all(
      this.rules.map(rule => rule.validate(product))
    );
    
    const errors = results.filter(r => !r.valid);
    const warnings = results.filter(r => r.warning);
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// 검증 규칙 예시
class ForbiddenWordRule implements ValidationRule {
  private forbiddenWords = ['최고', '최저', '1위', '의료효능', ...];
  
  validate(product: Product): ValidationResult {
    const found = this.forbiddenWords.filter(word => 
      product.name.includes(word) || product.description?.includes(word)
    );
    
    if (found.length > 0) {
      return {
        valid: false,
        field: 'name/description',
        message: `금지어 포함: ${found.join(', ')}`
      };
    }
    
    return { valid: true };
  }
}

class RequiredFieldRule implements ValidationRule {
  validate(product: Product): ValidationResult {
    const required = ['name', 'category', 'price', 'images'];
    const missing = required.filter(field => !product[field]);
    
    if (missing.length > 0) {
      return {
        valid: false,
        message: `필수 항목 누락: ${missing.join(', ')}`
      };
    }
    
    return { valid: true };
  }
}
```

---

### 5.5 Coupang Integration Service

**책임**: 쿠팡 OPEN API 연동

**구조**:
```typescript
// src/modules/coupang/coupang.service.ts

class CoupangIntegrationService {
  private apiClient: CoupangApiClient;
  
  async registerProduct(product: Product): Promise<RegistrationResult> {
    try {
      // 1. 상품 데이터 변환 (내부 → 쿠팡 형식)
      const coupangProduct = this.transformToCoupangFormat(product);
      
      // 2. API 호출
      const response = await this.apiClient.createProduct(coupangProduct);
      
      // 3. 결과 저장
      await this.saveRegistration({
        productId: product.id,
        coupangId: response.productId,
        status: 'success'
      });
      
      return { success: true, coupangId: response.productId };
      
    } catch (error) {
      // 에러 처리 및 로깅
      await this.saveRegistration({
        productId: product.id,
        status: 'failed',
        errorMessage: error.message
      });
      
      throw error;
    }
  }
  
  async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    // 상품 수정
  }
  
  async getProductStatus(coupangId: string): Promise<ProductStatus> {
    // 상품 상태 조회
  }
  
  private transformToCoupangFormat(product: Product): CoupangProduct {
    // 데이터 변환 로직
  }
}
```

---

## 6. 보안 및 인증

### 6.1 인증 (Authentication)

**방식**: JWT (JSON Web Token)

**구현**:
```typescript
// src/modules/auth/auth.service.ts

class AuthService {
  async register(email: string, password: string): Promise<AuthResult> {
    // 1. 이메일 중복 체크
    // 2. 비밀번호 해싱 (bcrypt, rounds=12)
    // 3. 사용자 생성
    // 4. JWT 토큰 발급
  }
  
  async login(email: string, password: string): Promise<AuthResult> {
    // 1. 사용자 조회
    // 2. 비밀번호 검증
    // 3. JWT 토큰 발급
  }
  
  generateToken(userId: string): string {
    return jwt.sign(
      { userId, iat: Date.now() },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
  
  verifyToken(token: string): TokenPayload {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}
```

**미들웨어**:
```typescript
// src/middleware/auth.middleware.ts

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const payload = authService.verifyToken(token);
    req.user = await userService.findById(payload.userId);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 6.2 인가 (Authorization)

**역할 기반 접근 제어 (RBAC)**:
```typescript
enum Role {
  USER = 'user',
  ADMIN = 'admin'
}

enum Permission {
  CREATE_PRODUCT = 'create:product',
  DELETE_PRODUCT = 'delete:product',
  VIEW_ANALYTICS = 'view:analytics'
}

const rolePermissions = {
  [Role.USER]: [Permission.CREATE_PRODUCT, Permission.VIEW_ANALYTICS],
  [Role.ADMIN]: Object.values(Permission)
};

export const requirePermission = (permission: Permission) => {
  return (req, res, next) => {
    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};
```

### 6.3 Rate Limiting

```typescript
// src/middleware/rate-limit.middleware.ts

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'ratelimit:'
  }),
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100 요청
  message: 'Too many requests'
});

// 구독 티어별 제한
export const tierBasedLimiter = async (req, res, next) => {
  const user = req.user;
  const limits = {
    basic: 50,
    pro: 300,
    team: 1000
  };
  
  const limit = limits[user.subscription.tier];
  // Redis에서 현재 사용량 확인
  // 초과 시 429 응답
};
```

### 6.4 데이터 암호화

```typescript
// 민감 데이터 암호화
import crypto from 'crypto';

class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  
  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }
  
  decrypt(encryptedText: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

---

## 7. 인프라 및 배포

### 7.1 Docker 구성

**Dockerfile (Backend)**:
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

**docker-compose.yml (Development)**:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/winnerlens
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./src:/app/src
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: winnerlens
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
  
  ai-service:
    build: ./ai-service
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}

volumes:
  postgres_data:
  redis_data:
```

### 7.2 AWS 인프라 구성

**아키텍처**:
```
Internet
    │
    ▼
┌─────────────────┐
│  CloudFront     │ (CDN)
│  + S3 (Static)  │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  Route 53       │ (DNS)
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  ALB            │ (Load Balancer)
└─────────────────┘
    │
    ├─────────────────┐
    ▼                 ▼
┌─────────┐      ┌─────────┐
│ ECS     │      │ ECS     │
│ (App)   │      │ (App)   │
└─────────┘      └─────────┘
    │
    ├──────────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  RDS   │ │ Redis  │ │   S3   │ │  SQS   │
│ (PG)   │ │(Cache) │ │(Files) │ │(Queue) │
└────────┘ └────────┘ └────────┘ └────────┘
```

**Terraform 예시**:
```hcl
# terraform/main.tf

provider "aws" {
  region = "ap-northeast-2"
}

resource "aws_ecs_cluster" "winnerlens" {
  name = "winnerlens-cluster"
}

resource "aws_ecs_service" "app" {
  name            = "winnerlens-app"
  cluster         = aws_ecs_cluster.winnerlens.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 2
  
  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = 3000
  }
}

resource "aws_db_instance" "postgres" {
  identifier        = "winnerlens-db"
  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = "db.t3.medium"
  allocated_storage = 100
  
  db_name  = "winnerlens"
  username = var.db_username
  password = var.db_password
  
  backup_retention_period = 7
  multi_az               = true
}
```

### 7.3 CI/CD Pipeline

**GitHub Actions**:
```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      - run: npm run lint
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/winnerlens:$IMAGE_TAG .
          docker push $ECR_REGISTRY/winnerlens:$IMAGE_TAG
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster winnerlens-cluster \
            --service winnerlens-app \
            --force-new-deployment
```

---

## 8. 모니터링 및 로깅

### 8.1 로깅 전략

**Winston Logger 설정**:
```typescript
// src/utils/logger.ts

import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export default logger;
```

**로그 레벨**:
- `error`: 시스템 오류
- `warn`: 경고 (예: API 지연)
- `info`: 주요 이벤트 (예: 상품 등록 성공)
- `debug`: 디버깅 정보

### 8.2 모니터링

**메트릭 수집**:
```typescript
// Prometheus metrics

import promClient from 'prom-client';

const register = new promClient.Registry();

// HTTP 요청 메트릭
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// 비즈니스 메트릭
const productRegistrations = new promClient.Counter({
  name: 'product_registrations_total',
  help: 'Total number of product registrations',
  labelNames: ['status'],
  registers: [register]
});

// 외부 API 호출
const externalApiCalls = new promClient.Counter({
  name: 'external_api_calls_total',
  help: 'Total external API calls',
  labelNames: ['service', 'status'],
  registers: [register]
});
```

**대시보드 (Grafana)**:
- API 응답 시간
- 에러율
- 등록 성공/실패율
- 외부 API 상태
- 데이터베이스 성능

### 8.3 알림 (Alerting)

**Sentry 통합**:
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1
});

// 에러 캡처
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: { module: 'product-registration' },
    extra: { productId: product.id }
  });
  throw error;
}
```

---

## 9. 성능 최적화

### 9.1 캐싱 전략

```typescript
// 다층 캐싱

class CacheService {
  // L1: In-memory cache (Node.js)
  private memoryCache = new Map();
  
  // L2: Redis
  private redis: Redis;
  
  async get(key: string): Promise<any> {
    // 1. 메모리 캐시 확인
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    
    // 2. Redis 확인
    const cached = await this.redis.get(key);
    if (cached) {
      this.memoryCache.set(key, JSON.parse(cached));
      return JSON.parse(cached);
    }
    
    return null;
  }
  
  async set(key: string, value: any, ttl: number): Promise<void> {
    this.memoryCache.set(key, value);
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
}
```

**캐시 대상**:
- 트렌드 데이터 (1시간)
- 상품 스코어 (24시간)
- 사용자 세션 (7일)
- API 응답 (케이스별)

### 9.2 데이터베이스 최적화

**인덱스 전략**:
```sql
-- 자주 조회되는 필드에 인덱스
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- 복합 인덱스
CREATE INDEX idx_products_user_status ON products(user_id, status);

-- 전문 검색 인덱스
CREATE INDEX idx_products_name_gin ON products USING gin(to_tsvector('korean', name));
```

**쿼리 최적화**:
```typescript
// N+1 문제 해결 (Prisma)
const products = await prisma.product.findMany({
  where: { userId },
  include: {
    user: true,
    registrations: true
  }
});

// 페이지네이션
const products = await prisma.product.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' }
});
```

### 9.3 비동기 처리

**작업 큐 (Bull)**:
```typescript
// src/queues/product-registration.queue.ts

import Queue from 'bull';

const registrationQueue = new Queue('product-registration', {
  redis: process.env.REDIS_URL
});

// Producer
export async function enqueueRegistration(productId: string) {
  await registrationQueue.add({
    productId
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  });
}

// Consumer
registrationQueue.process(async (job) => {
  const { productId } = job.data;
  
  try {
    await coupangService.registerProduct(productId);
    logger.info(`Product ${productId} registered successfully`);
  } catch (error) {
    logger.error(`Failed to register product ${productId}`, error);
    throw error; // 재시도
  }
});
```

---

## 10. 개발 환경 및 도구

### 10.1 개발 환경 설정

**필수 도구**:
- Node.js 20 LTS
- Docker Desktop
- PostgreSQL 15
- Redis 7
- VS Code (권장)

**VS Code 확장**:
- ESLint
- Prettier
- Prisma
- Docker
- GitLens

### 10.2 코드 품질

**ESLint 설정**:
```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

**Prettier 설정**:
```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### 10.3 테스트 전략

**단위 테스트 (Jest)**:
```typescript
// src/modules/scoring/__tests__/scoring.service.test.ts

describe('ScoringEngine', () => {
  let scoringEngine: ScoringEngine;
  
  beforeEach(() => {
    scoringEngine = new ScoringEngine();
  });
  
  it('should calculate demand score correctly', async () => {
    const product = {
      keyword: '무선청소기',
      category: '가전'
    };
    
    const score = await scoringEngine.calculateDemandScore(product);
    
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
```

**통합 테스트**:
```typescript
// src/__tests__/integration/product-registration.test.ts

describe('Product Registration Flow', () => {
  it('should register product successfully', async () => {
    const response = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product',
        category: '가전',
        price: 100000
      });
    
    expect(response.status).toBe(201);
    expect(response.body.data.productId).toBeDefined();
  });
});
```

**E2E 테스트 (Playwright)**:
```typescript
// e2e/product-registration.spec.ts

test('complete product registration flow', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('text=새 상품 등록');
  await page.fill('[name="keyword"]', '무선청소기');
  await page.click('text=AI 생성');
  await page.waitForSelector('text=생성 완료');
  await page.click('text=등록하기');
  await expect(page.locator('text=등록 성공')).toBeVisible();
});
```

---

## 11. 환경 변수 관리

```bash
# .env.example

# Application
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/winnerlens
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# External APIs
OPENAI_API_KEY=sk-...
COUPANG_API_KEY=...
COUPANG_API_SECRET=...
GOOGLE_TRENDS_API_KEY=...

# AWS
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=winnerlens-uploads

# Monitoring
SENTRY_DSN=https://...
LOG_LEVEL=info

# Encryption
ENCRYPTION_KEY=... # 32 bytes hex
```

---

## 12. 배포 체크리스트

### 12.1 프로덕션 배포 전

- [ ] 모든 테스트 통과
- [ ] 환경 변수 설정 완료
- [ ] 데이터베이스 마이그레이션 실행
- [ ] SSL 인증서 설정
- [ ] 백업 전략 수립
- [ ] 모니터링 대시보드 설정
- [ ] 알림 설정 (Slack, Email)
- [ ] 로드 테스트 완료
- [ ] 보안 감사 완료
- [ ] 문서화 완료

### 12.2 배포 후

- [ ] 헬스 체크 확인
- [ ] 메트릭 모니터링
- [ ] 에러 로그 확인
- [ ] 성능 지표 확인
- [ ] 사용자 피드백 수집

---

## 부록

### A. 참고 문서
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [AWS ECS Best Practices](https://docs.aws.amazon.com/ecs/)

### B. 용어집
- **ORM**: Object-Relational Mapping
- **JWT**: JSON Web Token
- **TTL**: Time To Live
- **CDN**: Content Delivery Network
- **ECS**: Elastic Container Service

---

**문서 버전**: 1.0  
**최종 수정일**: 2025-12-26  
**작성자**: WinnerLens Engineering Team
