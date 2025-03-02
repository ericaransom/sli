// server/src/routes/endpoints/shodanRoute.js
import { Router } from 'express';
import { shodanController } from '../../controllers/endpoints/shodanController.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/shodan/:ip?', authenticate, shodanController.getShodan);

export default router;