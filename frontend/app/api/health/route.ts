import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../src/config/database';

export async function GET(req: NextRequest) {
    try {
        // 데이터베이스 연결 확인
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json({
            success: true,
            data: {
                status: 'ok',
                message: 'WinnerLens API is running',
                timestamp: new Date().toISOString(),
                database: 'connected',
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: 'Database connection failed',
            },
            { status: 503 }
        );
    }
}
