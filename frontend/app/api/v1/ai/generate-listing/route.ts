import { NextRequest, NextResponse } from 'next/server';
import { AiService } from '../../../../../src/services/ai.service';
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
        const decoded = AuthUtil.verifyToken(token);

        if (!decoded || !decoded.userId) {
            return NextResponse.json({
                success: false,
                error: 'Invalid token',
            }, { status: 401 });
        }

        const body = await req.json();
        const result = await AiService.generateListing(body);

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to generate listing',
        }, { status: 500 });
    }
}
