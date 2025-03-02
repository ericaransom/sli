// server/src/routes/endpoints/geoRoute.js
import { Router } from 'express';
import { geoController } from '../../controllers/endpoints/geoController.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/geo/:ip?', authenticate, geoController.getGeoIP);

export default router;