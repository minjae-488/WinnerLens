import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthUtil {
    /**
     * 비밀번호 해싱
     */
    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS);
    }

    /**
     * 비밀번호 검증
     */
    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    /**
     * JWT 토큰 생성
     */
    static generateToken(payload: JwtPayload): string {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        } as jwt.SignOptions);
    }

    /**
     * JWT 토큰 검증
     */
    static verifyToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, JWT_SECRET) as JwtPayload;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    /**
     * Authorization 헤더에서 토큰 추출
     */
    static extractTokenFromHeader(authHeader?: string): string | null {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }
}
