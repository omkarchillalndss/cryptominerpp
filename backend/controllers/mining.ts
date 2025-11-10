import { Request, Response } from 'express';
import { MiningSession } from '../models/MiningSession';
import { User } from '../models/User';
import { computeReward, clampMultiplier } from '../utils/calc';

const MAX_MULTIPLIER = Number(process.env.MAX_MULTIPLIER ?? '6');

export const start = async (req: Request, res: Response) => {
  const { walletAddress, selectedHour, multiplier } = req.body as { walletAddress: string; selectedHour: number; multiplier?: number; };
  if (!walletAddress || !selectedHour) return res.status(400).json({ message: 'walletAddress & selectedHour required' });
  await MiningSession.updateMany({ walletAddress, status: 'mining' }, { $set: { status: 'claimed' } });
  const now = new Date();
  const ms = await MiningSession.create({
    walletAddress, totalCoins: 0, multiplier: clampMultiplier(multiplier ?? 1, MAX_MULTIPLIER),
    miningStartTime: now, multiplierStartTime: now, status: 'mining', selectedHour
  });
  res.status(201).json(ms);
};

export const upgrade = async (req: Request, res: Response) => {
  const { walletAddress } = req.body;
  const session = await MiningSession.findOne({ walletAddress, status: 'mining' }).sort({ createdAt: -1 });
  if (!session) return res.status(404).json({ message: 'No active session' });
  session.multiplier = clampMultiplier(session.multiplier + 1, MAX_MULTIPLIER);
  session.multiplierStartTime = new Date();
  await session.save();
  res.json({ multiplier: session.multiplier });
};

export const stop = async (req: Request, res: Response) => {
  const { walletAddress } = req.body;
  const session = await MiningSession.findOne({ walletAddress, status: 'mining' }).sort({ createdAt: -1 });
  if (!session) return res.status(404).json({ message: 'No active session' });
  session.status = 'claimed';
  await session.save();
  res.json({ ok: true });
};

export const claim = async (req: Request, res: Response) => {
  const { walletAddress } = req.body;
  const session = await MiningSession.findOne({ walletAddress, status: 'mining' }).sort({ createdAt: -1 });
  if (!session) return res.status(404).json({ message: 'No active session' });
  const now = new Date();
  const durationSec = session.selectedHour * 3600;
  const elapsedSec = Math.min(Math.floor((now.getTime() - session.miningStartTime.getTime()) / 1000), durationSec);
  const awarded = computeReward(elapsedSec, session.multiplier);
  const user = await User.findOneAndUpdate(
    { walletAddress }, { $inc: { totalBalance: awarded } }, { new: true, upsert: true }
  );
  session.totalCoins = awarded; session.status = 'claimed'; await session.save();
  res.json({ awarded, totalBalance: user?.totalBalance ?? awarded });
};
