"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const riskController_1 = require("../controllers/riskController");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const router = (0, express_1.Router)();
router.post('/', riskController_1.registerRisk);
router.get('/', riskController_1.getAllRisks);
// New routes for champion
router.get('/champion', authenticate_1.default, riskController_1.getRisksForChampion);
router.get('/:id', authenticate_1.default, riskController_1.getRiskById);
exports.default = router;
