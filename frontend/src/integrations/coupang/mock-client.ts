import { ICoupangClient, CoupangProduct, CoupangRegistrationResult, CoupangProductStatus } from './types';

/**
 * Mock Coupang API Client
 * 실제 쿠팡 API 없이 테스트 및 개발용으로 사용
 * 나중에 실제 API 키를 받으면 RealCoupangClient로 교체됨
 */
export class MockCoupangClient implements ICoupangClient {
    private mockDelay = 2000; // 실제 API 호출 시뮬레이션 (2초)

    async registerProduct(product: CoupangProduct): Promise<CoupangRegistrationResult> {
        console.log('🔧 [Mock] Registering product to Coupang:', product.productName);

        // API 호출 시뮬레이션
        await this.delay(this.mockDelay);

        // Mock 성공 응답
        const mockCoupangProductId = `COUPANG-${Date.now()}`;

        return {
            success: true,
            productId: mockCoupangProductId,
            coupangProductId: mockCoupangProductId,
            status: 'pending',
            message: '[Mock] 상품이 쿠팡에 등록되었습니다. 실제 API 연동 시 쿠팡 심사가 진행됩니다.',
            registeredAt: new Date(),
        };
    }

    async getProductStatus(coupangProductId: string): Promise<CoupangProductStatus> {
        console.log('🔧 [Mock] Getting product status:', coupangProductId);

        await this.delay(1000);

        // Mock 상태 응답 (랜덤으로 다양한 상태 반환)
        const statuses: Array<'pending' | 'approved' | 'selling'> = ['pending', 'approved', 'selling'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        return {
            productId: coupangProductId,
            coupangProductId,
            status: randomStatus,
            message: `[Mock] 현재 상태: ${randomStatus}`,
            updatedAt: new Date(),
        };
    }

    async updateProduct(
        coupangProductId: string,
        updates: Partial<CoupangProduct>
    ): Promise<CoupangRegistrationResult> {
        console.log('🔧 [Mock] Updating product:', coupangProductId, updates);

        await this.delay(1500);

        return {
            success: true,
            productId: coupangProductId,
            coupangProductId,
            status: 'approved',
            message: '[Mock] 상품 정보가 업데이트되었습니다.',
            registeredAt: new Date(),
        };
    }

    async deleteProduct(coupangProductId: string): Promise<{ success: boolean; message: string }> {
        console.log('🔧 [Mock] Deleting product:', coupangProductId);

        await this.delay(1000);

        return {
            success: true,
            message: '[Mock] 상품이 판매 중지되었습니다.',
        };
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
