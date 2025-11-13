import { Request, Response } from 'express';
import { User } from '../models/User';
import { AdReward } from '../models/AdReward';

const MAX_DAILY_CLAIMS = 6;
const REWARD_OPTIONS = [10, 20, 30, 40, 50, 60];

const isNewDay = (lastDate: Date): boolean => {
  const now = new Date();
  const last = new Date(lastDate);
  return (
    now.getDate() !== last.getDate() ||
    now.getMonth() !== last.getMonth() ||
    now.getFullYear() !== last.getFullYear()
  );
};

const getRandomReward = (): number => {
  const randomIndex = Math.floor(Math.random() * REWARD_OPTIONS.length);
  return REWARD_OPTIONS[randomIndex];
};

export const claimAdReward = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    let adReward = await AdReward.findOne({ walletAddress });

    if (!adReward) {
      adReward = new AdReward({
        walletAddress,
        claimedCount: 0,
        lastResetDate: new Date(),
        lastClaimTime: new Date(),
      });
    }

    if (isNewDay(adReward.lastResetDate)) {
      adReward.claimedCount = 0;
      adReward.lastResetDate = new Date();
    }

    if (adReward.claimedCount >= MAX_DAILY_CLAIMS) {
      return res.status(429).json({
        error: 'Daily limit reached',
        message: 'You have reached the maximum 6 ad rewards for today. Come back tomorrow!',
        claimedCount: adReward.claimedCount,
        maxClaims: MAX_DAILY_CLAIMS,
      });
    }

    const reward = getRandomReward();

    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.totalBalance += reward;
    await user.save();

    adReward.claimedCount += 1;
    adReward.lastClaimTime = new Date();
    await adReward.save();

    console.log(
      `💰 Ad reward claimed: ${walletAddress} earned ${reward} tokens (${adReward.claimedCount}/${MAX_DAILY_CLAIMS})`,
    );

    return res.json({
      success: true,
      reward,
      newBalance: user.totalBalance,
      claimedCount: adReward.claimedCount,
      remainingClaims: MAX_DAILY_CLAIMS - adReward.claimedCount,
    });
  } catch (error) {
    console.error('Error claiming ad reward:', error);
    return res.status(500).json({ error: 'Failed to claim ad reward' });
  }
};

export const getAdRewardStatus = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    let adReward = await AdReward.findOne({ walletAddress });

    if (!adReward) {
      return res.json({
        claimedCount: 0,
        remainingClaims: MAX_DAILY_CLAIMS,
        maxClaims: MAX_DAILY_CLAIMS,
        canClaim: true,
      });
    }

    if (isNewDay(adReward.lastResetDate)) {
      adReward.claimedCount = 0;
      adReward.lastResetDate = new Date();
      await adReward.save();
    }

    const canClaim = adReward.claimedCount < MAX_DAILY_CLAIMS;

    return res.json({
      claimedCount: adReward.claimedCount,
      remainingClaims: MAX_DAILY_CLAIMS - adReward.claimedCount,
      maxClaims: MAX_DAILY_CLAIMS,
      canClaim,
      lastClaimTime: adReward.lastClaimTime,
    });
  } catch (error) {
    console.error('Error getting ad reward status:', error);
    return res.status(500).json({ error: 'Failed to get ad reward status' });
  }
};
