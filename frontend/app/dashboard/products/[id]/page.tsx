'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Loading } from '@/components/ui/Loading';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { Product, UpdateProductInput, UpdateScoreInput } from '@/lib/types';
import { AiGeneratorModal } from '@/components/AiGeneratorModal';

export default function ProductDetailPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showScoreModal, setShowScoreModal] = useState(false);

    const [formData, setFormData] = useState<UpdateProductInput>({});
    const [scoreData, setScoreData] = useState<UpdateScoreInput>({});
    const [aiModal, setAiModal] = useState<{ isOpen: boolean; type: 'name' | 'description' }>({
        isOpen: false,
        type: 'name',
    });

    useEffect(() => {
        loadProduct();
    }, [productId]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await api.getProduct(productId);
            setProduct(data);
            setFormData({
                productName: data.productName,
                category: data.category,
                description: data.description,
                price: data.price,
                cost: data.cost || undefined,
                status: data.status,
            });
            setScoreData({
                demandScore: data.demandScore,
                competitionScore: data.competitionScore,
                marginScore: data.marginScore,
                operabilityScore: data.operabilityScore,
            });
        } catch (error: any) {
            showToast.error(error.message || '상품을 불러오는데 실패했습니다');
            router.push('/dashboard/products');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setSaving(true);
            const updated = await api.updateProduct(productId, formData);
            setProduct(updated);
            setIsEditing(false);
            showToast.success('상품이 수정되었습니다');
        } catch (error: any) {
            showToast.error(error.message || '상품 수정에 실패했습니다');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateScore = async () => {
        try {
            setSaving(true);
            const updated = await api.updateProductScore(productId, scoreData);
            setProduct(updated);
            setShowScoreModal(false);
            showToast.success('스코어가 업데이트되었습니다');
        } catch (error: any) {
            showToast.error(error.message || '스코어 업데이트에 실패했습니다');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('정말 이 상품을 삭제하시겠습니까?')) {
            return;
        }

        try {
            await api.deleteProduct(productId);
            showToast.success('상품이 삭제되었습니다');
            router.push('/dashboard/products');
        } catch (error: any) {
            showToast.error(error.message || '상품 삭제에 실패했습니다');
        }
    };

    const openAiModal = (type: 'name' | 'description') => {
        if (!formData.category) {
            showToast.error('먼저 카테고리를 선택해주세요');
            return;
        }
        if (type === 'description' && !formData.productName) {
            showToast.error('먼저 상품명을 입력해주세요');
            return;
        }
        setAiModal({ isOpen: true, type });
    };

    const handleAiSelect = (value: string) => {
        if (aiModal.type === 'name') {
            setFormData(prev => ({ ...prev, productName: value }));
        } else {
            setFormData(prev => ({ ...prev, description: value }));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loading size="lg" />
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {product.productName}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {product.category} • 등록일: {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? '취소' : '✏️ 수정'}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                    >
                        🗑️ 삭제
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Product Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card header={<h2 className="text-xl font-semibold">상품 정보</h2>}>
                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <Input
                                        label="상품명"
                                        value={formData.productName}
                                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openAiModal('name')}
                                            className="text-xs"
                                        >
                                            ✨ AI 상품명 생성
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        카테고리
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input"
                                    >
                                        <option value="전자기기">전자기기</option>
                                        <option value="패션">패션</option>
                                        <option value="뷰티">뷰티</option>
                                        <option value="식품">식품</option>
                                        <option value="생활용품">생활용품</option>
                                        <option value="기타">기타</option>
                                    </select>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            설명
                                        </label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openAiModal('description')}
                                            className="text-xs"
                                        >
                                            ✨ AI 상세설명 생성
                                        </Button>
                                    </div>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="input"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="판매가"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    />

                                    <Input
                                        label="원가"
                                        type="number"
                                        value={formData.cost || ''}
                                        onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || undefined })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        상태
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="input"
                                    >
                                        <option value="draft">초안</option>
                                        <option value="pending">대기중</option>
                                        <option value="registered">등록됨</option>
                                        <option value="rejected">거부됨</option>
                                    </select>
                                </div>

                                <Button
                                    variant="primary"
                                    onClick={handleUpdate}
                                    isLoading={saving}
                                    className="w-full"
                                >
                                    저장
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">카테고리</label>
                                    <p className="text-lg text-gray-900 dark:text-white">{product.category}</p>
                                </div>

                                {product.description && (
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">설명</label>
                                        <p className="text-gray-900 dark:text-white">{product.description}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">판매가</label>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            ₩{product.price.toLocaleString()}
                                        </p>
                                    </div>

                                    {product.cost && (
                                        <div>
                                            <label className="text-sm text-gray-500 dark:text-gray-400">원가</label>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                ₩{product.cost.toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {product.margin !== null && product.margin !== undefined && (
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">마진율</label>
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {Number(product.margin).toFixed(1)}%
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">상태</label>
                                    <div className="mt-1">
                                        <span className={`badge ${product.status === 'registered' ? 'badge-success' :
                                            product.status === 'pending' ? 'badge-warning' :
                                                product.status === 'rejected' ? 'badge-error' :
                                                    'badge-info'
                                            }`}>
                                            {product.status === 'draft' ? '초안' :
                                                product.status === 'pending' ? '대기중' :
                                                    product.status === 'registered' ? '등록됨' :
                                                        '거부됨'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column - Scores */}
                <div className="space-y-6">
                    <Card header={
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">스코어</h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowScoreModal(true)}
                            >
                                수정
                            </Button>
                        </div>
                    }>
                        <ScoreDisplay
                            demandScore={Number(product.demandScore)}
                            competitionScore={Number(product.competitionScore)}
                            marginScore={Number(product.marginScore)}
                            operabilityScore={Number(product.operabilityScore)}
                            totalScore={Number(product.totalScore)}
                        />
                    </Card>
                </div>
            </div>

            {/* Score Modal */}
            <Modal
                isOpen={showScoreModal}
                onClose={() => setShowScoreModal(false)}
                title="스코어 업데이트"
                footer={
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setShowScoreModal(false)}
                            className="flex-1"
                        >
                            취소
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleUpdateScore}
                            isLoading={saving}
                            className="flex-1"
                        >
                            저장
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="수요 점수 (0-100)"
                        type="number"
                        min="0"
                        max="100"
                        value={scoreData.demandScore || 0}
                        onChange={(e) => setScoreData({ ...scoreData, demandScore: parseFloat(e.target.value) })}
                    />

                    <Input
                        label="경쟁 점수 (0-100)"
                        type="number"
                        min="0"
                        max="100"
                        value={scoreData.competitionScore || 0}
                        onChange={(e) => setScoreData({ ...scoreData, competitionScore: parseFloat(e.target.value) })}
                    />

                    <Input
                        label="마진 점수 (0-100)"
                        type="number"
                        min="0"
                        max="100"
                        value={scoreData.marginScore || 0}
                        onChange={(e) => setScoreData({ ...scoreData, marginScore: parseFloat(e.target.value) })}
                    />

                    <Input
                        label="운영 가능성 (0-100)"
                        type="number"
                        min="0"
                        max="100"
                        value={scoreData.operabilityScore || 0}
                        onChange={(e) => setScoreData({ ...scoreData, operabilityScore: parseFloat(e.target.value) })}
                    />

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            종합 점수는 자동으로 계산됩니다 (수요 30% + 경쟁 25% + 마진 25% + 운영 20%)
                        </p>
                    </div>
                </div>
            </Modal>

            <AiGeneratorModal
                isOpen={aiModal.isOpen}
                onClose={() => setAiModal(prev => ({ ...prev, isOpen: false }))}
                onSelect={handleAiSelect}
                type={aiModal.type}
                category={formData.category || ''}
                productName={formData.productName}
            />
        </div>
    );
}
