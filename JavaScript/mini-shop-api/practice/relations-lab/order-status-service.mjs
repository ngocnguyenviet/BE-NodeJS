import { AppError } from '../../src/errors/app-error.mjs';
import { assertOrderStatusTransition } from './order-status-policy.mjs';

export async function updateOrderStatus(pool, orderId, nextStatus) {
    const orders = await pool.query(
        `
            SELECT id, status
            FROM public.orders
            WHERE id = $1
        `,
        [orderId],
    );

    const order = orders.rows[0];
    if (!order) {
        throw new AppError(404, 'ORDER_NOT_FOUND', 'order not found');
    }
    assertOrderStatusTransition(order.status, nextStatus);

    const updateResult = await pool.query(
        `
            UPDATE public.orders
            SET status = $1
            WHERE id = $2 AND status = $3
            RETURNING id, status
        `,
        [nextStatus, orderId, order.status],
    );

    if (updateResult.rowCount === 0) {
        const orders = await pool.query(
            `
                SELECT id FROM public.orders WHERE id = $1
            `,
            [orderId],
        );
        if (!orders.rows[0]) {
            throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
        }
        throw new AppError(
            409,
            'ORDER_STATUS_CONFLICT',
            'Order status change; reload the order and try again',
        );
    }
    return updateResult.rows[0];
}
