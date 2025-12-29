# SOLID 원칙 (SOLID Principles)

## 개요

WinnerLens 프로젝트의 모든 코어 로직은 **SOLID 원칙**을 준수하여 구현합니다.  
SOLID는 객체지향 설계의 5가지 핵심 원칙으로, 유지보수성과 확장성을 높이는 코드를 작성하는 데 필수적입니다.

---

## SOLID 원칙 개요

| 원칙 | 약어 | 핵심 개념 |
|------|------|----------|
| **Single Responsibility** | S | 단일 책임 원칙 - 클래스는 하나의 책임만 가져야 함 |
| **Open/Closed** | O | 개방-폐쇄 원칙 - 확장에는 열려있고 수정에는 닫혀있어야 함 |
| **Liskov Substitution** | L | 리스코프 치환 원칙 - 하위 타입은 상위 타입을 대체할 수 있어야 함 |
| **Interface Segregation** | I | 인터페이스 분리 원칙 - 클라이언트는 사용하지 않는 인터페이스에 의존하지 않아야 함 |
| **Dependency Inversion** | D | 의존성 역전 원칙 - 구체화가 아닌 추상화에 의존해야 함 |

---

## 1. Single Responsibility Principle (SRP)
### 단일 책임 원칙

> **"클래스는 단 하나의 책임만 가져야 하며, 변경의 이유도 단 하나여야 한다."**

### ❌ Bad: 여러 책임을 가진 클래스

```typescript
// 잘못된 예: UserService가 너무 많은 책임을 가짐
class UserService {
  // 책임 1: 사용자 관리
  async createUser(data: CreateUserDto) {
    const user = await prisma.user.create({ data });
    return user;
  }

  // 책임 2: 이메일 발송
  async sendWelcomeEmail(user: User) {
    const transporter = nodemailer.createTransport({...});
    await transporter.sendMail({
      to: user.email,
      subject: 'Welcome!',
      html: '<h1>Welcome to WinnerLens</h1>'
    });
  }

  // 책임 3: 결제 처리
  async processPayment(userId: string, amount: number) {
    const paymentGateway = new PaymentGateway();
    return await paymentGateway.charge(userId, amount);
  }

  // 책임 4: 로깅
  logUserActivity(userId: string, action: string) {
    console.log(`User ${userId} performed ${action}`);
  }
}
```

### ✅ Good: 단일 책임으로 분리

```typescript
// 사용자 관리만 담당
class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
    private logger: Logger
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(data);
    
    // 다른 서비스에 위임
    await this.emailService.sendWelcomeEmail(user);
    this.logger.info(`User created: ${user.id}`);
    
    return user;
  }
}

// 이메일 발송만 담당
class EmailService {
  constructor(private transporter: Transporter) {}

  async sendWelcomeEmail(user: User): Promise<void> {
    await this.transporter.sendMail({
      to: user.email,
      subject: 'Welcome!',
      html: this.getWelcomeTemplate(user)
    });
  }

  private getWelcomeTemplate(user: User): string {
    return `<h1>Welcome ${user.name}!</h1>`;
  }
}

// 결제 처리만 담당
class PaymentService {
  constructor(private paymentGateway: PaymentGateway) {}

  async processPayment(userId: string, amount: number): Promise<PaymentResult> {
    return await this.paymentGateway.charge(userId, amount);
  }
}

// 로깅만 담당
class Logger {
  info(message: string): void {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  }

  error(message: string, error?: Error): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  }
}
```

---

## 2. Open/Closed Principle (OCP)
### 개방-폐쇄 원칙

> **"소프트웨어 엔티티는 확장에는 열려있고, 수정에는 닫혀있어야 한다."**

### ❌ Bad: 새로운 기능 추가 시 기존 코드 수정 필요

```typescript
// 잘못된 예: 새로운 스코어링 방식 추가 시 기존 코드 수정 필요
class ScoringEngine {
  calculateScore(product: Product, type: string): number {
    if (type === 'basic') {
      return product.price * 0.1;
    } else if (type === 'advanced') {
      return product.price * 0.2 + product.reviews * 0.5;
    } else if (type === 'premium') {
      // 새로운 타입 추가 시 이 메서드를 수정해야 함
      return product.price * 0.3 + product.reviews * 0.7 + product.sales * 0.1;
    }
    return 0;
  }
}
```

### ✅ Good: 확장 가능한 구조 (Strategy Pattern)

```typescript
// 스코어링 전략 인터페이스
interface ScoringStrategy {
  calculate(product: Product): number;
}

// 기본 스코어링 전략
class BasicScoringStrategy implements ScoringStrategy {
  calculate(product: Product): number {
    return product.price * 0.1;
  }
}

// 고급 스코어링 전략
class AdvancedScoringStrategy implements ScoringStrategy {
  calculate(product: Product): number {
    return product.price * 0.2 + product.reviews * 0.5;
  }
}

// 프리미엄 스코어링 전략 (새로운 전략 추가 - 기존 코드 수정 없음)
class PremiumScoringStrategy implements ScoringStrategy {
  calculate(product: Product): number {
    return product.price * 0.3 + product.reviews * 0.7 + product.sales * 0.1;
  }
}

// 스코어링 엔진 (수정 없이 확장 가능)
class ScoringEngine {
  constructor(private strategy: ScoringStrategy) {}

  calculateScore(product: Product): number {
    return this.strategy.calculate(product);
  }

  // 전략 변경 가능
  setStrategy(strategy: ScoringStrategy): void {
    this.strategy = strategy;
  }
}

// 사용 예시
const engine = new ScoringEngine(new BasicScoringStrategy());
const score1 = engine.calculateScore(product);

// 전략 변경
engine.setStrategy(new PremiumScoringStrategy());
const score2 = engine.calculateScore(product);
```

---

## 3. Liskov Substitution Principle (LSP)
### 리스코프 치환 원칙

> **"하위 타입은 상위 타입을 대체할 수 있어야 한다."**

### ❌ Bad: 하위 클래스가 상위 클래스의 계약을 위반

```typescript
// 잘못된 예: Rectangle의 하위 클래스 Square가 예상과 다르게 동작
class Rectangle {
  constructor(
    protected width: number,
    protected height: number
  ) {}

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  setWidth(width: number): void {
    this.width = width;
    this.height = width; // 정사각형은 너비와 높이가 같아야 함
  }

  setHeight(height: number): void {
    this.width = height;
    this.height = height; // 정사각형은 너비와 높이가 같아야 함
  }
}

// 문제 발생
function testRectangle(rect: Rectangle) {
  rect.setWidth(5);
  rect.setHeight(4);
  console.log(rect.getArea()); // 기대: 20
}

const square = new Square(0, 0);
testRectangle(square); // 실제: 16 (예상과 다름!)
```

### ✅ Good: 올바른 추상화

```typescript
// 올바른 예: 공통 인터페이스 사용
interface Shape {
  getArea(): number;
}

class Rectangle implements Shape {
  constructor(
    private width: number,
    private height: number
  ) {}

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class Square implements Shape {
  constructor(private size: number) {}

  setSize(size: number): void {
    this.size = size;
  }

  getArea(): number {
    return this.size * this.size;
  }
}

// 사용 예시
function printArea(shape: Shape) {
  console.log(`Area: ${shape.getArea()}`);
}

printArea(new Rectangle(5, 4)); // 20
printArea(new Square(5));       // 25
```

### WinnerLens 적용 예시

```typescript
// 추상 클래스
abstract class TrendDataSource {
  abstract fetchTrends(category: string): Promise<TrendData[]>;
  
  async getTrendScore(category: string): Promise<number> {
    const trends = await this.fetchTrends(category);
    return this.calculateScore(trends);
  }

  protected calculateScore(trends: TrendData[]): number {
    return trends.reduce((sum, t) => sum + t.searchVolume, 0) / trends.length;
  }
}

// 하위 클래스들은 상위 클래스를 완전히 대체 가능
class GoogleTrendsSource extends TrendDataSource {
  async fetchTrends(category: string): Promise<TrendData[]> {
    // Google Trends API 호출
    return await this.googleApi.getTrends(category);
  }
}

class NaverTrendsSource extends TrendDataSource {
  async fetchTrends(category: string): Promise<TrendData[]> {
    // Naver Shopping API 호출
    return await this.naverApi.getTrends(category);
  }
}

// 어떤 하위 클래스를 사용해도 동일하게 동작
function analyzeTrends(source: TrendDataSource, category: string) {
  return source.getTrendScore(category);
}
```

---

## 4. Interface Segregation Principle (ISP)
### 인터페이스 분리 원칙

> **"클라이언트는 자신이 사용하지 않는 메서드에 의존하지 않아야 한다."**

### ❌ Bad: 비대한 인터페이스

```typescript
// 잘못된 예: 모든 기능을 하나의 인터페이스에 포함
interface ProductService {
  // 상품 CRUD
  createProduct(data: CreateProductDto): Promise<Product>;
  updateProduct(id: string, data: UpdateProductDto): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  getProduct(id: string): Promise<Product>;
  
  // 스코어링
  calculateScore(product: Product): Promise<Score>;
  
  // AI 생성
  generateListing(product: Product): Promise<Listing>;
  
  // 쿠팡 연동
  registerToCoupang(product: Product): Promise<void>;
  updateCoupangProduct(product: Product): Promise<void>;
  
  // 분석
  getAnalytics(productId: string): Promise<Analytics>;
}

// 문제: 단순히 상품 조회만 필요한 클라이언트도 모든 메서드를 알아야 함
class ProductViewer {
  constructor(private productService: ProductService) {}
  
  async viewProduct(id: string) {
    // getProduct만 필요하지만 전체 인터페이스에 의존
    return await this.productService.getProduct(id);
  }
}
```

### ✅ Good: 작고 집중된 인터페이스

```typescript
// 올바른 예: 역할별로 인터페이스 분리

// 상품 조회 인터페이스
interface ProductReader {
  getProduct(id: string): Promise<Product>;
  listProducts(filters: ProductFilters): Promise<Product[]>;
}

// 상품 작성 인터페이스
interface ProductWriter {
  createProduct(data: CreateProductDto): Promise<Product>;
  updateProduct(id: string, data: UpdateProductDto): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}

// 상품 스코어링 인터페이스
interface ProductScorer {
  calculateScore(product: Product): Promise<Score>;
}

// AI 생성 인터페이스
interface ListingGenerator {
  generateListing(product: Product): Promise<Listing>;
}

// 쿠팡 연동 인터페이스
interface CoupangIntegration {
  registerProduct(product: Product): Promise<void>;
  updateProduct(product: Product): Promise<void>;
}

// 클라이언트는 필요한 인터페이스만 의존
class ProductViewer {
  constructor(private productReader: ProductReader) {}
  
  async viewProduct(id: string) {
    return await this.productReader.getProduct(id);
  }
}

class ProductRegistrar {
  constructor(
    private productWriter: ProductWriter,
    private listingGenerator: ListingGenerator,
    private coupangIntegration: CoupangIntegration
  ) {}
  
  async registerNewProduct(data: CreateProductDto) {
    const product = await this.productWriter.createProduct(data);
    const listing = await this.listingGenerator.generateListing(product);
    await this.coupangIntegration.registerProduct(product);
    return product;
  }
}
```

---

## 5. Dependency Inversion Principle (DIP)
### 의존성 역전 원칙

> **"고수준 모듈은 저수준 모듈에 의존해서는 안 된다. 둘 다 추상화에 의존해야 한다."**

### ❌ Bad: 구체적인 구현에 의존

```typescript
// 잘못된 예: 고수준 모듈이 저수준 구현에 직접 의존
class ProductService {
  private prisma: PrismaClient; // 구체적인 구현에 의존
  private openai: OpenAI;       // 구체적인 구현에 의존

  constructor() {
    this.prisma = new PrismaClient();
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async createProduct(data: CreateProductDto) {
    // Prisma에 직접 의존
    const product = await this.prisma.product.create({ data });
    
    // OpenAI에 직접 의존
    const listing = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Generate listing' }]
    });
    
    return product;
  }
}

// 문제: 테스트 어려움, 구현 변경 시 ProductService도 수정 필요
```

### ✅ Good: 추상화에 의존 (Dependency Injection)

```typescript
// 올바른 예: 인터페이스(추상화)에 의존

// 추상화 정의
interface ProductRepository {
  create(data: CreateProductDto): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  update(id: string, data: UpdateProductDto): Promise<Product>;
  delete(id: string): Promise<void>;
}

interface AIService {
  generateListing(input: GenerateListingInput): Promise<Listing>;
  generateProductName(input: GenerateNameInput): Promise<string>;
}

// 고수준 모듈: 추상화에 의존
class ProductService {
  constructor(
    private productRepository: ProductRepository,  // 추상화에 의존
    private aiService: AIService                   // 추상화에 의존
  ) {}

  async createProduct(data: CreateProductDto): Promise<Product> {
    const product = await this.productRepository.create(data);
    const listing = await this.aiService.generateListing({ product });
    return product;
  }
}

// 저수준 모듈: 구체적인 구현
class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateProductDto): Promise<Product> {
    return await this.prisma.product.create({ data });
  }

  async findById(id: string): Promise<Product | null> {
    return await this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    return await this.prisma.product.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }
}

class OpenAIService implements AIService {
  constructor(private openai: OpenAI) {}

  async generateListing(input: GenerateListingInput): Promise<Listing> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: this.buildPrompt(input) }]
    });
    return this.parseListing(response);
  }

  async generateProductName(input: GenerateNameInput): Promise<string> {
    // 구현
    return '';
  }

  private buildPrompt(input: GenerateListingInput): string {
    // 프롬프트 생성
    return '';
  }

  private parseListing(response: any): Listing {
    // 응답 파싱
    return {} as Listing;
  }
}

// 의존성 주입 (Dependency Injection)
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const productRepository = new PrismaProductRepository(prisma);
const aiService = new OpenAIService(openai);

const productService = new ProductService(productRepository, aiService);

// 테스트 시 Mock 객체 주입 가능
const mockRepository: ProductRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

const mockAIService: AIService = {
  generateListing: jest.fn(),
  generateProductName: jest.fn()
};

const testProductService = new ProductService(mockRepository, mockAIService);
```

---

## SOLID 적용 체크리스트

새로운 클래스나 모듈을 작성할 때 다음을 확인하세요:

### Single Responsibility Principle (SRP)
- [ ] 이 클래스가 변경되어야 하는 이유가 하나뿐인가?
- [ ] 클래스 이름이 역할을 명확히 표현하는가?
- [ ] 메서드들이 모두 같은 책임과 관련되어 있는가?

### Open/Closed Principle (OCP)
- [ ] 새로운 기능 추가 시 기존 코드를 수정하지 않아도 되는가?
- [ ] 확장 포인트(인터페이스, 추상 클래스)가 명확한가?
- [ ] Strategy, Factory 등의 디자인 패턴을 고려했는가?

### Liskov Substitution Principle (LSP)
- [ ] 하위 클래스가 상위 클래스의 계약을 준수하는가?
- [ ] 하위 클래스로 대체해도 프로그램이 정상 동작하는가?
- [ ] 하위 클래스가 상위 클래스의 메서드를 예상과 다르게 구현하지 않는가?

### Interface Segregation Principle (ISP)
- [ ] 인터페이스가 너무 비대하지 않은가?
- [ ] 클라이언트가 사용하지 않는 메서드를 포함하고 있지 않은가?
- [ ] 역할별로 인터페이스를 분리할 수 있는가?

### Dependency Inversion Principle (DIP)
- [ ] 고수준 모듈이 저수준 모듈에 직접 의존하지 않는가?
- [ ] 의존성이 인터페이스(추상화)를 통해 주입되는가?
- [ ] 테스트 시 Mock 객체로 대체 가능한가?

---

## WinnerLens 프로젝트 적용 예시

### 트렌드 분석 모듈

```typescript
// 인터페이스 정의 (DIP, ISP)
interface TrendDataSource {
  fetchTrends(category: string): Promise<TrendData[]>;
}

interface TrendAnalyzer {
  analyze(trends: TrendData[]): TrendInsight;
}

interface TrendRepository {
  save(trends: TrendData[]): Promise<void>;
  findByCategory(category: string): Promise<TrendData[]>;
}

// 구현 (SRP)
class GoogleTrendsSource implements TrendDataSource {
  async fetchTrends(category: string): Promise<TrendData[]> {
    // Google Trends API 호출만 담당
    return [];
  }
}

class TrendScoreAnalyzer implements TrendAnalyzer {
  analyze(trends: TrendData[]): TrendInsight {
    // 트렌드 분석만 담당
    return {} as TrendInsight;
  }
}

class PrismaTrendRepository implements TrendRepository {
  constructor(private prisma: PrismaClient) {}

  async save(trends: TrendData[]): Promise<void> {
    // DB 저장만 담당
  }

  async findByCategory(category: string): Promise<TrendData[]> {
    // DB 조회만 담당
    return [];
  }
}

// 서비스 (DIP - 추상화에 의존)
class TrendService {
  constructor(
    private dataSources: TrendDataSource[],  // 여러 소스 지원 (OCP)
    private analyzer: TrendAnalyzer,
    private repository: TrendRepository
  ) {}

  async collectAndAnalyzeTrends(category: string): Promise<TrendInsight> {
    // 모든 소스에서 데이터 수집
    const allTrends = await Promise.all(
      this.dataSources.map(source => source.fetchTrends(category))
    );
    
    const mergedTrends = this.mergeTrends(allTrends.flat());
    
    // 분석
    const insight = this.analyzer.analyze(mergedTrends);
    
    // 저장
    await this.repository.save(mergedTrends);
    
    return insight;
  }

  private mergeTrends(trends: TrendData[]): TrendData[] {
    // 중복 제거 및 병합
    return trends;
  }
}

// 의존성 주입
const trendService = new TrendService(
  [new GoogleTrendsSource(), new NaverTrendsSource()],
  new TrendScoreAnalyzer(),
  new PrismaTrendRepository(prisma)
);
```

---

## 참고 자료

- [Clean Architecture (Robert C. Martin)](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Design Patterns (Gang of Four)](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612)

---

**마지막 업데이트**: 2025-12-26  
**작성자**: WinnerLens Engineering Team
