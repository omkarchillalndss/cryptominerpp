import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MiningProvider, useMining } from './src/contexts/MiningContext';
import SplashScreen from './src/screens/SplashScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import MiningScreen from './src/screens/MiningScreen';
import ClaimScreen from './src/screens/ClaimScreen';
import AdScreen from './src/screens/AdScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

function Root() {
  const { walletAddress, isLoading, miningStatus, hasUnclaimedRewards } =
    useMining();
  const [showInitialSplash, setShowInitialSplash] = useState(true);

  // Show splash screen on first load
  if (showInitialSplash) {
    return <SplashScreen onFinish={() => setShowInitialSplash(false)} />;
  }

  // Show loading splash while hydrating
  if (isLoading) {
    return <SplashScreen onFinish={() => {}} />;
  }

  // Determine initial route based on wallet and mining status
  const getInitialRoute = () => {
    if (!walletAddress) return 'Signup';
    if (hasUnclaimedRewards) return 'Claim';
    if (miningStatus === 'active') return 'Mining';
    return 'Home';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={getInitialRoute()}
      >
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Mining" component={MiningScreen} />
        <Stack.Screen name="Claim" component={ClaimScreen} />
        <Stack.Screen name="Ad" component={AdScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MiningProvider>
          <Root />
        </MiningProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
