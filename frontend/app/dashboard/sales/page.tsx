'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { AnimatedCard } from '@/components/AnimatedCard';
import { Loading } from '@/components/ui/Loading';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { TrendingUp, DollarSign, ShoppingBag, CreditCard, RefreshCcw, Calendar, Package } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function SalesPage() {
    const [loading, setLoading] = useState(true);
    const [salesData, setSalesData] = useState<any>(null);

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            setLoading(true);
            const data = await api.getSalesData();
            setSalesData(data);
        } catch (error: any) {
            showToast.error(error.message || '매출 데이터를 불러오는데 실패했습니다');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loading size="lg" />
            </div>
        );
    }

    if (!salesData) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400">데이터를 불러올 수 없습니다</p>
            </div>
        );
    }

    const { summary, chartData, topProducts } = salesData;

    const chartConfig = {
        labels: chartData.labels,
        datasets: [
            {
                type: 'line' as const,
                label: '순수익',
                data: chartData.profit,
                borderColor: '#10b981', // Emerald 500
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                yAxisID: 'y',
            },
            {
                type: 'bar' as const,
                label: '매출액',
                data: chartData.revenue,
                backgroundColor: 'rgba(59, 130, 246, 0.5)', // Blue 500
                borderColor: '#3b82f6',
                borderWidth: 1,
                yAxisID: 'y',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    callback: function (value: any) {
                        return value >= 1000000 ? `${value / 1000000}M` : value >= 1000 ? `${value / 1000}K` : value;
                    }
                }
            },
        },
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                        <DollarSign className="w-8 h-8 text-blue-600" />
                        매출 분석
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {summary.platform} 판매 데이터 및 수익성 분석 (최근 30일)
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span>최근 업데이트: {new Date(summary.lastUpdated).toLocaleString()}</span>
                    <button
                        onClick={fetchSalesData}
                        className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        title="새로고침"
                    >
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatedCard delay={0} className="metric-card bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">총 매출</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {summary.totalRevenue.toLocaleString()}원
                        </p>
                        <p className="text-xs text-gray-500">지난 30일 합계</p>
                    </div>
                </AnimatedCard>

                <AnimatedCard delay={0.1} className="metric-card bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 border-green-100 dark:border-green-900/30">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-green-100 dark:bg-green-900/40 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">순수익</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {summary.totalProfit.toLocaleString()}원
                        </p>
                        <p className="text-xs text-gray-500">마켓 수수료 차감 후</p>
                    </div>
                </AnimatedCard>

                <AnimatedCard delay={0.2} className="metric-card">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                            <ShoppingBag className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">총 주문수</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {summary.totalOrders.toLocaleString()}건
                        </p>
                        <p className="text-xs text-gray-500">일 평균 {Math.round(summary.totalOrders / 30)}건</p>
                    </div>
                </AnimatedCard>

                <AnimatedCard delay={0.3} className="metric-card">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">마진율</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {summary.profitMargin}%
                        </p>
                        <p className="text-xs text-gray-500">매출 대비 순수익 비율</p>
                    </div>
                </AnimatedCard>
            </div>

            {/* Main Chart */}
            <AnimatedCard delay={0.4} className="card p-6 h-[400px]">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">매출 및 수익 추이</h2>
                <div className="h-[320px] w-full">
                    <Line data={chartConfig as any} options={chartOptions} />
                </div>
            </AnimatedCard>

            {/* Product Performance Table */}
            <AnimatedCard delay={0.5} className="card overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">상품별 성과 분석</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">순위</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">판매가</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">판매량</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">총 매출</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">순수익</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">마진율</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {topProducts.map((product: any, index: number) => (
                                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        #{index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 mr-3">
                                                <Package className="w-4 h-4" />
                                            </div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                        {product.price.toLocaleString()}원
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white font-medium">
                                        {product.sold.toLocaleString()}개
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white font-bold">
                                        {product.totalRevenue.toLocaleString()}원
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400 font-bold">
                                        {product.totalProfit.toLocaleString()}원
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${parseFloat(product.margin) >= 30
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : parseFloat(product.margin) >= 20
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            {product.margin}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AnimatedCard>
        </div>
    );
}
