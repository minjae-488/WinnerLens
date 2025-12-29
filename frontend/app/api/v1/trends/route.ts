import { NextRequest, NextResponse } from 'next/server';
import { trendController } from '../../../../src/controllers/trend.controller';

export async function GET(req: NextRequest) {
    try {
        // Query parameters 추출
        const searchParams = req.nextUrl.searchParams;
        const category = searchParams.get('category');
        const period = searchParams.get('period');

        // Mock Request/Response 객체 생성 (Express 호환)
        const mockReq: any = {
            query: {
                category,
                period,
            },
        };

        let responseData: any = null;
        const mockRes: any = {
            status: (code: number) => mockRes,
            json: (data: any) => {
                responseData = data;
                return mockRes;
            },
        };

        // 기존 컨트롤러 호출
        await trendController.getTrends(mockReq, mockRes);

        if (responseData) {
            return NextResponse.json(responseData);
        }

        return NextResponse.json({
            success: false,
            error: 'Failed to fetch trends',
        }, { status: 500 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch trends',
        }, { status: 500 });
    }
}
