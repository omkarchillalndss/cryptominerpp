import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useMining } from '../contexts/MiningContext';

export default function AdScreen({ navigation }: any) {
  const { upgradeMultiplier } = useMining();
  const [left, setLeft] = useState(10);

  useEffect(() => {
    const i = setInterval(() => setLeft(p => p - 1), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (left <= 0) {
      upgradeMultiplier().finally(() => navigation.goBack());
    }
  }, [left]);

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
          <Text style={styles.icon}>📺</Text>
          <Text style={styles.title}>Advertisement</Text>
          <Text style={styles.subtitle}>
            Watching ad to unlock multiplier boost
          </Text>

          <View style={styles.timerContainer}>
            <Text style={styles.timerValue}>{Math.max(0, left)}</Text>
            <Text style={styles.timerLabel}>seconds remaining</Text>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((10 - left) / 10) * 100}%` },
              ]}
            />
          </View>
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
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerValue: {
    fontSize: 72,
    fontWeight: '700',
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 14,
    color: '#e9d5ff',
    marginTop: 8,
  },
  progressBar: {
    width: 200,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
});
