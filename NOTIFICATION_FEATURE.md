# In-App Notification System

## Overview

A complete in-app notification system that alerts users about referral activities and mining bonuses.

## Features

### 1. Notification Icon

- Located beside the logout button on the Home screen
- Shows a badge with unread notification count
- Auto-refreshes every 30 seconds
- Click to navigate to notifications screen

### 2. Notification Types

#### Referral Used Notification

- **Trigger**: When someone uses your referral code
- **Recipient**: The referral code owner
- **Message**: "Someone used your referral code! You earned 200 tokens."
- **Icon**: 🎉

#### Mining Bonus Notification

- **Trigger**: When a referred user claims their mining rewards
- **Recipient**: The referrer (who gets 10% bonus)
- **Message**: "You earned X tokens from your referral's mining (10% of Y tokens)."
- **Icon**: 💰

### 3. Notifications Screen

- View all notifications (read and unread)
- Pull-to-refresh functionality
- Mark individual notifications as read
- Mark all notifications as read
- Delete individual notifications
- Time-based formatting (e.g., "5m ago", "2h ago", "3d ago")
- Empty state with helpful message

## Backend Implementation

### Database Model

```typescript
{
  walletAddress: string; // Recipient's wallet
  type: 'referral_used' | 'mining_bonus' | 'general';
  title: string; // Notification title
  message: string; // Notification message
  data: any; // Additional data
  read: boolean; // Read status
  createdAt: Date; // Timestamp
}
```

### API Endpoints

- `GET /api/notifications/:walletAddress` - Get all notifications
- `PATCH /api/notifications/:notificationId/read` - Mark as read
- `POST /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:notificationId` - Delete notification

### Notification Creation Points

1. **Referral Code Applied** (`backend/controllers/referral.ts`)

   - When user applies a referral code
   - Notifies the referral code owner

2. **Mining Reward Claimed** (`backend/controllers/mining.ts`)
   - When a referred user claims mining rewards
   - Notifies the referrer with 10% bonus amount

## Frontend Implementation

### Components

- `NotificationIcon` - Badge icon with unread count
- `NotificationsScreen` - Full notifications list view

### Services

- `notificationApiService` - API client for notification operations

### Navigation

- Added "Notifications" screen to navigation stack
- Accessible from Home screen via notification icon

## Usage

### For Users

1. Click the bell icon (🔔) on the Home screen
2. View all notifications
3. Tap a notification to mark it as read
4. Swipe down to refresh
5. Use "Mark all read" to clear all unread notifications
6. Tap × to delete individual notifications

### For Developers

To create a custom notification:

```typescript
await Notification.create({
  walletAddress: 'recipient_wallet',
  type: 'general',
  title: 'Custom Title',
  message: 'Custom message',
  data: { customField: 'value' },
});
```

## Testing

1. **Test Referral Notification**:

   - User A creates account (gets referral code)
   - User B creates account and applies User A's code
   - User A should receive notification

2. **Test Mining Bonus Notification**:
   - User B (who used User A's code) starts mining
   - User B claims mining rewards
   - User A should receive notification with 10% bonus amount

## Future Enhancements

- Push notifications (already implemented via notificationService)
- Notification preferences/settings
- Notification categories/filters
- Batch notifications
- Notification history export
