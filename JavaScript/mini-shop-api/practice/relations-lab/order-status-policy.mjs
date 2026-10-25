import { AppError } from '../../src/errors/app-error.mjs';

const transitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['shipping', 'cancelled'],
    shipping: ['completed'],
    completed: [],
    cancelled: [],
};

export function canTransition(currentStatus, nextStatus) {
    const allowedNextStatuses = transitions[currentStatus];

    if (!Array.isArray(allowedNextStatuses)) {
        return false;
    }
    return allowedNextStatuses.includes(nextStatus);
}

export function assertOrderStatusTransition(currentStatus, nextStatus) {
    const validStatuses = Object.keys(transitions);

    if (!validStatuses.includes(nextStatus)) {
        throw new AppError(400, 'INVALID_ORDER_STATUS', 'Order status is invalid');
    }

    if (!canTransition(currentStatus, nextStatus)) {
        throw new AppError(
            409,
            'INVALID_ORDER_STATUS_TRANSITION',
            `Cannot change order status from ${currentStatus} to ${nextStatus}`,
        );
    }
}
