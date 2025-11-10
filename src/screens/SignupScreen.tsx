import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { useMining } from '../contexts/MiningContext';
import { api } from '../services/api';

export default function SignupScreen({ navigation }: any) {
  const { setWalletAddress, refreshBalance } = useMining();
  const [address, setAddress] = useState('');

  const create = async () => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      Alert.alert('Invalid wallet address');
      return;
    }
    await api.post('/api/users/signup', { walletAddress: address });
    setWalletAddress(address);
    await refreshBalance();
    navigation.replace('Home');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>
        Enter Wallet Address
      </Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="0x..."
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 12,
          padding: 12,
          marginTop: 12,
        }}
      />
      <Button title="Create Account" onPress={create} />
    </View>
  );
}
