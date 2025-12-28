'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* Animated 404 */}
                <div className="mb-8 relative">
                    <div className="text-[150px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Search className="w-20 h-20 text-gray-300 dark:text-gray-600 animate-pulse" />
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    페이지를 찾을 수 없습니다
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
                    <br />
                    URL을 확인하시거나 아래 버튼을 통해 이동해주세요.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/dashboard">
                        <Button variant="primary" size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                            <Home className="w-5 h-5" />
                            대시보드로 이동
                        </Button>
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-outline flex items-center gap-2 w-full sm:w-auto"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        이전 페이지로
                    </button>
                </div>

                {/* Help Links */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        자주 찾는 페이지
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/dashboard/products" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            상품 관리
                        </Link>
                        <Link href="/dashboard/trends" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            트렌드 분석
                        </Link>
                        <Link href="/dashboard/products/new" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            상품 등록
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
