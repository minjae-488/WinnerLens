import prisma from '../config/database';
import { AuthUtil } from '../utils/auth';
import { AppError } from '../middleware/errorHandler';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export class AuthService {
    /**
     * 회원가입
     */
    static async register(data: RegisterInput) {
        const { email, password, name } = data;

        // 이메일 중복 확인
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new AppError('Email already exists', 409, 'EMAIL_EXISTS');
        }

        // 비밀번호 해싱
        const hashedPassword = await AuthUtil.hashPassword(password);

        // 사용자 생성
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                subscriptionTier: 'Basic',
                subscriptionStatus: 'trial',
            },
            select: {
                id: true,
                email: true,
                name: true,
                subscriptionTier: true,
                subscriptionStatus: true,
                createdAt: true,
            },
        });

        // JWT 토큰 생성
        const token = AuthUtil.generateToken({
            userId: user.id,
            email: user.email,
            subscriptionTier: user.subscriptionTier,
        });

        return {
            user,
            token,
        };
    }

    /**
     * 로그인
     */
    static async login(data: LoginInput) {
        const { email, password } = data;

        // 사용자 조회
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
        }

        // 비밀번호 검증
        const isPasswordValid = await AuthUtil.comparePassword(password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
        }

        // JWT 토큰 생성
        const token = AuthUtil.generateToken({
            userId: user.id,
            email: user.email,
            subscriptionTier: user.subscriptionTier,
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                subscriptionTier: user.subscriptionTier,
                subscriptionStatus: user.subscriptionStatus,
                createdAt: user.createdAt,
            },
            token,
        };
    }

    /**
     * 현재 사용자 정보 조회
     */
    static async getCurrentUser(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                subscriptionTier: true,
                subscriptionStatus: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new AppError('User not found', 404, 'USER_NOT_FOUND');
        }

        return user;
    }
}
