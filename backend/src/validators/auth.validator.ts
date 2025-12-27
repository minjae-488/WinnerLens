import { z } from 'zod';

// 회원가입 스키마
export const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

// 로그인 스키마
export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

// 타입 추출
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
