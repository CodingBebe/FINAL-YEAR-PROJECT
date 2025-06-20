"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const riskController_1 = require("../controllers/riskController");
const router = (0, express_1.Router)();
router.post('/', riskController_1.registerRisk);
exports.default = router;
