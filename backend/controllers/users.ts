import { Request, Response } from 'express';
import { User } from '../models/User';

export const signup = async (req: Request, res: Response) => {
  const { walletAddress } = req.body;
  const existing = await User.findOne({ walletAddress });
  if (existing) return res.json(existing);
  const user = await User.create({ walletAddress, totalBalance: 0 });
  res.status(201).json(user);
};

export const getUser = async (req: Request, res: Response) => {
  const { walletAddress } = req.params;
  const user = await User.findOne({ walletAddress });
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  // Check if user has an active mining session
  const { MiningSession } = await import('../models/MiningSession');
  const activeSession = await MiningSession.findOne({
    walletAddress,
    status: 'mining',
  }).sort({ miningStartTime: -1 });
  
  // Get totalCoins from the most recent MiningSession (source of truth for display)
  const latestSession = await MiningSession.findOne({ walletAddress })
    .sort({ createdAt: -1 });
  
  const totalBalance = latestSession?.totalCoins ?? (user as any).totalBalance ?? 0;
  
  const response: any = {
    ...user.toObject(),
    totalBalance, // Use totalCoins from latest MiningSession
    walletBalance: totalBalance, // Same as totalBalance for now
    miningStatus: activeSession ? 'active' : 'inactive',
  };
  
  if (activeSession) {
    response.miningStartTime = activeSession.miningStartTime;
    response.selectedHour = activeSession.selectedHour;
    response.multiplier = activeSession.multiplier;
  }
  
  res.json(response);
};
