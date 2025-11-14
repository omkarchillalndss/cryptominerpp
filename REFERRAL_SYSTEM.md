# Referral System Implementation

## Overview

Complete referral system where users can invite friends and earn rewards.

## Features

### User Model Updates

- `referralCode`: Unique 8-character code (auto-generated)
- `hasUsedReferralCode`: Boolean flag
- `referralPoints`: Total points earned from referrals
- `usedReferralCode`: Code they used (if any)

### Rewards

- **Code Owner**: 200 tokens when someone uses their code
- **Code User**: 100 tokens when they use a code

### Rules

- ✅ Each user gets unique referral code on signup
- ✅ User can only use ONE referral code (ever)
- ✅ User CANNOT use their own code
- ✅ Code must exist and be valid

## API Endpoints

### POST /api/referral/apply

Apply a referral code

```json
{
  "walletAddress": "user_wallet",
  "referralCode": "ABC12345"
}
```

### GET /api/referral/stats/:walletAddress

Get referral statistics

## Frontend

### New Screen: ReferralScreen

- Display user's referral code
- Copy/Share functionality
- View referral stats
- Input field to apply codes
- Shows "how it works" info

### HomeScreen Changes

- Removed "Base Rate" and "Multiplier" info card
- Added "Referral Program" button
- Navigates to ReferralScreen

## Testing

1. **Restart backend server** (IMPORTANT!)
2. Create two test users
3. User A gets referral code (auto-generated)
4. User B applies User A's code
5. Verify rewards:
   - User A: +200 tokens
   - User B: +100 tokens

## Database Migration

Existing users need referral codes. Run this in MongoDB:

```javascript
// Generate codes for existing users
db.users.find({ referralCode: { $exists: false } }).forEach(user => {
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  db.users.updateOne(
    { _id: user._id },
    {
      $set: {
        referralCode: code,
        hasUsedReferralCode: false,
        referralPoints: 0,
      },
    },
  );
});
```

## Files Created/Modified

**Backend:**

- ✅ `backend/models/User.ts` - Updated
- ✅ `backend/controllers/users.ts` - Updated signup
- ✅ `backend/controllers/referral.ts` - New
- ✅ `backend/routes/referral.ts` - New
- ✅ `backend/server.ts` - Added route

**Frontend:**

- ✅ `src/services/referralService.ts` - New
- ✅ `src/screens/ReferralScreen.tsx` - New
- ✅ `src/screens/HomeScreen.tsx` - Updated
- ✅ `App.tsx` - Added navigation

## Next Steps

1. Restart backend server
2. Test with new users
3. Migrate existing users (if any)
4. Share and earn! 🎉
