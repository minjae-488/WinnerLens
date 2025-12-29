'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth.store';
import { showToast } from '@/lib/toast';

export default function LoginPage() {
    const router = useRouter();
    const { setUser, isAuthenticated } = useAuthStore();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Verification States
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerificationInput, setShowVerificationInput] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });

    const handleSendVerification = async () => {
        if (!formData.email) {
            showToast.error('이메일을 입력해주세요.');
            return;
        }
        try {
            setLoading(true);
            const code = await api.sendVerification(formData.email);
            showToast.success(`인증 코드(테스트용): ${code}`);
            // 테스트 편의를 위해 자동 입력
            setVerificationCode(code);
            setShowVerificationInput(true);
        } catch (e: any) {
            showToast.error(e.message || '인증 코드 발송 실패');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!verificationCode) {
            showToast.error('인증 코드를 입력해주세요.');
            return;
        }
        try {
            setIsVerifying(true);
            const verified = await api.verifyCode(formData.email, verificationCode);
            if (verified) {
                setIsEmailVerified(true);
                setShowVerificationInput(false);
                showToast.success('이메일 인증이 완료되었습니다.');
            } else {
                showToast.error('인증 코드가 올바르지 않습니다.');
            }
        } catch (e: any) {
            showToast.error(e.message || '인증 실패');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isLogin && !isEmailVerified) {
            showToast.error('이메일 인증을 완료해주세요.');
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                const authData = await api.login({
                    email: formData.email,
                    password: formData.password,
                });

                setUser(authData.user);
                showToast.success(`환영합니다, ${authData.user.name || authData.user.email}님!`);
                router.push('/dashboard');
            } else {
                const authData = await api.register({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name || undefined,
                });

                setUser(authData.user);
                showToast.success('회원가입이 완료되었습니다!');
                router.push('/dashboard');
            }
        } catch (err: any) {
            const errorMessage = err.message || '오류가 발생했습니다';
            setError(errorMessage);
            showToast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // 이메일 변경 시 인증 상태 초기화
        if (e.target.name === 'email' && !isLogin) {
            setIsEmailVerified(false);
            setShowVerificationInput(false);
            setVerificationCode('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            <div className="w-full max-w-md animate-fade-in">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">
                        🏆 WinnerLens
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        AI 기반 쿠팡 셀러 자동화 플랫폼
                    </p>
                </div>

                {/* Card */}
                <div className="card p-8">
                    {/* Tabs */}
                    <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 rounded-md font-medium transition-smooth ${isLogin
                                ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            로그인
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 rounded-md font-medium transition-smooth ${!isLogin
                                ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            회원가입
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    이름 (선택)
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="홍길동"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                이메일
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="input flex-1"
                                    placeholder="example@winnerlens.com"
                                    disabled={!isLogin && isEmailVerified}
                                />
                                {!isLogin && !isEmailVerified && (
                                    <button
                                        type="button"
                                        onClick={handleSendVerification}
                                        disabled={loading || !formData.email}
                                        className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors disabled:opacity-50 whitespace-nowrap"
                                    >
                                        인증
                                    </button>
                                )}
                            </div>
                            {!isLogin && isEmailVerified && (
                                <p className="mt-1 text-xs text-green-600 font-medium flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    이메일 인증 완료
                                </p>
                            )}

                            {/* Verification Code Input */}
                            {!isLogin && showVerificationInput && (
                                <div className="mt-2 flex gap-2 animate-in fade-in slide-in-from-top-1">
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        className="input flex-1"
                                        placeholder="인증코드 6자리"
                                        maxLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyCode}
                                        disabled={isVerifying}
                                        className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                                    >
                                        {isVerifying ? '확인 중...' : '확인'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                비밀번호
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="input"
                                placeholder={isLogin ? '비밀번호' : '8자 이상, 대소문자, 숫자 포함'}
                            />
                            {!isLogin && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    8자 이상, 대문자, 소문자, 숫자를 포함해야 합니다
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full btn btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${!isLogin && !isEmailVerified ? 'opacity-50 grayscale' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    처리 중...
                                </span>
                            ) : (
                                isLogin ? '로그인' : '회원가입'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        {isLogin ? (
                            <p>
                                계정이 없으신가요?{' '}
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                                >
                                    회원가입
                                </button>
                            </p>
                        ) : (
                            <p>
                                이미 계정이 있으신가요?{' '}
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                                >
                                    로그인
                                </button>
                            </p>
                        )}
                    </div>
                </div>

                {/* Features */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                        <div className="text-2xl mb-1">🔍</div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">트렌드 분석</p>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                        <div className="text-2xl mb-1">📊</div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">스코어링</p>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                        <div className="text-2xl mb-1">🤖</div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">AI 생성</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
