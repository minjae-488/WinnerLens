import { PrismaClient } from '@prisma/client';
import { getCoupangClient } from '../integrations/coupang/factory';
import { CoupangProduct } from '../integrations/coupang/types';

const prisma = new PrismaClient();

export class CoupangService {
    private coupangClient = getCoupangClient();

    /**
     * 상품을 쿠팡에 등록
     */
    async registerProductToCoupang(productId: string) {
        // 1. 상품 정보 조회
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new Error('상품을 찾을 수 없습니다');
        }

        // 2. 쿠팡 API로 등록
        const coupangProduct: CoupangProduct = {
            productName: product.productName,
            category: product.category,
            price: Number(product.price),
            cost: product.cost ? Number(product.cost) : undefined,
            description: product.description || undefined,
            stock: 999, // 기본 재고
        };

        const result = await this.coupangClient.registerProduct(coupangProduct);

        // 3. 등록 결과 저장
        if (result.success && result.coupangProductId) {
            await prisma.product.update({
                where: { id: productId },
                data: {
                    coupangProductId: result.coupangProductId,
                    status: 'REGISTERED',
                    registeredAt: new Date(),
                },
            });
        }

        return result;
    }

    /**
     * 쿠팡 상품 상태 조회
     */
    async getProductStatus(productId: string) {
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product || !product.coupangProductId) {
            throw new Error('쿠팡에 등록되지 않은 상품입니다');
        }

        const status = await this.coupangClient.getProductStatus(product.coupangProductId);

        // 상태 업데이트
        await prisma.product.update({
            where: { id: productId },
            data: {
                status: this.mapCoupangStatus(status.status),
            },
        });

        return status;
    }

    /**
     * 쿠팡 상품 정보 업데이트
     */
    async updateCoupangProduct(productId: string, updates: Partial<CoupangProduct>) {
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product || !product.coupangProductId) {
            throw new Error('쿠팡에 등록되지 않은 상품입니다');
        }

        const result = await this.coupangClient.updateProduct(product.coupangProductId, updates);

        return result;
    }

    /**
     * 쿠팡 상품 삭제 (판매 중지)
     */
    async deleteCoupangProduct(productId: string) {
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product || !product.coupangProductId) {
            throw new Error('쿠팡에 등록되지 않은 상품입니다');
        }

        const result = await this.coupangClient.deleteProduct(product.coupangProductId);

        if (result.success) {
            await prisma.product.update({
                where: { id: productId },
                data: {
                    status: 'DRAFT',
                    coupangProductId: null,
                },
            });
        }

        return result;
    }

    /**
     * 쿠팡 상태를 내부 상태로 매핑
     */
    private mapCoupangStatus(coupangStatus: string): string {
        const statusMap: Record<string, string> = {
            'pending': 'REGISTERED',
            'approved': 'REGISTERED',
            'selling': 'REGISTERED',
            'rejected': 'DRAFT',
            'soldout': 'REGISTERED',
        };

        return statusMap[coupangStatus] || 'DRAFT';
    }

    /**
     * 등록 가능한 상품 목록 조회
     */
    async getRegisterableProducts() {
        return await prisma.product.findMany({
            where: {
                status: 'DRAFT',
                coupangProductId: null,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    /**
     * 등록된 상품 목록 조회
     */
    async getRegisteredProducts() {
        return await prisma.product.findMany({
            where: {
                status: 'REGISTERED',
                coupangProductId: { not: null },
            },
            orderBy: {
                registeredAt: 'desc',
            },
        });
    }
}
