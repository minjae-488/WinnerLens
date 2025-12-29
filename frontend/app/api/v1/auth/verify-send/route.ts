import { NextRequest, NextResponse } from 'next/server';

// 간단한 인메모리 저장소 (개발/데모용)
const verificationCodes = new Map<string, { code: string; expires: number }>();

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({
                success: false,
                error: 'Email is required',
            }, { status: 400 });
        }

        // 6자리 코드 생성
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // 5분 유효
        verificationCodes.set(email, {
            code,
            expires: Date.now() + 5 * 60 * 1000
        });

        // 실제 메일 발송 대신 콘솔 출력
        console.log(`📧 [Email Verification] Code for ${email}: ${code}`);

        return NextResponse.json({
            success: true,
            data: {
                message: 'Verification code sent (Check server console)',
                code // 개발 편의를 위해 응답에도 포함
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to send verification code',
        }, { status: 500 });
    }
}

// Export for use in verify-code route
export { verificationCodes };
