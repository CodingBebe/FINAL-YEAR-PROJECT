"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRisks = exports.registerRisk = void 0;
const Risk_1 = require("../models/Risk");
const registerRisk = async (req, res) => {
    console.log("Incoming Risk Data:", req.body);
    try {
        const { strategicObjective, title, riskId, description, principalOwner, supportingOwners, category, likelihood, impact, causes, consequences, existingControls, proposedMitigation, } = req.body;
        if (!strategicObjective || !/^[A-Ga-g]$/.test(strategicObjective)) {
            res.status(400).json({
                success: false,
                message: 'Invalid or missing strategic objective. Must be a letter A-G.',
            });
            return;
        }
        const prefix = strategicObjective.toUpperCase();
        const existingCount = await Risk_1.RiskModel.countDocuments({ id: { $regex: `^${prefix}` } });
        const generatedId = `${prefix}${existingCount + 1}`;
        const newRisk = await Risk_1.RiskModel.create({
            id: generatedId,
            strategicObjective: prefix,
            title,
            riskId,
            description,
            principalOwner,
            supportingOwners,
            category,
            likelihood,
            impact,
            causes,
            consequences,
            existingControls,
            proposedMitigation,
        });
        res.status(201).json({ success: true, data: newRisk });
    }
    catch (err) {
        console.error('Error creating risk:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.registerRisk = registerRisk;
const getAllRisks = async (req, res) => {
    try {
        const risks = await Risk_1.RiskModel.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: risks });
    }
    catch (err) {
        console.error('Error fetching risks:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getAllRisks = getAllRisks;
