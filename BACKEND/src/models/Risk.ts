import mongoose, { Document, Schema } from 'mongoose';

export interface Risk extends Document {
  riskId: string;
  title: string;
  strategicObjective: string;
  description?: string;
  principalOwner?: string;
  supportingOwners?: string[];
  category?: string;
  likelihood?: string;
  impact?: string;
  rating?: number;
  causes?: string[];
  consequences?: string[];
  existingControls?: string[];
  proposedMitigation?: string[];
  targets?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const RiskSchema = new Schema<Risk>({
  riskId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  strategicObjective: { type: String, required: true },
  description: { type: String },
  principalOwner: { type: String },
  supportingOwners: [{ type: String }],
  category: { type: String },
  likelihood: { type: String },
  impact: { type: String },
  rating: { type: Number },
  causes: [{ type: String }],
  consequences: [{ type: String }],
  existingControls: [{ type: String }],
  proposedMitigation: [{ type: String }],
  targets: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

RiskSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const RiskModel = mongoose.models.Risk || mongoose.model<Risk>('Risk', RiskSchema);

export async function countRisksByPrefix(db: mongoose.Connection, prefix: string) {
  return await RiskModel.countDocuments({ riskId: { $regex: `^${prefix}` } });
}