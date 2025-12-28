import { Request, Response } from 'express';
import { ApiResponseUtil } from '../utils/response';
import { AppError } from '../middleware/errorHandler';
import { googleTrendsService } from '../services/google-trends.service';

const USE_REAL_TRENDS = process.env.USE_REAL_TRENDS === 'true';

export class TrendController {
    // 트렌드 분석 데이터 가져오기
    async getTrends(req: Request, res: Response): Promise<any> {
        const { category, period } = req.query;

        // Real API 사용 시
        if (USE_REAL_TRENDS) {
            return this.getRealTrends(req, res);
        }

        // Mock 데이터 사용 (기존 로직)

        // Mock 데이터: 실제 API 대신 시뮬레이션된 데이터 반환
        // 카테고리에 따라 데이터를 다르게 생성하여 현실감 제공

        const labels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

        // 카테고리별 베이스 데이터 생성
        let baseVolume = 1000;
        let growthRate = 1.1;
        let profitability = '중간';
        let seasonality = '연중';
        let targetAge = '전연령';

        if (category === '패션') {
            baseVolume = 5000;
            growthRate = 1.2;
            profitability = '높음';
            seasonality = '봄/가을 성수기';
            targetAge = '20-40대';
        } else if (category === '전자기기') {
            baseVolume = 3000;
            growthRate = 1.05;
            profitability = '중간';
            seasonality = '연말 성수기';
            targetAge = '20-50대';
        } else if (category === '뷰티') {
            baseVolume = 4000;
            growthRate = 1.15;
            profitability = '높음';
            seasonality = '연중';
            targetAge = '20-30대 여성';
        }

        // 검색량 데이터 생성
        const searchVolume = labels.map((_, index) => {
            const randomFactor = 0.8 + Math.random() * 0.4;
            return Math.floor(baseVolume * Math.pow(growthRate, index) * randomFactor);
        });

        // 경쟁 강도 데이터
        const competitionIndex = labels.map(() => Math.floor(Math.random() * 40) + 60);

        // 급상승 키워드 (카테고리별)
        const risingKeywordsByCategory: Record<string, any[]> = {
            '전자기기': [
                { keyword: '초경량 무선 이어폰', growth: 150, searchVolume: 12450 },
                { keyword: '방수 블루투스 스피커', growth: 85, searchVolume: 8230 },
                { keyword: '휴대용 보조배터리', growth: 45, searchVolume: 6540 },
                { keyword: '캠핑용 미니 빔프로젝터', growth: 30, searchVolume: 4320 },
                { keyword: '스마트워치 스트랩', growth: 25, searchVolume: 3890 },
            ],
            '패션': [
                { keyword: '오버핏 후드티', growth: 180, searchVolume: 15600 },
                { keyword: '와이드 데님 팬츠', growth: 120, searchVolume: 11200 },
                { keyword: '크로스백 미니', growth: 95, searchVolume: 9870 },
                { keyword: '청키 스니커즈', growth: 70, searchVolume: 7650 },
                { keyword: '버킷햇', growth: 55, searchVolume: 6430 },
            ],
            '뷰티': [
                { keyword: '수분 앰플 세럼', growth: 165, searchVolume: 14200 },
                { keyword: '비건 선크림', growth: 140, searchVolume: 12800 },
                { keyword: '글로우 쿠션', growth: 110, searchVolume: 10500 },
                { keyword: '립 틴트 세트', growth: 80, searchVolume: 8900 },
                { keyword: '클렌징 밤', growth: 60, searchVolume: 7200 },
            ],
        };

        const risingKeywords = risingKeywordsByCategory[category as string] || risingKeywordsByCategory['전자기기'];

        // 연관 검색어
        const relatedKeywords = [
            risingKeywords[0].keyword.split(' ')[0] + ' 추천',
            risingKeywords[0].keyword + ' 가성비',
            risingKeywords[0].keyword + ' 후기',
            '인기 ' + risingKeywords[0].keyword,
            risingKeywords[0].keyword + ' 비교',
        ];

        const data = {
            category: category || '전체',
            period: period || '1년',

            // 기존 차트 데이터
            chartData: {
                labels,
                datasets: [
                    {
                        label: '검색량',
                        data: searchVolume,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    },
                    {
                        label: '경쟁 강도',
                        data: competitionIndex,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    }
                ]
            },

            risingKeywords,

            summary: {
                totalSearchVolume: searchVolume.reduce((a, b) => a + b, 0),
                averageCompetition: Math.floor(competitionIndex.reduce((a, b) => a + b, 0) / competitionIndex.length),
                topKeyword: risingKeywords[0].keyword
            },

            // 새로운 데이터: 시장 인사이트
            marketInsights: {
                growthRate: `+${Math.floor(growthRate * 100 - 100)}%`,
                profitability,
                seasonality,
                targetAge,
                marketSize: baseVolume > 4000 ? '대형' : baseVolume > 2000 ? '중형' : '소형',
                trend: growthRate > 1.15 ? '급성장' : growthRate > 1.05 ? '성장' : '안정',
            },

            // 경쟁 분석
            competitionAnalysis: {
                sellerCount: Math.floor(1000 + Math.random() * 2000),
                avgPrice: Math.floor(20000 + Math.random() * 30000),
                avgRating: (4.0 + Math.random() * 0.9).toFixed(1),
                stockTurnover: baseVolume > 3000 ? '빠름' : '보통',
                entryBarrier: competitionIndex[0] > 80 ? '높음' : competitionIndex[0] > 60 ? '중간' : '낮음',
                saturation: competitionIndex[0] > 85 ? '포화' : competitionIndex[0] > 70 ? '경쟁적' : '여유',
            },

            // 키워드 인사이트
            keywordInsights: {
                relatedKeywords,
                searchIntent: baseVolume > 3000 ? '구매 의도 높음' : '정보 탐색',
                regionalPopularity: {
                    서울: 35,
                    경기: 28,
                    부산: 12,
                    대구: 8,
                    기타: 17,
                },
                ageDistribution: {
                    '10대': 5,
                    '20대': 35,
                    '30대': 30,
                    '40대': 20,
                    '50대+': 10,
                },
            },

            // AI 추천
            recommendations: {
                entryScore: Math.floor(60 + Math.random() * 30),
                riskLevel: competitionIndex[0] > 80 ? '높음' : competitionIndex[0] > 65 ? '중간' : '낮음',
                optimalPrice: `${Math.floor(15000 + Math.random() * 20000).toLocaleString()}-${Math.floor(35000 + Math.random() * 20000).toLocaleString()}원`,
                expectedSales: baseVolume > 4000 ? '월 100-200개' : baseVolume > 2000 ? '월 50-100개' : '월 20-50개',
                bestTiming: seasonality !== '연중' ? seasonality : '즉시 진입 가능',
                suggestion: growthRate > 1.15
                    ? '🔥 급성장 시장! 빠른 진입 추천'
                    : competitionIndex[0] < 70
                        ? '✅ 경쟁 낮음, 진입 적기'
                        : '⚠️ 차별화 전략 필요',
            },
        };

        return ApiResponseUtil.success(res, data);
    }

    // Google Trends API를 사용한 실제 트렌드 데이터
    async getRealTrends(req: Request, res: Response): Promise<any> {
        try {
            const { category } = req.query;

            // 카테고리별 키워드 매핑
            const categoryKeywords: Record<string, string> = {
                '전자기기': '무선 이어폰',
                '패션': '오버핏 후드티',
                '뷰티': '수분 앰플',
                '식품': '건강 간식',
                '생활용품': '친환경 세제',
            };

            const keyword = categoryKeywords[category as string] || '무선 이어폰';

            console.log(`🔍 Fetching Google Trends data for: ${keyword}`);

            // Google Trends에서 데이터 가져오기
            const trendsData = await googleTrendsService.getInterestOverTime(keyword);
            const relatedQueries = await googleTrendsService.getRelatedQueries(keyword);
            const regionData = await googleTrendsService.getInterestByRegion(keyword);

            // 데이터 변환
            const timelineData = trendsData.default?.timelineData || [];
            const labels = timelineData.map((item: any) => {
                const date = new Date(parseInt(item.time) * 1000);
                return `${date.getMonth() + 1}월`;
            });

            const searchVolume = timelineData.map((item: any) => item.value[0]);
            const avgSearchVolume = searchVolume.reduce((a: number, b: number) => a + b, 0) / searchVolume.length;

            // 경쟁 강도는 검색량 기반으로 추정
            const competitionIndex = searchVolume.map((vol: number) => {
                return Math.min(100, Math.floor((vol / Math.max(...searchVolume)) * 100));
            });

            // 급상승 키워드
            const risingKeywords = relatedQueries?.default?.rankedList?.[0]?.rankedKeyword
                ?.slice(0, 5)
                .map((item: any) => ({
                    keyword: item.query,
                    growth: item.value,
                    searchVolume: Math.floor(avgSearchVolume * (item.value / 100)),
                })) || [];

            // 연관 검색어
            const relatedKeywordsList = relatedQueries?.default?.rankedList?.[1]?.rankedKeyword
                ?.slice(0, 5)
                .map((item: any) => item.query) || [];

            // 지역별 데이터
            const regionalData = regionData?.default?.geoMapData || [];
            const regionalPopularity: Record<string, number> = {};
            regionalData.slice(0, 5).forEach((item: any) => {
                regionalPopularity[item.geoName] = item.value[0];
            });

            const data = {
                category: category || '전체',
                period: '1년',
                source: 'Google Trends API',

                chartData: {
                    labels,
                    datasets: [
                        {
                            label: '검색량',
                            data: searchVolume,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        },
                        {
                            label: '경쟁 강도',
                            data: competitionIndex,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        }
                    ]
                },

                risingKeywords,

                summary: {
                    totalSearchVolume: searchVolume.reduce((a: number, b: number) => a + b, 0),
                    averageCompetition: Math.floor(competitionIndex.reduce((a: number, b: number) => a + b, 0) / competitionIndex.length),
                    topKeyword: risingKeywords[0]?.keyword || keyword,
                },

                marketInsights: {
                    growthRate: `+${Math.floor((searchVolume[searchVolume.length - 1] / searchVolume[0] - 1) * 100)}%`,
                    profitability: avgSearchVolume > 50 ? '높음' : '중간',
                    seasonality: '실시간 데이터 기반',
                    targetAge: '전연령',
                    marketSize: avgSearchVolume > 70 ? '대형' : avgSearchVolume > 40 ? '중형' : '소형',
                    trend: searchVolume[searchVolume.length - 1] > searchVolume[0] ? '성장' : '안정',
                },

                competitionAnalysis: {
                    sellerCount: Math.floor(1000 + Math.random() * 2000),
                    avgPrice: Math.floor(20000 + Math.random() * 30000),
                    avgRating: (4.0 + Math.random() * 0.9).toFixed(1),
                    stockTurnover: avgSearchVolume > 50 ? '빠름' : '보통',
                    entryBarrier: competitionIndex[0] > 80 ? '높음' : competitionIndex[0] > 60 ? '중간' : '낮음',
                    saturation: competitionIndex[0] > 85 ? '포화' : competitionIndex[0] > 70 ? '경쟁적' : '여유',
                },

                keywordInsights: {
                    relatedKeywords: relatedKeywordsList,
                    searchIntent: avgSearchVolume > 50 ? '구매 의도 높음' : '정보 탐색',
                    regionalPopularity,
                    ageDistribution: {
                        '10대': 5,
                        '20대': 35,
                        '30대': 30,
                        '40대': 20,
                        '50대+': 10,
                    },
                },

                recommendations: {
                    entryScore: Math.floor(60 + Math.random() * 30),
                    riskLevel: competitionIndex[0] > 80 ? '높음' : competitionIndex[0] > 65 ? '중간' : '낮음',
                    optimalPrice: `${Math.floor(15000 + Math.random() * 20000).toLocaleString()}-${Math.floor(35000 + Math.random() * 20000).toLocaleString()}원`,
                    expectedSales: avgSearchVolume > 70 ? '월 100-200개' : avgSearchVolume > 40 ? '월 50-100개' : '월 20-50개',
                    bestTiming: '즉시 진입 가능',
                    suggestion: searchVolume[searchVolume.length - 1] > searchVolume[0] * 1.2
                        ? '🔥 급성장 시장! 빠른 진입 추천'
                        : competitionIndex[0] < 70
                            ? '✅ 경쟁 낮음, 진입 적기'
                            : '⚠️ 차별화 전략 필요',
                },
            };

            console.log('✅ Google Trends data fetched successfully');
            return ApiResponseUtil.success(res, data);
        } catch (error: any) {
            console.error('❌ Google Trends API Error:', error.message);
            // 에러 발생 시 Mock 데이터로 폴백
            console.log('⚠️ Falling back to Mock data');
            return this.getTrends(req, res);
        }
    }
}

export const trendController = new TrendController();
