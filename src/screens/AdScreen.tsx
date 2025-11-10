import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
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
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>Advertisement</Text>
      <Text>Closing in {Math.max(0, left)}s…</Text>
    </View>
  );
}
