export type SessionRecord = {
    accountId: string;
    expiresAt: number;
    revokedAt: number | null;
};

export type SessionCheckResult =
    | {
          ok: true;
          accountId: string;
      }
    | {
          ok: false;
          code: 'SESSION_NOT_FOUND' | 'SESSION_REVOKED' | 'SESSION_EXPIRED';
      };

export function checkSession(session: SessionRecord | undefined, now: number): SessionCheckResult {
    if (session === undefined) {
        return {
            ok: false,
            code: 'SESSION_NOT_FOUND',
        };
    }

    if (session.revokedAt !== null) {
        return {
            ok: false,
            code: 'SESSION_REVOKED',
        };
    }

    if (session.expiresAt <= now) {
        return {
            ok: false,
            code: 'SESSION_EXPIRED',
        };
    }

    return {
        ok: true,
        accountId: session.accountId,
    };
}
