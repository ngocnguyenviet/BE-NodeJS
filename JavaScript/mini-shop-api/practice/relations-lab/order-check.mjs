import pg from 'pg';

const pool = new pg.Pool({
    database: 'mini_shop_relations_lab',
    connectionTimeoutMillis: 5000,
});

const orderId = 21;

try {
    const orderResult = await pool.query(
        `
        SELECT id, customer_id, recipient_name, shipping_address, status
        FROM public.orders
        WHERE id = $1
        `,
        [orderId],
    );
    console.log('Saved order: ');
    console.table(orderResult.rows);

    const itemResult = await pool.query(
        `
            SELECT id, order_id, product_id, product_name, quantity, unit_price,
                quantity * unit_price AS line_total
            FROM public.order_items
            WHERE order_id = $1
            ORDER BY id
        `,
        [orderId],
    );
    console.log('Saved order items: ');
    console.table(itemResult.rows);

    let totalAmount = 0;
    for (const item of itemResult.rows) {
        totalAmount += item.line_total;
    }
    console.log('Order total: ', totalAmount);
} catch (error) {
    console.log('Order verification failed: ', error.message);
    process.exitCode = 1;
} finally {
    await pool.end();
}
