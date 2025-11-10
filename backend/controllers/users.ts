import { Request, Response } from 'express';
import { User } from '../models/User';

export const signup = async (req: Request, res: Response) => {
  const { walletAddress } = req.body;
  if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) return res.status(400).json({ message: 'Invalid wallet address' });
  const existing = await User.findOne({ walletAddress });
  if (existing) return res.json(existing);
  const user = await User.create({ walletAddress, totalBalance: 0 });
  res.status(201).json(user);
};

export const getUser = async (req: Request, res: Response) => {
  const { walletAddress } = req.params;
  const user = await User.findOne({ walletAddress });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};
