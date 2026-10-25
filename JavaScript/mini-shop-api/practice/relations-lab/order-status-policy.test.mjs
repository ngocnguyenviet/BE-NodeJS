import test from 'node:test';
import assert from 'node:assert/strict';
import { canTransition, assertOrderStatusTransition } from './order-status-policy.mjs';

test('allows pending to confirmed', () => {
    const actual = canTransition('pending', 'confirmed');
    assert.equal(actual, true);
});

test('rejects pending to completed', () => {
    const actual = canTransition('pending', 'completed');
    assert.equal(actual, false);
});

test('rejects an unknown order status', () => {
    assert.throws(() => assertOrderStatusTransition('pending', 'done'), {
        statusCode: 400,
        code: 'INVALID_ORDER_STATUS',
    });
});

test('rejects pending to completed with a conflict', () => {
    assert.throws(() => assertOrderStatusTransition('pending', 'completed'), {
        statusCode: 409,
        code: 'INVALID_ORDER_STATUS_TRANSITION',
    });
});

const allowedCases = [
    { from: 'pending', to: 'confirmed' },
    { from: 'pending', to: 'cancelled' },
    { from: 'confirmed', to: 'shipping' },
    { from: 'confirmed', to: 'cancelled' },
    { from: 'shipping', to: 'completed' },
];

for (const testCase of allowedCases) {
    test(`accepts ${testCase.from} to ${testCase.to}`, () => {
        assertOrderStatusTransition(testCase.from, testCase.to);
    });
}

const blockedCases = [
    { from: 'pending', to: 'pending' },
    { from: 'confirmed', to: 'pending' },
    { from: 'pending', to: 'shipping' },
    { from: 'completed', to: 'pending' },
    { from: 'cancelled', to: 'confirmed' },
];

for (const testCase of blockedCases) {
    test(`rejects ${testCase.from} to ${testCase.to} with a conflict`, () => {
        assert.throws(() => assertOrderStatusTransition(testCase.from, testCase.to), {
            statusCode: 409,
            code: 'INVALID_ORDER_STATUS_TRANSITION',
        });
    });
}
