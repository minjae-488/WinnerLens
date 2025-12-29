'use client';

import { useState } from 'react';
import { AnimatedCard } from '@/components/AnimatedCard';
import { Settings, Lock, User, Bell, ChevronRight, LogOut, X } from 'lucide-react';
import { useAuthStore } from '@/lib/auth.store';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';

export default function SettingsPage() {
    const { user, logout, checkAuth } = useAuthStore();
    const router = useRouter();

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const openProfileModal = () => {
        setNewName(user?.name || '');
        setNewEmail(user?.email || '');
        setIsEditingProfile(true);
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || !newEmail.trim()) {
            showToast.error('이름과 이메일을 모두 입력해주세요.');
            return;
        }

        setIsSaving(true);
        try {
            await api.updateProfile({ name: newName, email: newEmail });
            await checkAuth(); // 사용자 정보 갱신
            showToast.success('프로필이 성공적으로 업데이트되었습니다.');
            setIsEditingProfile(false);
        } catch (error: any) {
            showToast.error(error.message || '프로필 업데이트 중 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = () => {
        showToast.error('비밀번호 변경 기능은 준비 중입니다.');
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                    <Settings className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                    설정
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    내 계정 정보 및 앱 설정을 관리합니다.
                </p>
            </div>

            {/* Account Settings */}
            <AnimatedCard delay={0}>
                <div className="card p-6 divide-y divide-gray-100 dark:divide-gray-700">
                    <div className="pb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">프로필 정보</h2>
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold border-2 border-white dark:border-gray-800 shadow-sm">
                                {user?.name?.[0] || user?.email?.[0] || 'U'}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                    {user?.name || '사용자'}
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-medium">
                                        {user?.subscriptionTier || 'Basic'}
                                    </span>
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
                            </div>
                            <button
                                onClick={openProfileModal}
                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 rounded-lg transition-colors"
                            >
                                프로필 수정
                            </button>
                        </div>
                    </div>

                    <div onClick={handlePasswordChange} className="py-6 flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                                <Lock className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">비밀번호 변경</h4>
                                <p className="text-sm text-gray-500">안전을 위해 정기적으로 비밀번호를 변경하세요.</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>

                    <div className="py-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                                <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">알림 설정</h4>
                                <p className="text-sm text-gray-500">이메일 및 푸시 알림 수신 여부를 설정합니다.</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-blue-600 cursor-pointer"></label>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg -ml-4"
                        >
                            <LogOut className="w-5 h-5" />
                            로그아웃
                        </button>
                    </div>
                </div>
            </AnimatedCard>

            {/* Profile Edit Modal */}
            {isEditingProfile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm p-6 shadow-xl transform transition-all scale-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">프로필 수정</h3>
                            <button
                                onClick={() => setIsEditingProfile(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">이름</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="이름을 입력하세요"
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">이메일</label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="이메일을 입력하세요"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditingProfile(false)}
                                    className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isSaving ? '저장 중...' : '저장하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
