import { BLACKLIST_KEYWORDS, INSPECTION_MESSAGES } from '../constants/blacklist';

export interface InspectionResult {
    passed: boolean;
    score: number; // 100점 만점
    issues: InspectionIssue[];
}

export interface InspectionIssue {
    type: 'error' | 'warning';
    field: string;
    message: string;
    keyword?: string;
}

export interface InspectionInput {
    productName: string;
    description?: string;
    category?: string;
}

export class InspectionService {
    /**
     * 상품 정보 검수 실행
     */
    static inspect(input: InspectionInput): InspectionResult {
        const issues: InspectionIssue[] = [];
        const { productName, description } = input;

        // 1. 상품명 검사
        this.checkKeywords(productName, 'productName', issues);

        if (productName.length > 50) {
            issues.push({
                type: 'warning',
                field: 'productName',
                message: '상품명이 너무 깁니다. (권장: 50자 이내)'
            });
        }

        if (productName.length < 5) {
            issues.push({
                type: 'error',
                field: 'productName',
                message: '상품명이 너무 짧습니다. (최소 5자 이상)'
            });
        }

        // 2. 상세설명 검사 (있을 경우)
        if (description) {
            this.checkKeywords(description, 'description', issues);
        }

        // 점수 계산 (기본 100점, 에러 -20, 경고 -5)
        let score = 100;
        issues.forEach(issue => {
            score -= issue.type === 'error' ? 20 : 5;
        });

        // 점수 하한선 0점
        score = Math.max(0, score);

        // 에러가 하나라도 있으면 불합격
        const passed = !issues.some(issue => issue.type === 'error');

        return {
            passed,
            score,
            issues
        };
    }

    /**
     * 금칙어 포함 여부 확인
     */
    private static checkKeywords(text: string, field: string, issues: InspectionIssue[]) {
        Object.entries(BLACKLIST_KEYWORDS).forEach(([category, keywords]) => {
            keywords.forEach(keyword => {
                if (text.includes(keyword)) {
                    issues.push({
                        type: 'error', // 금칙어는 기본적으로 Error 처리
                        field,
                        message: (INSPECTION_MESSAGES as any)[category] || '사용할 수 없는 단어가 포함되어 있습니다.',
                        keyword
                    });
                }
            });
        });
    }
}
