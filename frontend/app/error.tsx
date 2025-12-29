'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* Animated Error Icon */}
                <div className="mb-8 relative">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                        <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400 animate-pulse" />
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    문제가 발생했습니다
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                    일시적인 오류가 발생했습니다.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
                    잠시 후 다시 시도해주시거나, 문제가 계속되면 관리자에게 문의해주세요.
                </p>

                {/* Error Details (Development only) */}
                {process.env.NODE_ENV === 'development' && error.message && (
                    <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left max-w-lg mx-auto">
                        <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={reset}
                        className="flex items-center gap-2 w-full sm:w-auto"
                    >
                        <RefreshCw className="w-5 h-5" />
                        다시 시도
                    </Button>
                    <Link href="/dashboard">
                        <Button variant="outline" size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                            <Home className="w-5 h-5" />
                            대시보드로 이동
                        </Button>
                    </Link>
                </div>

                {/* Help Text */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        문제가 계속되나요?
                    </p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center text-sm">
                        <button
                            onClick={() => window.location.reload()}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            페이지 새로고침
                        </button>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                sessionStorage.clear();
                                window.location.href = '/dashboard';
                            }}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            캐시 삭제 후 재시작
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
