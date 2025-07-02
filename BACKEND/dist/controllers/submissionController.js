"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuarterlyRiskBreakdown = exports.getUnitRiskBreakdown = exports.getRiskTrends = exports.getSeverityDistribution = exports.getAllSubmissions = exports.createSubmission = void 0;
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
// --- Committee Dashboard Analytics Endpoints ---
// 1. Severity Distribution
const getSeverityDistribution = async (req, res) => {
    try {
        const result = await Submission_1.default.aggregate([
            { $group: { _id: "$severity", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch severity distribution', error });
    }
};
exports.getSeverityDistribution = getSeverityDistribution;
// 2. Risk Trends Over Time (by month/year)
const getRiskTrends = async (req, res) => {
    try {
        const result = await Submission_1.default.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        severity: "$severity"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.severity': 1 } }
        ]);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch risk trends', error });
    }
};
exports.getRiskTrends = getRiskTrends;
// 3. Unit Risk Breakdown
const getUnitRiskBreakdown = async (req, res) => {
    try {
        const result = await Submission_1.default.aggregate([
            {
                $group: {
                    _id: { unit: "$unit_id", severity: "$severity" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.unit': 1, '_id.severity': 1 } }
        ]);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch unit risk breakdown', error });
    }
};
exports.getUnitRiskBreakdown = getUnitRiskBreakdown;
// 4. Quarterly Risk Breakdown
const getQuarterlyRiskBreakdown = async (req, res) => {
    try {
        const result = await Submission_1.default.aggregate([
            {
                $group: {
                    _id: { year: "$year", quarter: "$timePeriod", severity: "$severity" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.quarter': 1, '_id.severity': 1 } }
        ]);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch quarterly risk breakdown', error });
    }
};
exports.getQuarterlyRiskBreakdown = getQuarterlyRiskBreakdown;
