'use client';

import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { TrendData } from '@/lib/types';
import { TrendingUp, Users, DollarSign, Target, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { AnimatedCard } from '@/components/AnimatedCard';

// Chart.js 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function TrendsPage() {
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('전체');
    const [trendData, setTrendData] = useState<TrendData | null>(null);

    useEffect(() => {
        fetchTrends();
    }, [category]);

    const fetchTrends = async () => {
        try {
            setLoading(true);
            const data = await api.getTrends(category === '전체' ? undefined : category);
            setTrendData(data);
        } catch (error: any) {
            showToast.error(error.message || '트렌드 데이터를 불러오는데 실패했습니다');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['전체', '전자기기', '패션', '뷰티', '식품', '생활용품', '기타'];

    // 차트 옵션
    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: {
                    display: true,
                    text: '검색량'
                }
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false,
                },
                title: {
                    display: true,
                    text: '경쟁 강도 (0-100)'
                }
            },
        },
    };

    // 차트 데이터 구성
    const chartDataFormatted = trendData ? {
        labels: trendData.chartData.labels,
        datasets: trendData.chartData.datasets.map((ds, index) => ({
            ...ds,
            yAxisID: index === 0 ? 'y' : 'y1',
            tension: 0.3,
        })),
    } : { labels: [], datasets: [] };

    // 지역별 도넛 차트
    const regionalChartData = trendData?.keywordInsights ? {
        labels: Object.keys(trendData.keywordInsights.regionalPopularity),
        datasets: [{
            data: Object.values(trendData.keywordInsights.regionalPopularity),
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(251, 146, 60, 0.8)',
                'rgba(139, 92, 246, 0.8)',
                'rgba(236, 72, 153, 0.8)',
            ],
        }],
    } : { labels: [], datasets: [] };

    // 연령대별 바 차트
    const ageChartData = trendData?.keywordInsights ? {
        labels: Object.keys(trendData.keywordInsights.ageDistribution),
        datasets: [{
            label: '비율 (%)',
            data: Object.values(trendData.keywordInsights.ageDistribution),
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
        }],
    } : { labels: [], datasets: [] };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">트렌드 분석</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        카테고리별 키워드 검색량과 경쟁 강도를 분석하여 시장 기회를 발굴하세요.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="w-full md:w-48">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input bg-white dark:bg-gray-800"
                    >
                        {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loading size="lg" />
                </div>
            ) : trendData ? (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <AnimatedCard delay={0} className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                            <div className="flex items-start justify-between p-2">
                                <div>
                                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-3">총 연간 검색량</h3>
                                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                        {trendData.summary.totalSearchVolume.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-blue-500 mt-2">지난 12개월 기준</p>
                                </div>
                                <TrendingUp className="w-10 h-10 text-blue-400" />
                            </div>
                        </AnimatedCard>

                        <AnimatedCard delay={0.1} className="card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
                            <div className="flex items-start justify-between p-2">
                                <div>
                                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-3">평균 경쟁 강도</h3>
                                    <p className="text-4xl font-bold text-red-600 dark:text-red-400 mt-1">
                                        {trendData.summary.averageCompetition}/100
                                    </p>
                                    <p className="text-xs text-red-500 mt-2">낮을수록 진입 용이</p>
                                </div>
                                <Target className="w-10 h-10 text-red-400" />
                            </div>
                        </AnimatedCard>

                        <AnimatedCard delay={0.2} className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                            <div className="flex items-start justify-between p-2">
                                <div>
                                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-3">지금 뜨는 키워드</h3>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1 truncate">
                                        {trendData.summary.topKeyword}
                                    </p>
                                    <p className="text-xs text-green-500 mt-2">가장 높은 성장률 기록</p>
                                </div>
                                <Zap className="w-10 h-10 text-green-400" />
                            </div>
                        </AnimatedCard>
                    </div>

                    {/* Main Chart */}
                    <AnimatedCard delay={0.3} className="card">
                        <h2 className="text-xl font-semibold mb-4">📊 검색량 및 경쟁 강도 추이</h2>
                        <div className="h-[400px]">
                            <Line options={lineOptions} data={chartDataFormatted} />
                        </div>
                    </AnimatedCard>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Market Insights */}
                        {trendData.marketInsights && (
                            <AnimatedCard delay={0.4} className="card">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    💡 시장 인사이트
                                </h2>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">성장률</p>
                                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                                            {trendData.marketInsights.growthRate}
                                        </p>
                                    </div>
                                    <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">수익성</p>
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                            {trendData.marketInsights.profitability}
                                        </p>
                                    </div>
                                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">시장 규모</p>
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                            {trendData.marketInsights.marketSize}
                                        </p>
                                    </div>
                                    <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">트렌드</p>
                                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                                            {trendData.marketInsights.trend}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">계절성</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                                        {trendData.marketInsights.seasonality}
                                    </p>
                                </div>
                                <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">타겟 연령층</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                                        {trendData.marketInsights.targetAge}
                                    </p>
                                </div>
                            </AnimatedCard>
                        )}

                        {/* Competition Analysis */}
                        {trendData.competitionAnalysis && (
                            <AnimatedCard delay={0.5} className="card">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    🏪 경쟁 분석
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-blue-500" />
                                            <span className="text-gray-700 dark:text-gray-300">판매자 수</span>
                                        </div>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                            {trendData.competitionAnalysis.sellerCount.toLocaleString()}명
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="w-5 h-5 text-green-500" />
                                            <span className="text-gray-700 dark:text-gray-300">평균 가격</span>
                                        </div>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                            {trendData.competitionAnalysis.avgPrice.toLocaleString()}원
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-yellow-500" />
                                            <span className="text-gray-700 dark:text-gray-300">평균 평점</span>
                                        </div>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                            ⭐ {trendData.competitionAnalysis.avgRating}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-purple-500" />
                                            <span className="text-gray-700 dark:text-gray-300">재고 회전</span>
                                        </div>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                            {trendData.competitionAnalysis.stockTurnover}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">진입 장벽</p>
                                            <p className="text-lg font-bold text-orange-600 dark:text-orange-400 mt-1">
                                                {trendData.competitionAnalysis.entryBarrier}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">시장 포화도</p>
                                            <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-1">
                                                {trendData.competitionAnalysis.saturation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedCard>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Rising Keywords */}
                        <AnimatedCard delay={0.6} className="card lg:col-span-1">
                            <h2 className="text-xl font-semibold mb-4">🔥 급상승 키워드 TOP 5</h2>
                            <div className="space-y-3">
                                {trendData.risingKeywords.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <span className={`
                                                flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0
                                                ${index === 0 ? 'bg-yellow-400 text-yellow-900' :
                                                    index === 1 ? 'bg-gray-300 text-gray-800' :
                                                        index === 2 ? 'bg-orange-300 text-orange-900' :
                                                            'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
                                            `}>
                                                {index + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 dark:text-white truncate">{item.keyword}</p>
                                                {item.searchVolume && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        검색량: {item.searchVolume.toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center text-red-500 font-semibold text-sm flex-shrink-0 ml-2">
                                            <span>+{item.growth}%</span>
                                            <TrendingUp className="w-4 h-4 ml-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>

                        {/* Keyword Insights */}
                        {trendData.keywordInsights && (
                            <AnimatedCard delay={0.7} className="card lg:col-span-2">
                                <h2 className="text-xl font-semibold mb-6">🔍 키워드 인사이트</h2>

                                {/* Related Keywords */}
                                <div className="mb-8">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">연관 검색어</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {trendData.keywordInsights.relatedKeywords.map((kw, idx) => (
                                            <span key={idx} className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Search Intent */}
                                <div className="mb-8 p-5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">검색 의도</p>
                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                        {trendData.keywordInsights.searchIntent}
                                    </p>
                                </div>

                                {/* Charts */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">지역별 인기도</h3>
                                        <div className="h-48">
                                            <Doughnut data={regionalChartData} options={{ maintainAspectRatio: false }} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">연령대별 분포</h3>
                                        <div className="h-48">
                                            <Bar data={ageChartData} options={{ maintainAspectRatio: false }} />
                                        </div>
                                    </div>
                                </div>
                            </AnimatedCard>
                        )}
                    </div>

                    {/* AI Recommendations */}
                    {trendData.recommendations && (
                        <AnimatedCard delay={0.8} className="card bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-900 dark:text-indigo-300">
                                🎯 AI 추천
                            </h2>

                            {/* Entry Score */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">진입 점수</span>
                                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                        {trendData.recommendations.entryScore}/100
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${trendData.recommendations.entryScore}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">리스크 레벨</p>
                                    <p className={`text-lg font-bold mt-1 ${trendData.recommendations.riskLevel === '낮음' ? 'text-green-600 dark:text-green-400' :
                                        trendData.recommendations.riskLevel === '중간' ? 'text-yellow-600 dark:text-yellow-400' :
                                            'text-red-600 dark:text-red-400'
                                        }`}>
                                        {trendData.recommendations.riskLevel}
                                    </p>
                                </div>
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">최적 가격대</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                                        {trendData.recommendations.optimalPrice}
                                    </p>
                                </div>
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">예상 판매량</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                                        {trendData.recommendations.expectedSales}
                                    </p>
                                </div>
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">최적 타이밍</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                                        {trendData.recommendations.bestTiming}
                                    </p>
                                </div>
                            </div>

                            {/* Suggestion */}
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-indigo-200 dark:border-indigo-700">
                                <p className="text-lg font-bold text-indigo-900 dark:text-indigo-300">
                                    {trendData.recommendations.suggestion}
                                </p>
                            </div>
                        </AnimatedCard>
                    )}
                </>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    데이터를 불러올 수 없습니다.
                </div>
            )}
        </div>
    );
}
