import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from '../security/password.js';

async function main(): Promise<void> {
    const password = 'Demo-only password 2026!';

    const firstHash = await hashPassword(password);
    const secondHash = await hashPassword(password);

    assert.notEqual(firstHash, secondHash);

    assert.equal(await verifyPassword(password, firstHash), true);

    assert.equal(await verifyPassword(password, secondHash), true);

    assert.equal(await verifyPassword('Wrong password', firstHash), false);

    assert.equal(await verifyPassword(`${password} `, firstHash), false);

    console.log('Password checks passed: 5 assertions');
}

main().catch((error: unknown) => {
    console.error('Password check failed:', error);
    process.exitCode = 1;
});
