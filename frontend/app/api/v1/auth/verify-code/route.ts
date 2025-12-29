import { NextRequest, NextResponse } from 'next/server';

// 간단한 인메모리 저장소 (verify-send와 공유)
const verificationCodes = new Map<string, { code: string; expires: number }>();

export async function POST(req: NextRequest) {
    try {
        const { email, code } = await req.json();

        const record = verificationCodes.get(email);

        if (!record) {
            return NextResponse.json({
                success: false,
                error: 'Verification code not found or expired',
            }, { status: 400 });
        }

        if (record.expires < Date.now()) {
            verificationCodes.delete(email);
            return NextResponse.json({
                success: false,
                error: 'Verification code expired',
            }, { status: 400 });
        }

        if (record.code !== code) {
            return NextResponse.json({
                success: false,
                error: 'Invalid verification code',
            }, { status: 400 });
        }

        // 인증 성공 후 코드 삭제
        verificationCodes.delete(email);

        return NextResponse.json({
            success: true,
            data: { verified: true }
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Verification failed',
        }, { status: 500 });
    }
}
