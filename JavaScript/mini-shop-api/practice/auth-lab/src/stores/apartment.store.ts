import type { ApartmentRecord } from '../types/apartment.types.js';

export const apartments = new Map<string, ApartmentRecord>([
    [
        'apt_101',
        {
            id: 'apt_101',
            code: 'A101',
            ownerAccountId: 'account_a',
        },
    ],
    [
        'apt_102',
        {
            id: 'apt_102',
            code: 'A102',
            ownerAccountId: 'account_a',
        },
    ],
    [
        'apt_201',
        {
            id: 'apt_201',
            code: 'A201',
            ownerAccountId: 'account_b',
        },
    ],
]);
