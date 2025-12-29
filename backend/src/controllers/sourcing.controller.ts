import { Request, Response } from 'express';
import { CrawlerFactory } from '../services/crawling/crawler.factory';
import { PricingService } from '../services/pricing/pricing.service';
import { ApiResponseUtil } from '../utils/response';

export class SourcingController {
  private pricingService: PricingService;
  
  constructor() {
    this.pricingService = new PricingService();
  }
  
  async searchWholesale(req: Request, res: Response): Promise<Response> {
    try {
      const { keyword, site, options } = req.body;
      const crawler = CrawlerFactory.create(site);
      const products = await crawler.search(keyword, options);
      return ApiResponseUtil.success(res, products);
    } catch (error: any) {
      return ApiResponseUtil.error(res, error.message, 500);
    }
  }
  
  async getProductDetail(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { site } = req.query;
      const crawler = CrawlerFactory.create(site as any);
      const product = await crawler.getProductDetail(id);
      return ApiResponseUtil.success(res, product);
    } catch (error: any) {
      return ApiResponseUtil.error(res, error.message, 500);
    }
  }
  
  async calculatePrice(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.pricingService.calculateOptimalPrice(req.body);
      return ApiResponseUtil.success(res, result);
    } catch (error: any) {
      return ApiResponseUtil.error(res, error.message, 500);
    }
  }
  
  async generateListing(req: Request, res: Response): Promise<Response> {
    try {
      const { wholesaleProduct } = req.body;
      const listing = {
        productName: wholesaleProduct.name,
        description: wholesaleProduct.description || '',
        features: [],
        specifications: wholesaleProduct.specifications || {},
        images: wholesaleProduct.images,
      };
      return ApiResponseUtil.success(res, listing);
    } catch (error: any) {
      return ApiResponseUtil.error(res, error.message, 500);
    }
  }
  
  async registerToCoupang(req: Request, res: Response): Promise<Response> {
    try {
      const result = { success: true, productId: Date.now().toString() };
      return ApiResponseUtil.success(res, result);
    } catch (error: any) {
      return ApiResponseUtil.error(res, error.message, 500);
    }
  }
}

export const sourcingController = new SourcingController();
