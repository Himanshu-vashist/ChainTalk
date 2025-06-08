import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
  Animated,
  Pressable,
} from 'react-native';
import { chatAppContext } from '../Context/ChatAppContext';
import { useTheme } from '../Context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { converTime } from '../Utils/apiFeatures';

const ChatsScreen = ({
  functionName,
  friendMsg = [],
  account,
  username,
  loading,
  currentUserName,
  currentUserAddress,
  selectedFriend,
  readMessage,
}) => {
  const { userList } = useContext(chatAppContext);
  const { colors } = useTheme();
  const [message, setMessage] = useState('');
  const [userImageUrl, setUserImageUrl] = useState('https://via.placeholder.com/100');
  const [friendImageUrl, setFriendImageUrl] = useState('https://via.placeholder.com/100');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

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
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const user = userList?.find(
          (u) => u.accountAddress.toLowerCase() === currentUserAddress?.toLowerCase()
        );
        if (user?.imageHash) {
          const res = await fetch(`https://gateway.pinata.cloud/ipfs/${user.imageHash}`);
          const data = await res.json();
          setUserImageUrl(data.image || userImageUrl);
        }

        if (selectedFriend?.[0]) {
          const friend = userList?.find(
            (u) => u.accountAddress.toLowerCase() === selectedFriend[0].toLowerCase()
          );
          if (friend?.imageHash) {
            const res = await fetch(`https://gateway.pinata.cloud/ipfs/${friend.imageHash}`);
            const data = await res.json();
            setFriendImageUrl(data.image || friendImageUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (userList?.length > 0 && (currentUserAddress || selectedFriend)) {
      fetchImages();
    }
  }, [userList, currentUserAddress, selectedFriend]);

  useEffect(() => {
    if (selectedFriend?.[0]) {
      readMessage(selectedFriend[0]);
    }
  }, [selectedFriend]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [friendMsg]);

  const handleSend = () => {
    if (!selectedFriend?.[0] || !message.trim()) return;
    functionName({ msg: message, address: selectedFriend[0] });
    setMessage('');
  };

  const renderMessageBubble = (msg, index, isFriend) => {
    const imageSource = isFriend ? friendImageUrl : userImageUrl;
    const name = isFriend ? selectedFriend[1] : username;

    return (
      <Animated.View
        key={index}
        style={[
          styles.messageBubble,
          isFriend ? styles.leftBubble : styles.rightBubble,
          {
            backgroundColor: isFriend ? colors.surface : colors.primary,
            opacity: fadeAnim,
            transform: [
              { translateY },
              { scale: scaleAnim }
            ],
          }
        ]}
      >
        <Image source={{ uri: imageSource }} style={styles.avatarSmall} />
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={[styles.senderName, { color: colors.text }]}>
              {name}
            </Text>
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              {converTime(msg.timestamp)}
            </Text>
          </View>
          <Text style={[styles.messageText, { color: isFriend ? colors.text : '#fff' }]}>
            {msg.msg}
          </Text>
          {!isFriend && (
            <View style={styles.messageStatus}>
              <MaterialIcons name="done-all" size={16} color="#fff" />
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {selectedFriend?.[0] && (
          <Animated.View 
            style={[
              styles.userInfo,
              { 
                backgroundColor: colors.surface,
                opacity: fadeAnim,
                transform: [{ translateY }],
              }
            ]}
          >
            <Image source={{ uri: friendImageUrl }} style={styles.avatarLarge} />
            <View style={styles.userInfoText}>
              <Text style={[styles.userName, { color: colors.text }]}>{selectedFriend[1]}</Text>
              <Text style={[styles.userAddress, { color: colors.textSecondary }]}>
                {selectedFriend[0].slice(0, 6)}...{selectedFriend[0].slice(-4)}
              </Text>
            </View>
            <TouchableOpacity style={styles.menuButton}>
              <MaterialIcons name="more-vert" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </Animated.View>
        )}

        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {Array.isArray(friendMsg) && friendMsg.map((msg, index) => {
            const isFriend = msg.sender.toLowerCase() === selectedFriend?.[0]?.toLowerCase();
            return renderMessageBubble(msg, index, isFriend);
          })}
        </ScrollView>

        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <MaterialIcons name="emoji-emotions" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Type your message..."
            placeholderTextColor={colors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="attach-file" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator color={colors.primary} size="small" style={styles.sendButton} />
          ) : (
            <Pressable 
              style={({ pressed }) => [
                styles.sendButton, 
                { 
                  backgroundColor: colors.primary,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
                !message.trim() && styles.sendButtonDisabled
              ]} 
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <MaterialIcons name="send" size={20} color="#fff" />
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
    margin: 16,
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
  userInfoText: {
    flex: 1,
  },
  avatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#f99500',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userAddress: {
    fontSize: 14,
  },
  menuButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageBubble: {
    flexDirection: 'row',
    marginVertical: 8,
    maxWidth: '85%',
    borderRadius: 20,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  leftBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  rightBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    marginLeft: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageStatus: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatsScreen;
