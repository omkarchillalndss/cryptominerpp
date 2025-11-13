# Watch Ads to Earn Feature

## Overview

Users watch **real Google AdMob ads** to earn random token rewards (10-60 tokens) with a daily limit of 6 claims.

## Features Implemented

### Backend

1. **Model: `backend/models/AdReward.ts`**

   - **Each claim is stored as a separate entry**
   - Fields: walletAddress, rewardAmount, createdAt
   - Indexed for efficient queries by wallet and date
   - No need for manual resets - queries filter by date

2. **Controller: `backend/controllers/adRewards.ts`**

   - `claimAdReward`: Awards random tokens and creates new entry
   - `getAdRewardStatus`: Counts today's claims from database
   - Daily limit: 6 claims per day (counted from today's entries)
   - Uses date range queries (start of day to end of day)

3. **Routes: `backend/routes/adRewards.ts`**

   - POST `/api/ad-rewards/claim` - Claim a reward
   - GET `/api/ad-rewards/status/:walletAddress` - Get claim status

4. **Server: `backend/server.ts`**
   - Added `/api/ad-rewards` route

### Frontend

1. **Service: `src/services/adRewardService.ts`**

   - `getStatus()`: Fetch user's claim status
   - `claimReward()`: Claim an ad reward
   - Handles errors and daily limits

2. **HomeScreen: `src/screens/HomeScreen.tsx`**

   - New "Watch Ads to Earn" card
   - Shows claims remaining (X/6 Today)
   - Button navigates to AdRewardScreen
   - Button states:
     - Active: "🎁 Watch Ad (X left)"
     - Limit reached: "✅ All Claimed Today"
   - Auto-refreshes status when returning to screen

3. **AdRewardScreen: `src/screens/AdRewardScreen.tsx`**
   - Loads and displays Google AdMob rewarded ads
   - Shows loading state while ad loads
   - Waits for user to complete watching ad
   - Claims reward from backend after ad completion
   - Shows success alert with reward amount
   - **Automatically navigates back to HomeScreen** after ad closes (completed or dismissed)
   - Uses AppState monitoring to detect when user closes ad

## How It Works

1. **User clicks "Watch Ad" button on HomeScreen**
2. **App navigates to AdRewardScreen**
3. **AdRewardScreen loads Google AdMob rewarded ad**
4. **User watches the full ad**
5. **When ad completes**, AdMob fires `EARNED_REWARD` event
6. **Frontend calls** `adRewardService.claimReward(walletAddress)`
7. **Backend checks**:
   - If new day → reset count to 0
   - If count < 6 → award random tokens (10-60)
   - If count >= 6 → return error
8. **Backend updates**:
   - User's totalBalance += reward
   - AdReward claimedCount += 1
9. **Frontend shows**:
   - Success alert with reward amount
   - Updated balance
   - Updated claims counter
10. **App navigates back to HomeScreen**

## Reward System

- **Possible rewards**: 10, 20, 30, 40, 50, 60 tokens
- **Selection**: Random (equal probability)
- **Daily limit**: 6 claims per user
- **Reset time**: Midnight (based on server time)

## Testing

### Test the feature:

1. **Start backend server**:

   ```bash
   cd backend
   npm start
   ```

2. **Run the app**:

   ```bash
   npx react-native run-android
   # or
   npx react-native run-ios
   ```

3. **Test scenarios**:
   - Click "Watch Ad" button → Should show reward (10-60 tokens)
   - Click 6 times → Should show "All Claimed Today"
   - Try 7th time → Should show "Daily limit reached" alert
   - Wait until next day → Counter should reset to 0/6

### Backend API Testing:

```bash
# Get status
curl http://localhost:3000/api/ad-rewards/status/YOUR_WALLET_ADDRESS

# Claim reward
curl -X POST http://localhost:3000/api/ad-rewards/claim \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"YOUR_WALLET_ADDRESS"}'
```

## Database Schema

**Each claim is stored as a separate entry:**

```typescript
AdReward {
  walletAddress: string (indexed)
  rewardAmount: number (10, 20, 30, 40, 50, or 60)
  createdAt: Date (default: now)
}
```

**Benefits of this approach:**

- Complete history of all ad reward claims
- Easy to query claims by date range
- Can generate analytics and reports
- No need to reset counters - just count today's claims
- Audit trail for each reward

## UI/UX

- **Card Design**: Green-themed card with gradient
- **Badge**: Shows "X/6 Today"
- **Button**:
  - Green gradient when available
  - Gray when limit reached or processing
  - Disabled state when limit reached
- **Feedback**: Alert dialog with reward amount and remaining claims

## AdMob Integration

### Ad Unit IDs

- **Development**: Uses `TestIds.REWARDED` (test ads)
- **Production**: `ca-app-pub-7930332952469106/6559535492`

### Ad Flow

1. Ad loads in background
2. Shows loading screen to user
3. Automatically displays ad when loaded
4. Waits for user to complete ad
5. Awards tokens only after ad completion
6. Handles errors gracefully

### Important Notes

- **Test Ads**: In development mode (`__DEV__`), test ads are shown
- **Production Ads**: Real ads shown in production builds
- **Ad Completion Required**: Users must watch the full ad to earn rewards
- **No Reward Without Ad**: Backend only awards tokens after successful ad completion

## Future Enhancements

- Add cooldown between claims (e.g., 5 minutes)
- Track total lifetime ad rewards
- Add analytics for ad performance
- Implement reward multipliers for special events
- Add different ad types (interstitial, banner)
- Implement ad frequency capping
