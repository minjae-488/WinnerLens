import { Request, Response } from 'express';
import { ApiResponseUtil } from '../utils/response';

export class SalesController {
    // 매출 분석 데이터 가져오기 (Mock: 쿠팡 데이터 시뮬레이션)
    async getSalesData(req: Request, res: Response): Promise<any> {
        // 날짜 범위 (최근 30일)
        const labels = Array.from({ length: 30 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            return `${d.getMonth() + 1}/${d.getDate()}`;
        });

        // 일별 매출 데이터 생성 (랜덤하지만 현실적인 패턴)
        // 주말에는 매출이 조금 떨어지고, 평일에 오르는 패턴 + 랜덤 노이즈
        const dailySales = labels.map((label, i) => {
            const dayOfWeek = new Date().getDay() - (29 - i) % 7;
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 || dayOfWeek === -1 || dayOfWeek === -7;

            // 기본 매출: 30만원 ~ 80만원
            let baseRevenue = 300000 + Math.random() * 500000;
            if (isWeekend) baseRevenue *= 0.8; // 주말 20% 감소

            // 가끔 대박 터지는 날 (5% 확률)
            if (Math.random() > 0.95) baseRevenue *= 2.5;

            const revenue = Math.floor(baseRevenue);
            // 쿠팡 수수료 약 11% + 배송비 등 고려하여 순이익율 25~35% 설정
            const marginRate = 0.25 + Math.random() * 0.1;
            const profit = Math.floor(revenue * marginRate);

            return {
                date: label,
                revenue,
                profit,
                orderCount: Math.floor(revenue / 35000) // 평균 객단가 3.5만원 가정
            };
        });

        // 요약 데이터 계산
        const totalRevenue = dailySales.reduce((sum, day) => sum + day.revenue, 0);
        const totalProfit = dailySales.reduce((sum, day) => sum + day.profit, 0);
        const totalOrders = dailySales.reduce((sum, day) => sum + day.orderCount, 0);
        const profitMargin = (totalProfit / totalRevenue) * 100;

        // 상품별 성과 (Mock)
        const products = [
            { id: 1, name: '초경량 무선 이어폰 Pro', price: 49000, cost: 25000, sold: 124, fees: 5390 },
            { id: 2, name: '오버핏 기모 후드티 (Black)', price: 35000, cost: 18000, sold: 98, fees: 3850 },
            { id: 3, name: '대용량 캡슐 세제 100입', price: 28900, cost: 15000, sold: 85, fees: 3179 },
            { id: 4, name: '차량용 고속 충전기', price: 15900, cost: 6000, sold: 210, fees: 1749 },
            { id: 5, name: '규조토 발매트', price: 12900, cost: 5000, sold: 156, fees: 1419 },
        ].map(p => ({
            ...p,
            totalRevenue: p.price * p.sold,
            totalProfit: (p.price - p.cost - p.fees) * p.sold,
            margin: ((p.price - p.cost - p.fees) / p.price * 100).toFixed(1)
        })).sort((a, b) => b.totalRevenue - a.totalRevenue); // 매출순 정렬

        const data = {
            summary: {
                totalRevenue,
                totalProfit,
                totalOrders,
                profitMargin: profitMargin.toFixed(1),
                platform: 'Coupang', // 연동된 플랫폼 표시
                lastUpdated: new Date().toISOString()
            },
            chartData: {
                labels,
                revenue: dailySales.map(d => d.revenue),
                profit: dailySales.map(d => d.profit),
                orders: dailySales.map(d => d.orderCount)
            },
            topProducts: products
        };

        return ApiResponseUtil.success(res, data);
    }
}

export const salesController = new SalesController();
