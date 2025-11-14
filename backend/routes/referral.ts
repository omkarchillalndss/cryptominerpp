import { Router } from 'express';
import { applyReferralCode, getReferralStats } from '../controllers/referral';

const r = Router();
r.post('/apply', applyReferralCode);
r.get('/stats/:walletAddress', getReferralStats);

export default r;
