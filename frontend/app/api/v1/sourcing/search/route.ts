import { NextRequest, NextResponse } from 'next/server';
import { SourcingService } from '../../../../../src/services/sourcing.service';
import { AuthUtil } from '../../../../../src/utils/auth';

export async function POST(req: NextRequest) {
    try {
        // 인증 확인
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({
                success: false,
                error: 'No token provided',
            }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        if (!decoded || !decoded.userId) {
            return NextResponse.json({
                success: false,
                error: 'Invalid token',
            }, { status: 401 });
        }

        const body = await req.json();
        const { keyword } = body;

        if (!keyword) {
            return NextResponse.json({
                success: false,
                error: 'Keyword is required',
            }, { status: 400 });
        }

        const result = await SourcingService.searchWholesaleProducts(keyword);

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to search wholesale products',
        }, { status: 500 });
    }
}
