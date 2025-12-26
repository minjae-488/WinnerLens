# Test-Driven Development (TDD) 규칙

## 개요

WinnerLens 프로젝트의 **모든 코어 로직**은 TDD(Test-Driven Development) 방식으로 구현합니다.  
UI 컴포넌트를 제외한 비즈니스 로직, 서비스, 유틸리티 함수 등은 반드시 테스트를 먼저 작성합니다.

---

## TDD 적용 범위

### ✅ TDD 필수 적용 대상

- **비즈니스 로직**: 서비스 클래스, 도메인 로직
- **데이터 처리**: 스코어링 알고리즘, 트렌드 분석 로직
- **API 엔드포인트**: 컨트롤러 및 라우터 로직
- **유틸리티 함수**: 헬퍼 함수, 변환 함수
- **검증 로직**: Validator, 가드레일 시스템
- **외부 API 연동**: Coupang API, OpenAI API 래퍼
- **데이터베이스 레이어**: Repository 패턴 구현

### ❌ TDD 제외 대상

- **UI 컴포넌트**: React 컴포넌트 (단, 복잡한 로직은 분리하여 TDD 적용)
- **스타일링**: CSS, Tailwind 클래스
- **설정 파일**: 환경 변수, 설정 파일

---

## TDD 사이클: Red-Green-Refactor

### 1️⃣ Red (실패하는 테스트 작성)

먼저 실패하는 테스트를 작성합니다.

```typescript
// src/modules/scoring/__tests__/scoring.service.test.ts

describe('ScoringEngine', () => {
  describe('calculateDemandScore', () => {
    it('should return a score between 0 and 100', async () => {
      // Arrange
      const scoringEngine = new ScoringEngine();
      const product = {
        keyword: '무선청소기',
        category: '가전'
      };

      // Act
      const score = await scoringEngine.calculateDemandScore(product);

      // Assert
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
```

**실행 결과**: ❌ 테스트 실패 (구현되지 않음)

---

### 2️⃣ Green (최소한의 코드로 테스트 통과)

테스트를 통과시키는 최소한의 코드를 작성합니다.

```typescript
// src/modules/scoring/scoring.service.ts

export class ScoringEngine {
  async calculateDemandScore(product: ProductInput): Promise<number> {
    // 최소 구현: 일단 테스트만 통과
    return 50;
  }
}
```

**실행 결과**: ✅ 테스트 통과

---

### 3️⃣ Refactor (리팩토링)

테스트를 통과한 후, 코드를 개선합니다.

```typescript
// src/modules/scoring/scoring.service.ts

export class ScoringEngine {
  constructor(
    private trendService: TrendService,
    private categoryService: CategoryService
  ) {}

  async calculateDemandScore(product: ProductInput): Promise<number> {
    // 실제 로직 구현
    const trendData = await this.trendService.getTrendData(product.keyword);
    const categoryGrowth = await this.categoryService.getGrowthRate(product.category);
    
    const searchVolumeScore = this.normalizeSearchVolume(trendData.searchVolume);
    const growthScore = this.normalizeGrowthRate(categoryGrowth);
    
    return Math.round((searchVolumeScore * 0.6) + (growthScore * 0.4));
  }

  private normalizeSearchVolume(volume: number): number {
    // 정규화 로직
    return Math.min(100, (volume / 1000) * 100);
  }

  private normalizeGrowthRate(rate: number): number {
    // 정규화 로직
    return Math.min(100, rate * 10);
  }
}
```

**실행 결과**: ✅ 테스트 여전히 통과 (리팩토링 성공)

---

## 테스트 작성 원칙

### AAA 패턴 (Arrange-Act-Assert)

모든 테스트는 AAA 패턴을 따릅니다.

```typescript
it('should calculate margin score correctly', () => {
  // Arrange (준비): 테스트에 필요한 데이터 및 객체 준비
  const scoringEngine = new ScoringEngine();
  const product = {
    price: 150000,
    cost: 100000
  };

  // Act (실행): 테스트할 메서드 실행
  const score = scoringEngine.calculateMarginScore(product);

  // Assert (검증): 결과 검증
  expect(score).toBe(70);
});
```

---

### 테스트 명명 규칙

테스트 이름은 **"should + 동작 + 조건"** 형식을 따릅니다.

```typescript
// ✅ Good
it('should return 0 when search volume is 0', () => {});
it('should throw error when product is null', () => {});
it('should cache result for 1 hour', () => {});

// ❌ Bad
it('test1', () => {});
it('works', () => {});
it('calculateDemandScore', () => {});
```

---

### 하나의 테스트는 하나의 개념만 검증

```typescript
// ✅ Good: 각 테스트가 하나의 개념만 검증
it('should return high score when search volume is high', () => {
  const score = scoringEngine.calculateDemandScore({ searchVolume: 10000 });
  expect(score).toBeGreaterThan(80);
});

it('should return low score when search volume is low', () => {
  const score = scoringEngine.calculateDemandScore({ searchVolume: 100 });
  expect(score).toBeLessThan(20);
});

// ❌ Bad: 하나의 테스트에서 여러 개념 검증
it('should calculate demand score', () => {
  const highScore = scoringEngine.calculateDemandScore({ searchVolume: 10000 });
  expect(highScore).toBeGreaterThan(80);
  
  const lowScore = scoringEngine.calculateDemandScore({ searchVolume: 100 });
  expect(lowScore).toBeLessThan(20);
});
```

---

## 테스트 커버리지 목표

### 최소 커버리지 요구사항

- **전체 코드**: 80% 이상
- **비즈니스 로직**: 90% 이상
- **유틸리티 함수**: 95% 이상

### 커버리지 확인

```bash
# 커버리지 리포트 생성
npm run test:coverage

# 커버리지 리포트 확인
open coverage/lcov-report/index.html
```

---

## TDD 워크플로우 체크리스트

새로운 기능을 구현할 때 다음 순서를 따릅니다:

- [ ] 1. **요구사항 이해**: 구현할 기능의 요구사항 명확히 파악
- [ ] 2. **테스트 케이스 작성**: 가능한 모든 시나리오 나열
- [ ] 3. **Red**: 실패하는 테스트 작성
- [ ] 4. **Green**: 최소한의 코드로 테스트 통과
- [ ] 5. **Refactor**: 코드 개선 (테스트는 계속 통과)
- [ ] 6. **추가 테스트**: 엣지 케이스, 에러 케이스 추가
- [ ] 7. **커버리지 확인**: 목표 커버리지 달성 확인
- [ ] 8. **코드 리뷰**: PR 생성 및 리뷰 요청

---

## 테스트 작성 시 주의사항

### ✅ Do

- 테스트를 먼저 작성하라
- 작은 단위로 테스트하라
- 테스트 이름을 명확하게 작성하라
- Mock을 적극 활용하라
- 엣지 케이스를 테스트하라
- 에러 케이스를 테스트하라

### ❌ Don't

- 구현 후 테스트를 작성하지 마라
- 테스트를 건너뛰지 마라
- 너무 많은 것을 한 번에 테스트하지 마라
- 실제 외부 API를 호출하지 마라
- 테스트 간 의존성을 만들지 마라
- 랜덤 값을 사용하지 마라 (재현 불가능)

---

**마지막 업데이트**: 2025-12-26  
**작성자**: WinnerLens Engineering Team
