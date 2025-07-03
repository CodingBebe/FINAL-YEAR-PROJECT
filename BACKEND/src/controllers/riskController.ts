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
      targets,
    } = req.body;

    const rating = (impact && likelihood) ? Number(impact) * Number(likelihood) : undefined;

    const newRisk = await RiskModel.create({
      id: riskId,
      riskId: riskId,
      strategicObjective,
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

export const getRisksForChampion = async (req: Request, res: Response): Promise<void> => {
  try {
    // Assume req.user is set by authentication middleware
    const user = (req as any).user;
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
    const risks = await RiskModel.find({ $or: orConditions }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: risks });
  } catch (err) {
    console.error('Error fetching champion risks:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getRiskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { riskId } = req.params;
    const risk = await RiskModel.findOne({ riskId });
    if (!risk) {
      res.status(404).json({ success: false, message: 'Risk not found' });
      return;
    }
    res.status(200).json({ success: true, data: risk });
  } catch (err) {
    console.error('Error fetching risk by riskId:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
