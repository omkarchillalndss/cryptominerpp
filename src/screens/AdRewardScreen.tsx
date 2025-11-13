import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { useMining } from '../contexts/MiningContext';
import { adRewardService } from '../services/adRewardService';

// AdMob Rewarded Ad Unit ID for earning tokens
const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED // Test ad for development
  : 'ca-app-pub-7930332952469106/6559535492'; // Production Ad Unit ID

let rewardedAd: RewardedAd | null = null;

export default function AdRewardScreen({ navigation }: any) {
  const { walletAddress, refreshBalance } = useMining();
  const [adLoaded, setAdLoaded] = useState(false);
  const [adShown, setAdShown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create and load the ad when component mounts
    rewardedAd = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID);

    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        console.log('✅ Rewarded ad loaded for token earning');
        setAdLoaded(true);
        setLoading(false);
      },
    );

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async reward => {
        console.log('🎁 User earned reward from ad:', reward);
        setAdShown(true);

        try {
          // Claim the ad reward from backend
          const result = await adRewardService.claimReward(walletAddress);

          // Refresh balance
          await refreshBalance();

          console.log(
            `💰 User earned ${result.reward} tokens! (${result.claimedCount}/6 today)`,
          );

          // Show success message
          Alert.alert(
            '🎉 Reward Earned!',
            `You earned ${result.reward} tokens!\n\nClaims today: ${result.claimedCount}/6\nRemaining: ${result.remainingClaims}`,
            [
              {
                text: 'Awesome!',
                onPress: () => {
                  // Navigate back to home
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  } else {
                    navigation.navigate('Home');
                  }
                },
              },
            ],
          );
        } catch (error: any) {
          console.error('❌ Failed to claim ad reward:', error);

          // Check if it's a backend connection error
          const isBackendError =
            error.message?.includes('404') ||
            error.message?.includes('Network') ||
            error.message?.includes('Request failed');

          const errorTitle = isBackendError ? 'Backend Not Available' : 'Error';
          const errorMessage = isBackendError
            ? 'The backend server is not running. Please restart the backend server and try again.\n\nSee RESTART_BACKEND.md for instructions.'
            : error.message || 'Failed to claim reward. Please try again.';

          Alert.alert(errorTitle, errorMessage, [
            {
              text: 'OK',
              onPress: () => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.navigate('Home');
                }
              },
            },
          ]);
        }
      },
    );

    // Load the ad
    rewardedAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [walletAddress]);

  useEffect(() => {
    // Show ad when it's loaded
    if (adLoaded && !adShown && rewardedAd) {
      rewardedAd
        .show()
        .then(() => {
          console.log('📺 Ad shown successfully');
        })
        .catch(error => {
          console.error('❌ Failed to show ad:', error);
          Alert.alert(
            'Ad Unavailable',
            'Failed to show ad. Please try again later.',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  } else {
                    navigation.navigate('Home');
                  }
                },
              },
            ],
          );
        });
    }
  }, [adLoaded, adShown]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#581c87', '#1e3a8a', '#312e81']}
        style={styles.container}
      >
        {/* Animated background elements */}
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        <View style={styles.content}>
          <Text style={styles.icon}>💰</Text>
          <Text style={styles.title}>
            {loading ? 'Loading Ad...' : 'Showing Ad'}
          </Text>
          <Text style={styles.subtitle}>
            {loading
              ? 'Please wait while we load the advertisement'
              : 'Watch the full ad to earn 10-60 tokens!'}
          </Text>

          {loading && (
            <View style={styles.loadingContainer}>
              <View style={styles.spinner} />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#581c87',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  bgCircle1: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: 384,
    height: 384,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderRadius: 192,
  },
  bgCircle2: {
    position: 'absolute',
    bottom: '25%',
    right: '25%',
    width: 384,
    height: 384,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 192,
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  icon: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#e9d5ff',
    textAlign: 'center',
    marginBottom: 48,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  spinner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: '#fff',
  },
  loadingText: {
    fontSize: 14,
    color: '#e9d5ff',
    marginTop: 16,
  },
});
