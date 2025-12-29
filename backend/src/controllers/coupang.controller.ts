import { Request, Response } from 'express';
import { CoupangService } from '../services/coupang.service';

const coupangService = new CoupangService();

export class CoupangController {
    /**
     * 상품을 쿠팡에 등록
     * POST /api/v1/coupang/register/:id
     */
    static async registerProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await coupangService.registerProductToCoupang(id);

            res.json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: {
                    message: error.message || '상품 등록에 실패했습니다',
                },
            });
        }
    }

    /**
     * 쿠팡 상품 상태 조회
     * GET /api/v1/coupang/status/:id
     */
    static async getProductStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const status = await coupangService.getProductStatus(id);

            res.json({
                success: true,
                data: status,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: {
                    message: error.message || '상태 조회에 실패했습니다',
                },
            });
        }
    }

    /**
     * 쿠팡 상품 정보 업데이트
     * PUT /api/v1/coupang/update/:id
     */
    static async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const result = await coupangService.updateCoupangProduct(id, updates);

            res.json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: {
                    message: error.message || '상품 업데이트에 실패했습니다',
                },
            });
        }
    }

    /**
     * 쿠팡 상품 삭제 (판매 중지)
     * DELETE /api/v1/coupang/delete/:id
     */
    static async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await coupangService.deleteCoupangProduct(id);

            res.json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: {
                    message: error.message || '상품 삭제에 실패했습니다',
                },
            });
        }
    }

    /**
     * 등록 가능한 상품 목록 조회
     * GET /api/v1/coupang/registerable
     */
    static async getRegisterableProducts(req: Request, res: Response) {
        try {
            const products = await coupangService.getRegisterableProducts();

            res.json({
                success: true,
                data: products,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: {
                    message: error.message || '목록 조회에 실패했습니다',
                },
            });
        }
    }

    /**
     * 등록된 상품 목록 조회
     * GET /api/v1/coupang/registered
     */
    static async getRegisteredProducts(req: Request, res: Response) {
        try {
            const products = await coupangService.getRegisteredProducts();

            res.json({
                success: true,
                data: products,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: {
                    message: error.message || '목록 조회에 실패했습니다',
                },
            });
        }
    }
}
