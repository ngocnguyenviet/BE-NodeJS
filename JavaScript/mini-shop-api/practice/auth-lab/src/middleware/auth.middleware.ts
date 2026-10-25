import type { NextFunction, Request, Response } from 'express';
import type { AuthLocals, Role } from '../types/auth.types.js';
import { checkSession } from '../policies/session-policy.js';
import { sessions, findAccountById } from '../stores/auth.store.js';

export function requireSession(
    req: Request,
    res: Response<unknown, AuthLocals>,
    next: NextFunction,
): void {
    const authorization = req.get('Authorization');
    const match = authorization?.match(/^Bearer +(\S+)$/i);
    const token = match?.[1];

    if (token === undefined) {
        res.set('WWW-Authenticate', 'Bearer');
        res.status(401).json({
            error: {
                code: 'AUTHENTICATION_REQUIRED',
                message: 'A Bearer token is required',
            },
        });
        return;
    }

    const session = sessions.get(token);
    const result = checkSession(session, Date.now());

    if (!result.ok) {
        res.set('WWW-Authenticate', 'Bearer error="invalid_token"');
        res.status(401).json({
            error: {
                code: result.code,
                message: 'Session is not valid',
            },
        });
        return;
    }

    const account = findAccountById(result.accountId);
    if (account === undefined) {
        res.set('WWW-Authenticate', 'Bearer error="invalid_token"');
        res.status(401).json({
            error: {
                code: 'ACCOUNT_UNAVAILABLE',
                message: 'Account is unavailable',
            },
        });
        return;
    }

    if (account.status === 'locked') {
        res.status(403).json({
            error: {
                code: 'ACCOUNT_LOCKED',
                message: 'Account is locked',
            },
        });
        return;
    }

    res.locals.accountId = result.accountId;
    res.locals.sessionToken = token;
    res.locals.role = account.role;
    next();
}

export function requireRole(...allowedRoles: Role[]) {
    return (_req: Request, res: Response<unknown, AuthLocals>, next: NextFunction): void => {
        if (!allowedRoles.includes(res.locals.role)) {
            res.status(403).json({
                error: {
                    code: 'ROLE_FORBIDDEN',
                    message: 'Your role cannot access this endpoint',
                },
            });
            return;
        }
        next();
    };
}
