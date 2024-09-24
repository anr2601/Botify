import mongoose, { Schema, Document } from 'mongoose';

interface DailyClaim extends Document {
  userId: string;
  lastClaim: Date;
  balance: number;
}

const dailyClaimSchema = new Schema<DailyClaim>({
  userId: { type: String, required: true, unique: true },
  lastClaim: { type: Date, required: true },
  balance: { type: Number, required: true, default: 0 }
});

export const DailyClaimModel = mongoose.model<DailyClaim>('DailyClaim', dailyClaimSchema);