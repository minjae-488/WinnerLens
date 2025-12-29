import { BaseCrawler } from './base.crawler';
import { WholesaleProduct, SearchOptions } from '../../types/sourcing.types';

/**
 * 1866 도매 사이트 크롤러
 * 
 * 주의: 이것은 PoC (Proof of Concept) 버전입니다.
 * 실제 1866 사이트 구조에 맞춰 수정이 필요합니다.
 */
export class Crawler1866 extends BaseCrawler {
    constructor() {
        super({
            baseUrl: 'https://www.1866.co.kr',
            siteName: '1866',
            rateLimit: 2, // 초당 최대 2 요청
            timeout: 10000, // 10초
            retryAttempts: 3,
        });
    }

    /**
     * 키워드로 상품 검색
     */
    async search(keyword: string, options?: SearchOptions): Promise<WholesaleProduct[]> {
        console.log(`[1866] Searching for: ${keyword}`);

        try {
            // 검색 URL 구성 (실제 1866 사이트 구조에 맞춰 수정 필요)
            const searchUrl = `/search?keyword=${encodeURIComponent(keyword)}`;

            // 페이지 가져오기
            const html = await this.retry(() => this.fetchPage(searchUrl));

            // HTML 파싱
            const $ = this.parseHTML(html);

            // 상품 리스트 추출 (실제 셀렉터는 사이트 구조에 맞춰 수정 필요)
            const products: WholesaleProduct[] = [];

            // PoC: 임시 데이터 반환 (실제 크롤링 로직으로 대체 필요)
            // 실제 구현 시 아래 주석 해제하고 셀렉터 수정
            /*
            $('.product-item').each((index, element) => {
              const $item = $(element);
              
              const externalId = $item.attr('data-product-id') || '';
              const name = $item.find('.product-name').text().trim();
              const priceStr = $item.find('.product-price').text().trim();
              const price = this.parsePrice(priceStr);
              const imageUrl = $item.find('.product-image img').attr('src') || '';
              const productUrl = $item.find('a').attr('href') || '';
              
              products.push({
                id: this.generateProductId(externalId),
                site: '1866',
                externalId,
                name,
                price,
                category: options?.category || 'general',
                images: [imageUrl],
                minOrderQty: 1,
                shippingCost: 0,
                url: `${this.config.baseUrl}${productUrl}`,
              });
            });
            */

            // PoC: 테스트용 더미 데이터
            products.push({
                id: this.generateProductId('test_001'),
                site: '1866',
                externalId: 'test_001',
                name: `${keyword} - 테스트 상품 1`,
                price: 8900,
                category: 'electronics',
                images: ['https://via.placeholder.com/300'],
                description: '테스트용 상품입니다.',
                minOrderQty: 10,
                shippingCost: 3000,
                url: 'https://www.1866.co.kr/product/test_001',
            });

            products.push({
                id: this.generateProductId('test_002'),
                site: '1866',
                externalId: 'test_002',
                name: `${keyword} - 테스트 상품 2`,
                price: 12500,
                category: 'electronics',
                images: ['https://via.placeholder.com/300'],
                description: '테스트용 상품입니다.',
                minOrderQty: 5,
                shippingCost: 2500,
                url: 'https://www.1866.co.kr/product/test_002',
            });

            // 가격 정렬
            if (options?.sortBy === 'price') {
                products.sort((a, b) => a.price - b.price);
            }

            // 가격 범위 필터
            let filtered = products;
            if (options?.priceRange) {
                const [min, max] = options.priceRange;
                filtered = products.filter(p => p.price >= min && p.price <= max);
            }

            // 개수 제한
            if (options?.limit) {
                filtered = filtered.slice(0, options.limit);
            }

            console.log(`[1866] Found ${filtered.length} products`);
            return filtered;

        } catch (error: any) {
            console.error(`[1866] Search error:`, error.message);
            throw error;
        }
    }

    /**
     * 상품 상세 정보 조회
     */
    async getProductDetail(productId: string): Promise<WholesaleProduct> {
        console.log(`[1866] Getting product detail: ${productId}`);

        try {
            // 상품 ID에서 externalId 추출
            const externalId = productId.replace('1866_', '');

            // 상세 페이지 URL (실제 구조에 맞춰 수정 필요)
            const detailUrl = `/product/${externalId}`;

            // 페이지 가져오기
            const html = await this.retry(() => this.fetchPage(detailUrl));

            // HTML 파싱
            const $ = this.parseHTML(html);

            // PoC: 테스트용 더미 데이터
            const product: WholesaleProduct = {
                id: productId,
                site: '1866',
                externalId,
                name: '블루투스 무선 이어폰 TWS 5.0',
                price: 8900,
                category: 'electronics',
                images: [
                    'https://via.placeholder.com/600x600/4CAF50/FFFFFF?text=Image+1',
                    'https://via.placeholder.com/600x600/2196F3/FFFFFF?text=Image+2',
                    'https://via.placeholder.com/600x600/FF9800/FFFFFF?text=Image+3',
                ],
                description: `
          <h3>상품 설명</h3>
          <p>고품질 블루투스 5.0 무선 이어폰입니다.</p>
          <ul>
            <li>블루투스 5.0 칩셋</li>
            <li>AAC 코덱 지원</li>
            <li>노이즈 캔슬링 기능</li>
            <li>IPX7 방수</li>
            <li>최대 24시간 재생</li>
          </ul>
        `,
                specifications: {
                    '블루투스 버전': '5.0',
                    '재생 시간': '최대 24시간',
                    '충전 시간': '약 1.5시간',
                    '방수 등급': 'IPX7',
                    '무게': '약 4g (이어폰 1개)',
                    '색상': '블랙, 화이트',
                },
                minOrderQty: 10,
                shippingCost: 3000,
                url: `https://www.1866.co.kr/product/${externalId}`,
            };

            // 실제 구현 시 아래 주석 해제하고 셀렉터 수정
            /*
            const name = $('.product-detail-name').text().trim();
            const priceStr = $('.product-detail-price').text().trim();
            const price = this.parsePrice(priceStr);
            
            const images: string[] = [];
            $('.product-detail-images img').each((i, el) => {
              const src = $(el).attr('src');
              if (src) images.push(src);
            });
            
            const description = $('.product-detail-description').html() || '';
            
            const specifications: Record<string, string> = {};
            $('.product-spec-table tr').each((i, el) => {
              const key = $(el).find('th').text().trim();
              const value = $(el).find('td').text().trim();
              if (key && value) {
                specifications[key] = value;
              }
            });
            
            const minOrderQtyStr = $('.min-order-qty').text().trim();
            const minOrderQty = parseInt(minOrderQtyStr, 10) || 1;
            
            const shippingCostStr = $('.shipping-cost').text().trim();
            const shippingCost = this.parsePrice(shippingCostStr);
            
            product = {
              id: productId,
              site: '1866',
              externalId,
              name,
              price,
              category: 'general',
              images,
              description,
              specifications,
              minOrderQty,
              shippingCost,
              url: `${this.config.baseUrl}${detailUrl}`,
            };
            */

            console.log(`[1866] Product detail retrieved: ${product.name}`);
            return product;

        } catch (error: any) {
            console.error(`[1866] Product detail error:`, error.message);
            throw error;
        }
    }
}
