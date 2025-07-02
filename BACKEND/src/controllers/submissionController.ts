import { Request, Response } from 'express';
import Submission from '../models/Submission';

export const createSubmission = async (req: Request, res: Response) => {
  try {
    const {
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
    } = req.body;

    const submission = new Submission({
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
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ message: 'Failed to create submission', error });
  }
};

export const getAllSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch submissions', error });
  }
};

// --- Committee Dashboard Analytics Endpoints ---

// 1. Severity Distribution
export const getSeverityDistribution = async (req: Request, res: Response) => {
  try {
    const result = await Submission.aggregate([
      { $group: { _id: "$severity", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch severity distribution', error });
  }
};

// 2. Risk Trends Over Time (by month/year)
export const getRiskTrends = async (req: Request, res: Response) => {
  try {
    const result = await Submission.aggregate([
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch risk trends', error });
  }
};

// 3. Unit Risk Breakdown
export const getUnitRiskBreakdown = async (req: Request, res: Response) => {
  try {
    const result = await Submission.aggregate([
      {
        $group: {
          _id: { unit: "$unit_id", severity: "$severity" },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.unit': 1, '_id.severity': 1 } }
    ]);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch unit risk breakdown', error });
  }
};

// 4. Quarterly Risk Breakdown
export const getQuarterlyRiskBreakdown = async (req: Request, res: Response) => {
  try {
    const result = await Submission.aggregate([
      {
        $group: {
          _id: { year: "$year", quarter: "$timePeriod", severity: "$severity" },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.quarter': 1, '_id.severity': 1 } }
    ]);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch quarterly risk breakdown', error });
  }
}; 