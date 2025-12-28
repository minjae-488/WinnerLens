'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth.store';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Package, TrendingUp, Sparkles, Menu, X, Trophy, LogOut } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, isLoading, isAuthenticated, logout, checkAuth } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const menuItems = [
        { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
        { href: '/dashboard/products', label: '상품 관리', icon: Package },
        { href: '/dashboard/trends', label: '트렌드 분석', icon: TrendingUp },
        { href: '/dashboard/ai', label: 'AI 생성', icon: Sparkles, disabled: true },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden mr-2 p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                            >
                                {sidebarOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                            <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-bold gradient-text">
                                <Trophy className="w-7 h-7" />
                                WinnerLens
                            </Link>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block text-right">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.name || user?.email}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {user?.subscriptionTier}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    logout();
                                    router.push('/login');
                                }}
                                className="btn btn-outline text-sm flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                로그아웃
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
                    fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    mt-16 lg:mt-0
                `}>
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.disabled ? '#' : item.href}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth
                                        ${item.disabled
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }
                                    `}
                                    onClick={(e) => {
                                        if (item.disabled) e.preventDefault();
                                        setSidebarOpen(false);
                                    }}
                                >
                                    <IconComponent className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                    {item.disabled && (
                                        <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                            곧 출시
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
