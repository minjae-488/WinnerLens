import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../../src/services/auth.service';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await AuthService.register(body);

        return NextResponse.json({
            success: true,
            data: result,
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Registration failed',
        }, { status: error.statusCode || 400 });
    }
}
