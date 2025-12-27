import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service';
import { ApiResponseUtil } from '../utils/response';
import { AppError } from '../middleware/errorHandler';

export const generateProductName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category, keywords } = req.body;

        if (!category || !keywords) {
            throw new AppError('카테고리와 키워드는 필수입니다', 400);
        }

        if (!Array.isArray(keywords) || keywords.length === 0) {
            throw new AppError('키워드는 비어있지 않은 배열이어야 합니다', 400);
        }

        const names = await aiService.generateProductName(category, keywords);
        return ApiResponseUtil.success(res, { names });
    } catch (error) {
        next(error);
    }
};

export const generateProductDescription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productName, category, features } = req.body;

        if (!productName || !category || !features) {
            throw new AppError('상품명, 카테고리, 특징은 필수입니다', 400);
        }

        if (!Array.isArray(features)) {
            throw new AppError('특징은 배열이어야 합니다', 400);
        }

        const description = await aiService.generateProductDescription(productName, category, features);
        return ApiResponseUtil.success(res, { description });
    } catch (error) {
        next(error);
    }
};
