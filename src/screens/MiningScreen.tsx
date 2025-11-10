import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useMining } from '../contexts/MiningContext';
import { ProgressBar } from '../components/ProgressBar';

const fmt = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${ss
    .toString()
    .padStart(2, '0')}`;
};

export default function MiningScreen({ navigation }: any) {
  const {
    remainingSeconds,
    selectedDuration,
    liveTokens,
    currentMultiplier,
    miningStatus,
    stopMining,
  } = useMining();

  const progress =
    selectedDuration > 0
      ? (selectedDuration - remainingSeconds) / selectedDuration
      : 0;
  const finished =
    miningStatus === 'inactive' &&
    remainingSeconds === 0 &&
    selectedDuration > 0;

  const durationHours = selectedDuration / 3600;
  const baseRate = 0.01;
  const effectiveRate = baseRate * currentMultiplier; // Correct: multiply by multiplier
  const totalReward = effectiveRate * selectedDuration;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#581c87', '#1e3a8a', '#312e81']}
        style={styles.container}
      >
        {/* Animated background elements */}
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
        <View style={styles.bgCircle3} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.miningIcon}>⛏️</Text>
            <Text style={styles.mainTitle}>Mining in Progress</Text>
            <View style={styles.activeBadge}>
              <Text style={styles.badgeText}>Active</Text>
            </View>
          </View>

          {/* Timer Card */}
          <LinearGradient
            colors={['#3b82f6', '#9333ea', '#ec4899']}
            style={styles.timerCard}
          >
            <View style={styles.cardDecoration} />
            <Text style={styles.timerLabel}>Time Remaining</Text>
            <Text style={styles.timerValue}>
              {fmt(Math.max(0, remainingSeconds))}
            </Text>
          </LinearGradient>

          {/* Progress Card */}
          <View style={styles.progressCard}>
            <Text style={styles.cardTitle}>Mining Progress</Text>
            <View style={styles.progressContainer}>
              <ProgressBar progress={progress} />
              <View style={styles.progressOverlay}>
                <Text style={styles.progressText}>
                  {(Math.min(progress, 1) * 100).toFixed(1)}%
                </Text>
              </View>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressInfoLabel}>Progress</Text>
              <Text style={styles.progressInfoValue}>
                {(Math.min(progress, 1) * 100).toFixed(1)}%
              </Text>
            </View>
          </View>

          {/* Tokens Mined Card */}
          <LinearGradient
            colors={['#fbbf24', '#f97316', '#ec4899']}
            style={styles.tokensCard}
          >
            <View style={styles.cardDecorationBottom} />
            <Text style={styles.tokensIcon}>💰</Text>
            <Text style={styles.tokensLabel}>Tokens Mined</Text>
            <Text style={styles.tokensValue}>{liveTokens.toFixed(6)}</Text>
            <Text style={styles.tokensTotal}>
              / {totalReward.toFixed(4)} total
            </Text>
          </LinearGradient>

          {/* Mining Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Duration</Text>
                <Text style={styles.infoValue}>{durationHours}h</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Multiplier</Text>
                <Text style={styles.infoValue}>{currentMultiplier}×</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Rate</Text>
                <Text style={styles.infoValueSmall}>
                  {effectiveRate.toFixed(6)}/s
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Ad')}
              activeOpacity={0.8}
              style={styles.buttonHalf}
            >
              <LinearGradient
                colors={['#ca8a04', '#ea580c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>⚡ Upgrade Multiplier</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Claim')}
              activeOpacity={0.8}
              style={styles.buttonHalf}
            >
              <View style={styles.outlineButton}>
                <Text style={styles.outlineButtonText}>Cancel & Claim</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  bgCircle3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 384,
    height: 384,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderRadius: 192,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 32,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  miningIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  activeBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(134, 239, 172, 0.3)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  timerCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardDecoration: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 160,
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 80,
  },
  cardDecorationBottom: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 160,
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 80,
  },
  timerLabel: {
    color: 'rgba(191, 219, 254, 1)',
    fontSize: 14,
    marginBottom: 8,
    zIndex: 10,
  },
  timerValue: {
    color: '#fff',
    fontSize: 56,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    zIndex: 10,
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  progressContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  progressInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  progressInfoLabel: {
    color: '#e9d5ff',
    fontSize: 12,
    marginBottom: 4,
  },
  progressInfoValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  tokensCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  tokensIcon: {
    fontSize: 48,
    marginBottom: 8,
    zIndex: 10,
  },
  tokensLabel: {
    color: 'rgba(254, 243, 199, 1)',
    fontSize: 14,
    marginBottom: 8,
    zIndex: 10,
  },
  tokensValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    zIndex: 10,
  },
  tokensTotal: {
    color: 'rgba(254, 243, 199, 1)',
    fontSize: 12,
    marginTop: 8,
    zIndex: 10,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  infoLabel: {
    color: '#e9d5ff',
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  infoValueSmall: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  buttonHalf: {
    flex: 1,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  outlineButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  outlineButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
