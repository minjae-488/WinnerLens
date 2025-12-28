# 쿠팡 API 연동 가이드

## 📋 개요

WinnerLens는 쿠팡 Wing API 연동을 지원합니다. 현재는 **Mock 모드**로 작동하며, 실제 쿠팡 API 키를 받으면 바로 실제 API로 전환할 수 있습니다.

---

## 🔧 현재 상태: Mock 모드

개발 및 테스트를 위해 Mock API를 사용합니다. 실제 쿠팡 API 호출 없이 모든 기능을 테스트할 수 있습니다.

### Mock 모드 특징
- ✅ 실제 API 키 불필요
- ✅ 빠른 테스트 가능
- ✅ API 호출 제한 없음
- ✅ 시뮬레이션된 응답 (2초 딜레이)

---

## 🚀 실제 API로 전환하기

### Step 1: 쿠팡 셀러 계정 생성

1. [쿠팡 Wing 셀러센터](https://wing.coupang.com) 접속
2. 사업자 등록증으로 가입
3. 셀러 승인 대기 (1~3일)

### Step 2: API 키 발급

1. 쿠팡 Wing 셀러센터 로그인
2. **설정 → API 관리** 메뉴 접속
3. **API 키 생성** 클릭
4. **Access Key**, **Secret Key**, **Vendor ID** 복사

### Step 3: 환경 변수 설정

`backend/.env` 파일을 수정합니다:

```bash
# Mock 모드 비활성화
USE_MOCK_COUPANG_API=false

# 실제 API 키 입력
COUPANG_API_KEY=your_actual_access_key_here
COUPANG_API_SECRET=your_actual_secret_key_here
COUPANG_VENDOR_ID=your_vendor_id_here
```

### Step 4: 서버 재시작

```bash
cd backend
npm run dev
```

### Step 5: 완료! 🎉

이제 실제 쿠팡에 상품이 등록됩니다!

---

## 📚 API 사용법

### 1. 상품 등록

```typescript
// POST /api/v1/coupang/register/:productId
const result = await coupangService.registerProductToCoupang(productId);

// 응답
{
  success: true,
  productId: "COUPANG-1234567890",
  status: "pending",
  message: "상품이 쿠팡에 등록되었습니다.",
  registeredAt: "2025-12-28T12:00:00Z"
}
```

### 2. 상품 상태 조회

```typescript
// GET /api/v1/coupang/status/:productId
const status = await coupangService.getProductStatus(productId);

// 응답
{
  productId: "COUPANG-1234567890",
  status: "approved", // pending, approved, selling, rejected
  message: "심사 완료",
  updatedAt: "2025-12-28T12:30:00Z"
}
```

### 3. 상품 정보 업데이트

```typescript
// PUT /api/v1/coupang/update/:productId
const result = await coupangService.updateCoupangProduct(productId, {
  price: 29900,
  stock: 100
});
```

### 4. 상품 삭제 (판매 중지)

```typescript
// DELETE /api/v1/coupang/delete/:productId
const result = await coupangService.deleteCoupangProduct(productId);
```

---

## 🏗️ 구조 설명

### 파일 구조

```
backend/src/
├── integrations/coupang/
│   ├── types.ts           # 타입 정의
│   ├── mock-client.ts     # Mock API 클라이언트
│   ├── real-client.ts     # 실제 API 클라이언트
│   └── factory.ts         # 자동 선택 팩토리
├── services/
│   └── coupang.service.ts # 비즈니스 로직
└── controllers/
    └── coupang.controller.ts # API 엔드포인트
```

### 자동 선택 메커니즘

```typescript
// factory.ts
export function createCoupangClient(): ICoupangClient {
  const useMock = process.env.USE_MOCK_COUPANG_API === 'true';
  
  if (useMock) {
    return new MockCoupangClient(); // 개발용
  } else {
    return new RealCoupangClient(); // 프로덕션용
  }
}
```

---

## ⚠️ 주의사항

### 1. 쿠팡 정책 준수

- ✅ 금칙어 사용 금지 (WinnerLens 검수 시스템 활용)
- ✅ 허위 과장 광고 금지
- ✅ 정확한 상품 정보 입력

### 2. 재고 관리

- 쿠팡은 **직접 판매 방식**
- 주문 시 **직접 배송** 필요
- 재고 관리 필수

### 3. API 호출 제한

- 쿠팡 API에는 호출 제한이 있을 수 있음
- 과도한 호출 주의

---

## 🔍 테스트

### Mock 모드 테스트

```bash
# .env 설정
USE_MOCK_COUPANG_API=true

# 서버 실행
npm run dev

# API 테스트
curl -X POST http://localhost:3000/api/v1/coupang/register/product-id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 실제 API 테스트

```bash
# .env 설정
USE_MOCK_COUPANG_API=false
COUPANG_API_KEY=actual_key
COUPANG_API_SECRET=actual_secret
COUPANG_VENDOR_ID=actual_vendor_id

# 서버 실행
npm run dev

# API 테스트 (실제 쿠팡에 등록됨!)
curl -X POST http://localhost:3000/api/v1/coupang/register/product-id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📞 문의

쿠팡 API 연동 관련 문의사항이 있으시면 쿠팡 Wing 셀러센터 고객센터로 문의하세요.

- 쿠팡 Wing 셀러센터: https://wing.coupang.com
- 고객센터: 1577-7011
