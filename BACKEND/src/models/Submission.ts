import mongoose, { Schema, Document } from 'mongoose';

interface TargetAchievement {
  target: string;
  achievement: string;
  status: string;
}

export interface ISubmission extends Document {
  riskId: string;
  riskTitle: string;
  timePeriod: string;
  year: string;
  principalOwner: string;
  unit_id: string;
  supportingOwner: string;
  strategicObjective: string;
  targets: TargetAchievement[];
  severity: string;
  likelihood: number;
  impact: number;
  rating: number;
  createdAt: Date;
  quarterDate: Date;
  dimensions: {
    unit_id: string;
    principalOwner: string;
    severity: string;
  };
}

const SubmissionSchema = new Schema<ISubmission>({
  riskId: { type: String, required: true },
  riskTitle: { type: String, required: true },
  timePeriod: { type: String, required: true },
  year: { type: String, required: true },
  principalOwner: { type: String, required: true },
  unit_id: { type: String, required: true },
  supportingOwner: { type: String, required: true },
  strategicObjective: { type: String, required: true },
  targets: [
    {
      target: String,
      achievement: String,
      status: String,
    },
  ],
  severity: { type: String, required: true },
  likelihood: { type: Number, required: true },
  impact: { type: Number, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  quarterDate: { type: Date, default: Date.now },
  dimensions: {
    unit_id: String,
    principalOwner: String,
    severity: String,
  },
}, {
  timeseries: {
    timeField: 'quarterDate',
    metaField: 'dimensions',
    granularity: 'hours',
  },
  strict: false,
});

export default mongoose.model<ISubmission>('Submission', SubmissionSchema); 