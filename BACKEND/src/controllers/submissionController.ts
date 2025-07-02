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