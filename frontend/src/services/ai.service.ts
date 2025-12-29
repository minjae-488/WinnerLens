import { GoogleGenerativeAI } from '@google/generative-ai';
import { AppError } from '../middleware/errorHandler';

export class AiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        // API Key가 없을 경우 생성 시점이 아닌 호출 시점에 에러를 발생시키기 위해
        // 여기서는 초기화만 하거나 더미로 둡니다.
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('Gemini API Key is not set. AI features will be disabled.');
        }
        this.genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    }

    private checkApiKey() {
        if (!process.env.GEMINI_API_KEY) {
            throw new AppError('Gemini API 키가 설정되지 않았습니다', 503);
        }
    }

    async generateProductName(category: string, keywords: string[]): Promise<string[]> {
        this.checkApiKey();

        try {
            const prompt = `
            역할: 한국 이커머스(쿠팡, 네이버 스마트스토어) 최고의 상품명 작명가
            
            작업: 다음 키워드와 카테고리를 사용하여 클릭을 부르는 매력적인 상품명 5개를 작성하세요.
            
            입력 정보:
            - 카테고리: ${category}
            - 키워드: ${keywords.join(', ')}
            
            규칙:
            1. 한국어로 작성하십시오.
            2. SEO와 클릭률을 모두 고려하십시오.
            3. 특수문자는 필요한 경우에만 최소한으로 사용하십시오.
            4. 오직 JSON 배열 포맷으로만 응답하십시오. (예: ["상품명1", "상품명2"])
            5. 다른 말은 절대 하지 마십시오.
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return this.parseJsonArray(text);
        } catch (error: any) {
            console.error('Gemini API Error:', error);
            throw new AppError('AI 상품명 생성 중 오류가 발생했습니다: ' + (error.message || error), 500);
        }
    }

    async generateProductDescription(productName: string, category: string, features: string[]): Promise<string> {
        this.checkApiKey();

        try {
            const prompt = `
            역할: 전문 쇼핑몰 마케터 및 카피라이터
            
            작업: 다음 상품에 대해 구매 욕구를 자극하는 상세 설명을 작성하세요.
            
            상품 정보:
            - 상품명: ${productName}
            - 카테고리: ${category}
            - 주요 특징: ${features.join(', ')}
            
            작성 가이드:
            1. 고객이 얻을 수 있는 혜택(Benefit)을 중심으로 서술하세요.
            2. 신뢰감을 주면서도 감성적인 톤을 사용하세요.
            3. 가독성을 위해 적절한 줄바꿈, 글머리 기호, 이모지를 사용하세요.
            4. 마크다운(Markdown) 형식으로 깔끔하게 작성하세요.
            5. 바로 사용할 수 있는 본문 내용만 출력하세요.
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return text;
        } catch (error: any) {
            console.error('Gemini API Error:', error);
            throw new AppError('AI 상세 설명 생성 중 오류가 발생했습니다: ' + (error.message || error), 500);
        }
    }

    private parseJsonArray(text: string): string[] {
        try {
            // 마크다운 코드 블록 제거 (```json ... ```)
            let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

            // 대괄호 부분만 추출 시도
            const match = cleanText.match(/\[.*\]/s);
            if (match) {
                cleanText = match[0];
            }

            return JSON.parse(cleanText);
        } catch (error) {
            console.error('JSON Parse Error:', text);
            // 파싱 실패 시 텍스트 자체를 항목으로 하는 배열 반환 (최후의 수단)
            return [text];
        }
    }
}

export const aiService = new AiService();
