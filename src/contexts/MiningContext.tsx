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
  setWalletAddress: (addr: string) => void;
  totalBalance: number;
  walletBalance: number;
  refreshBalance: () => Promise<void>;
  miningStatus: MiningStatus;
  currentMultiplier: number;
  selectedDuration: number; // seconds
  remainingSeconds: number;
  liveTokens: number;
  startMining: (durationSeconds: number) => Promise<void>;
  stopMining: () => Promise<void>;
  upgradeMultiplier: () => Promise<void>;
  claimRewards: () => Promise<number>;
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
  const [walletAddress, setWalletAddress] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [miningStatus, setMiningStatus] = useState<MiningStatus>('inactive');
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [liveTokens, setLiveTokens] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const effectiveRate = useMemo(() => {
    // NOTE: Per brief: Effective Rate = Base Rate ÷ Multiplier
    // If you want boosts to increase reward, change to: BASE_RATE * currentMultiplier
    return BASE_RATE / currentMultiplier;
  }, [currentMultiplier]);

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
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...data, ...patch }),
    );
  };

  const hydrate = async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const saved: Persisted = JSON.parse(raw);
      setWalletAddress(saved.walletAddress || '');
      setMiningStatus(saved.miningStatus);
      setSelectedDuration(saved.selectedDuration);
      setCurrentMultiplier(saved.multiplier || 1);
      setLiveTokens(saved.liveTokens || 0);

      if (saved.miningStatus === 'active') {
        const elapsed = Math.floor((Date.now() - saved.startTimestamp) / 1000);
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
    } catch {}
  };

  useEffect(() => {
    hydrate();
  }, []);

  const tickStart = (
    startTs: number,
    duration: number,
    multiplier: number,
    startTokens: number,
  ) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
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

  const effectiveTokens = (elapsedSeconds: number, multiplier: number) => {
    const rate = BASE_RATE / multiplier; // per brief
    return rate * elapsedSeconds;
  };

  const refreshBalance = async () => {
    if (!walletAddress) return;
    const res = await api.get(`/api/users/${walletAddress}`);
    setTotalBalance(res.data.totalBalance ?? 0);
    setWalletBalance(res.data.walletBalance ?? res.data.totalBalance ?? 0);
  };

  const startMining = async (durationSeconds: number) => {
    if (!walletAddress) throw new Error('No wallet');
    // Backend records authoritative session
    const res = await api.post('/api/mining/start', {
      walletAddress,
      selectedHour: Math.round(durationSeconds / 3600),
      multiplier: currentMultiplier,
    });

    const startTs = new Date(res.data.miningStartTime).getTime();
    setSelectedDuration(durationSeconds);
    setRemainingSeconds(durationSeconds);
    setLiveTokens(0);
    setMiningStatus('active');
    tickStart(startTs, durationSeconds, currentMultiplier, 0);
    await persist({
      startTimestamp: startTs,
      selectedDuration: durationSeconds,
      miningStatus: 'active',
      multiplier: currentMultiplier,
      liveTokens: 0,
    });
  };

  const stopMining = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMiningStatus('inactive');
    await api.post('/api/mining/stop', { walletAddress });
    await persist({ miningStatus: 'inactive' });
  };

  const upgradeMultiplier = async () => {
    if (currentMultiplier >= MAX_MULTIPLIER) return;
    const res = await api.put('/api/mining/upgrade', { walletAddress });
    const newMult = res.data.multiplier as number;
    setCurrentMultiplier(newMult);
    await persist({ multiplier: newMult });
  };

  const claimRewards = async () => {
    const res = await api.post('/api/mining/claim', { walletAddress });
    // Server recomputes and returns awarded tokens to avoid client tampering
    const { awarded } = res.data;
    setLiveTokens(0);
    setMiningStatus('inactive');
    await refreshBalance();
    await persist({ miningStatus: 'inactive', liveTokens: 0 });
    return awarded as number;
  };

  useEffect(() => {
    const sub = AppState.addEventListener('change', async nextState => {
      if (
        appState.current.match(/active/) &&
        nextState.match(/inactive|background/)
      ) {
        await persist();
      }
      appState.current = nextState;
    });
    return () => sub.remove();
  }, []);

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
    startMining,
    stopMining,
    upgradeMultiplier,
    claimRewards,
  };

  return (
    <MiningContext.Provider value={value}>{children}</MiningContext.Provider>
  );
};
