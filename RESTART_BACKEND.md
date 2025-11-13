# Backend Server Restart Required

## Issue

The ad-rewards route was missing from the backend server. It has now been added.

## Solution

You need to restart the backend server for the changes to take effect.

## Steps to Restart Backend

### Option 1: Using Terminal

1. **Stop the current backend server** (if running):

   - Press `Ctrl+C` in the terminal where backend is running

2. **Navigate to backend directory**:

   ```bash
   cd backend
   ```

3. **Start the server**:

   ```bash
   npm start
   ```

4. **Verify it's running**:
   - You should see: `Server listening on :3000 ✅`
   - Check the logs for: `MongoDB connected ✅`

### Option 2: Using npm scripts from root

```bash
# From project root
cd backend && npm start
```

## Verify the Fix

Once the backend is restarted, test the ad rewards feature:

1. Open the app
2. Go to Home screen
3. Click "Watch Ad" button
4. The ad should load and show
5. After watching the ad, you should receive tokens

## Check Backend Logs

After restarting, you should see these routes registered:

```
Server listening on :3000 ✅
MongoDB connected ✅
```

When you claim an ad reward, you'll see:

```
💰 Ad reward claimed: [wallet] earned [10-60] tokens (X/6)
```

## Troubleshooting

### If you still get 404 error:

1. **Check backend is running**:

   ```bash
   curl http://localhost:3000/health
   ```

   Should return: `{"ok":true}`

2. **Check ad-rewards endpoint**:

   ```bash
   curl http://localhost:3000/api/ad-rewards/status/test-wallet
   ```

   Should return claim status

3. **Check backend logs** for any errors

4. **Verify MongoDB is connected**:
   - Check `.env` file has correct `MONGO_URI`
   - Ensure MongoDB is running

### If MongoDB connection fails:

1. Check your `.env` file in backend folder
2. Ensure `MONGO_URI` is set correctly
3. If using MongoDB Atlas, check your IP whitelist
4. If using local MongoDB, ensure it's running

## Files Updated

- ✅ `backend/server.ts` - Added ad-rewards route
- ✅ `backend/routes/adRewards.ts` - Route definitions
- ✅ `backend/controllers/adRewards.ts` - Business logic
- ✅ `backend/models/AdReward.ts` - Database model

All files are ready, just need to restart the server!
