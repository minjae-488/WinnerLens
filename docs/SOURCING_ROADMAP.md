# 도매 소싱 자동화 구현 로드맵

## 🎯 목표
키워드 입력 → 도매 사이트 최저가 발굴 → AI 리스팅 생성 → 가격 최적화 → 쿠팡 등록

---

## 📅 4주 개발 계획

### Week 1: 백엔드 크롤링 인프라 (1/29 - 2/4)

#### Day 1-2: 크롤링 기반 구축
```bash
backend/src/services/crawling/
├── base.crawler.ts          # 추상 크롤러 클래스
├── crawler.interface.ts     # 인터페이스 정의
└── crawler.factory.ts       # 팩토리 패턴
```

**작업 내용:**
- [ ] Puppeteer 설치 및 설정
- [ ] 기본 크롤러 추상 클래스 구현
- [ ] Rate Limiting 미들웨어
- [ ] Redis 캐싱 설정

**검증:**
```typescript
// 테스트 코드
const crawler = new BaseCrawler();
const html = await crawler.fetchPage('https://example.com');
expect(html).toBeDefined();
```

#### Day 3-4: 1866 크롤러 구현
```bash
backend/src/services/crawling/1866.crawler.ts
```

**작업 내용:**
- [ ] 검색 페이지 크롤링
- [ ] 상품 리스트 파싱
- [ ] 상품 상세 크롤링
- [ ] 이미지 URL 추출

**API 엔드포인트:**
```typescript
POST /api/v1/sourcing/search
{
  "keyword": "무선 이어폰",
  "site": "1866",
  "priceRange": [0, 50000]
}

Response:
{
  "success": true,
  "data": [
    {
      "id": "1866_12345",
      "name": "블루투스 이어폰",
      "price": 8900,
      "images": ["https://..."],
      "minOrderQty": 10
    }
  ]
}
```

#### Day 5: 도매매 크롤러 구현
```bash
backend/src/services/crawling/domeggook.crawler.ts
```

**작업 내용:**
- [ ] 도매매 사이트 구조 분석
- [ ] 검색/상세 크롤링 구현
- [ ] 1866과 동일한 인터페이스 적용

---

### Week 2: 가격 최적화 엔진 (2/5 - 2/11)

#### Day 1-2: 가격 계산 로직
```bash
backend/src/services/pricing/
├── pricing.service.ts       # 가격 계산 메인
├── margin.calculator.ts     # 마진 계산
└── competition.analyzer.ts  # 경쟁 분석
```

**핵심 알고리즘:**
```typescript
class PricingService {
  async calculateOptimalPrice(input: PricingInput): Promise<PricingOutput> {
    // 1. 개당 원가 계산
    const costPerUnit = (input.wholesalePrice * input.quantity + 
                         input.shippingCost + 
                         input.extraCost) / input.quantity;
    
    // 2. 쿠팡 수수료율 조회
    const feeRate = this.getCoupangFeeRate(input.category);
    
    // 3. 손익분기점 계산
    const breakeven = costPerUnit / (1 - feeRate);
    
    // 4. 목표 마진가 계산
    const targetPrice = costPerUnit / (1 - feeRate - input.targetMargin);
    
    // 5. 경쟁가 분석
    const competitorPrices = await this.analyzeCompetition(input.keyword);
    const competitivePrice = this.calculateMedian(competitorPrices) * 0.95;
    
    // 6. 3가지 전략 추천
    return {
      costPerUnit,
      recommendedPrices: {
        aggressive: competitivePrice,
        balanced: (targetPrice + competitivePrice) / 2,
        premium: targetPrice,
      },
      margins: {
        aggressive: this.calculateMargin(competitivePrice, costPerUnit, feeRate),
        balanced: this.calculateMargin((targetPrice + competitivePrice) / 2, costPerUnit, feeRate),
        premium: this.calculateMargin(targetPrice, costPerUnit, feeRate),
      },
      competitorPrices,
    };
  }
}
```

#### Day 3-4: 경쟁 분석 시스템
**작업 내용:**
- [ ] 쿠팡 API로 경쟁 상품 조회
- [ ] 가격 분포 분석
- [ ] 경쟁력 지수 계산

#### Day 5: API 통합 테스트
```bash
POST /api/v1/sourcing/calculate-price
{
  "wholesalePrice": 10000,
  "quantity": 10,
  "shippingCost": 3000,
  "targetMargin": 0.3,
  "category": "electronics",
  "keyword": "무선 이어폰"
}

Response:
{
  "success": true,
  "data": {
    "costPerUnit": 1300,
    "recommendedPrices": {
      "aggressive": 18500,
      "balanced": 21000,
      "premium": 23500
    },
    "margins": {
      "aggressive": 0.25,
      "balanced": 0.32,
      "premium": 0.38
    }
  }
}
```

---

### Week 3: AI 리스팅 생성 & 프론트엔드 (2/12 - 2/18)

#### Day 1-2: AI 서비스 확장
```bash
backend/src/services/ai.service.ts
```

**신규 메서드:**
```typescript
async generateCoupangListing(
  wholesaleProduct: WholesaleProduct
): Promise<CoupangListing> {
  const prompt = `
    다음 도매 상품을 쿠팡 판매용으로 변환하세요:
    
    [원본 정보]
    - 상품명: ${wholesaleProduct.name}
    - 가격: ${wholesaleProduct.price}원
    - 카테고리: ${wholesaleProduct.category}
    
    [요구사항]
    1. 상품명: SEO 최적화, 50자 이내, 금지어 제외
    2. 상세 설명: HTML 형식, 모바일 최적화
    3. 주요 특징: 5-7개 불릿 포인트
    4. 스펙 테이블: 정리된 형식
    
    [금지어]
    - 과대광고: "최고", "1위", "세계 최초"
    - 의료 효능: "치료", "예방", "개선"
    
    JSON 형식으로 응답:
    {
      "productName": "...",
      "description": "...",
      "features": ["...", "..."],
      "specifications": {...}
    }
  `;
  
  const response = await this.callGemini(prompt);
  return JSON.parse(response);
}
```

#### Day 3-5: 프론트엔드 UI 개발

**1. 소싱 검색 페이지**
```bash
frontend/app/dashboard/sourcing/page.tsx
```

```tsx
export default function SourcingPage() {
  const [keyword, setKeyword] = useState('');
  const [site, setSite] = useState('1866');
  const [results, setResults] = useState([]);
  
  const handleSearch = async () => {
    const res = await api.sourcing.search({ keyword, site });
    setResults(res.data);
  };
  
  return (
    <div className="sourcing-page">
      <h1>도매 소싱</h1>
      
      {/* 검색 바 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="키워드 입력 (예: 무선 이어폰)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select value={site} onChange={(e) => setSite(e.target.value)}>
          <option value="1866">1866</option>
          <option value="domeggook">도매매</option>
        </select>
        <button onClick={handleSearch}>검색</button>
      </div>
      
      {/* 결과 그리드 */}
      <div className="product-grid">
        {results.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={() => router.push(`/dashboard/sourcing/generate?id=${product.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
```

**2. 리스팅 생성 페이지**
```bash
frontend/app/dashboard/sourcing/generate/page.tsx
```

```tsx
export default function GenerateListingPage() {
  const [wholesaleProduct, setWholesaleProduct] = useState(null);
  const [listing, setListing] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  
  useEffect(() => {
    // 1. 도매 상품 로드
    loadWholesaleProduct();
    
    // 2. AI 리스팅 생성
    generateListing();
  }, []);
  
  const handleCalculatePrice = async (input) => {
    const res = await api.sourcing.calculatePrice(input);
    setPricing(res.data);
  };
  
  const handleRegister = async () => {
    await api.sourcing.register({
      listing,
      price: selectedPrice,
    });
    
    toast.success('쿠팡에 등록되었습니다!');
    router.push('/dashboard/products');
  };
  
  return (
    <div className="generate-listing-page">
      {/* 좌측: 원본 상품 */}
      <div className="original-product">
        <h2>원본 상품</h2>
        <ProductPreview product={wholesaleProduct} />
      </div>
      
      {/* 우측: 생성된 리스팅 */}
      <div className="generated-listing">
        <h2>쿠팡 리스팅</h2>
        
        {/* 편집 가능한 필드들 */}
        <EditableField
          label="상품명"
          value={listing?.productName}
          onChange={(value) => setListing({...listing, productName: value})}
        />
        
        <RichTextEditor
          label="상세 설명"
          value={listing?.description}
          onChange={(value) => setListing({...listing, description: value})}
        />
        
        {/* 가격 계산기 */}
        <PricingCalculator
          wholesalePrice={wholesaleProduct?.price}
          onCalculate={handleCalculatePrice}
          recommendedPrices={pricing?.recommendedPrices}
          onSelectPrice={setSelectedPrice}
        />
        
        {/* 등록 버튼 */}
        <button onClick={handleRegister} disabled={!selectedPrice}>
          쿠팡에 등록하기
        </button>
      </div>
    </div>
  );
}
```

**3. 가격 계산기 컴포넌트**
```bash
frontend/components/PricingCalculator.tsx
```

```tsx
export function PricingCalculator({
  wholesalePrice,
  onCalculate,
  recommendedPrices,
  onSelectPrice,
}) {
  const [quantity, setQuantity] = useState(10);
  const [shippingCost, setShippingCost] = useState(3000);
  const [targetMargin, setTargetMargin] = useState(30);
  
  const totalCost = (wholesalePrice * quantity) + shippingCost;
  const costPerUnit = totalCost / quantity;
  
  return (
    <div className="pricing-calculator">
      <h3>가격 계산</h3>
      
      {/* 입력 필드 */}
      <input
        type="number"
        placeholder="수량"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      
      <input
        type="number"
        placeholder="배송비"
        value={shippingCost}
        onChange={(e) => setShippingCost(Number(e.target.value))}
      />
      
      <input
        type="number"
        placeholder="목표 마진율 (%)"
        value={targetMargin}
        onChange={(e) => setTargetMargin(Number(e.target.value))}
      />
      
      <button onClick={() => onCalculate({ 
        wholesalePrice, 
        quantity, 
        shippingCost, 
        targetMargin: targetMargin / 100 
      })}>
        계산하기
      </button>
      
      {/* 추천 가격 */}
      {recommendedPrices && (
        <div className="recommended-prices">
          <PriceOption
            label="공격적 (점유율 우선)"
            price={recommendedPrices.aggressive}
            margin={calculateMargin(recommendedPrices.aggressive)}
            onClick={() => onSelectPrice(recommendedPrices.aggressive)}
          />
          
          <PriceOption
            label="균형 (추천)"
            price={recommendedPrices.balanced}
            margin={calculateMargin(recommendedPrices.balanced)}
            onClick={() => onSelectPrice(recommendedPrices.balanced)}
            recommended
          />
          
          <PriceOption
            label="프리미엄 (마진 우선)"
            price={recommendedPrices.premium}
            margin={calculateMargin(recommendedPrices.premium)}
            onClick={() => onSelectPrice(recommendedPrices.premium)}
          />
        </div>
      )}
    </div>
  );
}
```

---

### Week 4: 데이터베이스 & 테스트 (2/19 - 2/25)

#### Day 1-2: 데이터베이스 스키마

**Prisma 스키마 추가:**
```prisma
// backend/prisma/schema.prisma

model WholesaleProduct {
  id            String   @id @default(cuid())
  site          String   // '1866' | 'domeggook'
  externalId    String
  name          String
  price         Float
  category      String
  images        String[]
  description   String?  @db.Text
  specifications Json?
  minOrderQty   Int      @default(1)
  shippingCost  Float    @default(0)
  
  crawledAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  listings      SourcingListing[]
  
  @@unique([site, externalId])
  @@index([site, category])
}

model SourcingListing {
  id                  String   @id @default(cuid())
  userId              String
  wholesaleProductId  String
  
  wholesalePrice      Float
  quantity            Int
  shippingCost        Float
  extraCost           Float    @default(0)
  totalCost           Float
  costPerUnit         Float
  
  sellingPrice        Float
  targetMargin        Float
  actualMargin        Float
  pricingStrategy     String
  
  generatedName       String
  generatedDescription String  @db.Text
  generatedFeatures   Json
  generatedSpecs      Json
  
  isEdited            Boolean  @default(false)
  status              String
  productId           String?
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  user                User     @relation(fields: [userId], references: [id])
  wholesaleProduct    WholesaleProduct @relation(fields: [wholesaleProductId], references: [id])
  product             Product? @relation(fields: [productId], references: [id])
  
  @@index([userId, status])
}
```

**마이그레이션 실행:**
```bash
cd backend
npx prisma migrate dev --name add_sourcing_tables
npx prisma generate
```

#### Day 3-4: 통합 테스트

**전체 플로우 테스트:**
```typescript
// backend/tests/integration/sourcing.flow.test.ts

describe('Sourcing Flow', () => {
  it('should complete full sourcing workflow', async () => {
    // 1. 검색
    const searchRes = await request(app)
      .post('/api/v1/sourcing/search')
      .send({ keyword: '무선 이어폰', site: '1866' });
    
    expect(searchRes.status).toBe(200);
    const products = searchRes.body.data;
    
    // 2. AI 리스팅 생성
    const listingRes = await request(app)
      .post('/api/v1/sourcing/generate-listing')
      .send({ wholesaleProduct: products[0] });
    
    expect(listingRes.body.data.productName).toBeDefined();
    
    // 3. 가격 계산
    const priceRes = await request(app)
      .post('/api/v1/sourcing/calculate-price')
      .send({
        wholesalePrice: products[0].price,
        quantity: 10,
        shippingCost: 3000,
        targetMargin: 0.3,
      });
    
    expect(priceRes.body.data.recommendedPrices).toBeDefined();
    
    // 4. 쿠팡 등록
    const registerRes = await request(app)
      .post('/api/v1/sourcing/register')
      .send({
        listing: listingRes.body.data,
        price: priceRes.body.data.recommendedPrices.balanced,
      });
    
    expect(registerRes.body.success).toBe(true);
  });
});
```

#### Day 5: 배포 및 문서화

**배포 체크리스트:**
- [ ] 환경 변수 설정 (PUPPETEER_EXECUTABLE_PATH 등)
- [ ] Redis 연결 확인
- [ ] 크롤링 Rate Limit 설정
- [ ] 에러 로깅 설정
- [ ] 모니터링 대시보드

**문서 업데이트:**
- [ ] API 문서 (Swagger)
- [ ] 사용자 가이드
- [ ] 개발자 문서

---

## 🎯 성공 기준

### 기술적 지표
- [ ] 크롤링 성공률 95% 이상
- [ ] AI 리스팅 생성 시간 < 5초
- [ ] 가격 계산 응답 시간 < 1초
- [ ] 전체 플로우 완료 시간 < 2분

### 비즈니스 지표
- [ ] 베타 테스터 10명 확보
- [ ] 기능 만족도 NPS 60+
- [ ] 소싱 시간 80% 단축 (사용자 피드백)
- [ ] 등록 성공률 90% 이상

---

## 🚨 리스크 관리

### 주요 리스크

1. **도매 사이트 차단**
   - 대응: Rate Limiting, User-Agent 로테이션, 프록시 사용
   - 백업: 공식 API 협의

2. **크롤링 구조 변경**
   - 대응: 유연한 파서 설계, 자동 알림 시스템
   - 모니터링: 일일 크롤링 성공률 체크

3. **AI 생성 품질 저하**
   - 대응: 프롬프트 A/B 테스트, 사용자 피드백 반영
   - 백업: 수동 편집 옵션 제공

---

## 📞 다음 단계

### 즉시 시작 가능한 작업

1. **PoC (Proof of Concept)**
   ```bash
   # 1866 크롤링 테스트
   node scripts/test-1866-crawler.js
   ```

2. **개발 환경 설정**
   ```bash
   # Puppeteer 설치
   npm install puppeteer cheerio
   
   # Redis 시작
   docker-compose up -d redis
   ```

3. **첫 번째 PR 생성**
   - 브랜치: `feature/sourcing-crawler-base`
   - 작업: BaseCrawler 추상 클래스 구현
   - 리뷰어: 팀원 지정

---

**시작하시겠습니까? 🚀**
