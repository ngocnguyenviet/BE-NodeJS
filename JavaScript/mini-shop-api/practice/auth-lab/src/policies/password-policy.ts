import { Buffer } from 'node:buffer';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

export type PasswordRecord = {
    scheme: 'scrypt-v1';
    saltHex: string;
    hashHex: string;
};

function derivePasswordKey(password: string, saltHex: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        scrypt(
            password,
            saltHex,
            64,
            {
                N: 2 ** 17,
                r: 8,
                p: 1,
                maxmem: 256 * 1024 * 1024,
            },
            (error, derivedKey) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(derivedKey);
            },
        );
    });
}

export async function hashPassword(password: string): Promise<PasswordRecord> {
    const saltHex = randomBytes(16).toString('hex');
    const result = await derivePasswordKey(password, saltHex);
    return {
        scheme: 'scrypt-v1',
        saltHex,
        hashHex: result.toString('hex'),
    };
}

export async function verifyPassword(password: string, stored: PasswordRecord): Promise<boolean> {
    const result = await derivePasswordKey(password, stored.saltHex);
    const hashBuffer = Buffer.from(stored.hashHex, 'hex');

    if (result.length !== hashBuffer.length) {
        return false;
    }
    return timingSafeEqual(result, hashBuffer);
}
