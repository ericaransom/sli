// server/src/routes/endpoints/pdnsRoute.js
import { Router } from 'express';
import { pdnsController } from '../../controllers/endpoints/pdnsController.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/pdns/:ipOrHost?/_:function?', authenticate, pdnsController.getPDNS);

export default router;