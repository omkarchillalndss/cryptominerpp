# 🔧 Fix AdMob Module Error

## Error:

```
Invariant Violation: TurboModuleRegistry.getEnforcing(...):
'RNGoogleMobileAdsModule' could not be found.
```

## ✅ Solution:

This error occurs because the native module needs to be rebuilt after adding AdMob configuration.

### **Step 1: Clean Build**

#### Android:

```bash
cd android
./gradlew clean
cd ..
```

#### iOS:

```bash
cd ios
rm -rf Pods
rm Podfile.lock
pod install
cd ..
```

---

### **Step 2: Reinstall Dependencies**

```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install

# Or if using yarn
rm -rf node_modules
yarn install
```

---

### **Step 3: Rebuild the App**

#### Android:

```bash
# Stop Metro bundler if running (Ctrl+C)

# Clean and rebuild
npx react-native run-android
```

#### iOS:

```bash
# Stop Metro bundler if running (Ctrl+C)

# Rebuild
npx react-native run-ios
```

---

### **Alternative: Complete Clean Rebuild**

If the above doesn't work, do a complete clean:

#### Android:

```bash
# 1. Clean Android
cd android
./gradlew clean
cd ..

# 2. Clear Metro cache
npx react-native start --reset-cache

# 3. In a new terminal, rebuild
npx react-native run-android
```

#### iOS:

```bash
# 1. Clean iOS
cd ios
rm -rf Pods
rm Podfile.lock
pod deintegrate
pod install
cd ..

# 2. Clear Metro cache
npx react-native start --reset-cache

# 3. In a new terminal, rebuild
npx react-native run-ios
```

---

## 🎯 Quick Fix (Windows):

Run these commands in order:

```powershell
# 1. Clean Android build
cd android
.\gradlew clean
cd ..

# 2. Clear Metro cache and start
npx react-native start --reset-cache
```

Then in a **new terminal**:

```powershell
# 3. Rebuild and run
npx react-native run-android
```

---

## ✅ Verification:

After rebuilding, the app should:

1. Start without the red error screen
2. Show the splash screen
3. Navigate to home screen
4. When you click "Upgrade Multiplier", it should load an ad

---

## 🔍 Still Having Issues?

### Check if module is installed:

```bash
npm list react-native-google-mobile-ads
```

Should show:

```
react-native-google-mobile-ads@16.0.0
```

### If not installed:

```bash
npm install react-native-google-mobile-ads
```

Then rebuild following Step 3 above.

---

## 📝 Why This Happens:

- Native modules (like AdMob) need to be compiled into the native code
- When you add new native modules or change configuration, you must rebuild
- The JavaScript code can't find the native module until it's compiled
- Cleaning and rebuilding ensures the native module is properly linked

---

## ⚠️ Important:

- **Always rebuild** after adding native modules
- **Always clean** before rebuilding if you have issues
- **Clear Metro cache** if you see stale code
- **Restart Metro bundler** after cleaning

---

## 🎉 After Fixing:

Your app will:

- ✅ Load without errors
- ✅ Show test ads in development
- ✅ Show real ads in production
- ✅ Upgrade multiplier after watching ads
- ✅ Generate revenue from ad views

---

**Need more help?** Check the full setup guide in `GOOGLE_ADMOB_SETUP.md`
