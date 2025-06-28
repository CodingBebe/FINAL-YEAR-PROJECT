import { Router } from 'express';
import { registerRisk, getAllRisks } from '../controllers/riskController';

const router = Router();

router.post('/', registerRisk);
router.get('/', getAllRisks);

export default router;
