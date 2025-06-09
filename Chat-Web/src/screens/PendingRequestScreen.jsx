import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  FlatList,
  Platform,
  Dimensions,
} from 'react-native';
import { chatAppContext } from '../Context/ChatAppContext';
import { useTheme } from '../Context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2; // 2 cards per row with padding

const PendingRequestCard = ({ user, imageUrl, index, acceptFriendRequest, rejectRequest, colors }) => {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
        delay: index * 100,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        delay: index * 100,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.requestCardContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          width: CARD_WIDTH,
        },
      ]}
    >
      <View 
        style={[
          styles.requestCard, 
          { 
            backgroundColor: colors.surface,
            transform: [{ scale: isPressed ? 0.98 : 1 }],
          }
        ]}
      >
        <View style={[styles.cardGradient, { backgroundColor: `rgba(${parseInt(colors.primary.slice(1,3), 16)}, ${parseInt(colors.primary.slice(3,5), 16)}, ${parseInt(colors.primary.slice(5,7), 16)}, 0.1)` }]} />
        <View style={styles.userInfo}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: imageUrl }} 
              style={[styles.userImage, { borderColor: colors.surface }]}
            />
            <View style={[styles.statusIndicator, { backgroundColor: colors.primary, borderColor: colors.surface }]} />
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: colors.primary }]} numberOfLines={1}>{user?.name || 'Unknown User'}</Text>
            <Text style={[styles.userAddress, { color: colors.textSecondary }]} numberOfLines={1}>
              {user?.accountAddress.slice(0, 4)}...{user?.accountAddress.slice(-4)}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              styles.acceptButton,
              { backgroundColor: colors.primary }
            ]}
            onPress={() => acceptFriendRequest(user.accountAddress)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              styles.rejectButton,
              { backgroundColor: colors.error }
            ]}
            onPress={() => rejectRequest(user.accountAddress)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const PendingRequestScreen = () => {
  const { pendingRequests, acceptFriendRequest, rejectRequest, userList } = useContext(chatAppContext);
  const { colors } = useTheme();
  const [userImages, setUserImages] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  const getUserDetails = (address) => {
    return userList.find(
      (user) => user.accountAddress.toLowerCase() === address.toLowerCase()
    );
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      for (const address of pendingRequests) {
        const user = getUserDetails(address);

        if (user?.imageHash && !userImages[address]) {
          try {
            const url = `https://ipfs.io/ipfs/${user.imageHash}`;
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error('Failed to fetch image data');
            }
            const data = await response.json();
            setUserImages((prev) => ({
              ...prev,
              [address]: data.image || 'https://via.placeholder.com/100',
            }));
          } catch (error) {
            console.error(`Image fetch failed for ${address}:`, error);
            setUserImages((prev) => ({
              ...prev,
              [address]: 'https://via.placeholder.com/100',
            }));
          }
        }
      }
    };

    if (pendingRequests.length > 0) fetchImages();
  }, [pendingRequests, userList]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.mainContent}>
        <View style={[styles.headerSection, { backgroundColor: colors.surface }]}>
          <View style={[styles.headerGradient, { backgroundColor: `rgba(${parseInt(colors.primary.slice(1,3), 16)}, ${parseInt(colors.primary.slice(3,5), 16)}, ${parseInt(colors.primary.slice(5,7), 16)}, 0.2)` }]} />
          <Text style={[styles.heading, { color: colors.text }]}>
            Pending Requests
          </Text>
          <Text style={[styles.subHeading, { color: colors.textSecondary }]}>
            {pendingRequests.length} request{pendingRequests.length !== 1 ? 's' : ''} waiting
          </Text>
        </View>

        {pendingRequests.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No pending requests at the moment.
            </Text>
          </View>
        ) : (
          <FlatList
            data={pendingRequests}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              const user = getUserDetails(item);
              const imageUrl = userImages[item] || 'https://via.placeholder.com/100';
              
              return (
                <PendingRequestCard
                  user={user}
                  imageUrl={imageUrl}
                  index={index}
                  acceptFriendRequest={acceptFriendRequest}
                  rejectRequest={rejectRequest}
                  colors={colors}
                />
              );
            }}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
          />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  mainContent: {
    flex: 1,
  },
  headerSection: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingVertical: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  requestCardContainer: {
    marginBottom: 16,
  },
  requestCard: {
    borderRadius: 16,
    padding: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  userImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  userDetails: {
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  userAddress: {
    fontSize: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PendingRequestScreen;
