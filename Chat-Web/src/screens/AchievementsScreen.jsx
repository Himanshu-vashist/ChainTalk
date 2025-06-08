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

const AchievementsScreen = () => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: 'Chat Master',
      description: 'Send 100 messages',
      icon: 'chat',
      progress: 75,
      total: 100,
      reward: 50,
      unlocked: false,
      category: 'messaging',
    },
    {
      id: 2,
      title: 'Social Butterfly',
      description: 'Add 10 friends',
      icon: 'people',
      progress: 8,
      total: 10,
      reward: 100,
      unlocked: false,
      category: 'social',
    },
    {
      id: 3,
      title: 'Early Adopter',
      description: 'Join during beta',
      icon: 'rocket-launch',
      progress: 100,
      total: 100,
      reward: 200,
      unlocked: true,
      category: 'special',
    },
    {
      id: 4,
      title: 'Night Owl',
      description: 'Send messages at night',
      icon: 'nightlight',
      progress: 3,
      total: 5,
      reward: 75,
      unlocked: false,
      category: 'time',
    },
    {
      id: 5,
      title: 'Message Marathon',
      description: 'Send 5 messages in 1 minute',
      icon: 'speed',
      progress: 100,
      total: 100,
      reward: 150,
      unlocked: true,
      category: 'speed',
    },
  ]);

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
    ]).start();

    // Animate progress bars
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, []);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'messaging':
        return '#4CAF50';
      case 'social':
        return '#2196F3';
      case 'special':
        return '#9C27B0';
      case 'time':
        return '#FF9800';
      case 'speed':
        return '#F44336';
      default:
        return colors.primary;
    }
  };

  const renderAchievement = (achievement, index) => {
    const categoryColor = getCategoryColor(achievement.category);
    const progress = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, achievement.progress],
    });

    return (
      <Animated.View
        key={achievement.id}
        style={[
          styles.achievementCard,
          {
            backgroundColor: colors.surface,
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: categoryColor + '15' }]}>
          <MaterialIcons name={achievement.icon} size={32} color={categoryColor} />
        </View>
        <View style={styles.achievementContent}>
          <View style={styles.achievementHeader}>
            <Text style={[styles.achievementTitle, { color: colors.text }]}>
              {achievement.title}
            </Text>
            <View style={[styles.rewardBadge, { backgroundColor: categoryColor + '15' }]}>
              <MaterialIcons name="stars" size={16} color={categoryColor} />
              <Text style={[styles.rewardText, { color: categoryColor }]}>
                {achievement.reward}
              </Text>
            </View>
          </View>
          <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
            {achievement.description}
          </Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBackground, { backgroundColor: colors.textSecondary + '20' }]}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: categoryColor,
                    width: progress.interpolate({
                      inputRange: [0, achievement.total],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {achievement.progress}/{achievement.total}
            </Text>
          </View>
        </View>
        {achievement.unlocked && (
          <View style={[styles.unlockedBadge, { backgroundColor: categoryColor }]}>
            <MaterialIcons name="check" size={20} color="#fff" />
          </View>
        )}
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
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Achievements</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Complete tasks to earn rewards
          </Text>
        </View>
        <View style={[styles.statsContainer, { backgroundColor: colors.primary + '15' }]}>
          <MaterialIcons name="stars" size={24} color={colors.primary} />
          <Text style={[styles.statsText, { color: colors.primary }]}>
            {achievements.filter(a => a.unlocked).length}/{achievements.length}
          </Text>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.achievementsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.achievementsListContent}
      >
        {achievements.map((achievement, index) => renderAchievement(achievement, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    gap: 8,
  },
  statsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  achievementsList: {
    flex: 1,
  },
  achievementsListContent: {
    padding: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  achievementDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    minWidth: 40,
    textAlign: 'right',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
  },
  unlockedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AchievementsScreen; 