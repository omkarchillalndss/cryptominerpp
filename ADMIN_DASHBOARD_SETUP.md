# Admin Dashboard Setup Guide

## Overview

Your admin dashboard has been successfully created with a modern dark theme design similar to the ChainScope interface you provided. The dashboard includes:

✅ **Backend Routes & Controllers** - New admin API endpoints
✅ **React Dashboard** - Modern UI with routing
✅ **Sidebar Navigation** - Users, Mining, Payment, Referral Rewards, Daily Rewards
✅ **Separate Components** - Reusable components for tables, cards, pagination
✅ **Backend Integration** - Connected to your existing backend

## Quick Start

### Option 1: Using the Start Script (Recommended)

Simply run:

```bash
start-admin.bat
```

This will start both the backend server and admin panel in separate windows.

### Option 2: Manual Start

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Admin Panel:**

```bash
cd adminpanel
npm run dev
```

## Access the Dashboard

- **Admin Panel**: http://localhost:5173
- **Backend API**: http://localhost:3000

## What Was Created

### Backend Files

1. **backend/routes/admin.ts** - Admin API routes
2. **backend/controllers/admin.ts** - Admin controller functions
3. **backend/server.ts** - Updated to include admin routes

### Admin Panel Structure

```
adminpanel/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   ├── StatsCard.jsx       # Dashboard stat cards
│   │   ├── Table.jsx           # Reusable data table
│   │   └── Pagination.jsx      # Table pagination
│   ├── pages/
│   │   ├── Dashboard.jsx       # Main dashboard with stats
│   │   ├── Users.jsx           # Users management
│   │   ├── Mining.jsx          # Mining sessions
│   │   ├── Payment.jsx         # Payment tracking
│   │   ├── ReferralRewards.jsx # Referral management
│   │   └── DailyRewards.jsx    # Daily rewards tracking
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.jsx                 # Main app with routing
│   └── index.css               # Global styles
```

## Features

### 1. Dashboard Page

- Total users count
- Active mining sessions
- Total referrals
- Rewards claimed
- Total platform balance

### 2. Users Page

- List all registered users
- View wallet addresses
- Check user balances
- See mining rates
- Referral codes
- Pagination support

### 3. Mining Page

- Active and completed sessions
- Mining rates per user
- Total earned amounts
- Session start times
- Status indicators

### 4. Payment Page

- User balances
- Payment history
- Wallet addresses
- Registration dates

### 5. Referral Rewards Page

- Referrer and referred user details
- Referral codes
- Referral dates
- Activity tracking

### 6. Daily Rewards Page

- Reward amounts
- Claim status
- Claimed timestamps
- User tracking

## API Endpoints

All admin endpoints are prefixed with `/api/admin`:

- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users?page=1&limit=20` - Paginated users list
- `GET /api/admin/mining?page=1&limit=20` - Mining sessions
- `GET /api/admin/payments?page=1&limit=20` - Payment records
- `GET /api/admin/referrals?page=1&limit=20` - Referral data
- `GET /api/admin/daily-rewards?page=1&limit=20` - Daily rewards

## Design Features

✨ **Dark Theme** - Modern dark interface matching your reference
✨ **Gradient Accents** - Green, blue, purple, and orange gradients
✨ **Responsive Layout** - Works on all screen sizes
✨ **Smooth Animations** - Hover effects and transitions
✨ **Icon Integration** - Lucide React icons throughout
✨ **Clean Typography** - Professional font hierarchy

## Customization

### Change API URL

Edit `adminpanel/.env`:

```env
VITE_API_BASE_URL=http://your-api-url/api
```

### Modify Colors

Edit `adminpanel/src/index.css` to change the color scheme:

```css
:root {
  --bg-primary: #0f0f0f;
  --bg-secondary: #1a1a1a;
  --accent-green: #4ade80;
  /* ... more colors */
}
```

### Add New Pages

1. Create a new page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add menu item in `src/components/Sidebar.jsx`

## Troubleshooting

### Backend Connection Issues

Make sure your backend is running on port 3000. Check `backend/.env` for MongoDB connection.

### Port Already in Use

If port 5173 is busy, Vite will automatically use the next available port.

### CORS Issues

The backend already has CORS enabled in `backend/server.ts`.

## Next Steps

1. Start both servers using `start-admin.bat`
2. Navigate to http://localhost:5173
3. Explore the dashboard and different pages
4. Add authentication if needed
5. Customize the design to match your brand

## Notes

- All data is fetched from your existing backend
- Pagination is implemented for large datasets
- The design follows the dark theme from your reference image
- Components are reusable and easy to modify
- The sidebar is fixed and always visible
- All routes are properly configured with React Router

Enjoy your new admin dashboard! 🚀
