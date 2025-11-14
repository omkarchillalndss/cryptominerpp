import { Request, Response } from 'express';
import { User } from '../models/User';

// Generate unique referral code
const generateReferralCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Apply referral code
export const applyReferralCode = async (req: Request, res: Response) => {
  try {
    const { walletAddress, referralCode } = req.body;

    if (!walletAddress || !referralCode) {
      return res.status(400).json({ error: 'Wallet address and referral code required' });
    }

    // Find the user who is applying the code
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has already used a referral code
    if (user.hasUsedReferralCode) {
      return res.status(400).json({ error: 'You have already used a referral code' });
    }

    // Check if user is trying to use their own code
    if (user.referralCode === referralCode.toUpperCase()) {
      return res.status(400).json({ error: 'You cannot use your own referral code' });
    }

    // Find the user who owns the referral code
    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    if (!referrer) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    // Award tokens
    const REFERRER_REWARD = 200; // Tokens for code owner
    const USER_REWARD = 100;     // Tokens for code user

    // Update referrer (code owner)
    referrer.totalBalance += REFERRER_REWARD;
    referrer.referralPoints += REFERRER_REWARD;
    await referrer.save();

    // Update user (code user)
    user.totalBalance += USER_REWARD;
    user.hasUsedReferralCode = true;
    user.usedReferralCode = referralCode.toUpperCase();
    await user.save();

    console.log(
      `🎁 Referral applied: ${walletAddress} used ${referralCode} | Referrer earned ${REFERRER_REWARD}, User earned ${USER_REWARD}`,
    );

    return res.json({
      success: true,
      userReward: USER_REWARD,
      referrerReward: REFERRER_REWARD,
      newBalance: user.totalBalance,
      message: `Success! You earned ${USER_REWARD} tokens and ${referrer.walletAddress.slice(0, 6)}... earned ${REFERRER_REWARD} tokens!`,
    });
  } catch (error) {
    console.error('Error applying referral code:', error);
    return res.status(500).json({ error: 'Failed to apply referral code' });
  }
};

// Get referral stats
export const getReferralStats = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Count how many users used this user's referral code
    const referralCount = await User.countDocuments({
      usedReferralCode: user.referralCode,
    });

    return res.json({
      referralCode: user.referralCode,
      hasUsedReferralCode: user.hasUsedReferralCode,
      usedReferralCode: user.usedReferralCode,
      referralPoints: user.referralPoints,
      referralCount,
      canUseReferral: !user.hasUsedReferralCode,
    });
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return res.status(500).json({ error: 'Failed to get referral stats' });
  }
};
