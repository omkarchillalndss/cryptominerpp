import { Request, Response } from 'express';
import { MiningSession } from '../models/MiningSession';
import { User } from '../models/User';
import { computeReward, clampMultiplier } from '../utils/calc';

const MAX_MULTIPLIER = Number(process.env.MAX_MULTIPLIER ?? '6');

export const start = async (req: Request, res: Response) => {
  const { walletAddress, selectedHour, multiplier } = req.body as {
    walletAddress: string;
    selectedHour: number;
    multiplier?: number;
  };
  if (!walletAddress || !selectedHour)
    return res
      .status(400)
      .json({ message: 'walletAddress & selectedHour required' });

  // Close any existing mining sessions
  await MiningSession.updateMany(
    { walletAddress, status: 'mining' },
    { $set: { status: 'claimed' } },
  );

  // Get totalCoins from the most recent session (source of truth for display)
  const previousSession = await MiningSession.findOne({ walletAddress })
    .sort({ createdAt: -1 });
  
  let totalCoins = 0;
  if (previousSession) {
    // Carry forward totalCoins from previous session
    totalCoins = previousSession.totalCoins;
  } else {
    // First session: use User's totalBalance if it exists
    const user = await User.findOne({ walletAddress });
    totalCoins = user?.totalBalance ?? 0;
  }

  const now = new Date();
  const ms = await MiningSession.create({
    walletAddress,
    totalCoins, // Carry forward from previous session
    currentMiningPoints: 0, // Current session starts at 0
    multiplier: clampMultiplier(multiplier ?? 1, MAX_MULTIPLIER),
    miningStartTime: now,
    multiplierStartTime: now,
    status: 'mining',
    selectedHour,
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
  const session = await MiningSession.findOne({
    walletAddress,
    status: 'mining',
  }).sort({ createdAt: -1 });
  if (!session)
    return res.status(404).json({ message: 'No active session' });

  const now = new Date();
  const durationSec = session.selectedHour * 3600;
  const elapsedSec = Math.min(
    Math.floor((now.getTime() - session.miningStartTime.getTime()) / 1000),
    durationSec,
  );

  // Calculate tokens earned in this session
  const awarded = computeReward(elapsedSec, session.multiplier);

  // Update user's total balance (single source of truth)
  const user = await User.findOneAndUpdate(
    { walletAddress },
    { $inc: { totalBalance: awarded } },
    { new: true, upsert: true },
  );

  // Update session: when status becomes 'claimed', totalCoins = totalCoins + currentMiningPoints
  session.currentMiningPoints = awarded; // Tokens earned in this session
  session.totalCoins = session.totalCoins + awarded; // Add currentMiningPoints to totalCoins
  session.status = 'claimed';
  await session.save();

  res.json({ awarded, totalBalance: user?.totalBalance ?? awarded });
};

// Get current mining session with real-time points
export const getCurrentSession = async (req: Request, res: Response) => {
  const { walletAddress } = req.params;
  const session = await MiningSession.findOne({
    walletAddress,
    status: 'mining',
  }).sort({ createdAt: -1 });

  if (!session)
    return res.status(404).json({ message: 'No active session' });

  const now = new Date();
  const durationSec = session.selectedHour * 3600;
  const elapsedSec = Math.min(
    Math.floor((now.getTime() - session.miningStartTime.getTime()) / 1000),
    durationSec,
  );

  // Calculate current mining points in real-time
  const currentMiningPoints = computeReward(elapsedSec, session.multiplier);

  res.json({
    ...session.toObject(),
    currentMiningPoints, // Real-time calculation
    elapsedSeconds: elapsedSec,
    remainingSeconds: Math.max(0, durationSec - elapsedSec),
  });
};
