# Crypto Miner App - Setup Instructions

## Prerequisites

- Node.js installed
- Android Studio with emulator setup
- MongoDB running (for backend)

## Running the App

### 1. Start the Backend Server

```bash
cd cryptominerapp/backend
npm run dev
```

The server will start on `http://localhost:3000`

### 2. Start the React Native App

In a new terminal:

```bash
cd cryptominerapp
npm run android
```

## Important Notes

### Network Configuration

- The app is configured to use `http://10.0.2.2:3000` for Android emulator
- `10.0.2.2` is the special IP that Android emulator uses to access `localhost` on your machine
- If testing on a physical device, update `.env` file with your computer's IP address

### Environment Variables

The app uses `.env` file for configuration:

```
API_BASE_URL=http://10.0.2.2:3000
```

### Backend Environment

Check `backend/.env` for MongoDB connection and other settings.

## Troubleshooting

### Network Error

If you see "Network Error":

1. Make sure backend server is running (`npm run dev` in backend folder)
2. Check that MongoDB is running
3. Verify the API_BASE_URL in `.env` file

### Build Errors

If you get build errors:

```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Metro Bundler Issues

If Metro bundler has issues:

```bash
npm start -- --reset-cache
```

## Features

- ✅ Beautiful gradient UI design
- ✅ Mining with multipliers
- ✅ Wallet management
- ✅ Reward claiming
- ✅ Ad watching for multiplier boosts
- ✅ Real-time mining progress tracking

## Screens

1. **SignupScreen** - Enter wallet address
2. **HomeScreen** - View balances and start mining
3. **MiningScreen** - Track mining progress
4. **ClaimScreen** - Claim rewards
5. **AdScreen** - Watch ads for multiplier boost
6. **WalletScreen** - View wallet details
