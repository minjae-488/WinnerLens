'use client';

import { InspectionResult, InspectionIssue } from '@/lib/types';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface InspectionResultCardProps {
    result: InspectionResult | null;
    loading?: boolean;
}

export function InspectionResultCard({ result, loading }: InspectionResultCardProps) {
    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    <p className="text-sm text-gray-600">검수 중...</p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                    상품명과 설명을 입력한 후 검수 버튼을 클릭하세요.
                </p>
            </div>
        );
    }

    const { passed, score, issues } = result;

    // 점수에 따른 색상 결정
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-50 border-green-200';
        if (score >= 60) return 'bg-yellow-50 border-yellow-200';
        return 'bg-red-50 border-red-200';
    };

    return (
        <div className={`rounded-lg border p-6 shadow-sm ${getScoreBgColor(score)}`}>
            {/* 헤더: 합격/불합격 상태 */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {passed ? (
                        <>
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <div>
                                <h3 className="text-lg font-semibold text-green-900">검수 통과</h3>
                                <p className="text-sm text-green-700">상품 등록이 가능합니다.</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <XCircle className="h-6 w-6 text-red-600" />
                            <div>
                                <h3 className="text-lg font-semibold text-red-900">검수 실패</h3>
                                <p className="text-sm text-red-700">문제를 수정한 후 다시 시도하세요.</p>
                            </div>
                        </>
                    )}
                </div>

                {/* 점수 표시 */}
                <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</div>
                    <div className="text-sm text-gray-600">/ 100점</div>
                </div>
            </div>

            {/* 이슈 목록 */}
            {issues.length > 0 && (
                <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">발견된 문제</h4>
                    <div className="space-y-2">
                        {issues.map((issue, index) => (
                            <IssueItem key={index} issue={issue} />
                        ))}
                    </div>
                </div>
            )}

            {/* 통과 시 안내 메시지 */}
            {passed && issues.length === 0 && (
                <div className="mt-4 rounded-md bg-green-100 p-3">
                    <p className="text-sm text-green-800">
                        ✨ 완벽합니다! 모든 검수 항목을 통과했습니다.
                    </p>
                </div>
            )}

            {/* 경고만 있는 경우 */}
            {passed && issues.length > 0 && (
                <div className="mt-4 rounded-md bg-yellow-100 p-3">
                    <p className="text-sm text-yellow-800">
                        ⚠️ 경고 사항이 있지만 등록은 가능합니다. 개선을 권장합니다.
                    </p>
                </div>
            )}
        </div>
    );
}

interface IssueItemProps {
    issue: InspectionIssue;
}

function IssueItem({ issue }: IssueItemProps) {
    const isError = issue.type === 'error';

    return (
        <div
            className={`flex items-start space-x-3 rounded-md p-3 ${isError ? 'bg-red-100' : 'bg-yellow-100'
                }`}
        >
            {isError ? (
                <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            ) : (
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
            )}
            <div className="flex-1">
                <div className="flex items-center space-x-2">
                    <span className={`text-xs font-semibold ${isError ? 'text-red-900' : 'text-yellow-900'}`}>
                        {isError ? '오류' : '경고'}
                    </span>
                    <span className="text-xs text-gray-600">• {issue.field}</span>
                </div>
                <p className={`mt-1 text-sm ${isError ? 'text-red-800' : 'text-yellow-800'}`}>
                    {issue.message}
                </p>
                {issue.keyword && (
                    <p className="mt-1 text-xs text-gray-600">
                        금칙어: <span className="font-mono font-semibold">{issue.keyword}</span>
                    </p>
                )}
            </div>
        </div>
    );
}
