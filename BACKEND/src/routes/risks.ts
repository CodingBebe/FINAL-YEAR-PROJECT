import { Router } from 'express';
import { registerRisk, getAllRisks, getRisksForChampion, getRiskById } from '../controllers/riskController';
import authenticate from '../middleware/authenticate';

const router = Router();

router.post('/', registerRisk);
router.get('/', getAllRisks);

// New routes for champion
router.get('/champion', authenticate, getRisksForChampion);
router.get('/:riskId', authenticate, getRiskById);

export default router;
