# Referral Bonus System - 10% Mining Rewards

## Overview

Referrers earn 10% of their referrals' mining rewards automatically and forever.

## How It Works

### Scenario:

1. **User A** shares referral code with **User B**
2. **User B** uses User A's code
3. **User B** mines and earns 1000 tokens
4. **User A** automatically gets 100 tokens (10% bonus)
5. This happens for EVERY mining session of User B

## Database Structure

### ReferralBonus Model

```javascript
{
  walletAddress: "0xUserA...",      // Referrer (who receives bonus)
  referredWallet: "0xUserB...",     // Referred user (who generated bonus)
  bonusAmount: 100,                  // 10% of mining reward
  miningReward: 1000,                // Original mining reward
  createdAt: ISODate("2025-11-13...")
}
```

## Implementation

### Mining Claim Flow:

1. User claims mining rewards
2. System checks if user was referred
3. If yes, find the referrer
4. Calculate 10% bonus
5. Add bonus to referrer's totalBalance
6. Create ReferralBonus record
7. Log the transaction

### Code Logic:

```typescript
// In mining claim controller
if (referral?.hasUsedReferralCode && referral.usedReferralCode) {
  const referrer = await Referral.findOne({
    referralCode: referral.usedReferralCode,
  });

  if (referrer) {
    const bonusAmount = Math.floor(awarded * 0.1);

    // Award bonus
    await Referral.findOneAndUpdate(
      { walletAddress: referrer.walletAddress },
      { $inc: { totalBalance: bonusAmount } },
    );

    // Record bonus
    await ReferralBonus.create({
      walletAddress: referrer.walletAddress,
      referredWallet: walletAddress,
      bonusAmount,
      miningReward: awarded,
    });
  }
}
```

## API Endpoints

### GET /api/referral/stats/:walletAddress

Returns referral stats including bonus earned:

```json
{
  "referralCode": "ABC12345",
  "referralCount": 5,
  "referralPoints": 1000,
  "bonusEarned": 2500,
  "canUseReferral": false
}
```

### GET /api/referral/bonus-history/:walletAddress

Returns bonus history:

```json
{
  "bonuses": [
    {
      "walletAddress": "0xUserA...",
      "referredWallet": "0xUserB...",
      "bonusAmount": 100,
      "miningReward": 1000,
      "createdAt": "2025-11-13..."
    }
  ],
  "total": 2500,
  "count": 25
}
```

## Frontend Updates

### ReferralScreen Stats:

- **Referrals**: Count of users who used your code
- **Direct Rewards**: 200 tokens per referral
- **Mining Bonus**: 10% of all referrals' mining rewards

### How It Works Section:

1. Share your referral code
2. They enter code and get 100 tokens
3. You get 200 tokens for each referral
4. **Earn 10% bonus from their mining rewards forever!**

## Benefits

### For Referrers:

- ✅ Passive income from referrals' mining
- ✅ Lifetime earnings (not one-time)
- ✅ Scales with referrals' activity
- ✅ Automatic - no action needed

### For Referred Users:

- ✅ No penalty - they get full rewards
- ✅ Bonus doesn't reduce their earnings
- ✅ Win-win situation

## Example Calculations

### Scenario 1: Single Referral

- User B mines 1000 tokens
- User A gets 100 tokens (10%)
- User B keeps 1000 tokens (full amount)

### Scenario 2: Multiple Referrals

- User A has 5 referrals
- Each mines 1000 tokens
- User A gets 500 tokens total (5 × 100)
- Plus 1000 tokens from direct rewards (5 × 200)
- Total: 1500 tokens

### Scenario 3: Long-term

- User A has 10 referrals
- Each mines 10 times (10,000 tokens each)
- User A gets 10,000 tokens from bonuses (10 × 10 × 100)
- Plus 2000 from direct rewards
- Total: 12,000 tokens

## Database Queries

### Get total bonus for a user:

```javascript
db.referralbonuses.aggregate([
  { $match: { walletAddress: '0xUserA...' } },
  { $group: { _id: null, total: { $sum: '$bonusAmount' } } },
]);
```

### Get bonus by referred user:

```javascript
db.referralbonuses.find({
  walletAddress: '0xUserA...',
  referredWallet: '0xUserB...',
});
```

### Get top earners:

```javascript
db.referralbonuses.aggregate([
  {
    $group: {
      _id: '$walletAddress',
      total: { $sum: '$bonusAmount' },
      count: { $sum: 1 },
    },
  },
  { $sort: { total: -1 } },
  { $limit: 10 },
]);
```

## Testing

1. **Create User A** - Get referral code
2. **Create User B** - Use User A's code
3. **User B mines** - Complete mining session
4. **User B claims** - Triggers bonus calculation
5. **Check User A's balance** - Should increase by 10%
6. **Check ReferralBonus collection** - Should have new entry
7. **Check stats** - bonusEarned should update

## Files Created/Modified

**Backend:**

- ✅ `backend/models/ReferralBonus.ts` - NEW model
- ✅ `backend/controllers/mining.ts` - Added bonus logic
- ✅ `backend/controllers/referral.ts` - Added bonus stats
- ✅ `backend/routes/referral.ts` - Added bonus endpoint

**Frontend:**

- ✅ `src/services/referralService.ts` - Added bonusEarned
- ✅ `src/screens/ReferralScreen.tsx` - Display bonus

## Monitoring

### Console Logs:

```
🎁 Referral bonus: 0xUserA... earned 100 tokens (10% of 0xUserB...'s 1000 tokens)
```

### Check Bonus Records:

```javascript
db.referralbonuses.find().sort({ createdAt: -1 }).limit(10);
```

## Summary

✅ Referrers earn 10% of referrals' mining rewards
✅ Automatic and lifetime earnings
✅ Separate ReferralBonus model for tracking
✅ No penalty for referred users
✅ Scales with network growth
✅ Complete audit trail

This creates a powerful incentive for users to invite friends and build a network!
