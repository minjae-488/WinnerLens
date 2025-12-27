import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'WinnerLens API is running' });
});

// API routes
app.get('/api/v1', (req: Request, res: Response) => {
    res.json({
        message: 'WinnerLens API v1',
        endpoints: {
            health: '/health',
            auth: '/api/v1/auth',
            products: '/api/v1/products',
            trends: '/api/v1/trends',
        },
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
