import mongoose, { Document, Schema } from 'mongoose';

export interface Risk extends Document {
  id: string;
  title: string;
  riskId?: string;
  strategicObjective: string;
  description?: string;
  principalOwner?: string;
  supportingOwners?: string[];
  category?: string;
  likelihood?: string;
  impact?: string;
  rating?: number;
  causes?: string;
  consequences?: string;
  existingControls?: string;
  proposedMitigation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const RiskSchema = new Schema<Risk>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  riskId: { type: String },
  strategicObjective: { type: String, required: true },
  description: { type: String },
  principalOwner: { type: String },
  supportingOwners: [{ type: String }],
  category: { type: String },
  likelihood: { type: String },
  impact: { type: String },
  rating: { type: Number },
  causes: { type: String },
  consequences: { type: String },
  existingControls: { type: String },
  proposedMitigation: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

RiskSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const RiskModel = mongoose.models.Risk || mongoose.model<Risk>('Risk', RiskSchema);

export async function countRisksByPrefix(db: mongoose.Connection, prefix: string) {
  return await RiskModel.countDocuments({ id: { $regex: `^${prefix}` } });
}