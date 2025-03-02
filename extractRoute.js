// server/src/routes/endpoints/extractRoute.js
import { Router } from 'express';
import { extractController } from '../../controllers/endpoints/extractController.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.post('/extract', authenticate, extractController.extract);

export default router;
