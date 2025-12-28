'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { TrendData } from '@/lib/types';
import { showToast } from '@/lib/toast';
import { AnimatedCard } from '@/components/AnimatedCard';
import { Loading } from '@/components/ui/Loading';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { TrendingUp, TrendingDown, Activity, Target, Users, DollarSign } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function TrendsPage() {
    const [loading, setLoading] = useState(true);
    const [trendData, setTrendData] = useState<TrendData | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('전자기기');
    const [customKeyword, setCustomKeyword] = useState('');
    const [searchMode, setSearchMode] = useState<'category' | 'keyword'>('category');

    useEffect(() => {
        if (searchMode === 'category') {
            fetchTrendData();
        }
    }, [selectedCategory, searchMode]);

    const fetchTrendData = async () => {
        try {
            setLoading(true);
            const data = await api.getTrends(selectedCategory);
            setTrendData(data);
        } catch (error: any) {
            showToast.error(error.message || '트렌드 데이터를 불러오는데 실패했습니다');
        } finally {
            setLoading(false);
        }
    };

    const handleKeywordSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customKeyword.trim()) {
            showToast.error('키워드를 입력해주세요');
            return;
        }

        try {
            setLoading(true);
            setSearchMode('keyword');
            const data = await api.getTrends(customKeyword);
            setTrendData(data);
            showToast.success(`"${customKeyword}" 트렌드 분석 완료`);
        } catch (error: any) {
            showToast.error(error.message || '트렌드 데이터를 불러오는데 실패했습니다');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        setSearchMode('category');
        setCustomKeyword('');
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loading size="lg" />
            </div>
        );
    }

    if (!trendData) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400">데이터를 불러올 수 없습니다</p>
            </div>
        );
    }

    const chartData = {
        labels: trendData.chartData.labels,
        datasets: trendData.chartData.datasets.map((dataset, index) => ({
            ...dataset,
            yAxisID: index === 0 ? 'y' : 'y1', // 첫 번째 데이터셋은 y축(검색량), 두 번째는 y1축(경쟁 강도)
            borderWidth: 2,
            tension: 0.4,
            fill: index === 0,
            backgroundColor: index === 0
                ? 'rgba(59, 130, 246, 0.05)'
                : 'rgba(239, 68, 68, 0.05)',
            borderColor: index === 0 ? '#3b82f6' : '#ef4444',
            pointBackgroundColor: index === 0 ? '#3b82f6' : '#ef4444',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
        })),
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                        weight: 'bold' as const,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                borderRadius: 8,
                titleFont: {
                    size: 13,
                    weight: 'bold' as const,
                },
                bodyFont: {
                    size: 12,
                },
            },
        },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.03)',
                    drawBorder: false,
                },
                ticks: {
                    font: { size: 11 },
                    color: '#9ca3af',
                    callback: function (value: any) {
                        return value >= 1000 ? value.toLocaleString() : value;
                    }
                },
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                beginAtZero: true,
                min: 0,
                max: 100,
                grid: {
                    drawOnChartArea: false, // 오른쪽 축 그리드 삭제
                },
                ticks: {
                    font: { size: 11 },
                    color: '#ef4444', // 경쟁 강도 색상과 일치
                    callback: function (value: any) {
                        return `${value}`;
                    }
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: { size: 11 },
                    color: '#9ca3af',
                },
            },
        },
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    트렌드 분석
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                    시장 트렌드와 키워드 분석
                </p>
            </div>

            {/* Category Selector */}
            <div className="flex gap-3">
                {['전자기기', '패션', '뷰티', '식품', '생활용품'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${searchMode === 'category' && selectedCategory === cat
                            ? 'bg-blue-600 text-white shadow-soft'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleKeywordSearch} className="flex gap-3">
                <input
                    type="text"
                    value={customKeyword}
                    onChange={(e) => setCustomKeyword(e.target.value)}
                    placeholder="직접 키워드를 입력하세요 (예: 무선 이어폰, 겨울 패딩)"
                    className="input flex-1"
                />
                <button type="submit" className="btn btn-primary whitespace-nowrap">
                    트렌드 분석
                </button>
            </form>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedCard delay={0} className="metric-card">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs font-medium text-blue-500">검색량</span>
                    </div>
                    <div className="space-y-1">
                        <p className="stat-number text-blue-600 dark:text-blue-400">
                            {trendData.summary?.totalSearchVolume?.toLocaleString() || 0}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">총 검색량</p>
                    </div>
                </AnimatedCard>

                <AnimatedCard delay={0.1} className="metric-card">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="text-xs font-medium text-orange-500">경쟁</span>
                    </div>
                    <div className="space-y-1">
                        <p className="stat-number text-orange-600 dark:text-orange-400">
                            {trendData.summary?.averageCompetition || 0}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">평균 경쟁 강도</p>
                    </div>
                </AnimatedCard>

                <AnimatedCard delay={0.2} className="metric-card">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-xs font-medium text-green-500">인기</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {trendData.summary?.topKeyword || '-'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">TOP 키워드</p>
                    </div>
                </AnimatedCard>
            </div>

            {/* Main Chart */}
            <AnimatedCard delay={0.3} className="card p-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    검색량 추이
                </h2>
                <div className="h-80">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </AnimatedCard>

            {/* Rising Keywords */}
            {trendData.risingKeywords && trendData.risingKeywords.length > 0 && (
                <AnimatedCard delay={0.4} className="card p-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        급상승 키워드 TOP 5
                    </h2>
                    <div className="space-y-4">
                        {trendData.risingKeywords.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {item.keyword}
                                        </p>
                                        {item.searchVolume && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                검색량: {item.searchVolume.toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-red-500 font-semibold">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>+{item.growth}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedCard>
            )}

            {/* Market Insights & Competition Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Market Insights */}
                {trendData.marketInsights && (
                    <AnimatedCard delay={0.5} className="card p-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            시장 인사이트
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">성장률</p>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {trendData.marketInsights.growthRate}
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">수익성</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {trendData.marketInsights.profitability}
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">시장 규모</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {trendData.marketInsights.marketSize}
                                </p>
                            </div>
                        </div>
                    </AnimatedCard>
                )}

                {/* Competition Analysis */}
                {trendData.competitionAnalysis && (
                    <AnimatedCard delay={0.6} className="card p-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            경쟁 분석
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    <span className="text-gray-700 dark:text-gray-300">판매자 수</span>
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {trendData.competitionAnalysis.sellerCount.toLocaleString()}명
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-5 h-5 text-green-500" />
                                    <span className="text-gray-700 dark:text-gray-300">평균 가격</span>
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {trendData.competitionAnalysis.avgPrice.toLocaleString()}원
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <Target className="w-5 h-5 text-orange-500" />
                                    <span className="text-gray-700 dark:text-gray-300">진입 장벽</span>
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {trendData.competitionAnalysis.entryBarrier}
                                </span>
                            </div>
                        </div>
                    </AnimatedCard>
                )}
            </div>

            {/* AI Recommendations */}
            {trendData.recommendations && (
                <AnimatedCard delay={0.7} className="card p-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        AI 추천
                    </h2>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border border-blue-100 dark:border-blue-900/20">
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {trendData.recommendations.suggestion}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">진입 점수</p>
                                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                    {trendData.recommendations.entryScore}점
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">리스크</p>
                                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                                    {trendData.recommendations.riskLevel}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">최적 가격</p>
                                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                                    {trendData.recommendations.optimalPrice}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">예상 판매</p>
                                <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                                    {trendData.recommendations.expectedSales}
                                </p>
                            </div>
                        </div>
                    </div>
                </AnimatedCard>
            )}
        </div>
    );
}
