import React from 'react';
import { View, Text, Button } from 'react-native';
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

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>
        Time Left: {fmt(Math.max(0, remainingSeconds))}
      </Text>
      <ProgressBar progress={progress} />
      <Text style={{ marginVertical: 8 }}>
        Live Tokens: {liveTokens.toFixed(4)}
      </Text>
      <Text>Multiplier: {currentMultiplier}×</Text>
      {finished ? (
        <Button
          title="Claim Rewards"
          onPress={() => navigation.navigate('Claim')}
        />
      ) : (
        <>
          <Button
            title="Upgrade Multiplier"
            onPress={() => navigation.navigate('Ad')}
          />
          <Button
            title="Stop & Claim Partial"
            onPress={() => {
              navigation.navigate('Claim'); // go claim directly
            }}
          />
        </>
      )}
    </View>
  );
}
