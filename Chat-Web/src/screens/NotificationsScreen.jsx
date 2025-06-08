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

const NotificationsScreen = () => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'message',
      title: 'New Message',
      description: 'John sent you a message',
      time: '2m ago',
      read: false,
      avatar: 'https://via.placeholder.com/40',
    },
    {
      id: 2,
      type: 'friend',
      title: 'Friend Request',
      description: 'Sarah wants to connect with you',
      time: '15m ago',
      read: false,
      avatar: 'https://via.placeholder.com/40',
    },
    {
      id: 3,
      type: 'reward',
      title: 'Reward Earned',
      description: 'You earned 50 tokens for being active',
      time: '1h ago',
      read: true,
      avatar: 'https://via.placeholder.com/40',
    },
    {
      id: 4,
      type: 'system',
      title: 'System Update',
      description: 'New features are available',
      time: '2h ago',
      read: true,
      avatar: 'https://via.placeholder.com/40',
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
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return 'chat';
      case 'friend':
        return 'person-add';
      case 'reward':
        return 'stars';
      case 'system':
        return 'info';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'message':
        return '#4CAF50';
      case 'friend':
        return '#2196F3';
      case 'reward':
        return '#FFC107';
      case 'system':
        return '#9C27B0';
      default:
        return colors.primary;
    }
  };

  const renderNotification = (notification, index) => {
    const iconColor = getNotificationColor(notification.type);
    
    return (
      <Animated.View
        key={notification.id}
        style={[
          styles.notificationItem,
          {
            backgroundColor: colors.surface,
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
          <MaterialIcons name={getNotificationIcon(notification.type)} size={24} color={iconColor} />
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={[styles.notificationTitle, { color: colors.text }]}>
              {notification.title}
            </Text>
            <Text style={[styles.notificationTime, { color: colors.textSecondary }]}>
              {notification.time}
            </Text>
          </View>
          <Text style={[styles.notificationDescription, { color: colors.textSecondary }]}>
            {notification.description}
          </Text>
        </View>
        {!notification.read && (
          <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        <TouchableOpacity
          style={[styles.clearButton, { backgroundColor: colors.primary + '15' }]}
          onPress={() => setNotifications([])}
        >
          <MaterialIcons name="clear-all" size={20} color={colors.primary} />
          <Text style={[styles.clearButtonText, { color: colors.primary }]}>Clear All</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.notificationsListContent}
      >
        {notifications.map((notification, index) => renderNotification(notification, index))}
      </ScrollView>

      {notifications.length === 0 && (
        <Animated.View
          style={[
            styles.emptyState,
            {
              opacity: fadeAnim,
              transform: [{ translateY }],
            },
          ]}
        >
          <MaterialIcons name="notifications-off" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            No notifications yet
          </Text>
        </Animated.View>
      )}
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
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    gap: 4,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
  },
  notificationsListContent: {
    padding: 16,
  },
  notificationItem: {
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
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  notificationTime: {
    fontSize: 12,
  },
  notificationDescription: {
    fontSize: 14,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default NotificationsScreen; 