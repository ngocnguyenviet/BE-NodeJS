import pg from 'pg';
import { createOrder } from './order.service.mjs';

const pool = new pg.Pool({
    database: 'mini_shop_relations_lab',
    connectionTimeoutMillis: 5000,
});

try {
    const result = await createOrder(pool, {
        customerId: 1,
        addressId: 1,
        items: [
            { productId: 1, quantity: 2 },
            { productId: 2, quantity: 1 },
        ],
    });
    console.log('Order created: ', result);
} catch (error) {
    console.log('Order practice failed: ', error.message);
    process.exitCode = 1;
} finally {
    await pool.end();
}
