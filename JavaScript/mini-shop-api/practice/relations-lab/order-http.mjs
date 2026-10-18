import express from 'express';
import pg from 'pg';
import { createOrder } from './order.service.mjs';
import { AppError } from '../../src/errors/app-error.mjs';

const app = express();

const pool = new pg.Pool({
    database: 'mini_shop_relations_lab',
    connectionTimeoutMillis: 5000,
});

app.use(express.json({ limit: '10kb' }));

async function receiveOrderHandle(req, res) {
    const input = req.body;
    const result = await createOrder(pool, input);
    return res.status(201).json(result);
}

app.post('/orders', receiveOrderHandle);

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({
            code: 'INVALID_JSON',
            error: 'Request body must be valid JSON',
        });
    }

    if (error.type === 'entity.too.large') {
        return res.status(413).json({
            code: 'BODY_TOO_LARGE',
            error: 'Request body must not exceed 10KB',
        });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            code: error.code,
            error: error.message,
        });
    }

    console.error('Order request failed: ', error);

    return res.status(500).json({
        code: 'INTERNAL_ERROR',
        error: 'Internal server error',
    });
});

app.listen(3001, () => console.log('Order lab listening on http://localhost:3001'));
