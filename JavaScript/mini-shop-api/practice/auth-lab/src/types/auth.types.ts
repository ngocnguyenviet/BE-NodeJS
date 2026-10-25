import type { PasswordRecord } from '../policies/password-policy.js';

export type Role =
    | 'ADMIN'
    | 'HOMEOWNER'
    | 'HR_MANAGER'
    | 'BUSINESS_OPERATOR'
    | 'TECHNICIAN'
    | 'SECURITY';

export type AccountStatus = 'active' | 'locked';

export type AccountRecord = {
    id: string;
    username: string;
    passwordRecord: PasswordRecord;
    status: AccountStatus;
    role: Role;
};

export type LoginInput = {
    username: string;
    password: string;
};

export type AuthLocals = {
    accountId: string;
    sessionToken: string;
    role: Role;
};

export type LoginResult =
    | {
          ok: true;
          data: {
              token: string;
              expiresAt: number;
          };
      }
    | {
          ok: false;
          code: 'INVALID_CREDENTIALS';
      };
