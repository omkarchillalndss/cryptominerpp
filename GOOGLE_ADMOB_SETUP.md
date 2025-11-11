# 🎯 Google AdMob Integration - Complete Setup Guide

## ✅ What Was Done:

- ✅ Replaced dummy 10-second timer with **real Google AdMob rewarded video ads**
- ✅ Integrated `react-native-google-mobile-ads` library
- ✅ Added AdMob configuration to Android and iOS
- ✅ Implemented reward handling and error management
- ✅ Added test ad units for development

---

## 📍 WHERE TO PASTE YOUR AD UNIT IDs (3 Locations):

### **Location 1: Rewarded Ad Unit ID**

**File:** `src/screens/AdScreen.tsx`  
**Line:** 18-20

```typescript
// ⚠️ PASTE YOUR ADMOB REWARDED AD UNIT ID HERE ⚠️
const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED // Test ad for development
  : 'ca-app-pub-3940256099942544/5224354917'; // ⚠️ REPLACE THIS
```

**What to do:**

1. Go to [AdMob Console](https://apps.admob.com/)
2. Select your app → **Ad units** → **Add ad unit**
3. Choose **"Rewarded"** ad format
4. Name it (e.g., "Multiplier Boost Reward")
5. Copy the **Ad Unit ID** (looks like: `ca-app-pub-3940256099942544/5224354917`)
6. Replace `'ca-app-pub-3940256099942544/5224354917'` with your actual Ad Unit ID

---

### **Location 2: Android AdMob App ID**

**File:** `android/app/src/main/AndroidManifest.xml`  
**Line:** 31

```xml
<!-- ⚠️ ADMOB APP ID - REPLACE WITH YOUR PRODUCTION APP ID ⚠️ -->
<meta-data
  android:name="com.google.android.gms.ads.APPLICATION_ID"
  android:value="ca-app-pub-3940256099942544/5224354917" />
<!-- ⚠️ REPLACE THE VALUE ABOVE ⚠️ -->
```

**What to do:**

1. Go to [AdMob Console](https://apps.admob.com/)
2. Click **"Apps"** in the sidebar
3. Select your app (or create new app)
4. Copy the **App ID** (looks like: `ca-app-pub-3940256099942544/5224354917`)
5. Replace the `android:value` with your App ID

---

### **Location 3: iOS AdMob App ID**

**File:** `ios/cryptominerapp/Info.plist`  
**Line:** 56-58

```xml
<!-- ⚠️ ADMOB APP ID - REPLACE WITH YOUR PRODUCTION APP ID ⚠️ -->
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-3940256099942544/5224354917</string>
<!-- ⚠️ REPLACE THE STRING ABOVE ⚠️ -->
```

**What to do:**

1. Use the **same App ID** from Location 2 above
2. Replace the `<string>` value with your App ID

---

## 🎮 How It Works Now:

### Before (Dummy):

1. User clicks "Upgrade Multiplier"
2. Shows 10-second countdown timer
3. Automatically upgrades after 10 seconds

### After (Real Ads):

1. User clicks **"Upgrade Multiplier"** in DurationPopup
2. App navigates to **AdScreen**
3. **Loading screen** appears while ad loads
4. **Google AdMob shows real video ad**
5. User **must watch full ad** to earn reward
6. After completion → **Multiplier automatically upgraded**
7. User returns to previous screen

---

## 🔑 Step-by-Step Setup:

### Step 1: Create AdMob Account & App

1. Go to [AdMob Console](https://apps.admob.com/)
2. Sign in with Google account
3. Click **"Apps"** → **"Add App"**
4. Choose platform (Android/iOS)
5. Enter app name
6. Copy the **App ID** (format: `ca-app-pub-3940256099942544/5224354917`)

### Step 2: Create Rewarded Ad Unit

1. In AdMob Console, select your app
2. Click **"Ad units"** → **"Add ad unit"**
3. Select **"Rewarded"** ad format
4. Name it: "Multiplier Boost Reward"
5. Click **"Create ad unit"**
6. Copy the **Ad Unit ID** (format: `ca-app-pub-3940256099942544/5224354917`)

### Step 3: Paste IDs in Code

1. **AdScreen.tsx** (line 20) → Paste **Ad Unit ID**
2. **AndroidManifest.xml** (line 31) → Paste **App ID**
3. **Info.plist** (line 58) → Paste **App ID**

### Step 4: Test

1. Run app in development mode: `npm run android` or `npm run ios`
2. Navigate to upgrade multiplier
3. You should see a **test ad** (labeled "Test Ad")
4. Watch the ad and verify multiplier upgrades

### Step 5: Release

1. Build release version
2. Real ads will show to users
3. You earn revenue when users watch ads!

---

## 🧪 Testing:

### Development Mode (`__DEV__ = true`):

- ✅ Uses **TestIds.REWARDED** automatically
- ✅ Shows test ads with "Test Ad" label
- ✅ No real ads, no revenue
- ✅ Safe to test unlimited times

### Production Mode (Release Build):

- ⚠️ Uses your **production Ad Unit ID**
- ⚠️ Shows **real ads** to users
- ⚠️ Generates **real revenue**
- ⚠️ **Never click your own ads!**

---

## ⚠️ IMPORTANT WARNINGS:

### 🚫 DO NOT:

- ❌ Click your own ads (AdMob will ban your account)
- ❌ Use test IDs in production builds
- ❌ Use production IDs in development
- ❌ Encourage users to click ads
- ❌ Show ads too frequently (respect user experience)

### ✅ DO:

- ✅ Test thoroughly with test ads
- ✅ Replace IDs before releasing
- ✅ Handle ad load failures gracefully
- ✅ Respect AdMob policies
- ✅ Monitor AdMob dashboard for performance

---

## 🔍 Troubleshooting:

### Ad not loading?

- Check internet connection
- Verify Ad Unit ID is correct
- Check AdMob console for account status
- Make sure ad unit is active
- Wait a few minutes (new ad units take time to activate)

### "Ad failed to load" error?

- Normal during development with test ads
- Try again after a few seconds
- Check if you exceeded request limits
- Verify AdMob App ID is correct in manifest/plist

### Ad shows but reward not given?

- Check console logs for errors
- Verify `upgradeMultiplier()` function works
- Make sure `EARNED_REWARD` event listener is working
- Test with test ads first

### App crashes when showing ad?

- Make sure `react-native-google-mobile-ads` is installed
- Run `cd ios && pod install` for iOS
- Rebuild the app completely
- Check for conflicting dependencies

---

## 📊 Monitoring Performance:

1. Go to [AdMob Console](https://apps.admob.com/)
2. Select your app
3. View metrics:
   - **Impressions**: How many ads shown
   - **Match rate**: How often ads are available
   - **Estimated earnings**: Your revenue
   - **eCPM**: Earnings per 1000 impressions

---

## 📚 Additional Resources:

- **AdMob Console:** https://apps.admob.com/
- **AdMob Help Center:** https://support.google.com/admob
- **AdMob Policies:** https://support.google.com/admob/answer/6128543
- **React Native Google Mobile Ads Docs:** https://docs.page/invertase/react-native-google-mobile-ads
- **AdMob Best Practices:** https://support.google.com/admob/answer/6128877

---

## 📝 Summary Checklist:

- [ ] Created AdMob account
- [ ] Created app in AdMob
- [ ] Created Rewarded ad unit
- [ ] Copied App ID
- [ ] Copied Ad Unit ID
- [ ] Pasted Ad Unit ID in `src/screens/AdScreen.tsx` (line 20)
- [ ] Pasted App ID in `android/app/src/main/AndroidManifest.xml` (line 31)
- [ ] Pasted App ID in `ios/cryptominerapp/Info.plist` (line 58)
- [ ] Tested with development build (test ads)
- [ ] Verified reward is granted after watching ad
- [ ] Built release version with production IDs
- [ ] Submitted to Play Store / App Store

---

**That's it! Your app now shows real Google AdMob ads!** 🎉

Users must watch full video ads to unlock multiplier boosts, and you earn revenue from each ad view.
