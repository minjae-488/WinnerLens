// 도매 소싱 관련 타입 정의

export interface WholesaleProduct {
  id: string;
  site: '1866' | 'domeggook';
  externalId: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  description?: string;
  specifications?: Record<string, any>;
  minOrderQty: number;
  shippingCost: number;
  url: string;
}

export interface SearchOptions {
  priceRange?: [number, number];
  minMargin?: number;
  category?: string;
  sortBy?: 'price' | 'popularity' | 'newest';
  limit?: number;
}

export interface PricingInput {
  wholesalePrice: number;
  quantity: number;
  shippingCost: number;
  extraCost?: number;
  targetMargin: number; // 0-1 (예: 0.3 = 30%)
  category: string;
  keyword?: string;
}

export interface PricingOutput {
  costPerUnit: number;
  totalCost: number;
  recommendedPrices: {
    aggressive: number;
    balanced: number;
    premium: number;
  };
  margins: {
    aggressive: number;
    balanced: number;
    premium: number;
  };
  competitorPrices?: number[];
  competitiveIndex?: number;
  breakdown: {
    wholesaleCost: number;
    shippingCost: number;
    extraCost: number;
    coupangFeeRate: number;
  };
}

export interface CoupangListing {
  productName: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  noticeInfo?: Record<string, string>;
  images: string[];
}

export interface SourcingListing {
  id: string;
  userId: string;
  wholesaleProductId: string;
  
  // 원가 정보
  wholesalePrice: number;
  quantity: number;
  shippingCost: number;
  extraCost: number;
  totalCost: number;
  costPerUnit: number;
  
  // 판매 정보
  sellingPrice: number;
  targetMargin: number;
  actualMargin: number;
  pricingStrategy: 'aggressive' | 'balanced' | 'premium' | 'custom';
  
  // AI 생성 콘텐츠
  generatedName: string;
  generatedDescription: string;
  generatedFeatures: string[];
  generatedSpecs: Record<string, string>;
  
  // 메타데이터
  isEdited: boolean;
  status: 'draft' | 'pending' | 'registered' | 'failed';
  productId?: string;
  
  createdAt: Date;
  updatedAt: Date;
}
