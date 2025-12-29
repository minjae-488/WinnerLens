import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../../src/services/auth.service';
import { AuthUtil } from '../../../../../src/utils/auth';

export async function GET(req: NextRequest) {
    try {
        // Authorization 헤더에서 토큰 추출
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

        const user = await AuthService.getCurrentUser(decoded.userId);

        return NextResponse.json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Unauthorized',
        }, { status: 401 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        // Authorization 헤더에서 토큰 추출
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
        const user = await AuthService.updateProfile(decoded.userId, body);

        return NextResponse.json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Update failed',
        }, { status: error.statusCode || 400 });
    }
}
