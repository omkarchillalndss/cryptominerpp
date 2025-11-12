import { Schema, model } from 'mongoose';
interface IUser { walletAddress: string; totalBalance: number; createdAt: Date; }
const UserSchema = new Schema<IUser>({
  walletAddress: { type: String, unique: true, index: true, required: true },
  totalBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: () => new Date() }
});
export const User = model<IUser>('User', UserSchema);
