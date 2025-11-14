# Referral System - Model Restructure

## Changes Made

### Previous Structure (Single Model)

```
Users Model:
- walletAddress
- totalBalance
- createdAt
- referralCode
- hasUsedReferralCode
- referralPoints
- usedReferralCode
```

### New Structure (Separate Models)

**Users Model:**

```
- walletAddress
- totalBalance
- createdAt
```

**Referrals Model (NEW):**

```
- walletAddress (unique, indexed)
- referralCode (unique, indexed)
- hasUsedReferralCode
- referralPoints
- usedReferralCode
- createdAt
```

## Benefits

1. **Separation of Concerns**: User data separate from referral data
2. **Cleaner User Model**: Only essential user info
3. **Easier to Query**: Referral-specific queries on dedicated collection
4. **Better Scalability**: Can add more referral features without bloating User model
5. **Data Integrity**: Referral logic isolated from user logic

## Files Updated

### Backend

- ✅ `backend/models/User.ts` - Reverted to original (3 fields only)
- ✅ `backend/models/Referral.ts` - NEW model created
- ✅ `backend/controllers/users.ts` - Creates Referral record on signup
- ✅ `backend/controllers/referral.ts` - Uses Referral model

### Frontend

- ✅ No changes needed (API responses remain the same)

## Database Migration

### For New Users

- Automatically handled on signup
- User record created in `users` collection
- Referral record created in `referrals` collection

### For Existing Users (If Any)

Run this migration script in MongoDB:

```javascript
// Connect to your database
use your_database_name;

// Migrate existing users to new structure
db.users.find({}).forEach(function(user) {
  // Check if user has referral data
  if (user.referralCode) {
    // Create referral record
    db.referrals.insertOne({
      walletAddress: user.walletAddress,
      referralCode: user.referralCode,
      hasUsedReferralCode: user.hasUsedReferralCode || false,
      referralPoints: user.referralPoints || 0,
      usedReferralCode: user.usedReferralCode || null,
      createdAt: user.createdAt || new Date()
    });

    // Remove referral fields from user
    db.users.updateOne(
      { _id: user._id },
      {
        $unset: {
          referralCode: "",
          hasUsedReferralCode: "",
          referralPoints: "",
          usedReferralCode: ""
        }
      }
    );
  } else {
    // User doesn't have referral code, generate one
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Create referral record
    db.referrals.insertOne({
      walletAddress: user.walletAddress,
      referralCode: code,
      hasUsedReferralCode: false,
      referralPoints: 0,
      usedReferralCode: null,
      createdAt: user.createdAt || new Date()
    });
  }
});

print("Migration complete!");
```

## API Behavior

### No Changes to API Responses

The API endpoints return the same data structure, so frontend doesn't need updates.

**GET /api/referral/stats/:walletAddress**

```json
{
  "referralCode": "ABC12345",
  "hasUsedReferralCode": false,
  "usedReferralCode": null,
  "referralPoints": 200,
  "referralCount": 1,
  "canUseReferral": true
}
```

**POST /api/referral/apply**

```json
{
  "success": true,
  "userReward": 100,
  "referrerReward": 200,
  "newBalance": 1100,
  "message": "Success! You earned 100 tokens..."
}
```

## Testing

1. **Restart backend server**:

   ```bash
   cd backend
   npm start
   ```

2. **Test new user signup**:

   - Create new user
   - Check `users` collection (should have 3 fields)
   - Check `referrals` collection (should have referral data)

3. **Test referral flow**:

   - User A gets referral code
   - User B applies code
   - Verify rewards in both collections

4. **Verify data separation**:

   ```javascript
   // Check user data
   db.users.findOne({ walletAddress: 'test' });
   // Should only have: walletAddress, totalBalance, createdAt

   // Check referral data
   db.referrals.findOne({ walletAddress: 'test' });
   // Should have: walletAddress, referralCode, hasUsedReferralCode, etc.
   ```

## Rollback (If Needed)

If you need to rollback to single model:

```javascript
// Merge referrals back into users
db.referrals.find({}).forEach(function (ref) {
  db.users.updateOne(
    { walletAddress: ref.walletAddress },
    {
      $set: {
        referralCode: ref.referralCode,
        hasUsedReferralCode: ref.hasUsedReferralCode,
        referralPoints: ref.referralPoints,
        usedReferralCode: ref.usedReferralCode,
      },
    },
  );
});

// Drop referrals collection
db.referrals.drop();
```

## Summary

✅ **Cleaner architecture** - Separated concerns
✅ **No frontend changes** - API responses unchanged
✅ **Better scalability** - Easier to add features
✅ **Data integrity** - Isolated referral logic
✅ **Easy migration** - Script provided

The referral system now uses two separate models for better organization and scalability!
