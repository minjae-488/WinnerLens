import { ICoupangClient, CoupangProduct, CoupangRegistrationResult, CoupangProductStatus } from './types';
import crypto from 'crypto';

/**
 * Real Coupang API Client
 * 실제 쿠팡 Wing API와 통신
 * 
 * 사용 전 필요한 환경 변수:
 * - COUPANG_API_KEY: 쿠팡 API Access Key
 * - COUPANG_API_SECRET: 쿠팡 API Secret Key
 * - COUPANG_VENDOR_ID: 쿠팡 판매자 ID
 */
export class RealCoupangClient implements ICoupangClient {
    private apiKey: string;
    private apiSecret: string;
    private vendorId: string;
    private baseUrl = 'https://api-gateway.coupang.com';

    constructor() {
        this.apiKey = process.env.COUPANG_API_KEY || '';
        this.apiSecret = process.env.COUPANG_API_SECRET || '';
        this.vendorId = process.env.COUPANG_VENDOR_ID || '';

        if (!this.apiKey || !this.apiSecret || !this.vendorId) {
            console.warn('⚠️ Coupang API credentials not found. Please set environment variables.');
        }
    }

    async registerProduct(product: CoupangProduct): Promise<CoupangRegistrationResult> {
        try {
            const endpoint = '/v2/providers/wing/products';
            const method = 'POST';

            const wingProduct = this.transformToWingFormat(product);

            const response = await this.request(method, endpoint, wingProduct);

            return {
                success: response.ok,
                productId: response.data?.productId,
                coupangProductId: response.data?.productId,
                status: response.data?.status || 'pending',
                message: response.data?.message || '상품이 등록되었습니다.',
                registeredAt: new Date(),
            };
        } catch (error: any) {
            return {
                success: false,
                status: 'failed',
                message: error.message || '상품 등록에 실패했습니다.',
                registeredAt: new Date(),
            };
        }
    }

    async getProductStatus(coupangProductId: string): Promise<CoupangProductStatus> {
        try {
            const endpoint = `/v2/providers/wing/products/${coupangProductId}`;
            const method = 'GET';

            const response = await this.request(method, endpoint);

            return {
                productId: coupangProductId,
                coupangProductId,
                status: response.data?.status || 'pending',
                message: response.data?.message || '상태 조회 완료',
                updatedAt: new Date(),
            };
        } catch (error: any) {
            throw new Error(`상품 상태 조회 실패: ${error.message}`);
        }
    }

    async updateProduct(
        coupangProductId: string,
        updates: Partial<CoupangProduct>
    ): Promise<CoupangRegistrationResult> {
        try {
            const endpoint = `/v2/providers/wing/products/${coupangProductId}`;
            const method = 'PUT';

            const wingUpdates = this.transformToWingFormat(updates);

            const response = await this.request(method, endpoint, wingUpdates);

            return {
                success: response.ok,
                productId: coupangProductId,
                coupangProductId,
                status: response.data?.status || 'approved',
                message: response.data?.message || '상품이 업데이트되었습니다.',
                registeredAt: new Date(),
            };
        } catch (error: any) {
            return {
                success: false,
                status: 'failed',
                message: error.message || '상품 업데이트에 실패했습니다.',
                registeredAt: new Date(),
            };
        }
    }

    async deleteProduct(coupangProductId: string): Promise<{ success: boolean; message: string }> {
        try {
            const endpoint = `/v2/providers/wing/products/${coupangProductId}`;
            const method = 'DELETE';

            const response = await this.request(method, endpoint);

            return {
                success: response.ok,
                message: response.data?.message || '상품이 삭제되었습니다.',
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || '상품 삭제에 실패했습니다.',
            };
        }
    }

    /**
     * 쿠팡 API 요청 실행
     */
    private async request(method: string, endpoint: string, body?: any): Promise<any> {
        const url = `${this.baseUrl}${endpoint}`;
        const timestamp = Date.now().toString();

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': this.generateAuthHeader(method, endpoint, timestamp),
            'X-COUPANG-TIMESTAMP': timestamp,
        };

        const options: RequestInit = {
            method,
            headers,
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const data = await response.json();

        return {
            ok: response.ok,
            status: response.status,
            data,
        };
    }

    /**
     * HMAC-SHA256 인증 헤더 생성
     */
    private generateAuthHeader(method: string, endpoint: string, timestamp: string): string {
        const message = `${method}${endpoint}${timestamp}`;
        const hmac = crypto.createHmac('sha256', this.apiSecret);
        hmac.update(message);
        const signature = hmac.digest('hex');

        return `HMAC-SHA256 ${this.apiKey}:${signature}`;
    }

    /**
     * WinnerLens 상품 형식을 쿠팡 Wing API 형식으로 변환
     */
    private transformToWingFormat(product: Partial<CoupangProduct>): any {
        return {
            vendorId: this.vendorId,
            displayCategoryCode: this.getCategoryCode(product.category),
            sellerProductName: product.productName,
            salePrice: product.price,
            originalPrice: product.price,
            maximumBuyCount: product.stock || 999,
            outboundShippingTimeDay: 3,
            maximumBuyForPerson: 10,
            maximumBuyForPersonPeriod: 1,
            unitCount: 1,
            adultOnly: false,
            taxType: 'TAX',
            parallelImported: false,
            overseasPurchased: false,
            pccNeeded: false,
            externalVendorSku: `WINNER-${Date.now()}`,
            modelNo: '',
            brand: '',
            manufacturerCode: '',
            emptyBarcode: true,
            emptyBarcodeReason: 'SELF_PRODUCTION',
            modelName: product.productName,
            certifications: [],
            searchTags: [],
            images: product.images || [],
            notices: [],
            returnCenterCode: 'DEFAULT',
            afterServiceInformation: '고객센터: 1234-5678',
            afterServiceGuideContent: '제품 하자 시 7일 이내 반품 가능',
        };
    }

    /**
     * 카테고리명을 쿠팡 카테고리 코드로 변환
     */
    private getCategoryCode(category?: string): string {
        const categoryMap: Record<string, string> = {
            '전자기기': '1001',
            '패션': '2001',
            '뷰티': '3001',
            '식품': '4001',
            '생활용품': '5001',
            '기타': '9999',
        };

        return categoryMap[category || '기타'] || '9999';
    }
}
