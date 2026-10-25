import express from 'express';
import { createOrder } from './order.service.mjs';
import { AppError } from '../../src/errors/app-error.mjs';
import { getOrderById } from './order-read.service.mjs';
import { updateOrderStatus } from './order-status-service.mjs';

const MAX_POSTGRE_INTEGER = 2147483647;

export function createOrderApp(pool) {
    const app = express();
    app.use(express.json({ limit: '10kb' }));

    async function receiveOrderHandle(req, res) {
        const input = req.body;
        const result = await createOrder(pool, input);
        return res.status(201).json(result);
    }

    async function readOrderHandle(req, res) {
        const orderId = Number(req.params.id);

        if (!Number.isSafeInteger(orderId) || orderId <= 0 || orderId > MAX_POSTGRE_INTEGER) {
            throw new AppError(400, 'INVALID_ORDER_ID', 'Order ID is invalid');
        }

        const order = await getOrderById(pool, orderId);
        return res.status(200).json(order);
    }

    async function changeOrderStatusHandle(req, res) {
        const orderId = Number(req.params.id);
        if (!Number.isSafeInteger(orderId) || orderId <= 0 || orderId > MAX_POSTGRE_INTEGER) {
            throw new AppError(400, 'INVALID_ORDER_ID', 'Order ID is invalid');
        }

        const input = req.body;
        if (typeof input !== 'object' || input === null || Array.isArray(input)) {
            throw new AppError(400, 'INVALID_ORDER_BODY', 'Order body must be an object');
        }

        const result = await updateOrderStatus(pool, orderId, input.status);
        return res.status(200).json(result);
    }

    app.post('/orders', receiveOrderHandle);
    app.get('/orders/:id', readOrderHandle);
    app.patch('/orders/:id/status', changeOrderStatusHandle);

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

    return app;
}
