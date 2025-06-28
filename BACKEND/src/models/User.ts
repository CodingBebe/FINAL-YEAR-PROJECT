import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole =
  | 'admin'
  | 'coordinator'
  | 'committee'
  | 'champion'
  | 'deputy_vice_chancellor'
  | 'vice_chancellor';

export interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  unit_id?: string | null;
  avatar?: string | null;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  unit_id: { type: String, default: null },
  avatar: { type: String, default: null },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  this.updated_at = new Date();
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.models.User || mongoose.model<User>('User', UserSchema);