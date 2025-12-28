const googleTrends = require('google-trends-api');

export class GoogleTrendsService {
    /**
     * 키워드의 시간별 관심도 가져오기
     */
    async getInterestOverTime(keyword: string, startDate?: Date): Promise<any> {
        try {
            const result = await googleTrends.interestOverTime({
                keyword,
                startTime: startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1년 전
                geo: 'KR', // 한국
                category: 0, // 모든 카테고리
            });

            return JSON.parse(result);
        } catch (error) {
            console.error('Google Trends API Error:', error);
            throw new Error('Failed to fetch Google Trends data');
        }
    }

    /**
     * 연관 검색어 가져오기
     */
    async getRelatedQueries(keyword: string): Promise<any> {
        try {
            const result = await googleTrends.relatedQueries({
                keyword,
                geo: 'KR',
            });

            return JSON.parse(result);
        } catch (error) {
            console.error('Google Trends Related Queries Error:', error);
            return null;
        }
    }

    /**
     * 지역별 관심도 가져오기
     */
    async getInterestByRegion(keyword: string): Promise<any> {
        try {
            const result = await googleTrends.interestByRegion({
                keyword,
                geo: 'KR',
                resolution: 'REGION',
            });

            return JSON.parse(result);
        } catch (error) {
            console.error('Google Trends Region Error:', error);
            return null;
        }
    }

    /**
     * 여러 키워드 비교
     */
    async compareKeywords(keywords: string[]): Promise<any> {
        try {
            const result = await googleTrends.interestOverTime({
                keyword: keywords,
                startTime: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
                geo: 'KR',
            });

            return JSON.parse(result);
        } catch (error) {
            console.error('Google Trends Compare Error:', error);
            throw new Error('Failed to compare keywords');
        }
    }
}

export const googleTrendsService = new GoogleTrendsService();
