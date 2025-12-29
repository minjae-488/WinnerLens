import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../../src/services/auth.service';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await AuthService.login(body);

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Login failed',
        }, { status: error.statusCode || 401 });
    }
}
