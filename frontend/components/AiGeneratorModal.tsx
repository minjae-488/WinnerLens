import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';

interface AiGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (value: string) => void;
    type: 'name' | 'description';
    category: string;
    productName?: string; // 설명 생성 시 필요
}

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    type,
    category,
    productName,
}) => {
    const [keywords, setKeywords] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedNames, setGeneratedNames] = useState<string[]>([]);
    const [generatedDesc, setGeneratedDesc] = useState('');

    const handleGenerate = async () => {
        if (!category) {
            showToast.error('카테고리가 선택되어야 합니다');
            return;
        }

        if (!keywords.trim()) {
            showToast.error(type === 'name' ? '키워드를 입력해주세요' : '특징을 입력해주세요');
            return;
        }

        try {
            setLoading(true);
            const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);

            if (type === 'name') {
                const names = await api.generateProductName(category, keywordList);
                setGeneratedNames(names);
                setGeneratedDesc('');
            } else {
                if (!productName) {
                    showToast.error('상품명이 필요합니다');
                    return;
                }
                const desc = await api.generateProductDescription(productName, category, keywordList);
                setGeneratedDesc(desc);
                setGeneratedNames([]);
            }
        } catch (error: any) {
            showToast.error(error.message || 'AI 생성에 실패했습니다');
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (value: string) => {
        onSelect(value);
        onClose();
        // Reset state
        setGeneratedNames([]);
        setGeneratedDesc('');
        setKeywords('');
    };

    const title = type === 'name' ? 'AI 상품명 생성' : 'AI 상세 설명 생성';
    const placeholder = type === 'name'
        ? '키워드를 쉼표(,)로 구분하여 입력하세요 (예: 무선, 블루투스, 노이즈캔슬링)'
        : '상품 특징을 쉼표(,)로 구분하여 입력하세요 (예: 24시간 재생, 방수, 고음질)';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>
                        닫기
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {type === 'name' ? '키워드' : '주요 특징'}
                    </label>
                    <div className="flex gap-2">
                        <Input
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder={placeholder}
                            className="flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <Button
                            variant="primary"
                            onClick={handleGenerate}
                            isLoading={loading}
                        >
                            ✨ 생성
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        더 정확한 결과를 위해 구체적인 키워드를 입력해주세요.
                    </p>
                </div>

                {/* Results */}
                {generatedNames.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">생성된 상품명 (클릭하여 선택)</p>
                        <div className="grid gap-2">
                            {generatedNames.map((name, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSelect(name)}
                                    className="text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 transition-colors"
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {generatedDesc && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">생성된 설명</p>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-h-60 overflow-y-auto whitespace-pre-wrap text-sm">
                            {generatedDesc}
                        </div>
                        <Button
                            variant="primary"
                            className="w-full mt-2"
                            onClick={() => handleSelect(generatedDesc)}
                        >
                            이 설명 사용하기
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};
