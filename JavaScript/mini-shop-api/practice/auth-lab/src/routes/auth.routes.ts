import { Router } from 'express';
import { requireSession, requireRole } from '../middleware/auth.middleware.js';

import {
    meController,
    adminCheckController,
    loginController,
    logoutController,
} from '../controller/auth.controller.js';
import {
    getMyApartmentController,
    listMyApartmentsController,
} from '../controller/apartment.controller.js';

export const authRouter = Router();

authRouter.get('/me', requireSession, meController);
authRouter.get('/demo/admin/check', requireSession, requireRole('ADMIN'), adminCheckController);
authRouter.get(
    '/me/apartments/:apartmentId',
    requireSession,
    requireRole('HOMEOWNER'),
    getMyApartmentController,
);
authRouter.get(
    '/me/apartments',
    requireSession,
    requireRole('HOMEOWNER'),
    listMyApartmentsController,
);

authRouter.post('/auth/login', loginController);
authRouter.post('/auth/logout', requireSession, logoutController);
