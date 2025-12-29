'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/lib/types';

export default function ProductsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const loadProducts = React.useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.getProducts({
                page,
                limit: 12,
                search: search || undefined,
                category: category || undefined,
                status: status || undefined,
                sortBy: 'createdAt',
                sortOrder: 'desc',
            });

            setProducts(data.data);
            setTotalPages(data.pagination.totalPages);
        } catch (error: any) {
            showToast.error(error.message || '상품을 불러오는데 실패했습니다');
        } finally {
            setLoading(false);
        }
    }, [page, search, category, status]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts, refreshTrigger]);

    const handleDelete = async (id: string) => {
        if (!confirm('정말 이 상품을 삭제하시겠습니까?')) {
            return;
        }

        try {
            await api.deleteProduct(id);
            showToast.success('상품이 삭제되었습니다');
            setRefreshTrigger(prev => prev + 1);
        } catch (error: any) {
            showToast.error(error.message || '상품 삭제에 실패했습니다');
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        // loadProducts will be triggered by useEffect when page changes to 1, or we can force it
        // If page was already 1, we need to trigger reload.
        if (page === 1) {
            loadProducts();
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">상품 관리</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        등록한 상품을 관리하세요
                    </p>
                </div>
                <Link href="/dashboard/products/new">
                    <Button variant="primary" size="lg">
                        ➕ 상품 추가
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                        type="text"
                        placeholder="상품명 검색..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setPage(1);
                        }}
                        className="input"
                    >
                        <option value="">모든 카테고리</option>
                        <option value="전자기기">전자기기</option>
                        <option value="패션">패션</option>
                        <option value="뷰티">뷰티</option>
                        <option value="식품">식품</option>
                        <option value="기타">기타</option>
                    </select>

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        className="input"
                    >
                        <option value="">모든 상태</option>
                        <option value="draft">초안</option>
                        <option value="pending">대기중</option>
                        <option value="registered">등록됨</option>
                        <option value="rejected">거부됨</option>
                    </select>

                    <Button type="submit" variant="primary">
                        🔍 검색
                    </Button>
                </form>
            </Card>

            {/* Products Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loading size="lg" />
                </div>
            ) : products.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📦</div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {search || category || status
                                ? '검색 결과가 없습니다'
                                : '아직 등록된 상품이 없습니다'}
                        </p>
                        <Link href="/dashboard/products/new">
                            <Button variant="primary">상품 추가하기</Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <Button
                                variant="outline"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                ← 이전
                            </Button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (page <= 3) {
                                        pageNum = i + 1;
                                    } else if (page >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = page - 2 + i;
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={page === pageNum ? 'primary' : 'outline'}
                                            onClick={() => setPage(pageNum)}
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                다음 →
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
