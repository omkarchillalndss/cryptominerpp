# Updates Summary - Ad Rewards Feature

## Changes Made

### 1. ✅ Auto-Navigate Back After Closing Ad

**Problem:** When user closed the ad without completing it, they stayed on the AdRewardScreen.

**Solution:**

- Added AppState monitoring to detect when user closes the ad
- Automatically navigates back to HomeScreen after ad is closed (completed or dismissed)
- Uses timestamp tracking to detect if ad was dismissed

**Files Updated:**

- `src/screens/AdRewardScreen.tsx`

### 2. ✅ Separate Database Entry for Each Claim

**Problem:** Old model stored aggregate data (count, last reset date) instead of individual claims.

**Solution:**

- Completely redesigned the AdReward model
- Each ad reward claim is now stored as a separate entry
- Fields: walletAddress, rewardAmount, createdAt

**Benefits:**

- Complete history of all ad reward claims
- Easy to query claims by date range
- Can generate analytics and reports
- No need to reset counters - just count today's claims
- Audit trail for each reward

**Files Updated:**

- `backend/models/AdReward.ts` - Redesigned schema
- `backend/controllers/adRewards.ts` - Updated logic to create separate entries

## New Database Schema

### Before (Old):

```typescript
AdReward {
  walletAddress: string (unique)
  claimedCount: number
  lastResetDate: Date
  lastClaimTime: Date
}
```

### After (New):

```typescript
AdReward {
  walletAddress: string (indexed, not unique)
  rewardAmount: number (10-60)
  createdAt: Date
}
```

## How It Works Now

### Claiming Rewards:

1. User watches ad
2. Backend counts today's claims: `AdReward.countDocuments({ walletAddress, createdAt: { $gte: startOfDay, $lte: endOfDay } })`
3. If count < 6, create new entry: `new AdReward({ walletAddress, rewardAmount, createdAt })`
4. Update user balance
5. Return success with claim count

### Checking Status:

1. Count today's claims from database
2. Calculate remaining claims (6 - count)
3. Get last claim time from most recent entry
4. Return status

### Navigation:

1. Ad loads and shows
2. If user completes ad → claim reward → show alert → navigate to Home
3. If user closes ad → detect via AppState → navigate to Home after 2 seconds

## Example Database Entries

```javascript
// User "wallet123" claims 3 times today
[
  {
    walletAddress: 'wallet123',
    rewardAmount: 30,
    createdAt: '2025-11-13T10:15:00Z',
  },
  {
    walletAddress: 'wallet123',
    rewardAmount: 50,
    createdAt: '2025-11-13T14:30:00Z',
  },
  {
    walletAddress: 'wallet123',
    rewardAmount: 20,
    createdAt: '2025-11-13T18:45:00Z',
  },
];
```

## Query Examples

### Get today's claims for a user:

```javascript
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

const claims = await AdReward.find({
  walletAddress: 'wallet123',
  createdAt: { $gte: startOfDay, $lte: endOfDay },
});
```

### Get total rewards earned today:

```javascript
const result = await AdReward.aggregate([
  {
    $match: {
      walletAddress: 'wallet123',
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    },
  },
  {
    $group: {
      _id: null,
      total: { $sum: '$rewardAmount' },
    },
  },
]);
```

### Get claim history for last 7 days:

```javascript
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const history = await AdReward.find({
  walletAddress: 'wallet123',
  createdAt: { $gte: sevenDaysAgo },
}).sort({ createdAt: -1 });
```

## Testing

### Test the changes:

1. **Restart backend server** (IMPORTANT!):

   ```bash
   cd backend
   npm start
   ```

2. **Test ad completion**:

   - Click "Watch Ad" button
   - Watch full ad
   - Should show reward alert
   - Should navigate back to Home
   - Balance should update

3. **Test ad dismissal**:

   - Click "Watch Ad" button
   - Close ad without completing
   - Should automatically navigate back to Home after 2 seconds
   - No reward should be given

4. **Test daily limit**:

   - Claim 6 rewards
   - Button should show "✅ All Claimed Today"
   - Trying to claim 7th should show error

5. **Check database**:

   ```bash
   # Connect to MongoDB
   mongosh "your-connection-string"

   # View all ad reward entries
   db.adrewards.find().pretty()

   # Count today's claims for a user
   db.adrewards.countDocuments({
     walletAddress: "your-wallet",
     createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
   })
   ```

## Migration Note

⚠️ **Important:** If you have existing data in the old AdReward format, you'll need to either:

1. **Drop the collection** (loses old data):

   ```javascript
   db.adrewards.drop();
   ```

2. **Or migrate the data** (preserves history):
   - Export old data
   - Transform to new format
   - Import new data

Since this is a new feature, dropping the collection is recommended.

## Files Changed

- ✅ `backend/models/AdReward.ts` - Redesigned schema
- ✅ `backend/controllers/adRewards.ts` - Updated logic
- ✅ `src/screens/AdRewardScreen.tsx` - Added auto-navigation
- ✅ `AD_REWARDS_FEATURE.md` - Updated documentation
- ✅ `UPDATES_SUMMARY.md` - This file

## Next Steps

1. Restart backend server
2. Test the feature
3. Verify database entries are being created correctly
4. Monitor logs for any errors
