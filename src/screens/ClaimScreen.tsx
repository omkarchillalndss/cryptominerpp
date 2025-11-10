import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useMining } from '../contexts/MiningContext';

export default function ClaimScreen({ navigation }: any) {
  const { claimRewards } = useMining();
  const [awarded, setAwarded] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const a = await claimRewards();
        setAwarded(a);
      } catch (e: any) {
        Alert.alert('Claim failed', e.message);
        navigation.goBack();
      }
    })();
  }, []);

  return (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Claimed!</Text>
      <Text style={{ fontSize: 18, marginVertical: 8 }}>
        {awarded?.toFixed(4) ?? '...'} tokens added
      </Text>
      <Button
        title="Back to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}
