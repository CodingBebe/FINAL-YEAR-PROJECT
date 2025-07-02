"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSubmissions = exports.createSubmission = void 0;
const Submission_1 = __importDefault(require("../models/Submission"));
const createSubmission = async (req, res) => {
    try {
        const { riskId, riskTitle, timePeriod, year, principalOwner, unit_id, supportingOwner, strategicObjective, targets, severity, likelihood, impact, rating, } = req.body;
        const submission = new Submission_1.default({
            riskId,
            riskTitle,
            timePeriod,
            year,
            principalOwner,
            unit_id,
            supportingOwner,
            strategicObjective,
            targets,
            severity,
            likelihood,
            impact,
            rating,
            metadata: {
                unit_id,
                principalOwner,
                severity,
            },
        });
        await submission.save();
        res.status(201).json({ message: 'Submission created successfully' });
    }
    catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ message: 'Failed to create submission', error });
    }
};
exports.createSubmission = createSubmission;
const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await Submission_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: submissions });
    }
    catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch submissions', error });
    }
};
exports.getAllSubmissions = getAllSubmissions;
