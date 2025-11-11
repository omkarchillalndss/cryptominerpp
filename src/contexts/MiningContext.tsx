import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

type MiningStatus = 'active' | 'inactive';

interface MiningContextType {
  walletAddress: string;
  setWalletAddress: (addr: string) => Promise<void>;
  totalBalance: number;
  walletBalance: number;
  refreshBalance: () => Promise<void>;
  miningStatus: MiningStatus;
  currentMultiplier: number;
  selectedDuration: number; // seconds
  remainingSeconds: number;
  liveTokens: number;
  isLoading: boolean;
  startMining: (durationSeconds: number) => Promise<void>;
  stopMining: () => Promise<void>;
  upgradeMultiplier: () => Promise<void>;
  claimRewards: () => Promise<number>;
  logout: () => Promise<void>;
}

const BASE_RATE = 0.01; // tokens/sec
const MAX_MULTIPLIER = 6;
const STORAGE_KEY = 'MINING_STATE_V1';

type Persisted = {
  walletAddress: string;
  miningStatus: MiningStatus;
  selectedDuration: number;
  multiplier: number;
  startTimestamp: number; // ms epoch
  liveTokens: number;
  lastTick: number; // ms epoch
};

const MiningContext = createContext<MiningContextType>({} as MiningContextType);
export const useMining = () => useContext(MiningContext);

export const MiningProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [walletAddress, setWalletAddressState] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [miningStatus, setMiningStatus] = useState<MiningStatus>('inactive');
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [liveTokens, setLiveTokens] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Wrapper to persist wallet address when set
  const setWalletAddress = async (addr: string) => {
    console.log('💼 Setting wallet address:', addr);
    setWalletAddressState(addr);
    // Persist immediately
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        walletAddress: addr,
        miningStatus: 'inactive',
        selectedDuration: 0,
        multiplier: 1,
        startTimestamp: Date.now(),
        liveTokens: 0,
        lastTick: Date.now(),
      }),
    );
  };

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const effectiveRate = useMemo(() => {
    // Correct formula: Effective Rate = Base Rate × Multiplier
    // Example: 0.01 * 3 = 0.03 tokens/sec
    return BASE_RATE * currentMultiplier;
  }, [currentMultiplier]);

  const effectiveTokens = (elapsedSeconds: number, multiplier: number) => {
    // Correct calculation: BASE_RATE * multiplier * seconds
    // Example: 0.01 * 3 * 14400 = 432 tokens for 4 hours with 3x multiplier
    const rate = BASE_RATE * multiplier;
    return rate * elapsedSeconds;
  };

  const persist = async (patch: Partial<Persisted> = {}) => {
    const data: Persisted = {
      walletAddress,
      miningStatus,
      selectedDuration,
      multiplier: currentMultiplier,
      startTimestamp: Date.now() - (selectedDuration - remainingSeconds) * 1000,
      liveTokens,
      lastTick: Date.now(),
    };
    const finalData = { ...data, ...patch };
    console.log('💾 Persisting data:', finalData);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(finalData));
  };

  const hydrate = async () => {
    console.log('🔄 Hydrating app state...');

    try {
      // Test backend connection
      try {
        const healthCheck = await api.get('/health');
        console.log('✅ Backend is reachable:', healthCheck.data);
      } catch (error) {
        console.error('❌ Backend not reachable:', error);
      }

      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        console.log('❌ No saved state found');
        return;
      }

      const saved: Persisted = JSON.parse(raw);
      const walletAddr = saved.walletAddress || '';
      console.log('💼 Wallet address found:', walletAddr);
      setWalletAddressState(walletAddr);

      // If wallet address exists, sync with backend
      if (walletAddr) {
        try {
          console.log('🌐 Fetching user data from backend...');
          const res = await api.get(`/api/users/${walletAddr}`);
          console.log('✅ Backend response:', res.data);
          setTotalBalance(res.data.totalBalance ?? 0);
          setWalletBalance(
            res.data.walletBalance ?? res.data.totalBalance ?? 0,
          );

          // Sync mining status from backend
          if (res.data.miningStatus === 'active' && res.data.miningStartTime) {
            console.log('⛏️ Active mining session found!');
            const startTs = new Date(res.data.miningStartTime).getTime();
            const duration = (res.data.selectedHour ?? 1) * 3600;
            const multiplier = res.data.multiplier ?? 1;
            const elapsed = Math.floor((Date.now() - startTs) / 1000);
            const rem = Math.max(duration - elapsed, 0);

            setMiningStatus('active');
            setSelectedDuration(duration);
            setRemainingSeconds(rem);
            setCurrentMultiplier(multiplier);

            if (rem > 0) {
              const elapsedTokens = effectiveTokens(elapsed, multiplier);
              setLiveTokens(elapsedTokens);
              tickStart(startTs, duration, multiplier, 0);
            } else {
              setMiningStatus('inactive');
            }
          } else {
            // Not mining on backend, use local state
            setMiningStatus(saved.miningStatus);
            setSelectedDuration(saved.selectedDuration);
            setCurrentMultiplier(saved.multiplier || 1);
            setLiveTokens(saved.liveTokens || 0);
          }
        } catch (error) {
          console.error('Failed to sync with backend:', error);
          // Fallback to local state if backend fails
          setMiningStatus(saved.miningStatus);
          setSelectedDuration(saved.selectedDuration);
          setCurrentMultiplier(saved.multiplier || 1);
          setLiveTokens(saved.liveTokens || 0);

          if (saved.miningStatus === 'active') {
            const elapsed = Math.floor(
              (Date.now() - saved.startTimestamp) / 1000,
            );
            const rem = Math.max(saved.selectedDuration - elapsed, 0);
            setRemainingSeconds(rem);
            if (rem > 0)
              tickStart(
                saved.startTimestamp,
                saved.selectedDuration,
                saved.multiplier,
                saved.liveTokens,
              );
            else setMiningStatus('inactive');
          }
        }
      }
    } catch (error) {
      console.error('❌ Error during hydration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    hydrate();
  }, []);

  // Real-time sync with backend every 2 seconds for immediate updates
  useEffect(() => {
    if (!walletAddress) return;

    const syncWithBackend = async () => {
      try {
        const res = await api.get(`/api/users/${walletAddress}`);

        // Update balance
        setTotalBalance(res.data.totalBalance ?? 0);
        setWalletBalance(res.data.walletBalance ?? res.data.totalBalance ?? 0);

        // Sync mining status
        if (res.data.miningStatus === 'active' && res.data.miningStartTime) {
          const startTs = new Date(res.data.miningStartTime).getTime();
          const duration = (res.data.selectedHour ?? 1) * 3600;
          const multiplier = res.data.multiplier ?? 1;
          const elapsed = Math.floor((Date.now() - startTs) / 1000);
          const rem = Math.max(duration - elapsed, 0);

          // Only update if mining status changed or multiplier changed
          if (miningStatus !== 'active' || currentMultiplier !== multiplier) {
            console.log('🔄 Syncing mining state from backend...');
            setMiningStatus('active');
            setSelectedDuration(duration);
            setRemainingSeconds(rem);
            setCurrentMultiplier(multiplier);

            if (rem > 0) {
              const elapsedTokens = effectiveTokens(elapsed, multiplier);
              setLiveTokens(elapsedTokens);
              tickStart(startTs, duration, multiplier, 0);
            } else {
              setMiningStatus('inactive');
            }
          }
        } else if (
          res.data.miningStatus === 'inactive' &&
          miningStatus === 'active'
        ) {
          // Backend says mining stopped, sync local state
          console.log('🔄 Mining stopped on backend, syncing...');
          if (intervalRef.current) clearInterval(intervalRef.current);
          setMiningStatus('inactive');
          setLiveTokens(0);
          setCurrentMultiplier(1);
        }
      } catch (error) {
        console.error('❌ Failed to sync with backend:', error);
      }
    };

    // Initial sync
    syncWithBackend();

    // Sync every 2 seconds for near real-time updates
    syncIntervalRef.current = setInterval(syncWithBackend, 2000);

    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, [walletAddress, miningStatus, currentMultiplier]);

  const tickStart = (
    startTs: number,
    duration: number,
    multiplier: number,
    startTokens: number,
  ) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Set initial values immediately
    const now = Date.now();
    const elapsed = Math.floor((now - startTs) / 1000);
    const rem = Math.max(duration - elapsed, 0);
    setRemainingSeconds(rem);
    const elapsedTokens = effectiveTokens(elapsed, multiplier);
    setLiveTokens(startTokens + elapsedTokens);

    // Then start the interval
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTs) / 1000);
      const rem = Math.max(duration - elapsed, 0);
      setRemainingSeconds(rem);

      // add tokens for this second
      setLiveTokens(() => {
        const elapsedTokens = effectiveTokens(elapsed, multiplier);
        return startTokens + elapsedTokens;
      });

      if (rem <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setMiningStatus('inactive');
      }
    }, 1000);
  };

  const refreshBalance = async () => {
    if (!walletAddress) return;
    const res = await api.get(`/api/users/${walletAddress}`);
    setTotalBalance(res.data.totalBalance ?? 0);
    setWalletBalance(res.data.walletBalance ?? res.data.totalBalance ?? 0);

    // Fetch mining status from database
    if (res.data.miningStatus) {
      setMiningStatus(res.data.miningStatus);
      setCurrentMultiplier(res.data.multiplier ?? 1);

      // If mining is active, sync with server
      if (res.data.miningStatus === 'active' && res.data.miningStartTime) {
        const startTs = new Date(res.data.miningStartTime).getTime();
        const duration = (res.data.selectedHour ?? 1) * 3600;
        const elapsed = Math.floor((Date.now() - startTs) / 1000);
        const rem = Math.max(duration - elapsed, 0);

        setSelectedDuration(duration);
        setRemainingSeconds(rem);

        if (rem > 0) {
          const elapsedTokens = effectiveTokens(
            elapsed,
            res.data.multiplier ?? 1,
          );
          setLiveTokens(elapsedTokens);
          tickStart(startTs, duration, res.data.multiplier ?? 1, 0);
        } else {
          setMiningStatus('inactive');
        }
      }
    }
  };

  const startMining = async (durationSeconds: number) => {
    if (!walletAddress) throw new Error('No wallet');

    // Use client timestamp to avoid network delay issues
    const clientStartTs = Date.now();

    // Backend records authoritative session
    const res = await api.post('/api/mining/start', {
      walletAddress,
      selectedHour: Math.round(durationSeconds / 3600),
      multiplier: currentMultiplier,
    });

    // Use client timestamp for immediate accuracy
    setSelectedDuration(durationSeconds);
    setRemainingSeconds(durationSeconds);
    setLiveTokens(0);
    setMiningStatus('active');
    tickStart(clientStartTs, durationSeconds, currentMultiplier, 0);
    await persist({
      startTimestamp: clientStartTs,
      selectedDuration: durationSeconds,
      miningStatus: 'active',
      multiplier: currentMultiplier,
      liveTokens: 0,
    });
  };

  const stopMining = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMiningStatus('inactive');
    setCurrentMultiplier(1); // Reset multiplier to 1
    await api.post('/api/mining/stop', { walletAddress });
    await persist({ miningStatus: 'inactive', multiplier: 1 });
  };

  const upgradeMultiplier = async () => {
    if (currentMultiplier >= MAX_MULTIPLIER) return;
    const res = await api.put('/api/mining/upgrade', { walletAddress });
    const newMult = res.data.multiplier as number;
    setCurrentMultiplier(newMult);

    // If mining is active, restart the ticker with the new multiplier
    if (miningStatus === 'active' && selectedDuration > 0) {
      const startTs = Date.now() - (selectedDuration - remainingSeconds) * 1000;
      const elapsed = Math.floor((Date.now() - startTs) / 1000);
      const currentTokens = effectiveTokens(elapsed, currentMultiplier);

      // Restart ticker with new multiplier, preserving current progress
      tickStart(startTs, selectedDuration, newMult, 0);
    }

    await persist({ multiplier: newMult });
  };

  const claimRewards = async () => {
    const res = await api.post('/api/mining/claim', { walletAddress });
    // Server recomputes and returns awarded tokens to avoid client tampering
    const { awarded } = res.data;
    setLiveTokens(0);
    setMiningStatus('inactive');
    setCurrentMultiplier(1); // Reset multiplier to 1 after claiming
    await refreshBalance();
    await persist({ miningStatus: 'inactive', liveTokens: 0, multiplier: 1 });
    return awarded as number;
  };

  const logout = async () => {
    console.log('🚪 Logging out...');

    // Stop all intervals (mining continues on backend)
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);

    // Clear only local state (backend mining session and balance remain intact)
    setWalletAddressState('');
    setTotalBalance(0);
    setWalletBalance(0);
    setMiningStatus('inactive');
    setCurrentMultiplier(1);
    setSelectedDuration(0);
    setRemainingSeconds(0);
    setLiveTokens(0);

    // Clear AsyncStorage
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('✅ Logged out successfully - mining continues on backend');
  };

  useEffect(() => {
    const sub = AppState.addEventListener('change', async nextState => {
      if (
        appState.current.match(/active/) &&
        nextState.match(/inactive|background/)
      ) {
        await persist();
      }

      // Sync immediately when app comes to foreground
      if (
        appState.current.match(/inactive|background/) &&
        nextState === 'active' &&
        walletAddress
      ) {
        console.log('🔄 App resumed, syncing with backend...');
        await refreshBalance();
      }

      appState.current = nextState;
    });
    return () => sub.remove();
  }, [walletAddress]);

  const value = {
    walletAddress,
    setWalletAddress,
    totalBalance,
    walletBalance,
    refreshBalance,
    miningStatus,
    currentMultiplier,
    selectedDuration,
    remainingSeconds,
    liveTokens,
    isLoading,
    startMining,
    stopMining,
    upgradeMultiplier,
    claimRewards,
    logout,
  };

  return (
    <MiningContext.Provider value={value}>{children}</MiningContext.Provider>
  );
};
