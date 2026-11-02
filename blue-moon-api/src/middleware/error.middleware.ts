import type { ErrorRequestHandler } from 'express';
import { OwnershipError, type OwnershipErrorCode } from '../errors/ownership.error.js';

const ownershipErrorStatus: Record<OwnershipErrorCode, number> = {
    INVALID_TRANSFER_REASON: 400,
    APARTMENT_NOT_FOUND: 404,
    ACTOR_FORBIDDEN: 403,
    NEW_OWNER_INVALID: 400,
    OWNERSHIP_CONFLICT: 409,
    SAME_OWNER: 409,
    INVALID_TRANSFER_TIME: 400,
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
    if (res.headersSent) {
        next(error);
        return;
    }

    if (error instanceof OwnershipError) {
        const status = ownershipErrorStatus[error.code];

        res.status(status).json({
            error: {
                code: error.code,
                message: error.message,
            },
        });

        return;
    }
    console.error('Unhandled request error:', error);

    res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
        },
    });
};
