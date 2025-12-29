import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '../../../../src/services/product.service';
import { AuthUtil } from '../../../../src/utils/auth';

export async function GET(req: NextRequest) {
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

        // Query parameters
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category = searchParams.get('category') || undefined;
        const minScore = searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!) : undefined;
        const sortBy = (searchParams.get('sortBy') || 'createdAt') as 'createdAt' | 'updatedAt' | 'price' | 'totalScore';
        const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

        const result = await ProductService.getProducts(decoded.userId, {
            page,
            limit,
            category,
            sortBy,
            sortOrder,
        });

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch products',
        }, { status: 500 });
    }
}

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
        const product = await ProductService.createProduct(decoded.userId, body);

        return NextResponse.json({
            success: true,
            data: product,
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to create product',
        }, { status: 400 });
    }
}
