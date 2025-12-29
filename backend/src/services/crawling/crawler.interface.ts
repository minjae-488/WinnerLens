import { WholesaleProduct, SearchOptions } from '../../types/sourcing.types';

/**
 * 크롤러 인터페이스
 * 모든 도매 사이트 크롤러는 이 인터페이스를 구현해야 함
 */
export interface ICrawler {
    /**
     * 키워드로 상품 검색
     */
    search(keyword: string, options?: SearchOptions): Promise<WholesaleProduct[]>;

    /**
     * 상품 상세 정보 조회
     */
    getProductDetail(productId: string): Promise<WholesaleProduct>;

    /**
     * 최저가 상품 찾기
     */
    getLowestPrice(keyword: string): Promise<WholesaleProduct | null>;
}

/**
 * 크롤러 설정
 */
export interface CrawlerConfig {
    baseUrl: string;
    siteName: '1866' | 'domeggook';
    rateLimit: number; // 초당 최대 요청 수
    timeout: number; // 타임아웃 (ms)
    userAgent?: string;
    retryAttempts?: number;
}

/**
 * 크롤링 에러
 */
export class CrawlerError extends Error {
    constructor(
        message: string,
        public site: string,
        public statusCode?: number,
        public originalError?: Error
    ) {
        super(message);
        this.name = 'CrawlerError';
    }
}
