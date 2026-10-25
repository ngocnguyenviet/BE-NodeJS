import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createOrderApp } from './order-app.mjs';

test('rejects an invalid order ID without querying the database', async (t) => {
    let queryCount = 0;
    const fakePool = {
        async query() {
            queryCount += 1;
            throw new Error('Unexpected query');
        },
    };
    const app = createOrderApp(fakePool);
    const server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');

    t.after(
        () =>
            new Promise((resolve, reject) => {
                server.close((error) => {
                    if (error) return reject(error);
                    resolve();
                });
            }),
    );

    const port = server.address().port;

    const response = await fetch(`http://127.0.0.1:${port}/orders/abc`);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.deepEqual(body, {
        code: 'INVALID_ORDER_ID',
        error: 'Order ID is invalid',
    });
    assert.equal(queryCount, 0);
});
