/**
 * 쿠팡 API 연동을 위한 타입 정의
 */

export interface CoupangProduct {
    productName: string;
    category: string;
    price: number;
    cost?: number;
    description?: string;
    images?: string[];
    stock?: number;
}

export interface CoupangRegistrationResult {
    success: boolean;
    productId?: string;
    coupangProductId?: string;
    status: 'pending' | 'approved' | 'rejected' | 'failed';
    message: string;
    registeredAt: Date;
}

export interface CoupangProductStatus {
    productId: string;
    coupangProductId: string;
    status: 'pending' | 'approved' | 'rejected' | 'selling' | 'soldout';
    message: string;
    updatedAt: Date;
}

export interface ICoupangClient {
    /**
     * 쿠팡에 상품 등록
     */
    registerProduct(product: CoupangProduct): Promise<CoupangRegistrationResult>;

    /**
     * 등록된 상품의 상태 조회
     */
    getProductStatus(coupangProductId: string): Promise<CoupangProductStatus>;

    /**
     * 상품 정보 업데이트
     */
    updateProduct(coupangProductId: string, updates: Partial<CoupangProduct>): Promise<CoupangRegistrationResult>;

    /**
     * 상품 삭제 (판매 중지)
     */
    deleteProduct(coupangProductId: string): Promise<{ success: boolean; message: string }>;
}
