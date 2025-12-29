import { PricingInput, PricingOutput } from '../../types/sourcing.types';

/**
 * 가격 최적화 서비스
 * 
 * 도매가를 기반으로 쿠팡 최적 판매가를 계산합니다.
 * - 원가 계산
 * - 손익분기점 계산
 * - 3가지 가격 전략 추천 (공격적/균형/프리미엄)
 * - 마진율 계산
 */
export class PricingService {
    /**
     * 카테고리별 쿠팡 수수료율
     * 실제로는 데이터베이스에서 관리하는 것이 좋음
     */
    private readonly COUPANG_FEE_RATES: Record<string, number> = {
        'electronics': 0.12,      // 전자제품 12%
        'fashion': 0.15,          // 패션 15%
        'beauty': 0.13,           // 뷰티 13%
        'home': 0.11,             // 생활용품 11%
        'sports': 0.12,           // 스포츠 12%
        'food': 0.10,             // 식품 10%
        'books': 0.08,            // 도서 8%
        'default': 0.12,          // 기본 12%
    };

    /**
     * 최적 판매가 계산
     */
    async calculateOptimalPrice(input: PricingInput): Promise<PricingOutput> {
        // 1. 원가 계산
        const { costPerUnit, totalCost, breakdown } = this.calculateCost(input);

        // 2. 쿠팡 수수료율 조회
        const feeRate = this.getCoupangFeeRate(input.category);

        // 3. 손익분기점 계산
        const breakeven = this.calculateBreakeven(costPerUnit, feeRate);

        // 4. 목표 마진가 계산
        const targetPrice = this.calculateTargetPrice(costPerUnit, feeRate, input.targetMargin);

        // 5. 경쟁가 분석 (현재는 시뮬레이션, 실제로는 쿠팡 API 조회)
        const competitorPrices = await this.analyzeCompetition(input.keyword);
        const competitivePrice = this.calculateCompetitivePrice(competitorPrices);

        // 6. 3가지 전략 추천
        const recommendedPrices = {
            aggressive: this.roundPrice(competitivePrice),
            balanced: this.roundPrice((targetPrice + competitivePrice) / 2),
            premium: this.roundPrice(targetPrice),
        };

        // 7. 각 전략별 마진율 계산
        const margins = {
            aggressive: this.calculateMargin(recommendedPrices.aggressive, costPerUnit, feeRate),
            balanced: this.calculateMargin(recommendedPrices.balanced, costPerUnit, feeRate),
            premium: this.calculateMargin(recommendedPrices.premium, costPerUnit, feeRate),
        };

        // 8. 경쟁력 지수 계산
        const competitiveIndex = this.calculateCompetitiveIndex(
            recommendedPrices.balanced,
            competitorPrices
        );

        return {
            costPerUnit,
            totalCost,
            recommendedPrices,
            margins,
            competitorPrices,
            competitiveIndex,
            breakdown: {
                ...breakdown,
                coupangFeeRate: feeRate,
            },
        };
    }

    /**
     * 원가 계산
     */
    private calculateCost(input: PricingInput): {
        costPerUnit: number;
        totalCost: number;
        breakdown: {
            wholesaleCost: number;
            shippingCost: number;
            extraCost: number;
        };
    } {
        const wholesaleCost = input.wholesalePrice * input.quantity;
        const shippingCost = input.shippingCost;
        const extraCost = input.extraCost || 0;

        const totalCost = wholesaleCost + shippingCost + extraCost;
        const costPerUnit = totalCost / input.quantity;

        return {
            costPerUnit,
            totalCost,
            breakdown: {
                wholesaleCost,
                shippingCost,
                extraCost,
            },
        };
    }

    /**
     * 카테고리별 쿠팡 수수료율 조회
     */
    getCoupangFeeRate(category: string): number {
        return this.COUPANG_FEE_RATES[category] || this.COUPANG_FEE_RATES['default'];
    }

    /**
     * 손익분기점 계산
     * 
     * 손익분기점 = 개당 원가 / (1 - 수수료율)
     * 
     * 예: 원가 10,000원, 수수료 12%
     * → 10,000 / (1 - 0.12) = 11,364원
     */
    private calculateBreakeven(costPerUnit: number, feeRate: number): number {
        return costPerUnit / (1 - feeRate);
    }

    /**
     * 목표 마진가 계산
     * 
     * 목표가 = 개당 원가 / (1 - 수수료율 - 목표 마진율)
     * 
     * 예: 원가 10,000원, 수수료 12%, 목표 마진 30%
     * → 10,000 / (1 - 0.12 - 0.30) = 17,241원
     */
    private calculateTargetPrice(
        costPerUnit: number,
        feeRate: number,
        targetMargin: number
    ): number {
        return costPerUnit / (1 - feeRate - targetMargin);
    }

    /**
     * 경쟁 상품 가격 분석
     * 
     * TODO: 실제로는 쿠팡 API를 통해 경쟁 상품 가격 조회
     * 현재는 시뮬레이션 데이터 반환
     */
    private async analyzeCompetition(keyword?: string): Promise<number[]> {
        // 시뮬레이션: 경쟁 상품 가격 리스트
        // 실제 구현 시 쿠팡 API 호출
        return [
            18500,
            19900,
            17900,
            21000,
            18900,
            20500,
            19500,
        ];
    }

    /**
     * 경쟁가 계산
     * 
     * 중앙값의 95%를 경쟁가로 설정 (5% 할인)
     */
    private calculateCompetitivePrice(competitorPrices: number[]): number {
        if (competitorPrices.length === 0) {
            throw new Error('경쟁 상품 가격 데이터가 없습니다.');
        }

        const median = this.calculateMedian(competitorPrices);
        return median * 0.95; // 경쟁가 대비 5% 할인
    }

    /**
     * 중앙값 계산
     */
    private calculateMedian(numbers: number[]): number {
        const sorted = [...numbers].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);

        if (sorted.length % 2 === 0) {
            return (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
            return sorted[mid];
        }
    }

    /**
     * 마진율 계산
     * 
     * 마진율 = (판매가 - 원가 - 수수료) / 판매가
     * 
     * 예: 판매가 20,000원, 원가 10,000원, 수수료 12%
     * → 수수료 = 20,000 × 0.12 = 2,400원
     * → 순이익 = 20,000 - 10,000 - 2,400 = 7,600원
     * → 마진율 = 7,600 / 20,000 = 0.38 (38%)
     */
    calculateMargin(sellingPrice: number, costPerUnit: number, feeRate: number): number {
        const fee = sellingPrice * feeRate;
        const profit = sellingPrice - costPerUnit - fee;
        const margin = profit / sellingPrice;

        return Math.max(0, margin); // 음수 방지
    }

    /**
     * 가격 반올림 (100원 단위)
     */
    private roundPrice(price: number): number {
        return Math.round(price / 100) * 100;
    }

    /**
     * 경쟁력 지수 계산 (0-100)
     * 
     * 우리 가격이 경쟁사 평균보다 낮을수록 높은 점수
     */
    private calculateCompetitiveIndex(ourPrice: number, competitorPrices: number[]): number {
        if (competitorPrices.length === 0) return 50;

        const avgCompetitorPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
        const priceDiff = avgCompetitorPrice - ourPrice;
        const diffPercentage = (priceDiff / avgCompetitorPrice) * 100;

        // -20% ~ +20% 범위를 0 ~ 100 점수로 변환
        // 경쟁사보다 20% 저렴하면 100점, 20% 비싸면 0점
        const index = 50 + (diffPercentage * 2.5);

        return Math.max(0, Math.min(100, index));
    }

    /**
     * 순이익 계산
     */
    calculateProfit(sellingPrice: number, costPerUnit: number, feeRate: number): number {
        const fee = sellingPrice * feeRate;
        return sellingPrice - costPerUnit - fee;
    }

    /**
     * 총 예상 이익 계산
     */
    calculateTotalProfit(
        sellingPrice: number,
        costPerUnit: number,
        feeRate: number,
        quantity: number
    ): number {
        const profitPerUnit = this.calculateProfit(sellingPrice, costPerUnit, feeRate);
        return profitPerUnit * quantity;
    }
}
