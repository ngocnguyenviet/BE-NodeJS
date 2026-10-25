import pg from 'pg';
import { createOrderApp } from './order-app.mjs';

const pool = new pg.Pool({
    database: 'mini_shop_relations_lab',
    connectionTimeoutMillis: 5000,
});

const app = createOrderApp(pool);

app.listen(3001, () => console.log('Order lab listening on http://localhost:3001'));
