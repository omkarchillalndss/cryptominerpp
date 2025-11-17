# Quick Start Guide - Notification System

## Setup

### 1. Backend Setup

No additional dependencies needed! The notification system uses existing MongoDB connection.

```bash
cd backend
npm start
```

The server will automatically include the notification routes at `/api/notifications`.

### 2. Frontend Setup

No additional dependencies needed! Uses existing React Native components.

```bash
npm start
```

## Testing the Notification System

### Test 1: Referral Code Notification

1. **Create User A**

   - Open app
   - Create account (User A)
   - Go to Referral screen
   - Copy referral code (e.g., "ABC123")

2. **Create User B**

   - Logout from User A
   - Create new account (User B)
   - Go to Referral screen
   - Enter User A's referral code
   - Submit

3. **Check User A's Notifications**
   - Logout from User B
   - Login as User A
   - See notification bell icon with badge (1)
   - Click bell icon
   - See notification: "🎉 New Referral! Someone used your referral code! You earned 200 tokens."

### Test 2: Mining Bonus Notification

1. **User B Starts Mining**

   - Login as User B (who used User A's code)
   - Start mining session
   - Wait for completion (or use short duration for testing)
   - Claim rewards

2. **Check User A's Notifications**
   - Login as User A
   - See notification bell icon with badge (2)
   - Click bell icon
   - See new notification: "💰 Mining Bonus Earned! You earned X tokens from your referral's mining (10% of Y tokens)."

## Features to Test

### Notification Icon

- ✅ Badge shows correct unread count
- ✅ Badge updates when new notifications arrive
- ✅ Badge clears when all marked as read
- ✅ Auto-refreshes every 30 seconds

### Notifications Screen

- ✅ Shows all notifications (newest first)
- ✅ Unread notifications highlighted in purple
- ✅ Tap notification to mark as read
- ✅ "Mark all read" button works
- ✅ Delete button removes notification
- ✅ Pull-to-refresh updates list
- ✅ Time formatting (5m ago, 2h ago, etc.)
- ✅ Empty state shows when no notifications

### Backend

- ✅ Notifications created on referral code use
- ✅ Notifications created on mining bonus award
- ✅ API endpoints respond correctly
- ✅ Notifications persist in database

## API Testing (Optional)

You can test the API directly using curl or Postman:

### Get Notifications

```bash
curl http://localhost:3000/api/notifications/YOUR_WALLET_ADDRESS
```

### Mark as Read

```bash
curl -X PATCH http://localhost:3000/api/notifications/NOTIFICATION_ID/read
```

### Mark All as Read

```bash
curl -X POST http://localhost:3000/api/notifications/mark-all-read \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"YOUR_WALLET_ADDRESS"}'
```

### Delete Notification

```bash
curl -X DELETE http://localhost:3000/api/notifications/NOTIFICATION_ID
```

## Troubleshooting

### Notification Icon Not Showing Badge

- Check if backend is running
- Check console for API errors
- Verify wallet address is correct
- Check MongoDB connection

### Notifications Not Being Created

- Check backend console logs
- Look for "🎁 Referral applied" or "🎁 Referral bonus" messages
- Verify MongoDB is connected
- Check if Notification model is imported correctly

### Badge Count Not Updating

- Pull down to refresh on Notifications screen
- Wait 30 seconds for auto-refresh
- Navigate away and back to Home screen
- Check network connection

## Next Steps

1. Test with multiple users
2. Verify notifications persist after app restart
3. Test with different mining durations
4. Test with multiple referrals
5. Verify notification deletion works
6. Test "Mark all read" functionality

## Production Considerations

- Consider adding push notifications for real-time alerts
- Add notification preferences (enable/disable types)
- Implement notification expiry (auto-delete old notifications)
- Add pagination for large notification lists
- Consider adding notification categories/filters
- Add analytics to track notification engagement
