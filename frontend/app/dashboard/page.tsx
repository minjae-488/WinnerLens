'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import { showToast } from '@/lib/toast';
import { AnimatedCard } from '@/components/AnimatedCard';
import { Loading } from '@/components/ui/Loading';
import { Package, CheckCircle, BarChart3, TrendingUp, Plus, ArrowRight, Sparkles } from 'lucide-react';

interface DashboardStats {
    totalProducts: number;
    totalRegistered: number;
    averageScore: number;
    totalCategories: number;
}

interface CategoryStat {
    category: string;
    count: number;
    avgScore: number;
}

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        totalRegistered: 0,
        averageScore: 0,
        totalCategories: 0,
    });
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);
    const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const products = await api.getProducts({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });
            setRecentProducts(products?.data || []);

            const allProducts = await api.getProducts({ limit: 1000 });
            const productsList = allProducts?.data || [];
            const totalProducts = productsList.length;
            const totalRegistered = productsList.filter((p: Product) => p.status === 'registered').length;
            const avgScore = totalProducts > 0
                ? productsList.reduce((sum: number, p: Product) => sum + (p.totalScore || 0), 0) / totalProducts
                : 0;

            const categoryMap = new Map<string, { count: number; totalScore: number }>();
            productsList.forEach((p: Product) => {
                const existing = categoryMap.get(p.category) || { count: 0, totalScore: 0 };
                categoryMap.set(p.category, {
                    count: existing.count + 1,
                    totalScore: existing.totalScore + (p.totalScore || 0),
                });
            });

            const categoryStatsData: CategoryStat[] = Array.from(categoryMap.entries()).map(([category, data]) => ({
                category,
                count: data.count,
                avgScore: data.count > 0 ? data.totalScore / data.count : 0,
            }));

            setStats({
                totalProducts,
                totalRegistered,
                averageScore: avgScore,
                totalCategories: categoryStatsData.length,
            });
            setCategoryStats(categoryStatsData);
        } catch (error: any) {
            console.error('Dashboard data fetch error:', error);
            showToast.error(error.message || '대시보드 데이터를 불러오는데 실패했습니다');
        } finally {
            setLoading(false);
        }
    };

    const { totalProducts, totalRegistered, averageScore, totalCategories } = stats;

    return (
        <div className="space-y-8">
            {/* Hero Section - Modern Minimal */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                        대시보드
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        AI 기반 쿠팡 셀러 자동화 시스템
                    </p>
                </div>
                <Link href="/dashboard/products/new">
                    <button className="btn btn-primary group">
                        <Plus className="w-5 h-5" />
                        상품 추가
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loading size="lg" />
                </div>
            ) : (
                <>
                    {/* Stats Grid - Modern Minimal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <AnimatedCard delay={0} className="metric-card group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </div>
                                <span className="text-xs font-medium text-gray-400">전체</span>
                            </div>
                            <div className="space-y-1">
                                <p className="stat-number">{totalProducts}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">등록된 상품</p>
                            </div>
                        </AnimatedCard>

                        <AnimatedCard delay={0.1} className="metric-card group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="text-xs font-medium text-green-500">활성</span>
                            </div>
                            <div className="space-y-1">
                                <p className="stat-number text-green-600 dark:text-green-400">{totalRegistered}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">쿠팡 등록</p>
                            </div>
                        </AnimatedCard>

                        <AnimatedCard delay={0.2} className="metric-card group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-xs font-medium text-blue-500">평균</span>
                            </div>
                            <div className="space-y-1">
                                <p className="stat-number text-blue-600 dark:text-blue-400">{averageScore.toFixed(1)}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">품질 점수</p>
                            </div>
                        </AnimatedCard>

                        <AnimatedCard delay={0.3} className="metric-card group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-xs font-medium text-purple-500">카테고리</span>
                            </div>
                            <div className="space-y-1">
                                <p className="stat-number text-purple-600 dark:text-purple-400">{totalCategories}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">활성 카테고리</p>
                            </div>
                        </AnimatedCard>
                    </div>

                    {/* Recent Products - Modern Minimal */}
                    <AnimatedCard delay={0.4} className="card p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">최근 상품</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">최근 등록된 상품 목록</p>
                            </div>
                            <Link href="/dashboard/products">
                                <button className="btn btn-outline text-sm">
                                    전체 보기
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {recentProducts.length === 0 ? (
                                <div className="text-center py-12">
                                    <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">아직 등록된 상품이 없습니다</p>
                                    <Link href="/dashboard/products/new">
                                        <button className="btn btn-primary mt-4">
                                            <Plus className="w-4 h-4" />
                                            첫 상품 추가하기
                                        </button>
                                    </Link>
                                </div>
                            ) : (
                                recentProducts.map((product, index) => (
                                    <div
                                        key={product.id}
                                        onClick={() => router.push(`/dashboard/products/${product.id}`)}
                                        className="group p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all cursor-pointer hover:shadow-soft"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {product.productName}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="badge badge-info">{product.category}</span>
                                                    {product.totalScore && (
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                                            점수: {product.totalScore}
                                                        </span>
                                                    )}
                                                    {product.status === 'registered' && (
                                                        <span className="badge badge-success">쿠팡 등록</span>
                                                    )}
                                                </div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </AnimatedCard>

                    {/* Category Stats - Modern Minimal */}
                    {categoryStats.length > 0 && (
                        <AnimatedCard delay={0.5} className="card p-8">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">카테고리별 통계</h2>
                            <div className="space-y-4">
                                {categoryStats.map((stat, index) => (
                                    <div key={stat.category} className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {stat.category}
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {stat.count}개 · 평균 {stat.avgScore.toFixed(1)}점
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${(stat.count / totalProducts) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>
                    )}
                </>
            )}
        </div>
    );
}
