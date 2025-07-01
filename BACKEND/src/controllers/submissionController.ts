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