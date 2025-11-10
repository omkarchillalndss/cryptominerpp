import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useMining } from '../contexts/MiningContext';
import { DurationPopup } from '../components/DurationPopup';

export default function HomeScreen({ navigation }: any) {
  const {
    totalBalance,
    miningStatus,
    currentMultiplier,
    startMining,
    refreshBalance,
    walletAddress,
    walletBalance,
    logout,
  } = useMining();
  const [popup, setPopup] = useState(false);

  const isMining = miningStatus === 'active';
  const canClaim = false; // This will be determined by your logic

  return (
    <LinearGradient
      colors={['#581c87', '#1e3a8a', '#312e81']}
      style={styles.container}
    >
      {/* Animated background elements */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Wallet')}
              style={styles.walletButton}
            >
              <Text style={styles.walletButtonText}>💼 Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                try {
                  await logout();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Signup' }],
                  });
                } catch (error: any) {
                  Alert.alert(
                    'Cannot Logout',
                    error.message || 'Cannot logout while mining is active',
                  );
                }
              }}
              style={[styles.walletButton, styles.logoutButton]}
            >
              <Text style={styles.walletButtonText}>🚪 Logout</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.mainTitle}>🪙 Crypto Miner</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
            </Text>
          </View>
        </View>

        {/* Balances */}
        <View style={styles.balancesContainer}>
          <LinearGradient
            colors={['#fbbf24', '#f97316', '#ec4899']}
            style={styles.balanceCard}
          >
            <View style={styles.cardDecoration} />
            <Text style={styles.balanceLabel}>Mining Balance</Text>
            <Text style={styles.balanceValue}>{totalBalance.toFixed(4)}</Text>
          </LinearGradient>

          {/* <LinearGradient
            colors={['#4ade80', '#10b981', '#14b8a6']}
            style={styles.balanceCard}
          >
            <View style={styles.cardDecoration} />
            <Text style={styles.balanceLabel}>Wallet Balance</Text>
            <Text style={styles.balanceValue}>
              {(walletBalance || 0).toFixed(4)}
            </Text>
          </LinearGradient> */}
        </View>

        {/* Mining Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Mining Status</Text>
            <View style={[styles.badge, isMining && styles.badgeActive]}>
              <Text style={styles.badgeText}>
                {isMining ? '🟢 Active' : '⚪ Inactive'}
              </Text>
            </View>
          </View>

          <View style={styles.statusContent}>
            {!isMining && !canClaim && (
              <View style={styles.centerContent}>
                <Text style={styles.statusMessage}>
                  Start mining to earn tokens
                </Text>
                <TouchableOpacity
                  onPress={() => setPopup(true)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#9333ea', '#2563eb']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionButtonText}>Start Mining</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {canClaim && (
              <View style={styles.centerContent}>
                <Text style={styles.checkmark}>✅</Text>
                <Text style={styles.successMessage}>
                  Mining completed! Claim your rewards.
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Claim')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#16a34a', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionButtonText}>Claim Rewards</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {isMining && (
              <TouchableOpacity
                onPress={() => navigation.navigate('Mining')}
                activeOpacity={0.8}
                style={styles.centerContent}
              >
                <Text style={styles.miningIcon}>⛏️</Text>
                <Text style={styles.miningMessage}>
                  Mining in progress... Tap to view
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Base Rate</Text>
              <Text style={styles.infoValue}>0.01 tokens/sec</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Multiplier</Text>
              <Text style={styles.infoValue}>1× - 6×</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <DurationPopup
        visible={popup}
        currentMultiplier={currentMultiplier}
        onClose={() => setPopup(false)}
        onUpgrade={() => {
          setPopup(false);
          navigation.navigate('Ad');
        }}
        onStart={async sec => {
          setPopup(false);
          await startMining(sec);
          navigation.navigate('Mining');
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 32,
    zIndex: 10,
  },
  header: {
    marginBottom: 32,
  },
  headerRight: {
    alignItems: 'flex-end',
    marginBottom: 16,
    flexDirection: 'row',
    gap: 8,
  },
  walletButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  walletButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  addressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  addressText: {
    color: '#e9d5ff',
    fontSize: 14,
  },
  balancesContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  balanceCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardDecoration: {
    position: 'absolute',
    top: -64,
    right: -64,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 64,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    marginBottom: 4,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  statusCard: {
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
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badgeActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.8)',
    borderColor: 'rgba(134, 239, 172, 0.3)',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statusContent: {
    paddingVertical: 24,
  },
  centerContent: {
    alignItems: 'center',
  },
  statusMessage: {
    color: '#e9d5ff',
    fontSize: 14,
    marginBottom: 16,
  },
  checkmark: {
    fontSize: 48,
    marginBottom: 16,
  },
  successMessage: {
    color: '#86efac',
    fontSize: 14,
    marginBottom: 16,
  },
  miningIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  miningMessage: {
    color: '#93c5fd',
    fontSize: 14,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
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
    fontWeight: '600',
  },
});
