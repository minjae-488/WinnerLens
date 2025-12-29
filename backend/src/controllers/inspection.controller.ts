import { Request, Response } from 'express';
import { InspectionService } from '../services/inspection.service';
import { ApiResponseUtil } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class InspectionController {
    /**
     * POST /api/v1/inspection/inspect
     * 상품 정보 검수
     */
    static inspect = asyncHandler(async (req: Request, res: Response) => {
        const result = InspectionService.inspect(req.body);
        return ApiResponseUtil.success(res, result);
    });
}
