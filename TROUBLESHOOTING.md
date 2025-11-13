# Troubleshooting Guide

## Issues Fixed

### 1. Splash Screen Stuck Issue ✅

**Problem:** App was hanging at splash screen during startup.

**Root Cause:**

- The `MiningContext` hydration process was waiting for backend sync
- Timeout was set to 1 second but async operations weren't properly handled
- `setIsLoading(false)` wasn't called in the success path

**Fixes Applied:**

- Reduced timeout from 1000ms to 500ms for faster loading
- Added explicit `setIsLoading(false)` in the success path of hydration
- Reduced backend timeout from 2000ms to 1000ms
- Removed blocking `setIsLoading(false)` before backend sync (it now happens in background)

### 2. Notifications Not Working ✅

**Problem:** Scheduled notifications weren't appearing on Android 12+.

**Root Cause:**

- Android 12+ (API 31+) requires `SCHEDULE_EXACT_ALARM` permission
- The app was only logging a warning without properly requesting permission
- Users weren't being prompted to grant exact alarm permission

**Fixes Applied:**

- Enhanced `requestExactAlarmPermission()` to return boolean and properly check permission status
- Added automatic permission check before scheduling notifications
- Opens system settings if permission is not granted
- Added proper error handling and user feedback

### 3. Added Notification Testing ✅

**New Feature:** Added a "Test Notifications" button on HomeScreen to help debug notification issues.

**What it does:**

- Sends an immediate test notification
- Schedules a notification for 10 seconds later
- Shows alert if permissions are missing
- Helps users verify notifications are working

## How to Test

### Test Splash Screen Fix:

1. Close the app completely
2. Reopen the app
3. Splash screen should disappear within 500ms-1s
4. App should load even if backend is slow/unreachable

### Test Notifications:

1. Open the app and go to Home screen
2. Tap "🧪 Test Notifications" button
3. You should see an immediate notification
4. Wait 10 seconds - you should see a scheduled notification
5. If no notifications appear, check:
   - App notification permissions in device settings
   - For Android 12+: Check "Alarms & reminders" permission in app settings

### Test Mining Notifications:

1. Start a mining session (use 1 hour for quick test)
2. Close the app completely
3. Wait for mining to complete
4. You should receive a notification when mining finishes
5. Tap the notification to open the app

## Common Issues

### Notifications Still Not Working?

**Check these settings:**

1. **App Notification Permission:**

   - Go to: Settings → Apps → Crypto Miner → Notifications
   - Enable "Show notifications"

2. **Exact Alarm Permission (Android 12+):**

   - Go to: Settings → Apps → Crypto Miner → Alarms & reminders
   - Enable "Allow setting alarms and reminders"

3. **Battery Optimization:**

   - Go to: Settings → Apps → Crypto Miner → Battery
   - Set to "Unrestricted" or "Not optimized"

4. **Do Not Disturb:**
   - Make sure Do Not Disturb is off or app is allowed

### Backend Connection Issues?

If the app loads but shows 0 balance or can't start mining:

1. Check if backend server is running:

   ```bash
   cd backend
   npm start
   ```

2. Check `.env` file has correct backend URL

3. Check network connectivity

4. Look at console logs for error messages

## Debug Logs

The app now logs detailed information:

- `🚀 MiningContext initializing...` - App startup
- `✅ Hydration completed successfully` - Local state loaded
- `🌐 Starting background sync with backend...` - Backend sync started
- `📱 Requesting exact alarm permission...` - Notification permission check
- `✅ Successfully scheduled notification` - Notification scheduled
- `⏰ Mining completed!` - Mining finished

Check React Native logs:

```bash
# Android
npx react-native log-android

# iOS
npx react-native log-ios
```
