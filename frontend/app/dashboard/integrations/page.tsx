'use client';

import { useState } from 'react';
import { AnimatedCard } from '@/components/AnimatedCard';
import { Store, Link as LinkIcon, CheckCircle2, AlertCircle, RefreshCw, Lock } from 'lucide-react';
import { showToast } from '@/lib/toast';

export default function IntegrationsPage() {
    const [showModal, setShowModal] = useState(false);
    const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Mock: 연동 상태 관리
    const [integrations, setIntegrations] = useState<Record<string, boolean>>({
        'coupang': false,
        'naver': false,
        '11st': false,
    });

    const markets = [
        {
            id: 'coupang',
            name: 'Coupang',
            color: 'bg-red-600',
            textColor: 'text-red-600',
            description: '쿠팡 윙(WING) 판매자 센터 연동',
        },
        {
            id: 'naver',
            name: 'Naver Smart Store',
            color: 'bg-green-500',
            textColor: 'text-green-500',
            description: '스마트스토어 센터 연동',
        },
        {
            id: '11st',
            name: '11st',
            color: 'bg-red-500',
            textColor: 'text-red-500',
            description: '11번가 셀러 오피스 연동',
            disabled: true,
        },
    ];

    const handleConnect = (marketId: string) => {
        setSelectedMarket(marketId);
        setShowModal(true);
    };

    const handleDisconnect = (marketId: string) => {
        if (confirm('정말로 연동을 해제하시겠습니까?')) {
            setIntegrations(prev => ({ ...prev, [marketId]: false }));
            showToast.success('연동이 해제되었습니다.');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // 연동 시뮬레이션
        setTimeout(() => {
            setIsLoading(false);
            setIntegrations(prev => ({ ...prev, [selectedMarket!]: true }));
            setShowModal(false);
            showToast.success(`${markets.find(m => m.id === selectedMarket)?.name} 연동이 완료되었습니다!`);
        }, 1500);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                        <Store className="w-8 h-8 text-blue-600" />
                        스토어 연동
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        오픈마켓 판매자 센터를 연결하여 상품 및 주문을 통합 관리하세요.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                    <RefreshCw className="w-4 h-4" />
                    연동 상태 새로고침
                </button>
            </div>

            {/* Content */}
            <AnimatedCard delay={0} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {markets.map((market) => {
                        const isConnected = integrations[market.id];
                        return (
                            <div
                                key={market.id}
                                className={`
                                    relative p-6 rounded-xl border-2 transition-all flex flex-col h-full
                                    ${isConnected
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-500'
                                        : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-800 shadow-sm hover:shadow-md'
                                    }
                                    ${market.disabled ? 'opacity-60 grayscale' : ''}
                                `}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-14 h-14 rounded-xl ${market.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-gray-200 dark:shadow-none`}>
                                        {market.name[0]}
                                    </div>
                                    {isConnected ? (
                                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-800">
                                            <CheckCircle2 className="w-3 h-3" />
                                            연동됨
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs border border-gray-200 dark:border-gray-600">
                                            <AlertCircle className="w-3 h-3" />
                                            미연동
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {market.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                                        {market.description}
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    {market.disabled ? (
                                        <button disabled className="w-full py-3 rounded-lg bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed">
                                            준비 중
                                        </button>
                                    ) : isConnected ? (
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-3 rounded-lg bg-white border border-blue-200 text-blue-600 text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm">
                                                설정
                                            </button>
                                            <button
                                                onClick={() => handleDisconnect(market.id)}
                                                className="px-4 py-3 rounded-lg border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-gray-400 bg-white"
                                            >
                                                해제
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleConnect(market.id)}
                                            className="w-full py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200 dark:shadow-none"
                                        >
                                            <LinkIcon className="w-4 h-4" />
                                            연동하기
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </AnimatedCard>

            {/* Integration Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-8 shadow-2xl transform transition-all scale-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full ${markets.find(m => m.id === selectedMarket)?.color}`} />
                                {markets.find(m => m.id === selectedMarket)?.name} 연동
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <span className="sr-only">Close</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Access Key / Client ID</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                    placeholder="API Key를 입력하세요"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Secret Key</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                    placeholder="Secret Key를 입력하세요"
                                />
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:-translate-y-0.5"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            연동 확인 중...
                                        </>
                                    ) : (
                                        '연동 완료'
                                    )}
                                </button>
                                <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    입력하신 정보는 암호화되어 안전하게 저장됩니다.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}


