'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const features = [
        {
            icon: '🔍',
            title: '트렌드 분석',
            description: '실시간 시장 트렌드를 분석하여 수요가 높은 상품을 발견하세요',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: '📊',
            title: '스마트 스코어링',
            description: '4가지 핵심 지표로 상품의 수익성을 정확하게 평가합니다',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: '🤖',
            title: 'AI 자동 생성',
            description: 'AI가 상품명과 설명을 자동으로 생성하여 시간을 절약하세요',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: '💰',
            title: '마진 최적화',
            description: '자동 마진 계산으로 최적의 가격 전략을 수립하세요',
            color: 'from-orange-500 to-red-500',
        },
    ];

    const stats = [
        { value: '10,000+', label: '분석된 상품' },
        { value: '95%', label: '정확도' },
        { value: '3배', label: '시간 절약' },
        { value: '24/7', label: '자동화' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-pulse-slow" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }} />
                </div>

                {/* Navigation */}
                <nav className="relative z-10 px-6 py-6">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="text-3xl font-bold gradient-text">
                            🏆 WinnerLens
                        </div>
                        <div className="flex gap-4">
                            <Link href="/login">
                                <button className="btn btn-outline">
                                    로그인
                                </button>
                            </Link>
                            <Link href="/login">
                                <button className="btn btn-primary">
                                    시작하기
                                </button>
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 sm:py-32">
                    <div className={`text-center space-y-8 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white">
                            AI 기반 쿠팡 셀러
                            <br />
                            <span className="gradient-text">자동화 플랫폼</span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            데이터 분석부터 상품 등록까지, WinnerLens가 당신의 쿠팡 셀러 비즈니스를
                            <span className="font-semibold text-blue-600 dark:text-blue-400"> 완전히 자동화</span>합니다
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                            <Link href="/login">
                                <button className="btn btn-primary text-lg px-8 py-4 shadow-glow">
                                    🚀 무료로 시작하기
                                </button>
                            </Link>
                            <button className="btn btn-secondary text-lg px-8 py-4">
                                📺 데모 보기
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-16">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        강력한 기능들
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        성공적인 쿠팡 셀러가 되기 위한 모든 것
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-smooth hover:-translate-y-2"
                        >
                            {/* Gradient Background on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-smooth`} />

                            <div className="relative">
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* How It Works Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        간단한 3단계
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        누구나 쉽게 시작할 수 있습니다
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            step: '1',
                            title: '상품 추가',
                            description: '판매하고 싶은 상품 정보를 입력하세요',
                            icon: '📝',
                        },
                        {
                            step: '2',
                            title: 'AI 분석',
                            description: 'AI가 자동으로 시장을 분석하고 스코어를 계산합니다',
                            icon: '🧠',
                        },
                        {
                            step: '3',
                            title: '최적화 & 등록',
                            description: '최적화된 정보로 쿠팡에 바로 등록하세요',
                            icon: '✅',
                        },
                    ].map((item, index) => (
                        <div key={index} className="relative text-center">
                            {/* Connector Line */}
                            {index < 2 && (
                                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 opacity-30" />
                            )}

                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-6xl shadow-glow">
                                    {item.icon}
                                </div>
                                <div className="absolute -top-2 -right-2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl font-bold gradient-text border-4 border-white dark:border-gray-800">
                                    {item.step}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 sm:p-16 text-center shadow-2xl">
                    {/* Animated Background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse-slow" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }} />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            지금 바로 시작하세요
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            WinnerLens와 함께 성공적인 쿠팡 셀러가 되어보세요.
                            무료로 시작할 수 있습니다.
                        </p>
                        <Link href="/login">
                            <button className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-xl">
                                🚀 무료로 시작하기
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 border-t border-gray-200 dark:border-gray-700 py-12">
                <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
                    <p className="text-2xl font-bold gradient-text mb-4">🏆 WinnerLens</p>
                    <p>© 2025 WinnerLens. All rights reserved.</p>
                    <p className="mt-2 text-sm">AI 기반 쿠팡 셀러 자동화 플랫폼</p>
                </div>
            </footer>
        </div>
    );
}
