const update = {
    orderId: 21,
    status: 'confirmed',
};
function parseOrderStatus(value) {
    if (value === 'pending' ||
        value === 'confirmed' ||
        value === 'shipping' ||
        value === 'completed' ||
        value === 'cancelled') {
        return value;
    }
    return undefined;
}
async function loadUpdatedOrder() {
    return {
        id: 21,
        status: 'confirmed',
    };
}
async function formatLoadedOrder() {
    const order = await loadUpdatedOrder();
    return `Order ${order.id} -> ${order.status}`;
}
function parseStatusFromObject(value) {
    if (typeof value !== 'object' || value === null) {
        return undefined;
    }
    if (!('status' in value)) {
        return undefined;
    }
    return parseOrderStatus(value.status);
}
function parseOrderStatusUpdate(value) {
    if (typeof value !== 'object' || value === null) {
        return {
            ok: false,
            error: {
                code: 'INVALID_INPUT',
                message: 'Input must be an object',
            },
        };
    }
    if (!('orderId' in value) || !('status' in value)) {
        return {
            ok: false,
            error: {
                code: 'INVALID_INPUT',
                message: 'Input must contain orderId and status',
            },
        };
    }
    if (typeof value.orderId !== 'number' ||
        !Number.isSafeInteger(value.orderId) ||
        value.orderId <= 0) {
        return {
            ok: false,
            error: {
                code: 'INVALID_ORDER_ID',
                message: 'Input must be a positive integer',
            },
        };
    }
    const status = parseOrderStatus(value.status);
    if (status === undefined) {
        return {
            ok: false,
            error: {
                code: 'INVALID_ORDER_STATUS',
                message: 'Order status is invalid',
            },
        };
    }
    return {
        ok: true,
        data: {
            orderId: value.orderId,
            status,
        },
    };
}
const parsed = parseOrderStatus('banana');
if (parsed !== undefined) {
    console.log(parsed.toUpperCase());
}
async function main() {
    const result1 = parseOrderStatusUpdate({
        orderId: 21,
        status: 'confirmed',
    });
    if (result1.ok) {
        console.log(result1.data.orderId);
        console.log(result1.data.status);
    }
    else {
        console.log(result1.error.code);
        console.log(result1.error.message);
    }
    const result2 = parseOrderStatusUpdate({
        orderId: 22,
        status: 'banana',
    });
    if (result2.ok) {
        console.log(result2.data.orderId);
        console.log(result2.data.status);
    }
    else {
        console.log(result2.error.code);
        console.log(result2.error.message);
    }
    const result = {
        ok: true,
        data: 21,
    };
    if (result.ok) {
        console.log(result.data.toFixed(0));
    }
}
main().catch(console.error);
export {};
