import { AppError } from '../../src/errors/app-error.mjs';

export async function getOrderById(pool, orderId) {
    const orderResult = await pool.query(
        `
        SELECT id, customer_id, recipient_name, shipping_address, status
        FROM public.orders
        WHERE id = $1
        `,
        [orderId],
    );

    const order = orderResult.rows[0];
    if (!order) {
        throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
    }

    const itemResult = await pool.query(
        `
            SELECT id, product_id, product_name, quantity, unit_price
            FROM public.order_items
            WHERE order_id = $1
            ORDER BY id
        `,
        [orderId],
    );

    let totalAmount = 0;
    for (const item of itemResult.rows) {
        totalAmount += item.unit_price * item.quantity;
    }

    return {
        order,
        items: itemResult.rows,
        totalAmount,
    };
}
