import { apartments } from '../stores/apartment.store.js';
import type {
    ApartmentListQuery,
    ApartmentListResult,
    ApartmentView,
} from '../types/apartment.types.js';

export function getApartmentForAccount(
    accountId: string,
    apartmentId: string,
): ApartmentView | undefined {
    const apartment = apartments.get(apartmentId);
    if (!apartment) {
        return undefined;
    }

    if (apartment.ownerAccountId !== accountId) {
        return undefined;
    }

    return {
        id: apartment.id,
        code: apartment.code,
    };
}

export function listApartmentsForAccount(
    accountId: string,
    query: ApartmentListQuery,
): ApartmentListResult {
    const ownedApartments = [...apartments.values()].filter(
        (apartment) => apartment.ownerAccountId === accountId,
    );

    ownedApartments.sort((left, right) => left.id.localeCompare(right.id));

    const total = ownedApartments.length;
    const offset = (query.page - 1) * query.pageSize;
    const totalPages = Math.ceil(total / query.pageSize);
    const pageApartments = ownedApartments.slice(offset, offset + query.pageSize);
    const data = pageApartments.map((apartment) => {
        return {
            id: apartment.id,
            code: apartment.code,
        };
    });
    return {
        data,
        meta: {
            page: query.page,
            pageSize: query.pageSize,
            total,
            totalPages,
        },
    };
}
