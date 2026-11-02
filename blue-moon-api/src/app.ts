import express from 'express';
import { healthRouter } from './routes/health.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

export const app = express();

app.use(healthRouter);

app.use((_req, res) => {
    res.status(404).json({
        error: {
            code: 'ROUTE_NOT_FOUND',
            message: 'Route not found',
        },
    });
});

app.use(errorHandler);
