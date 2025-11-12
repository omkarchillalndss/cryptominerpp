import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useMining } from '../contexts/MiningContext';
import { api } from '../services/api';

type User = {
  id: string;
  name: string;
  points: number;
  rank: number;
};

export default function LeaderBoardScreenWrapper({ navigation }: any) {
  const { walletAddress } = useMining();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      console.log('🏆 Fetching leaderboard from backend...');
      const response = await api.get('/api/leaderboard');
      console.log('✅ Leaderboard data received:', response.data);

      // Transform and rank users
      const leaderboardData = response.data.map((user: any, index: number) => ({
        id: user.walletAddress,
        name: `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(
          -4,
        )}`,
        points: user.totalCoins || 0,
        rank: index + 1,
      }));

      setUsers(leaderboardData);
      console.log(`✅ Loaded ${leaderboardData.length} users to leaderboard`);
    } catch (error) {
      console.error('❌ Failed to fetch leaderboard:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: User }) => {
    const isCurrentUser = item.id === walletAddress;
    const isTop3 = item.rank <= 3;

    return (
      <View
        style={[
          styles.userItem,
          isCurrentUser && styles.currentUserItem,
          isTop3 && styles.top3Item,
        ]}
      >
        <View style={styles.rankContainer}>
          {item.rank === 1 && <Text style={styles.rankEmoji}>🥇</Text>}
          {item.rank === 2 && <Text style={styles.rankEmoji}>🥈</Text>}
          {item.rank === 3 && <Text style={styles.rankEmoji}>🥉</Text>}
          {item.rank > 3 && <Text style={styles.rankNumber}>#{item.rank}</Text>}
        </View>
        <View style={styles.userInfo}>
          <Text
            style={[styles.userName, isCurrentUser && styles.currentUserText]}
          >
            {item.name}
            {isCurrentUser && ' (You)'}
          </Text>
        </View>
        <Text
          style={[styles.userPoints, isCurrentUser && styles.currentUserText]}
        >
          {item.points.toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#581c87', '#1e3a8a', '#312e81']}
        style={styles.container}
      >
        {/* Animated background elements */}
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Home');
            }
          }}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.icon}>🏆</Text>
          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.subtitle}>Top miners ranked by total coins</Text>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading leaderboard...</Text>
          </View>
        ) : users.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>No users yet</Text>
            <Text style={styles.emptySubtext}>
              Start mining to appear on the leaderboard!
            </Text>
          </View>
        ) : (
          <FlatList
            data={users}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    margin: 16,
    zIndex: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  icon: {
    fontSize: 64,
    marginBottom: 12,
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
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  top3Item: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  currentUserItem: {
    backgroundColor: 'rgba(147, 51, 234, 0.3)',
    borderColor: 'rgba(147, 51, 234, 0.5)',
    borderWidth: 2,
  },
  rankContainer: {
    width: 48,
    alignItems: 'center',
  },
  rankEmoji: {
    fontSize: 32,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e9d5ff',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  currentUserText: {
    color: '#fbbf24',
  },
  userPoints: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#e9d5ff',
    fontSize: 14,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#e9d5ff',
    textAlign: 'center',
  },
});
