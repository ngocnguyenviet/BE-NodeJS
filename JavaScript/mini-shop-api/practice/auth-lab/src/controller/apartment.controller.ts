import type { Request, Response } from 'express';
import type { AuthLocals } from '../types/auth.types.js';

import { getApartmentForAccount, listApartmentsForAccount } from '../services/apartment.service.js';

export function getMyApartmentController(req: Request, res: Response<unknown, AuthLocals>): void {
    const apartmentId = req.params.apartmentId;
    const accountId = res.locals.accountId;

    if (typeof apartmentId !== 'string' || !/^apt_[1-9]\d*$/.test(apartmentId)) {
        res.status(400).json({
            error: {
                code: 'INVALID_APARTMENT_ID',
                message: 'Invalid apartment id',
            },
        });
        return;
    }

    const apartment = getApartmentForAccount(accountId, apartmentId);
    if (apartment === undefined) {
        res.status(404).json({
            error: {
                code: 'APARTMENT_NOT_FOUND',
                message: 'Apartment not found',
            },
        });
        return;
    }

    res.status(200).json({
        data: apartment,
    });
    return;
}

function parsePositiveIntegerQuery(
    value: unknown,
    defaultValue: number,
    max: number,
): number | undefined {
    if (value === undefined) {
        return defaultValue;
    }

    if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
        return undefined;
    }

    const number = Number(value);
    if (!Number.isSafeInteger(number) || number > max) {
        return undefined;
    }

    return number;
}

export function listMyApartmentsController(req: Request, res: Response<unknown, AuthLocals>): void {
    const page = parsePositiveIntegerQuery(req.query.page, 1, 1_000_000);
    const pageSize = parsePositiveIntegerQuery(req.query.pageSize, 20, 100);

    if (page === undefined || pageSize === undefined) {
        res.status(400).json({
            error: {
                code: 'INVALID_PAGINATION',
                message: 'Pagination parameters are invalid',
            },
        });
        return;
    }

    const result = listApartmentsForAccount(res.locals.accountId, { page, pageSize });

    res.status(200).json(result);
}
