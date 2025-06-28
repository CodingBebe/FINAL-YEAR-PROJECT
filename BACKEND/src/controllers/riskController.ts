import { Request, Response } from 'express';
import { RiskModel } from '../models/Risk';

export const registerRisk = async (req: Request, res: Response): Promise<void> => {
  console.log("Incoming Risk Data:", req.body);

  try {
    const {
      strategicObjective,
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
    } = req.body;

    if (!strategicObjective || !/^[A-Ga-g]$/.test(strategicObjective)) {
      res.status(400).json({
        success: false,
        message: 'Invalid or missing strategic objective. Must be a letter A-G.',
      });
      return;
    }

    const prefix = strategicObjective.toUpperCase();
    const existingCount = await RiskModel.countDocuments({ id: { $regex: `^${prefix}` } });
    const generatedId = `${prefix}${existingCount + 1}`;

    const newRisk = await RiskModel.create({
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
  } catch (err) {
    console.error('Error creating risk:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllRisks = async (req: Request, res: Response): Promise<void> => {
  try {
    const risks = await RiskModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: risks });
  } catch (err) {
    console.error('Error fetching risks:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
