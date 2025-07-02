"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const submissionController_1 = require("../controllers/submissionController");
const router = express_1.default.Router();
router.post('/', submissionController_1.createSubmission);
router.get('/', submissionController_1.getAllSubmissions);
// Committee Dashboard Analytics Endpoints
router.get('/analytics/severity-distribution', submissionController_1.getSeverityDistribution);
router.get('/analytics/risk-trends', submissionController_1.getRiskTrends);
router.get('/analytics/unit-breakdown', submissionController_1.getUnitRiskBreakdown);
router.get('/analytics/quarterly-breakdown', submissionController_1.getQuarterlyRiskBreakdown);
exports.default = router;
