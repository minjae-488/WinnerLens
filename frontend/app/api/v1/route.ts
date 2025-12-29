import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    return NextResponse.json({
        success: true,
        data: {
            message: 'WinnerLens API v1',
            version: '1.0.0',
            endpoints: {
                health: '/api/health',
                auth: '/api/v1/auth',
                products: '/api/v1/products',
                ai: '/api/v1/ai',
                trends: '/api/v1/trends',
                sales: '/api/v1/sales',
                sourcing: '/api/v1/sourcing',
            },
        },
    });
}
