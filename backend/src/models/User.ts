import mongoose, { Schema, Document } from 'mongoose';

interface UserDocument extends Document {
  email: string;
  password: string;
  twoFactorSecret?: string;
  twoFactorEnabled?: boolean;
}

const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  twoFactorSecret: { type: String },
  twoFactorEnabled: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<UserDocument>('User', userSchema);