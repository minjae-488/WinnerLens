'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface PricingCalculatorProps {
    wholesalePrice?: number;
    onPriceSelect?: (price: number, strategy: string) => void;
}

export default function PricingCalculator({
    wholesalePrice: initialPrice = 0,
    onPriceSelect
}: PricingCalculatorProps) {
    const [wholesalePrice, setWholesalePrice] = useState(initialPrice);
    const [quantity, setQuantity] = useState(10);
    const [shippingCost, setShippingCost] = useState(3000);
    const [extraCost, setExtraCost] = useState(0);
    const [targetMargin, setTargetMargin] = useState(30);
    const [category, setCategory] = useState('electronics');

    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

    const handleCalculate = async () => {
        if (wholesalePrice <= 0 || quantity <= 0) {
            alert('도매가와 수량을 입력해주세요');
            return;
        }

        setLoading(true);
        try {
            const data = await api.calculatePrice({
                wholesalePrice,
                quantity,
                shippingCost,
                extraCost,
                targetMargin: targetMargin / 100,
                category,
            });

            setResult(data);
            setSelectedStrategy('balanced'); // 기본값: 균형 전략
        } catch (error: any) {
            alert(error.message || '가격 계산 중 오류가 발생했습니다');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectStrategy = (strategy: string, price: number) => {
        setSelectedStrategy(strategy);
        if (onPriceSelect) {
            onPriceSelect(price, strategy);
        }
    };

    const calculateProfit = (sellingPrice: number) => {
        if (!result) return 0;
        const fee = sellingPrice * result.breakdown.coupangFeeRate;
        return sellingPrice - result.costPerUnit - fee;
    };

    const formatNumber = (num: number) => {
        return Math.round(num).toLocaleString();
    };

    const formatPercent = (num: number) => {
        return (num * 100).toFixed(1);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">💰 가격 계산기</h2>

            {/* 입력 섹션 */}
            <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            도매가 (원)
                        </label>
                        <input
                            type="number"
                            value={wholesalePrice || ''}
                            onChange={(e) => setWholesalePrice(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="8900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            수량 (개)
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="10"
                            min="1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            배송비 (원)
                        </label>
                        <input
                            type="number"
                            value={shippingCost}
                            onChange={(e) => setShippingCost(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="3000"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            기타 비용 (원)
                        </label>
                        <input
                            type="number"
                            value={extraCost}
                            onChange={(e) => setExtraCost(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            목표 마진율 (%)
                        </label>
                        <input
                            type="number"
                            value={targetMargin}
                            onChange={(e) => setTargetMargin(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="30"
                            min="0"
                            max="90"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            카테고리
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="electronics">전자제품 (12%)</option>
                            <option value="fashion">패션 (15%)</option>
                            <option value="beauty">뷰티 (13%)</option>
                            <option value="home">생활용품 (11%)</option>
                            <option value="sports">스포츠 (12%)</option>
                            <option value="food">식품 (10%)</option>
                            <option value="books">도서 (8%)</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
                >
                    {loading ? '계산 중...' : '가격 계산하기'}
                </button>
            </div>

            {/* 결과 섹션 */}
            {result && (
                <div className="space-y-6">
                    {/* 원가 분석 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">📊 원가 분석</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-600">총 원가:</span>
                                <span className="ml-2 font-semibold">{formatNumber(result.totalCost)}원</span>
                            </div>
                            <div>
                                <span className="text-gray-600">개당 원가:</span>
                                <span className="ml-2 font-semibold text-blue-600">{formatNumber(result.costPerUnit)}원</span>
                            </div>
                            <div>
                                <span className="text-gray-600">쿠팡 수수료:</span>
                                <span className="ml-2 font-semibold">{formatPercent(result.breakdown.coupangFeeRate)}%</span>
                            </div>
                            <div>
                                <span className="text-gray-600">손익분기점:</span>
                                <span className="ml-2 font-semibold">{formatNumber(result.costPerUnit / (1 - result.breakdown.coupangFeeRate))}원</span>
                            </div>
                        </div>
                    </div>

                    {/* 추천 판매가 */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">💵 추천 판매가</h3>
                        <div className="space-y-3">
                            {/* 공격적 전략 */}
                            <div
                                onClick={() => handleSelectStrategy('aggressive', result.recommendedPrices.aggressive)}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedStrategy === 'aggressive'
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-200 hover:border-red-300'
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <span className="font-semibold text-red-600">공격적 전략</span>
                                        <span className="ml-2 text-sm text-gray-600">(점유율 우선)</span>
                                    </div>
                                    {selectedStrategy === 'aggressive' && (
                                        <span className="text-red-600">✓</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold">{formatNumber(result.recommendedPrices.aggressive)}원</span>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">마진율</div>
                                        <div className="text-lg font-semibold text-red-600">
                                            {formatPercent(result.margins.aggressive)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    순이익: {formatNumber(calculateProfit(result.recommendedPrices.aggressive))}원/개
                                </div>
                            </div>

                            {/* 균형 전략 */}
                            <div
                                onClick={() => handleSelectStrategy('balanced', result.recommendedPrices.balanced)}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedStrategy === 'balanced'
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 hover:border-green-300'
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <span className="font-semibold text-green-600">균형 전략</span>
                                        <span className="ml-2 text-sm text-gray-600">(추천 ⭐)</span>
                                    </div>
                                    {selectedStrategy === 'balanced' && (
                                        <span className="text-green-600">✓</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold">{formatNumber(result.recommendedPrices.balanced)}원</span>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">마진율</div>
                                        <div className="text-lg font-semibold text-green-600">
                                            {formatPercent(result.margins.balanced)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    순이익: {formatNumber(calculateProfit(result.recommendedPrices.balanced))}원/개
                                </div>
                            </div>

                            {/* 프리미엄 전략 */}
                            <div
                                onClick={() => handleSelectStrategy('premium', result.recommendedPrices.premium)}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedStrategy === 'premium'
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-purple-300'
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <span className="font-semibold text-purple-600">프리미엄 전략</span>
                                        <span className="ml-2 text-sm text-gray-600">(마진 우선)</span>
                                    </div>
                                    {selectedStrategy === 'premium' && (
                                        <span className="text-purple-600">✓</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold">{formatNumber(result.recommendedPrices.premium)}원</span>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">마진율</div>
                                        <div className="text-lg font-semibold text-purple-600">
                                            {formatPercent(result.margins.premium)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    순이익: {formatNumber(calculateProfit(result.recommendedPrices.premium))}원/개
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 수익 예측 */}
                    {selectedStrategy && (
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-3">💰 예상 수익</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-gray-600">개당 순이익:</span>
                                    <span className="ml-2 font-semibold">
                                        {formatNumber(calculateProfit(result.recommendedPrices[selectedStrategy]))}원
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">총 예상 이익:</span>
                                    <span className="ml-2 font-semibold text-blue-600">
                                        {formatNumber(calculateProfit(result.recommendedPrices[selectedStrategy]) * quantity)}원
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">ROI:</span>
                                    <span className="ml-2 font-semibold">
                                        {((calculateProfit(result.recommendedPrices[selectedStrategy]) * quantity / result.totalCost) * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">판매 수량:</span>
                                    <span className="ml-2 font-semibold">{quantity}개</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
