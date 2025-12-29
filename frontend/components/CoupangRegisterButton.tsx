'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { CoupangRegistrationResult } from '@/lib/types';
import { CheckCircle, XCircle, Clock, AlertTriangle, ExternalLink } from 'lucide-react';

interface CoupangRegisterButtonProps {
    productId: string;
    productName: string;
    isRegistered?: boolean;
    coupangProductId?: string;
    onSuccess?: () => void;
}

export function CoupangRegisterButton({
    productId,
    productName,
    isRegistered = false,
    coupangProductId,
    onSuccess,
}: CoupangRegisterButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [result, setResult] = useState<CoupangRegistrationResult | null>(null);

    const handleRegister = async () => {
        try {
            setIsRegistering(true);
            const registrationResult = await api.registerToCoupang(productId);

            setResult(registrationResult);

            if (registrationResult.success) {
                showToast.success('쿠팡에 상품이 등록되었습니다!');
                onSuccess?.();
            } else {
                showToast.error(registrationResult.message || '등록에 실패했습니다');
            }
        } catch (error: any) {
            showToast.error(error.message || '등록 중 오류가 발생했습니다');
            setResult({
                success: false,
                status: 'failed',
                message: error.message || '등록 중 오류가 발생했습니다',
                registeredAt: new Date().toISOString(),
            });
        } finally {
            setIsRegistering(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-12 h-12 text-yellow-500" />;
            case 'approved':
            case 'selling':
                return <CheckCircle className="w-12 h-12 text-green-500" />;
            case 'rejected':
            case 'failed':
                return <XCircle className="w-12 h-12 text-red-500" />;
            default:
                return <AlertTriangle className="w-12 h-12 text-gray-400" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return '심사 대기 중';
            case 'approved':
                return '승인 완료';
            case 'selling':
                return '판매 중';
            case 'rejected':
                return '반려됨';
            case 'failed':
                return '등록 실패';
            default:
                return '알 수 없음';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-50 border-yellow-200';
            case 'approved':
            case 'selling':
                return 'bg-green-50 border-green-200';
            case 'rejected':
            case 'failed':
                return 'bg-red-50 border-red-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <>
            {isRegistered ? (
                <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2"
                >
                    <ExternalLink className="w-4 h-4" />
                    쿠팡 등록 정보
                </Button>
            ) : (
                <Button
                    variant="primary"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2"
                >
                    <ExternalLink className="w-4 h-4" />
                    쿠팡에 등록하기
                </Button>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setResult(null);
                }}
                title={isRegistered ? '쿠팡 등록 정보' : '쿠팡에 상품 등록'}
            >
                <div className="space-y-6">
                    {!result && !isRegistered && (
                        <>
                            <div className="text-center py-4">
                                <div className="text-5xl mb-4">🛒</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    쿠팡에 상품을 등록하시겠습니까?
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    <span className="font-medium">{productName}</span>
                                </p>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                                    <p className="text-sm text-blue-900 font-medium mb-2">📌 안내사항</p>
                                    <ul className="text-xs text-blue-800 space-y-1">
                                        <li>• 등록 후 쿠팡 심사가 진행됩니다 (1~3일 소요)</li>
                                        <li>• 심사 승인 후 판매가 시작됩니다</li>
                                        <li>• 현재 Mock 모드로 작동 중입니다</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1"
                                    disabled={isRegistering}
                                >
                                    취소
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleRegister}
                                    isLoading={isRegistering}
                                    className="flex-1"
                                >
                                    {isRegistering ? '등록 중...' : '등록하기'}
                                </Button>
                            </div>
                        </>
                    )}

                    {result && (
                        <div className={`rounded-lg border p-6 ${getStatusColor(result.status)}`}>
                            <div className="text-center mb-4">
                                {getStatusIcon(result.status)}
                                <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">
                                    {getStatusText(result.status)}
                                </h3>
                                <p className="text-sm text-gray-700">{result.message}</p>
                            </div>

                            {result.coupangProductId && (
                                <div className="bg-white rounded-md p-3 mb-4">
                                    <p className="text-xs text-gray-600 mb-1">쿠팡 상품 ID</p>
                                    <p className="text-sm font-mono font-semibold text-gray-900">
                                        {result.coupangProductId}
                                    </p>
                                </div>
                            )}

                            {result.status === 'pending' && (
                                <div className="bg-yellow-100 rounded-md p-3 mb-4">
                                    <p className="text-xs text-yellow-900">
                                        ⏳ 쿠팡 심사가 진행 중입니다. 1~3일 정도 소요될 수 있습니다.
                                    </p>
                                </div>
                            )}

                            {result.status === 'approved' && (
                                <div className="bg-green-100 rounded-md p-3 mb-4">
                                    <p className="text-xs text-green-900">
                                        ✅ 심사가 승인되었습니다! 곧 판매가 시작됩니다.
                                    </p>
                                </div>
                            )}

                            <Button
                                variant="primary"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setResult(null);
                                }}
                                className="w-full"
                            >
                                확인
                            </Button>
                        </div>
                    )}

                    {isRegistered && coupangProductId && (
                        <div className="text-center py-4">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                쿠팡에 등록된 상품입니다
                            </h3>
                            <div className="bg-gray-50 rounded-md p-3 mb-4">
                                <p className="text-xs text-gray-600 mb-1">쿠팡 상품 ID</p>
                                <p className="text-sm font-mono font-semibold text-gray-900">
                                    {coupangProductId}
                                </p>
                            </div>
                            <Button
                                variant="secondary"
                                onClick={() => setIsModalOpen(false)}
                                className="w-full"
                            >
                                닫기
                            </Button>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}
