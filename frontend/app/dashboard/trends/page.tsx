'use client';

import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { TrendData } from '@/lib/types';

// Chart.js 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
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
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: false,
                text: '월별 검색량 및 경쟁 강도',
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
            yAxisID: index === 0 ? 'y' : 'y1', // 첫 번째 데이터셋은 왼쪽 축, 두 번째는 오른쪽 축
            tension: 0.3, // 곡선
        })),
    } : { labels: [], datasets: [] };

    return (
        <div className="space-y-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900">
                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">총 연간 검색량</h3>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                                {trendData.summary.totalSearchVolume.toLocaleString()}
                            </p>
                            <p className="text-xs text-blue-500 mt-1">지난 12개월 기준</p>
                        </Card>
                        <Card className="bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">평균 경쟁 강도</h3>
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                                {trendData.summary.averageCompetition}/100
                            </p>
                            <p className="text-xs text-red-500 mt-1">낮을수록 진입 용이</p>
                        </Card>
                        <Card className="bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900">
                            <h3 className="text-sm font-medium text-green-800 dark:text-green-300">지금 뜨는 키워드</h3>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2 truncate">
                                {trendData.summary.topKeyword}
                            </p>
                            <p className="text-xs text-green-500 mt-1">가장 높은 성장률 기록</p>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Chart */}
                        <div className="lg:col-span-2">
                            <Card header={<h2 className="text-lg font-semibold">검색량 및 경쟁 강도 추이</h2>}>
                                <div className="h-[400px]">
                                    <Line options={options} data={chartDataFormatted} />
                                </div>
                            </Card>
                        </div>

                        {/* Rising Keywords */}
                        <div className="lg:col-span-1">
                            <Card header={<h2 className="text-lg font-semibold">🔥 급상승 키워드 TOP 5</h2>}>
                                <div className="space-y-4">
                                    {trendData.risingKeywords.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150">
                                            <div className="flex items-center gap-3">
                                                <span className={`
                                                    flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                                                    ${index === 0 ? 'bg-yellow-400 text-yellow-900' :
                                                        index === 1 ? 'bg-gray-300 text-gray-800' :
                                                            index === 2 ? 'bg-orange-300 text-orange-900' :
                                                                'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
                                                `}>
                                                    {index + 1}
                                                </span>
                                                <span className="font-medium text-gray-900 dark:text-white">{item.keyword}</span>
                                            </div>
                                            <div className="flex items-center text-red-500 font-semibold text-sm">
                                                <span>+{item.growth}%</span>
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Insight Tip */}
                            <div className="mt-6 p-4 border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                                    💡 WinnerLens 인사이트
                                </h4>
                                <p className="text-sm text-indigo-800 dark:text-indigo-200 mt-2">
                                    '{category}' 카테고리는 최근 검색량이 상승 추세입니다.
                                    특히 **{trendData.summary.topKeyword}** 관련 상품을 소싱하면
                                    초기 진입에 유리할 것으로 예측됩니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    데이터를 불러올 수 없습니다.
                </div>
            )}
        </div>
    );
}
