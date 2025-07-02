"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRiskById = exports.getRisksForChampion = exports.getAllRisks = exports.registerRisk = void 0;
const Risk_1 = require("../models/Risk");
const registerRisk = async (req, res) => {
    console.log("Incoming Risk Data:", req.body);
    try {
        const { strategicObjective, title, riskId, description, principalOwner, supportingOwners, category, likelihood, impact, causes, consequences, existingControls, proposedMitigation, targets, } = req.body;
        const prefix = strategicObjective.toUpperCase();
        const existingCount = await Risk_1.RiskModel.countDocuments({ riskId: { $regex: `^${prefix}` } });
        const generatedRiskId = `${prefix}${existingCount + 1}`;
        const rating = (impact && likelihood) ? Number(impact) * Number(likelihood) : undefined;
        const newRisk = await Risk_1.RiskModel.create({
            riskId: generatedRiskId,
            strategicObjective: prefix,
            title,
            description,
            principalOwner,
            supportingOwners,
            category,
            likelihood,
            impact,
            rating,
            causes,
            consequences,
            existingControls,
            proposedMitigation,
            targets,
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
const getRisksForChampion = async (req, res) => {
    try {
        // Assume req.user is set by authentication middleware
        const user = req.user;
        if (!user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        // Build $or array only for defined, non-empty user fields
        const orConditions = [];
        if (typeof user.firstName === 'string' && user.firstName.trim()) {
            orConditions.push({ supportingOwners: { $elemMatch: { $regex: user.firstName, $options: 'i' } } });
        }
        if (typeof user.lastName === 'string' && user.lastName.trim()) {
            orConditions.push({ supportingOwners: { $elemMatch: { $regex: user.lastName, $options: 'i' } } });
        }
        if (typeof user.email === 'string' && user.email.trim()) {
            orConditions.push({ supportingOwners: { $elemMatch: { $regex: user.email, $options: 'i' } } });
        }
        if (typeof user.unit_id === 'string' && user.unit_id.trim()) {
            orConditions.push({ supportingOwners: { $elemMatch: { $regex: user.unit_id, $options: 'i' } } });
        }
        if (orConditions.length === 0) {
            res.status(200).json({ success: true, data: [] });
            return;
        }
        const risks = await Risk_1.RiskModel.find({ $or: orConditions }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: risks });
    }
    catch (err) {
        console.error('Error fetching champion risks:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getRisksForChampion = getRisksForChampion;
const getRiskById = async (req, res) => {
    try {
        const { riskId } = req.params;
        const risk = await Risk_1.RiskModel.findOne({ riskId });
        if (!risk) {
            res.status(404).json({ success: false, message: 'Risk not found' });
            return;
        }
        res.status(200).json({ success: true, data: risk });
    }
    catch (err) {
        console.error('Error fetching risk by riskId:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getRiskById = getRiskById;
