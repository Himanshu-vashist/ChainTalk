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
} from 'react-native';
import { chatAppContext } from '../Context/ChatAppContext';
import { useTheme } from '../Context/ThemeContext';

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
        <View style={[styles.cardGradient, { backgroundColor: colors.primary + '10' }]} />
        <View style={styles.userInfo}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.userImage}
            />
            <View style={[styles.statusIndicator, { backgroundColor: colors.primary }]} />
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: colors.primary }]}>{user?.name || 'Unknown User'}</Text>
            <Text style={[styles.userAddress, { color: colors.textSecondary }]}>
              {user?.accountAddress.slice(0, 6)}...{user?.accountAddress.slice(-4)}
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
            <Text style={styles.buttonText}>Accept</Text>
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
            <Text style={styles.buttonText}>Reject</Text>
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
            const url = `https://gateway.pinata.cloud/ipfs/${user.imageHash}`;
            setUserImages((prev) => ({
              ...prev,
              [address]: url,
            }));
          } catch (error) {
            console.error(`Image fetch failed for ${address}:`, error);
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
          <View style={[styles.headerGradient, { backgroundColor: colors.primary + '20' }]} />
          <Text style={[styles.heading, { color: colors.text }]}>
            Pending Friend Requests
          </Text>
          <Text style={[styles.subHeading, { color: colors.textSecondary }]}>
            {pendingRequests.length} request{pendingRequests.length !== 1 ? 's' : ''} waiting for your response
          </Text>
        </View>

        {pendingRequests.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
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
            contentContainerStyle={styles.listContent}
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
    paddingVertical: 16,
    gap: 16,
  },
  requestCardContainer: {
    marginBottom: 16,
  },
  requestCard: {
    borderRadius: 16,
    padding: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  userImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userAddress: {
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
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
    color: '#fff',
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
