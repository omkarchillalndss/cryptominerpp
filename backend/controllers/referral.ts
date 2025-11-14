import { Request, Response } from 'express';
import { User } from '../models/User';
import { Referral } from '../models/Referral';

// Apply referral code
export const applyReferralCode = async (req: Request, res: Response) => {
  try {
    const { walletAddress, referralCode } = req.body;

    if (!walletAddress || !referralCode) {
      return res
        .status(400)
        .json({ error: 'Wallet address and referral code required' });
    }

    // Find the user who is applying the code
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find user's referral record
    const userReferral = await Referral.findOne({ walletAddress });
    if (!userReferral) {
      return res.status(404).json({ error: 'Referral record not found' });
    }

    // Check if user has already used a referral code
    if (userReferral.hasUsedReferralCode) {
      return res
        .status(400)
        .json({ error: 'You have already used a referral code' });
    }

    // Check if user is trying to use their own code
    if (userReferral.referralCode === referralCode.toUpperCase()) {
      return res
        .status(400)
        .json({ error: 'You cannot use your own referral code' });
    }

    // Find the referral record of the code owner
    const referrerReferral = await Referral.findOne({
      referralCode: referralCode.toUpperCase(),
    });
    if (!referrerReferral) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    // Find the referrer user
    const referrer = await User.findOne({
      walletAddress: referrerReferral.walletAddress,
    });
    if (!referrer) {
      return res.status(404).json({ error: 'Referrer not found' });
    }

    // Award tokens
    const REFERRER_REWARD = 200; // Tokens for code owner
    const USER_REWARD = 100; // Tokens for code user

    // Update referrer (code owner)
    referrerReferral.totalBalance += REFERRER_REWARD;
    referrerReferral.totalReferralPoints += REFERRER_REWARD;
    referrerReferral.totalReferrals += 1;
    await referrerReferral.save();

    // Update user (code user)
    userReferral.totalBalance += USER_REWARD;
    userReferral.hasUsedReferralCode = true;
    userReferral.usedReferralCode = referralCode.toUpperCase();
    await userReferral.save();

    console.log(
      `🎁 Referral applied: ${walletAddress} used ${referralCode} | Referrer earned ${REFERRER_REWARD}, User earned ${USER_REWARD}`,
    );

    return res.json({
      success: true,
      userReward: USER_REWARD,
      referrerReward: REFERRER_REWARD,
      newBalance: userReferral.totalBalance,
      message: `Success! You earned ${USER_REWARD} tokens and ${referrerReferral.walletAddress.slice(0, 6)}... earned ${REFERRER_REWARD} tokens!`,
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

    const referral = await Referral.findOne({ walletAddress });
    if (!referral) {
      return res.status(404).json({ error: 'Referral record not found' });
    }

    // Count how many users used this user's referral code
    const referralCount = await Referral.countDocuments({
      usedReferralCode: referral.referralCode,
    });

    return res.json({
      referralCode: referral.referralCode,
      hasUsedReferralCode: referral.hasUsedReferralCode,
      usedReferralCode: referral.usedReferralCode,
      referralPoints: referral.totalReferralPoints,
      referralCount: referral.totalReferrals,
      canUseReferral: !referral.hasUsedReferralCode,
    });
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return res.status(500).json({ error: 'Failed to get referral stats' });
  }
};
