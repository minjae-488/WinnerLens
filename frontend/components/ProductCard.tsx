import React from 'react';
import { Product } from '@/lib/types';
import Link from 'next/link';

interface ProductCardProps {
    product: Product;
    onDelete?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
    const getStatusBadge = (status: string) => {
        const badges = {
            draft: 'badge badge-info',
            pending: 'badge badge-warning',
            registered: 'badge badge-success',
            rejected: 'badge badge-error',
        };

        const labels = {
            draft: '초안',
            pending: '대기중',
            registered: '등록됨',
            rejected: '거부됨',
        };

        return (
            <span className={badges[status as keyof typeof badges]}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400';
        if (score >= 60) return 'text-blue-600 dark:text-blue-400';
        if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <div className="card hover:shadow-xl transition-smooth">
            <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <Link
                            href={`/dashboard/products/${product.id}`}
                            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-smooth"
                        >
                            {product.productName}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {product.category}
                        </p>
                    </div>
                    {getStatusBadge(product.status)}
                </div>

                {/* Description */}
                {product.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {product.description}
                    </p>
                )}

                {/* Price & Margin */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400">판매가</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                            ₩{product.price.toLocaleString()}
                        </div>
                    </div>
                    {product.margin !== null && product.margin !== undefined && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400">마진율</div>
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                {Number(product.margin).toFixed(1)}%
                            </div>
                        </div>
                    )}
                </div>

                {/* Score */}
                {product.totalScore !== null && product.totalScore !== undefined && (
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">종합 점수</span>
                            <span className={`text-2xl font-bold ${getScoreColor(Number(product.totalScore))}`}>
                                {Number(product.totalScore).toFixed(1)}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${Number(product.totalScore) >= 80 ? 'bg-green-500' : Number(product.totalScore) >= 60 ? 'bg-blue-500' : Number(product.totalScore) >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${Number(product.totalScore)}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Link
                        href={`/dashboard/products/${product.id}`}
                        className="flex-1 btn btn-outline text-sm py-2"
                    >
                        상세보기
                    </Link>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(product.id)}
                            className="btn bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 text-sm py-2 px-4"
                        >
                            삭제
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
