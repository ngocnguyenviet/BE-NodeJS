import { hashPassword, verifyPassword } from '../src/policies/password-policy.js';

async function main(): Promise<void> {
    const password = 'Practice-password-2026!';

    const first = await hashPassword(password);
    const second = await hashPassword(password);

    console.log(await verifyPassword(password, first));
    console.log(await verifyPassword('Wrong-password!', first));

    console.log(first.saltHex !== second.saltHex);
    console.log(first.hashHex !== second.hashHex);
}

main().catch(console.error);
