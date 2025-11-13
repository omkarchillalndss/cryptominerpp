import { Schema, model } from 'mongoose';

interface IAdReward {
  walletAddress: string;
  claimedCount: number;
  lastResetDate: Date;
  lastClaimTime: Date;
}

const AdRewardSchema = new Schema<IAdReward>({
  walletAddress: { type: String, unique: true, index: true, required: true },
  claimedCount: { type: Number, default: 0 },
  lastResetDate: { type: Date, default: () => new Date() },
  lastClaimTime: { type: Date, default: () => new Date() },
});

export const AdReward = model<IAdReward>('AdReward', AdRewardSchema);
