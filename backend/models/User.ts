import { Schema, model } from 'mongoose';

interface IUser {
  walletAddress: string;
  totalBalance: number;
  createdAt: Date;
  referralCode: string;
  hasUsedReferralCode: boolean;
  referralPoints: number;
  usedReferralCode?: string;
}

const UserSchema = new Schema<IUser>({
  walletAddress: { type: String, unique: true, index: true, required: true },
  totalBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: () => new Date() },
  referralCode: { type: String, unique: true, index: true, required: true },
  hasUsedReferralCode: { type: Boolean, default: false },
  referralPoints: { type: Number, default: 0 },
  usedReferralCode: { type: String, default: null },
});

export const User = model<IUser>('User', UserSchema);
