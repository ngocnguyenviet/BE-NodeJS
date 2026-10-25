import type { Request, Response } from 'express';
import type { AuthLocals, LoginInput } from '../types/auth.types.js';
import { login, logout } from '../services/auth.service.js';

function parseLoginInput(value: unknown): LoginInput | undefined {
    if (typeof value !== 'object' || value === null) {
        return undefined;
    }
    if (!('username' in value) || !('password' in value)) {
        return undefined;
    }
    if (typeof value.username !== 'string' || typeof value.password !== 'string') {
        return undefined;
    }
    if (value.username.length > 100 || value.username.length < 1) {
        return undefined;
    }
    if (value.password.length > 256 || value.password.length < 1) {
        return undefined;
    }
    return {
        username: value.username,
        password: value.password,
    };
}

export function meController(_req: Request, res: Response<unknown, AuthLocals>): void {
    res.json({
        data: {
            accountId: res.locals.accountId,
        },
    });
}

export function adminCheckController(_req: Request, res: Response<unknown, AuthLocals>): void {
    res.json({
        data: {
            accountId: res.locals.accountId,
            role: res.locals.role,
            message: 'Admin access granted',
        },
    });
}

export function logoutController(_req: Request, res: Response<unknown, AuthLocals>): void {
    const success = logout(res.locals.sessionToken);

    if (!success) {
        res.status(500).json({
            error: {
                code: 'SESSION_CONTEXT_MISSING',
                message: 'Authenticated session is unavailable',
            },
        });
        return;
    }

    res.status(204).end();
}

export async function loginController(req: Request, res: Response): Promise<void> {
    res.set('Cache-Control', 'no-store');

    const rawBody: unknown = req.body;
    const input = parseLoginInput(rawBody);

    if (input === undefined) {
        res.status(400).json({
            error: {
                code: 'INVALID_LOGIN_INPUT',
                message: 'Username and password are required and must be valid string.',
            },
        });
        return;
    }

    try {
        const result = await login(input);
        if (!result.ok) {
            res.status(401).json({
                error: {
                    code: result.code,
                    message: 'Invalid username or password',
                },
            });
            return;
        }
        res.status(200).json({
            data: {
                token: result.data.token,
                tokenType: 'Bearer',
                expiresAt: new Date(result.data.expiresAt).toISOString(),
            },
        });
    } catch {
        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: 'An unexpected error occured.',
            },
        });
    }
}
