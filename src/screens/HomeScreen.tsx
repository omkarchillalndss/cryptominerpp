import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useMining } from '../contexts/MiningContext';
import { DurationPopup } from '../components/DurationPopup';

export default function HomeScreen({ navigation }: any) {
  const {
    totalBalance,
    miningStatus,
    currentMultiplier,
    startMining,
    refreshBalance,
  } = useMining();
  const [popup, setPopup] = useState(false);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>
        Balance: {totalBalance.toFixed(2)} ⛏️
      </Text>
      <Text style={{ marginVertical: 8 }}>
        Status: {miningStatus === 'active' ? 'Active' : 'Inactive'}
      </Text>
      <Button title="Start Mining" onPress={() => setPopup(true)} />
      <Button title="Refresh" onPress={refreshBalance} />
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
    </View>
  );
}
