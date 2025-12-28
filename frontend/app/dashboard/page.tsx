'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading, Skeleton } from '@/components/ui/Loading';
import { ProductCard } from '@/components/ProductCard';
import { Product, CategoryStats } from '@/lib/types';
import { PageTransition } from '@/components/PageTransition';
import { AnimatedCard } from '@/components/AnimatedCard';
import { Package, CheckCircle, BarChart3, Folder, Plus, Package2 } from 'lucide-react';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [stats, setStats] = useState<CategoryStats[]>([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Load recent products
            const productsData = await api.getProducts({ limit: 6, sortBy: 'createdAt', sortOrder: 'desc' });
            setProducts(productsData.data);

            // Load category stats
            const statsData = await api.getCategoryStats();
            setStats(statsData);
        } catch (error: any) {
            showToast.error(error.message || '데이터를 불러오는데 실패했습니다');
        } finally {
            setLoading(false);
        }
    };

    const totalProducts = stats.reduce((sum, s) => sum + s.total, 0);
    const totalRegistered = stats.reduce((sum, s) => sum + s.registered, 0);
    const avgScore = stats.length > 0
        ? stats.reduce((sum, s) => sum + (s.avgScore * s.total), 0) / totalProducts
        : 0;

    return (
        <PageTransition className="space-y-8">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">대시보드</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        WinnerLens에 오신 것을 환영합니다
                    </p>
                </div>
                <Link href="/dashboard/products/new">
                    <Button variant="primary" size="lg" className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        상품 추가
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <Skeleton className="h-28" />
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <AnimatedCard delay={0} className="card group cursor-pointer">
                        <div className="flex items-center justify-between p-6">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    전체 상품
                                </p>
                                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                                    {totalProducts}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                    총 등록된 상품 수
                                </p>
                            </div>
                            <div className="ml-4">
                                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                                    <Package className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                                </div>
                            </div>
                        </div>
                    </AnimatedCard>

                    <AnimatedCard delay={0.1} className="card group cursor-pointer">
                        <div className="flex items-center justify-between p-6">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    등록된 상품
                                </p>
                                <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                                    {totalRegistered}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                    쿠팡 등록 완료
                                </p>
                            </div>
                            <div className="ml-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>
                    </AnimatedCard>

                    <AnimatedCard delay={0.2} className="card group cursor-pointer">
                        <div className="flex items-center justify-between p-6">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    평균 스코어
                                </p>
                                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                    {avgScore.toFixed(1)}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                    종합 평가 점수
                                </p>
                            </div>
                            <div className="ml-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                    <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>
                    </AnimatedCard>

                    <AnimatedCard delay={0.3} className="card group cursor-pointer">
                        <div className="flex items-center justify-between p-6">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    카테고리
                                </p>
                                <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                                    {stats.length}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                    활성 카테고리 수
                                </p>
                            </div>
                            <div className="ml-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                                    <Folder className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </div>
                    </AnimatedCard>
                </div>
            )}

            {/* Category Stats */}
            {!loading && stats.length > 0 && (
                <Card header={<h2 className="text-xl font-semibold">카테고리별 통계</h2>}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        카테고리
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        전체
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        등록됨
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        평균 스코어
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.map((stat) => (
                                    <tr key={stat.category} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                                            {stat.category}
                                        </td>
                                        <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">
                                            {stat.total}
                                        </td>
                                        <td className="py-3 px-4 text-center text-green-600 dark:text-green-400 font-medium">
                                            {stat.registered}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`font-semibold ${stat.avgScore >= 80 ? 'text-green-600 dark:text-green-400' :
                                                stat.avgScore >= 60 ? 'text-blue-600 dark:text-blue-400' :
                                                    stat.avgScore >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
                                                        'text-red-600 dark:text-red-400'
                                                }`}>
                                                {stat.avgScore.toFixed(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Recent Products */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">최근 상품</h2>
                    <Link href="/dashboard/products">
                        <Button variant="outline">전체 보기 →</Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <Skeleton className="h-48" />
                            </Card>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <Card>
                        <div className="text-center py-12">
                            <Package2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                아직 등록된 상품이 없습니다
                            </p>
                            <Link href="/dashboard/products/new">
                                <Button variant="primary">첫 상품 추가하기</Button>
                            </Link>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </PageTransition>
    );
}
