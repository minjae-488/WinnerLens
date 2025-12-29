'use client';

import { useState } from 'react';
import PricingCalculator from '@/components/PricingCalculator';

export default function SourcingPage() {
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

    const handlePriceSelect = (price: number, strategy: string) => {
        setSelectedPrice(price);
        setSelectedStrategy(strategy);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* 헤더 */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🛒 도매 소싱 자동화
                    </h1>
                    <p className="text-gray-600">
                        키워드로 도매 상품을 검색하고, AI가 최적 판매가를 계산합니다
                    </p>
                </div>

                {/* 안내 카드 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">
                        💡 사용 방법
                    </h2>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>도매가와 수량을 입력하세요</li>
                        <li>배송비와 기타 비용을 입력하세요</li>
                        <li>목표 마진율을 설정하세요 (기본 30%)</li>
                        <li>"가격 계산하기" 버튼을 클릭하세요</li>
                        <li>3가지 가격 전략 중 하나를 선택하세요</li>
                    </ol>
                </div>

                {/* 가격 계산기 */}
                <div className="mb-6">
                    <PricingCalculator onPriceSelect={handlePriceSelect} />
                </div>

                {/* 선택된 가격 표시 */}
                {selectedPrice && selectedStrategy && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">✅ 선택된 판매가</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600 mb-1">
                                    {selectedStrategy === 'aggressive' && '공격적 전략 (점유율 우선)'}
                                    {selectedStrategy === 'balanced' && '균형 전략 (추천 ⭐)'}
                                    {selectedStrategy === 'premium' && '프리미엄 전략 (마진 우선)'}
                                </div>
                                <div className="text-3xl font-bold text-blue-600">
                                    {selectedPrice.toLocaleString()}원
                                </div>
                            </div>
                            <button
                                onClick={() => alert('쿠팡 등록 기능은 개발 중입니다')}
                                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium transition-colors"
                            >
                                쿠팡에 등록하기
                            </button>
                        </div>
                    </div>
                )}

                {/* 통계 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm text-gray-600 mb-1">평균 소요 시간</div>
                        <div className="text-2xl font-bold text-blue-600">10초</div>
                        <div className="text-xs text-gray-500 mt-1">기존 30분 대비 99% 단축</div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm text-gray-600 mb-1">평균 마진율</div>
                        <div className="text-2xl font-bold text-green-600">37%</div>
                        <div className="text-xs text-gray-500 mt-1">균형 전략 기준</div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm text-gray-600 mb-1">평균 ROI</div>
                        <div className="text-2xl font-bold text-purple-600">80%</div>
                        <div className="text-xs text-gray-500 mt-1">10개 판매 기준</div>
                    </div>
                </div>

                {/* 예시 섹션 */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">📝 실전 예시</h2>

                    <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="font-semibold text-gray-900 mb-2">무선 이어폰</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>• 도매가: 8,900원 × 10개</p>
                                <p>• 배송비: 3,000원</p>
                                <p>• 개당 원가: 9,200원</p>
                                <p>• <span className="text-green-600 font-semibold">추천 판매가: 19,900원 (마진 37%)</span></p>
                                <p>• 예상 수익: 74,120원</p>
                            </div>
                        </div>

                        <div className="border-l-4 border-green-500 pl-4">
                            <h3 className="font-semibold text-gray-900 mb-2">USB 케이블</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>• 도매가: 1,200원 × 50개</p>
                                <p>• 배송비: 5,000원</p>
                                <p>• 개당 원가: 1,300원</p>
                                <p>• <span className="text-green-600 font-semibold">추천 판매가: 2,900원 (마진 40%)</span></p>
                                <p>• 예상 수익: 80,000원</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
