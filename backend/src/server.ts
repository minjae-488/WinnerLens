import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { ApiResponseUtil } from './utils/response';

// Routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import aiRoutes from './routes/ai.routes';
import trendRoutes from './routes/trend.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
        next();
    });
}

// Health check
app.get('/health', async (req: Request, res: Response) => {
    try {
        // 데이터베이스 연결 확인
        await prisma.$queryRaw`SELECT 1`;

        return ApiResponseUtil.success(res, {
            status: 'ok',
            message: 'WinnerLens API is running',
            timestamp: new Date().toISOString(),
            database: 'connected',
        });
    } catch (error) {
        return ApiResponseUtil.error(res, 'Database connection failed', 503);
    }
});

// API routes
app.get('/api/v1', (req: Request, res: Response) => {
    return ApiResponseUtil.success(res, {
        message: 'WinnerLens API v1',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/v1/auth',
            products: '/api/v1/products',
            ai: '/api/v1/ai',
            trends: '/api/v1/trends',
        },
    });
});

// API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/trends', trendRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    return ApiResponseUtil.notFound(res, `Route ${req.method} ${req.path} not found`);
});

// Error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing server gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, closing server gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 ====================================');
    console.log(`🚀 WinnerLens API Server Started`);
    console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`🚀 Health: http://localhost:${PORT}/health`);
    console.log(`🚀 API v1: http://localhost:${PORT}/api/v1`);
    console.log('🚀 ====================================');
});
