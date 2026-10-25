import test from 'node:test';
import assert from 'node:assert/strict';
import { updateOrderStatus } from './order-status-service.mjs';

test('rejects when the order does not exist', async () => {
    let queryCount = 0;

    const fakePool = {
        async query() {
            queryCount += 1;
            return { rows: [] };
        },
    };

    await assert.rejects(() => updateOrderStatus(fakePool, 999, 'confirmed'), {
        statusCode: 404,
        code: 'ORDER_NOT_FOUND',
    });

    assert.equal(queryCount, 1);
});

test('rejects a blocked transition before updating', async () => {
    let queryCount = 0;
    const fakePool = {
        async query() {
            queryCount += 1;
            return { rows: [{ id: 123, status: 'pending' }] };
        },
    };

    await assert.rejects(() => updateOrderStatus(fakePool, 123, 'pending'), {
        statusCode: 409,
        code: 'INVALID_ORDER_STATUS_TRANSITION',
    });

    assert.equal(queryCount, 1);
});

test('updates an order from pending to confirmed', async () => {
    let queryCount = 0;
    const fakePool = {
        async query() {
            queryCount += 1;
            if (queryCount == 1) {
                return { rows: [{ id: 123, status: 'pending' }] };
            } else if (queryCount == 2) {
                return {
                    rowCount: 1,
                    rows: [
                        {
                            id: 123,
                            status: 'confirmed',
                        },
                    ],
                };
            }
        },
    };

    const actual = await updateOrderStatus(fakePool, 123, 'confirmed');

    assert.deepEqual(actual, {
        id: 123,
        status: 'confirmed',
    });

    assert.equal(queryCount, 2);
});

test('rejects with a conflict when the order still exists', async () => {
    let queryCount = 0;
    const fakePool = {
        async query() {
            queryCount += 1;
            if (queryCount === 1) {
                return { rows: [{ id: 123, status: 'pending' }] };
            } else if (queryCount === 2) {
                return { rowCount: 0, rows: [] };
            } else if (queryCount === 3) {
                return { rows: [{ id: 123 }] };
            }
        },
    };

    await assert.rejects(() => updateOrderStatus(fakePool, 123, 'confirmed'), {
        statusCode: 409,
        code: 'ORDER_STATUS_CONFLICT',
    });

    assert.equal(queryCount, 3);
});

test('rejects when the order is missing on recheck', async () => {
    let queryCount = 0;
    const fakePool = {
        async query() {
            queryCount += 1;
            if (queryCount === 1) {
                return { rows: [{ id: 123, status: 'pending' }] };
            } else if (queryCount === 2) {
                return { rowCount: 0, rows: [] };
            } else if (queryCount === 3) {
                return { rows: [] };
            }
        },
    };

    await assert.rejects(() => updateOrderStatus(fakePool, 123, 'confirmed'), {
        statusCode: 404,
        code: 'ORDER_NOT_FOUND',
    });

    assert.equal(queryCount, 3);
});
