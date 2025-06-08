import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  FlatList,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  TextInput,
} from 'react-native';
import { chatAppContext } from '../Context/ChatAppContext';
import { useTheme } from '../Context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const UserCard = ({ el, sendFriendRequest, colors, index }) => {
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
        styles.userCardContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity 
        style={[
          styles.userCard, 
          { 
            backgroundColor: colors.surface,
            transform: [{ scale: isPressed ? 0.98 : 1 }],
          }
        ]}
        onPress={() => sendFriendRequest(el.accountAddress)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={[styles.cardGradient, { backgroundColor: colors.primary + '10' }]} />
        <View style={styles.userInfo}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: el.imageHash ? `https://gateway.pinata.cloud/ipfs/${el.imageHash}` : 'https://via.placeholder.com/100' }} 
              style={styles.userImage}
            />
            <View style={[styles.statusIndicator, { backgroundColor: colors.primary }]} />
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: colors.primary }]}>{el.name}</Text>
            <Text style={[styles.userAddress, { color: colors.textSecondary }]}>
              {el.accountAddress.slice(0, 6)}...{el.accountAddress.slice(-4)}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[
            styles.addButton, 
            { 
              backgroundColor: colors.primary,
              transform: [{ scale: isPressed ? 0.95 : 1 }],
            }
          ]}
          onPress={() => sendFriendRequest(el.accountAddress)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const AllUserScreen = () => {
  const {
    availableUsers,
    currentUserName,
    currentUserAddress,
    sendFriendRequest,
    error,
  } = useContext(chatAppContext);
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;
  const { width } = useWindowDimensions();

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
    if (availableUsers) {
      const filtered = availableUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.accountAddress.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, availableUsers]);

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
        {/* Left Side - Discover Section */}
        <View style={styles.leftSection}>
          <View style={[styles.headerSection, { backgroundColor: colors.surface }]}>
            <View style={[styles.headerGradient, { backgroundColor: colors.primary + '20' }]} />
            <Text style={[styles.heading, { color: colors.text }]}>
              Discover New Connections
            </Text>
            <Text style={[styles.subHeading, { color: colors.textSecondary }]}>
              Connect with other users and expand your network
            </Text>
          </View>

          <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
            <TextInput
              style={[styles.searchInput, { 
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              }]}
              placeholder="Search users by name or address..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.userList}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Available Users {filteredUsers.length > 0 && `(${filteredUsers.length})`}
            </Text>
            {filteredUsers && filteredUsers.length > 0 ? (
              <FlatList
                data={filteredUsers}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <UserCard 
                    el={item} 
                    sendFriendRequest={sendFriendRequest}
                    colors={colors}
                    index={index}
                  />
                )}
                horizontal={true}
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={styles.userListContent}
              />
            ) : (
              <View style={[styles.noUsers, { backgroundColor: colors.surface }]}>
                <Text style={[styles.noUsersText, { color: colors.textSecondary }]}>
                  {searchQuery ? 'No users found matching your search.' : 'No users available to add as friends.'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Right Side - Personal Details */}
        <View style={styles.rightSection}>
          <View style={[styles.currentUser, { backgroundColor: colors.surface }]}>
            <View style={[styles.currentUserGradient, { backgroundColor: colors.primary + '10' }]} />
            {currentUserName && currentUserAddress ? (
              <>
                <Text style={[styles.infoTitle, { color: colors.primary }]}>
                  Your Account Details
                </Text>
                <View style={styles.infoRow}>
                  <View style={[styles.infoIcon, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.infoIconText, { color: colors.primary }]}>👤</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Name</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>{currentUserName}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <View style={[styles.infoIcon, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.infoIconText, { color: colors.primary }]}>🏷</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Address</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {currentUserAddress.slice(0, 6)}...{currentUserAddress.slice(-4)}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <Text style={[styles.noAccount, { color: colors.textSecondary }]}>
                Your account is not created yet.
              </Text>
            )}
          </View>
        </View>
      </View>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: colors.error }]}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
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
    flexDirection: 'row',
    gap: 16,
  },
  leftSection: {
    flex: 2,
    maxWidth: '70%',
  },
  rightSection: {
    flex: 1,
    minWidth: 300,
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
  searchContainer: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 8,
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
  searchInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  currentUser: {
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    height: '100%',
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
  currentUserGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoIconText: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  noAccount: {
    fontSize: 16,
    textAlign: 'center',
  },
  userList: {
    flex: 1,
  },
  userListContent: {
    paddingVertical: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    marginLeft: 8,
  },
  userCardContainer: {
    marginRight: 12,
    width: 200,
  },
  userCard: {
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
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
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
  addButton: {
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
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  noUsers: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
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
  noUsersText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    borderRadius: 24,
    padding: 16,
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
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AllUserScreen;
