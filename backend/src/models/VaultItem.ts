import mongoose, { Schema, Document } from 'mongoose';

interface VaultItemDocument extends Document {
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  category?: string;
  isFavorite?: boolean;
  userId: mongoose.Types.ObjectId;
}

const vaultItemSchema = new Schema<VaultItemDocument>({
  title: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  url: { type: String },
  notes: { type: String },
  category: { type: String, default: 'General' },
  isFavorite: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<VaultItemDocument>('VaultItem', vaultItemSchema);