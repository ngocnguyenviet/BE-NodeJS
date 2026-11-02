export type OwnershipErrorCode =
    | 'INVALID_TRANSFER_REASON'
    | 'APARTMENT_NOT_FOUND'
    | 'ACTOR_FORBIDDEN'
    | 'NEW_OWNER_INVALID'
    | 'OWNERSHIP_CONFLICT'
    | 'SAME_OWNER'
    | 'INVALID_TRANSFER_TIME';

export class OwnershipError extends Error {
    readonly code: OwnershipErrorCode;

    constructor(code: OwnershipErrorCode, message: string) {
        super(message);

        this.name = 'OwnershipError';
        this.code = code;
    }
}
