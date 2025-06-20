import { Router } from 'express';
import { registerRisk } from '../controllers/riskController';

const router = Router();

router.post('/', registerRisk);

export default router;
