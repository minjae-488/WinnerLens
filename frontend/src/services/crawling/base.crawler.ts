import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { ICrawler, CrawlerConfig, CrawlerError } from './crawler.interface';
import { WholesaleProduct, SearchOptions } from '../../types/sourcing.types';

/**
 * 기본 크롤러 추상 클래스
 * 공통 기능을 제공하고, 각 사이트별 크롤러는 이를 상속받아 구현
 */
export abstract class BaseCrawler implements ICrawler {
    protected axiosInstance: AxiosInstance;
    protected lastRequestTime: number = 0;

    constructor(protected config: CrawlerConfig) {
        this.axiosInstance = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout,
            headers: {
                'User-Agent': config.userAgent || this.getRandomUserAgent(),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
            },
        });
    }

    /**
     * Rate Limiting 적용하여 페이지 가져오기
     */
    protected async fetchPage(url: string): Promise<string> {
        // Rate Limiting
        await this.applyRateLimit();

        try {
            const response = await this.axiosInstance.get(url);
            return response.data;
        } catch (error: any) {
            throw new CrawlerError(
                `Failed to fetch page: ${url}`,
                this.config.siteName,
                error.response?.status,
                error
            );
        }
    }

    /**
     * HTML 파싱
     */
    protected parseHTML(html: string): cheerio.CheerioAPI {
        return cheerio.load(html);
    }

    /**
     * Rate Limiting 적용
     */
    protected async applyRateLimit(): Promise<void> {
        const now = Date.now();
        const minInterval = 1000 / this.config.rateLimit; // ms
        const timeSinceLastRequest = now - this.lastRequestTime;

        if (timeSinceLastRequest < minInterval) {
            const delay = minInterval - timeSinceLastRequest;
            await this.sleep(delay);
        }

        this.lastRequestTime = Date.now();
    }

    /**
     * Sleep 유틸리티
     */
    protected sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 랜덤 User-Agent 생성
     */
    protected getRandomUserAgent(): string {
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        ];

        return userAgents[Math.floor(Math.random() * userAgents.length)];
    }

    /**
     * 가격 문자열을 숫자로 변환
     * 예: "10,000원" -> 10000
     */
    protected parsePrice(priceStr: string): number {
        const cleaned = priceStr.replace(/[^0-9]/g, '');
        return parseInt(cleaned, 10) || 0;
    }

    /**
     * 상품 ID 생성
     */
    protected generateProductId(externalId: string): string {
        return `${this.config.siteName}_${externalId}`;
    }

    /**
     * 재시도 로직
     */
    protected async retry<T>(
        fn: () => Promise<T>,
        attempts: number = this.config.retryAttempts || 3
    ): Promise<T> {
        let lastError: Error | undefined;

        for (let i = 0; i < attempts; i++) {
            try {
                return await fn();
            } catch (error: any) {
                lastError = error;

                // 마지막 시도가 아니면 대기 후 재시도
                if (i < attempts - 1) {
                    const delay = Math.pow(2, i) * 1000; // Exponential backoff
                    console.log(`Retry attempt ${i + 1}/${attempts} after ${delay}ms...`);
                    await this.sleep(delay);
                }
            }
        }

        throw lastError;
    }

    // 추상 메서드 - 각 크롤러에서 구현 필요
    abstract search(keyword: string, options?: SearchOptions): Promise<WholesaleProduct[]>;
    abstract getProductDetail(productId: string): Promise<WholesaleProduct>;

    /**
     * 최저가 상품 찾기 (기본 구현)
     */
    async getLowestPrice(keyword: string): Promise<WholesaleProduct | null> {
        const products = await this.search(keyword, { sortBy: 'price', limit: 1 });
        return products.length > 0 ? products[0] : null;
    }
}
