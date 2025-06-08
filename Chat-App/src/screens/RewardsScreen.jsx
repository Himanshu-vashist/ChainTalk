import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../Context/ThemeContext';

const RewardsScreen = () => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const [rewards, setRewards] = useState({
    totalTokens: 1250,
    availableTokens: 850,
    lockedTokens: 400,
    history: [
      {
        id: 1,
        type: 'earn',
        amount: 100,
        description: 'Achievement: Chat Master',
        date: '2 hours ago',
        icon: 'stars',
      },
      {
        id: 2,
        type: 'spend',
        amount: -50,
        description: 'Premium Theme Unlocked',
        date: '1 day ago',
        icon: 'palette',
      },
      {
        id: 3,
        type: 'earn',
        amount: 200,
        description: 'Achievement: Early Adopter',
        date: '2 days ago',
        icon: 'rocket-launch',
      },
      {
        id: 4,
        type: 'earn',
        amount: 75,
        description: 'Daily Login Bonus',
        date: '3 days ago',
        icon: 'login',
      },
    ],
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderRewardItem = (item) => {
    const isEarned = item.type === 'earn';
    const amountColor = isEarned ? '#4CAF50' : '#F44336';

    return (
      <Animated.View
        key={item.id}
        style={[
          styles.rewardItem,
          {
            backgroundColor: colors.surface,
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: amountColor + '15' }]}>
          <MaterialIcons name={item.icon} size={24} color={amountColor} />
        </View>
        <View style={styles.rewardContent}>
          <Text style={[styles.rewardDescription, { color: colors.text }]}>
            {item.description}
          </Text>
          <Text style={[styles.rewardDate, { color: colors.textSecondary }]}>
            {item.date}
          </Text>
        </View>
        <Text style={[styles.rewardAmount, { color: amountColor }]}>
          {isEarned ? '+' : ''}{item.amount}
        </Text>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>Rewards</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Your earned tokens and rewards
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.balanceCard,
          {
            backgroundColor: colors.surface,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.balanceHeader}>
          <MaterialIcons name="account-balance-wallet" size={24} color={colors.primary} />
          <Text style={[styles.balanceTitle, { color: colors.text }]}>Total Balance</Text>
        </View>
        <Text style={[styles.balanceAmount, { color: colors.text }]}>
          {rewards.totalTokens} tokens
        </Text>
        <View style={styles.balanceDetails}>
          <View style={styles.balanceDetail}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Available</Text>
            <Text style={[styles.detailValue, { color: '#4CAF50' }]}>
              {rewards.availableTokens}
            </Text>
          </View>
          <View style={styles.balanceDetail}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Locked</Text>
            <Text style={[styles.detailValue, { color: '#FF9800' }]}>
              {rewards.lockedTokens}
            </Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Transaction History</Text>
        <ScrollView
          style={styles.historyList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.historyListContent}
        >
          {rewards.history.map((item) => renderRewardItem(item))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[styles.redeemButton, { backgroundColor: colors.primary }]}
        onPress={() => {/* Handle redeem */}}
      >
        <MaterialIcons name="card-giftcard" size={24} color="#fff" />
        <Text style={styles.redeemButtonText}>Redeem Rewards</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  balanceCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 16,
  },
  balanceDetail: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  historyList: {
    flex: 1,
  },
  historyListContent: {
    gap: 12,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rewardContent: {
    flex: 1,
  },
  rewardDescription: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  rewardDate: {
    fontSize: 12,
  },
  rewardAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RewardsScreen; 