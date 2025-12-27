'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreateProductInput } from '@/lib/types';
import { AiGeneratorModal } from '@/components/AiGeneratorModal';

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateProductInput>({
        productName: '',
        category: '',
        description: '',
        price: 0,
        cost: 0,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CreateProductInput, string>>>({});
    const [aiModal, setAiModal] = useState<{ isOpen: boolean; type: 'name' | 'description' }>({
        isOpen: false,
        type: 'name',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'cost' ? parseFloat(value) || 0 : value,
        }));

        // Clear error when user types
        if (errors[name as keyof CreateProductInput]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
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

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof CreateProductInput, string>> = {};

        if (!formData.productName.trim()) {
            newErrors.productName = '상품명을 입력해주세요';
        }

        if (!formData.category) {
            newErrors.category = '카테고리를 선택해주세요';
        }

        if (formData.price <= 0) {
            newErrors.price = '판매가는 0보다 커야 합니다';
        }

        if (formData.cost && formData.cost < 0) {
            newErrors.cost = '원가는 0 이상이어야 합니다';
        }

        if (formData.cost && formData.cost >= formData.price) {
            newErrors.cost = '원가는 판매가보다 작아야 합니다';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setLoading(true);
            const product = await api.createProduct(formData);
            showToast.success('상품이 생성되었습니다');
            router.push(`/dashboard/products/${product.id}`);
        } catch (error: any) {
            showToast.error(error.message || '상품 생성에 실패했습니다');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">상품 추가</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    새로운 상품 정보를 입력하세요
                </p>
            </div>

            {/* Form */}
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Input
                            label="상품명 *"
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            error={errors.productName}
                            placeholder="예: 무선 블루투스 이어폰"
                            required
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
                            카테고리 *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`input ${errors.category ? 'border-red-500' : ''}`}
                            required
                        >
                            <option value="">카테고리 선택</option>
                            <option value="전자기기">전자기기</option>
                            <option value="패션">패션</option>
                            <option value="뷰티">뷰티</option>
                            <option value="식품">식품</option>
                            <option value="생활용품">생활용품</option>
                            <option value="기타">기타</option>
                        </select>
                        {errors.category && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.category}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                상품 설명
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
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="input"
                            placeholder="상품에 대한 상세한 설명을 입력하세요"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="판매가 (원) *"
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            error={errors.price}
                            min="0"
                            step="100"
                            placeholder="20000"
                            required
                        />

                        <Input
                            label="원가 (원)"
                            type="number"
                            name="cost"
                            value={formData.cost}
                            onChange={handleChange}
                            error={errors.cost}
                            min="0"
                            step="100"
                            placeholder="15000"
                            helperText="원가를 입력하면 마진율이 자동으로 계산됩니다"
                        />
                    </div>

                    {/* Margin Preview */}
                    {formData.price > 0 && formData.cost && formData.cost > 0 && formData.cost < formData.price && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-200">
                                예상 마진율: <span className="font-bold text-lg">
                                    {(((formData.price - formData.cost) / formData.price) * 100).toFixed(1)}%
                                </span>
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => router.back()}
                            disabled={loading}
                            className="flex-1"
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={loading}
                            className="flex-1"
                        >
                            상품 생성
                        </Button>
                    </div>
                </form>
            </Card>

            <AiGeneratorModal
                isOpen={aiModal.isOpen}
                onClose={() => setAiModal(prev => ({ ...prev, isOpen: false }))}
                onSelect={handleAiSelect}
                type={aiModal.type}
                category={formData.category}
                productName={formData.productName}
            />
        </div >
    );
}
