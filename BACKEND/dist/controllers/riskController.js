"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRisk = void 0;
const sequelize_1 = require("sequelize");
const Risk_1 = __importDefault(require("../models/Risk"));
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
        const existingCount = await Risk_1.default.count({
            where: {
                id: {
                    [sequelize_1.Op.like]: `${prefix}%`,
                },
            },
        });
        const generatedId = `${prefix}${existingCount + 1}`;
        const newRisk = await Risk_1.default.create({
            id: generatedId,
            strategicObjective: prefix, // Save the objective letter if it's in your DB
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
