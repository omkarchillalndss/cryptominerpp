# Notification System UI Guide

## Home Screen Changes

### Before

```
[🏆 Leaderboard]                    [🚪 Logout]
```

### After

```
[🏆 Leaderboard]          [🔔 3] [🚪 Logout]
                           ↑
                    Notification Icon
                    with badge count
```

## Notification Icon States

### No Unread Notifications

```
[🔔]
```

### With Unread Notifications

```
[🔔]
 ↑
[3]  ← Red badge with count
```

### Badge Count Display

- 1-99: Shows exact number
- 100+: Shows "99+"

## Notifications Screen Layout

```
┌─────────────────────────────────────┐
│ ← Back    Notifications  [Mark all] │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🎉  New Referral!            ● │ │ ← Unread (purple)
│ │     Someone used your referral  │ │
│ │     code! You earned 200 tokens │ │
│ │     5m ago                   × │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 💰  Mining Bonus Earned!       │ │ ← Read (transparent)
│ │     You earned 15 tokens from   │ │
│ │     your referral's mining      │ │
│ │     2h ago                   × │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

## Notification Card States

### Unread Notification

- Background: Purple tint (`rgba(147, 51, 234, 0.2)`)
- Border: Purple (`rgba(147, 51, 234, 0.4)`)
- Indicator: Purple dot (●)

### Read Notification

- Background: Transparent white (`rgba(255, 255, 255, 0.1)`)
- Border: White (`rgba(255, 255, 255, 0.2)`)
- Indicator: None

## Notification Types

### 1. Referral Used

```
🎉  New Referral!
    Someone used your referral code!
    You earned 200 tokens.
    5m ago
```

### 2. Mining Bonus

```
💰  Mining Bonus Earned!
    You earned 15 tokens from your
    referral's mining (10% of 150 tokens).
    2h ago
```

## Empty State

```
        🔔

   No notifications yet

   You'll be notified when someone
   uses your referral code or when
   you earn mining bonuses
```

## Time Formatting

- Less than 1 minute: "Just now"
- Less than 60 minutes: "5m ago"
- Less than 24 hours: "2h ago"
- Less than 7 days: "3d ago"
- 7+ days: "Nov 17, 2025"

## User Interactions

### Tap Notification

- Marks unread notification as read
- Purple highlight disappears
- Unread count decreases

### Tap "Mark all read"

- All notifications marked as read
- All purple highlights disappear
- Badge count becomes 0

### Tap Delete (×)

- Shows confirmation dialog
- Removes notification from list
- Cannot be undone

### Pull Down

- Refreshes notification list
- Updates unread count
- Shows loading indicator

## Color Scheme

### Notification Icon

- Background: `rgba(147, 51, 234, 0.2)`
- Border: `rgba(147, 51, 234, 0.4)`
- Badge: `#ef4444` (red)

### Unread Card

- Background: `rgba(147, 51, 234, 0.2)`
- Border: `rgba(147, 51, 234, 0.4)`
- Dot: `#9333ea` (purple)

### Read Card

- Background: `rgba(255, 255, 255, 0.1)`
- Border: `rgba(255, 255, 255, 0.2)`

### Text Colors

- Title: `#fff` (white)
- Message: `#e9d5ff` (light purple)
- Time: `#c4b5fd` (lighter purple)
