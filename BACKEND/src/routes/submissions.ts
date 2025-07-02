import express from 'express';
import { createSubmission, getAllSubmissions, getSeverityDistribution, getRiskTrends, getUnitRiskBreakdown, getQuarterlyRiskBreakdown } from '../controllers/submissionController';

const router = express.Router();

router.post('/', createSubmission);
router.get('/', getAllSubmissions);

// Committee Dashboard Analytics Endpoints
router.get('/analytics/severity-distribution', getSeverityDistribution);
router.get('/analytics/risk-trends', getRiskTrends);
router.get('/analytics/unit-breakdown', getUnitRiskBreakdown);
router.get('/analytics/quarterly-breakdown', getQuarterlyRiskBreakdown);

export default router; 