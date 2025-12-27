import { Request, Response } from 'express';
import { ApiResponseUtil } from '../utils/response';
import { AppError } from '../middleware/errorHandler';

export class TrendController {
    // 트렌드 분석 데이터 가져오기
    async getTrends(req: Request, res: Response) {
        const { category, period } = req.query;

        // 실제 데이터를 외부 API에서 가져오는 대신, 시뮬레이션된 데이터를 반환합니다.
        // 카테고리에 따라 데이터를 다르게 생성하여 현실감을 줍니다.

        const labels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

        // 카테고리별 베이스 데이터 생성
        let baseVolume = 1000;
        let growthRate = 1.1;

        if (category === '패션') {
            baseVolume = 5000;
            growthRate = 1.2; // 계절성, 급성장
        } else if (category === '전자기기') {
            baseVolume = 3000;
            growthRate = 1.05; // 꾸준함
        }

        // 검색량 데이터 생성 (약간의 랜덤성 추가)
        const searchVolume = labels.map((_, index) => {
            const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 ~ 1.2
            return Math.floor(baseVolume * Math.pow(growthRate, index) * randomFactor);
        });

        // 경쟁 강도 데이터 (역상관관계 시뮬레이션)
        const competitionIndex = labels.map(() => Math.floor(Math.random() * 40) + 60); // 60 ~ 100

        // 급상승 키워드
        const risingKeywords = [
            { keyword: '초경량 무선 선풍기', growth: 150 },
            { keyword: '방수 블루투스 스피커', growth: 85 },
            { keyword: '휴대용 보조배터리', growth: 45 },
            { keyword: '캠핑용 미니 빔프로젝터', growth: 30 },
            { keyword: '스마트워치 스트랩', growth: 25 },
        ];

        const data = {
            category: category || '전체',
            period: period || '1년',
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
            }
        };

        return ApiResponseUtil.success(res, data);
    }
}

export const trendController = new TrendController();
