import { ICoupangClient } from './types';
import { MockCoupangClient } from './mock-client';
import { RealCoupangClient } from './real-client';

/**
 * 쿠팡 API 클라이언트 팩토리
 * 
 * 환경 변수에 따라 자동으로 Mock 또는 Real 클라이언트를 반환
 * 
 * 개발 중: USE_MOCK_COUPANG_API=true → MockCoupangClient 사용
 * 프로덕션: USE_MOCK_COUPANG_API=false → RealCoupangClient 사용
 */
export function createCoupangClient(): ICoupangClient {
    const useMock = process.env.USE_MOCK_COUPANG_API === 'true';

    if (useMock) {
        console.log('🔧 Using Mock Coupang API (개발 모드)');
        console.log('💡 실제 API를 사용하려면 .env에서 USE_MOCK_COUPANG_API=false로 설정하세요');
        return new MockCoupangClient();
    } else {
        console.log('🚀 Using Real Coupang API (프로덕션 모드)');
        console.log('🔑 API 키 확인 중...');
        return new RealCoupangClient();
    }
}

/**
 * 싱글톤 인스턴스
 */
let coupangClientInstance: ICoupangClient | null = null;

export function getCoupangClient(): ICoupangClient {
    if (!coupangClientInstance) {
        coupangClientInstance = createCoupangClient();
    }
    return coupangClientInstance;
}
