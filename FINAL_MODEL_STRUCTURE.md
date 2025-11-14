# Final Model Structure

## Database Collections

### Users Collection

```javascript
{
  walletAddress: "0x123...",
  createdAt: ISODate("2025-11-13...")
}
```

### Referrals Collection

```javascript
{
  walletAddress: "0x123...",
  referralCode: "ABC12345",
  totalBalance: 1000,
  totalReferrals: 12,
  hasUsedReferralCode: false,
  totalReferralPoints: 200,
  usedReferralCode: null,
  createdAt: ISODate("2025-11-13...")
}
```

## Field Descriptions

### Users Model

- `walletAddress`: Unique user identifier
- `createdAt`: Account creation timestamp

### Referrals Model

- `walletAddress`: User's wallet (unique, indexed)
- `referralCode`: User's unique 8-char code (unique, indexed)
- `totalBalance`: User's total token balance
- `totalReferrals`: Count of successful referrals
- `hasUsedReferralCode`: Whether user has used a referral code
- `totalReferralPoints`: Total tokens earned from referrals
- `usedReferralCode`: Code they used (if any)
- `createdAt`: Referral record creation timestamp

## Balance Management

**All balance operations now use Referrals model:**

1. **Mining Rewards** → `referrals.totalBalance`
2. **Ad Rewards** → `referrals.totalBalance`
3. **Referral Rewards** → `referrals.totalBalance`
4. **Display Balance** → `referrals.totalBalance`

## Controllers Updated

### ✅ users.ts

- Signup creates both User and Referral records
- getUser fetches balance from Referral model

### ✅ referral.ts

- Updates `totalBalance` in Referral model
- Increments `totalReferrals` counter
- Uses `totalReferralPoints` field

### ✅ mining.ts

- Updates `totalBalance` in Referral model
- Reads initial balance from Referral model

### ✅ adRewards.ts

- Updates `totalBalance` in Referral model

## API Responses (Unchanged)

Frontend doesn't need updates - API responses remain the same structure.

## Testing Checklist

- [ ] Restart backend server
- [ ] Create new user
- [ ] Verify Users collection (2 fields only)
- [ ] Verify Referrals collection (8 fields)
- [ ] Test mining (balance updates in Referrals)
- [ ] Test ad rewards (balance updates in Referrals)
- [ ] Test referral system (all fields update correctly)

## Migration Script

For existing users, run in MongoDB:

```javascript
// Migrate existing data
db.users.find({}).forEach(function (user) {
  // Create referral record if doesn't exist
  const existing = db.referrals.findOne({ walletAddress: user.walletAddress });

  if (!existing) {
    // Generate code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Create referral record
    db.referrals.insertOne({
      walletAddress: user.walletAddress,
      referralCode: code,
      totalBalance: user.totalBalance || 0,
      totalReferrals: 0,
      hasUsedReferralCode: false,
      totalReferralPoints: 0,
      usedReferralCode: null,
      createdAt: user.createdAt || new Date(),
    });
  }

  // Remove totalBalance from user
  db.users.updateOne({ _id: user._id }, { $unset: { totalBalance: '' } });
});

print('Migration complete!');
```

## Summary

✅ Users model: Only walletAddress and createdAt
✅ Referrals model: All balance and referral data
✅ All controllers updated to use Referral model
✅ No frontend changes needed
✅ Clean separation of concerns
