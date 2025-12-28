'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global Error:', error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-2xl p-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
                            <AlertTriangle className="w-10 h-10 text-red-600" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            심각한 오류가 발생했습니다
                        </h1>
                        <p className="text-gray-600 mb-6">
                            애플리케이션을 다시 시작해야 합니다.
                        </p>

                        {process.env.NODE_ENV === 'development' && error.message && (
                            <div className="mb-6 p-3 bg-gray-100 rounded text-left">
                                <p className="text-xs font-mono text-gray-700 break-all">
                                    {error.message}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={reset}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            애플리케이션 재시작
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
