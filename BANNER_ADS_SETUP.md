# Banner Ads Implementation

## Overview

Banner ads have been added to the top of three screens:

- HomeScreen
- MiningScreen
- ClaimScreen

## AdMob Configuration

### App ID

```
ca-app-pub-7930332952469106~3387233787
```

### Banner Ad Unit ID

```
ca-app-pub-7930332952469106/9843673377
```

## Implementation Details

### 1. BannerAd Component

**File:** `src/components/BannerAd.tsx`

A reusable component that displays banner ads:

```typescript
import { BannerAdComponent } from '../components/BannerAd';

// Use in any screen:
<BannerAdComponent />;
```

**Features:**

- Uses test ads in development mode (`__DEV__`)
- Uses your production ad unit ID in release builds
- Adaptive banner size (adjusts to screen width)
- Automatic error handling and logging
- Centered alignment

### 2. Screens Updated

#### HomeScreen

- Banner ad at the very top
- Above the gradient background
- Visible while scrolling

#### MiningScreen

- Banner ad at the very top
- Above the mining progress display
- Always visible

#### ClaimScreen

- Banner ad at the very top
- Above the claim success animation
- Visible during reward claim

## Ad Sizes

The component uses `ANCHORED_ADAPTIVE_BANNER` which:

- Automatically adjusts to screen width
- Optimizes height for best performance
- Works on all device sizes
- Recommended by Google for best fill rates

## Testing

### Development Mode (Test Ads)

When running in development (`__DEV__ = true`):

- Shows Google test ads
- No real ad impressions
- Safe for testing

**To test:**

```bash
npx react-native run-android
```

You should see test banner ads at the top of:

- Home screen
- Mining screen
- Claim screen

### Production Mode (Real Ads)

When building for production:

- Shows real ads from your AdMob account
- Generates real revenue
- Uses your ad unit ID: `ca-app-pub-7930332952469106/9843673377`

**To build production APK:**

```bash
cd android
./gradlew assembleRelease
```

## Ad Behavior

### Loading States

- Ad loads automatically when screen mounts
- Shows blank space while loading
- Displays ad once loaded
- Logs success/failure to console

### Error Handling

- If ad fails to load, shows empty space
- Doesn't crash the app
- Logs error to console for debugging
- Automatically retries on next screen visit

### Performance

- Ads are loaded asynchronously
- Doesn't block UI rendering
- Minimal impact on app performance
- Cached for faster subsequent loads

## Customization

### Change Ad Size

Edit `src/components/BannerAd.tsx`:

```typescript
// Available sizes:
BannerAdSize.BANNER; // 320x50
BannerAdSize.LARGE_BANNER; // 320x100
BannerAdSize.MEDIUM_RECTANGLE; // 300x250
BannerAdSize.FULL_BANNER; // 468x60
BannerAdSize.LEADERBOARD; // 728x90
BannerAdSize.ANCHORED_ADAPTIVE_BANNER; // Adaptive (recommended)
```

### Change Position

To move banner to bottom instead of top:

```typescript
// In any screen, move <BannerAdComponent /> to bottom
<SafeAreaView>
  <LinearGradient>{/* Content */}</LinearGradient>
  <BannerAdComponent /> {/* Bottom position */}
</SafeAreaView>
```

### Add to More Screens

To add banner ads to other screens:

1. Import the component:

```typescript
import { BannerAdComponent } from '../components/BannerAd';
```

2. Add to layout:

```typescript
<BannerAdComponent />
```

## Revenue Optimization Tips

### 1. Ad Placement

✅ **Current:** Top of screen (good visibility)

- Consider testing bottom placement for comparison
- A/B test different positions

### 2. Ad Refresh

- Banner ads auto-refresh every 30-60 seconds
- More screen time = more impressions = more revenue

### 3. User Experience

- Ads are non-intrusive
- Don't block important content
- Smooth loading without layout shifts

### 4. Fill Rate

- Using adaptive banners improves fill rate
- More ad inventory = higher fill rate
- Test in different regions

## Monitoring & Analytics

### Check Ad Performance

1. **AdMob Dashboard:**

   - Go to: https://apps.admob.com
   - View impressions, clicks, revenue
   - Monitor fill rate

2. **Console Logs:**

   ```
   ✅ Banner ad loaded
   ❌ Banner ad failed to load: [error]
   ```

3. **Test Ads:**
   - Always test with test ads first
   - Verify ads load correctly
   - Check layout and positioning

## Troubleshooting

### Ads Not Showing?

**In Development:**

- Test ads should always show
- Check console for errors
- Verify AdMob SDK is installed

**In Production:**

- Wait 24-48 hours after first release
- Check AdMob account is active
- Verify ad unit ID is correct
- Check app is approved in AdMob

### Layout Issues?

**Banner too large:**

- Use smaller ad size
- Adjust container padding

**Banner overlapping content:**

- Ensure proper SafeAreaView usage
- Add margin/padding to content

**Banner not centered:**

- Check container alignment in BannerAd.tsx

### Performance Issues?

**App slow with ads:**

- Ads are loaded asynchronously (shouldn't affect performance)
- Check for other performance issues
- Monitor memory usage

**Ads causing crashes:**

- Check AdMob SDK version compatibility
- Update to latest react-native-google-mobile-ads
- Check console for error messages

## Best Practices

### ✅ Do:

- Use test ads during development
- Monitor ad performance regularly
- Respect user experience
- Follow AdMob policies
- Test on multiple devices

### ❌ Don't:

- Click your own ads (policy violation)
- Force users to click ads
- Place too many ads on one screen
- Hide or manipulate ad content
- Use production ads during testing

## Next Steps

1. **Test the implementation:**

   - Run app in development mode
   - Verify test ads appear on all three screens
   - Check layout and positioning

2. **Build production version:**

   - Create release APK
   - Test on physical device
   - Verify production ads load

3. **Monitor performance:**

   - Check AdMob dashboard after 24-48 hours
   - Monitor impressions and revenue
   - Optimize based on data

4. **Consider adding more ad placements:**
   - Leaderboard screen
   - Settings screen
   - Between content sections

## Additional Ad Types

You already have:

- ✅ Rewarded ads (for multiplier upgrade and token earning)
- ✅ Banner ads (on Home, Mining, Claim screens)

Consider adding:

- Interstitial ads (full-screen between screens)
- Native ads (blended with content)
- Rewarded interstitial ads (skippable full-screen)

## Support

For AdMob issues:

- AdMob Help: https://support.google.com/admob
- React Native Google Mobile Ads: https://docs.page/invertase/react-native-google-mobile-ads

For implementation issues:

- Check console logs
- Review this documentation
- Test with test ads first
