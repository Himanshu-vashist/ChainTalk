import React, { useEffect, useContext, useRef, useState, Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { chatAppContext } from '../Context/ChatAppContext';
import { useTheme } from '../Context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: '#d32f2f' }]}>
            Error loading post: {this.state.error?.toString()}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const PostCard = ({ post, index }) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

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
  }, [index]);

  const formatDate = (timestamp) => {
    try {
      const timestampNum = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
      if (!timestampNum || isNaN(timestampNum)) {
        return 'Invalid Date';
      }
      const date = new Date(timestampNum * 1000);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  // Validate post data
  if (!post || !post.owner || !post.content) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: colors.error }]}>Invalid post data</Text>
      </View>
    );
  }

  // Validate and clean imageHash
  const getImageUrl = (imageHash) => {
    if (!imageHash) return 'https://placehold.co/300x200';
    // Check if it's already a raw hash (starts with 'Qm' and is 46 characters long)
    if (/^Qm[1-9A-Za-z]{44}$/.test(imageHash)) {
      return `https://gateway.pinata.cloud/ipfs/${imageHash}`;
    }
    // Handle full URLs
    const match = imageHash.match(/ipfs\/(Qm[1-9A-Za-z]{44})/);
    return match ? `https://gateway.pinata.cloud/ipfs/${match[1]}` : 'https://placehold.co/300x200';
  };

  return (
    <ErrorBoundary>
      <Animated.View
        style={[
          styles.postCard,
          {
            backgroundColor: colors.surface,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <View style={[styles.cardGradient, { backgroundColor: colors.primary + '10' }]} />

        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
              <MaterialIcons name="person" size={24} color={colors.primary} />
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {post.owner.slice(0, 6)}...{post.owner.slice(-4)}
              </Text>
              <Text style={[styles.postDate, { color: colors.textSecondary }]}>
                {formatDate(post.timestamp)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.postContent, { color: colors.text }]}>
          {post.content}
        </Text>

        {post.imageHash && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: getImageUrl(post.imageHash) }}
              style={styles.postImage}
              resizeMode="cover"
              onError={(e) => console.error('Image load error:', e.nativeEvent.error)}
            />
          </View>
        )}

        <View style={styles.postFooter}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialIcons name="favorite" size={20} color={colors.primary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {(post.likes || []).length}
              </Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="chat-bubble-outline" size={20} color={colors.primary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {(post.comments || []).length}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </ErrorBoundary>
  );
};

const AllPostScreen = () => {
  const navigation = useNavigation();
  const { fetchMyPosts, myPosts } = useContext(chatAppContext);
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    const loadPosts = async () => {
      try {
        await fetchMyPosts();
      } catch (err) {
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    loadPosts();

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('TotalPost')}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Your Posts</Text>
        <View style={styles.backButton} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={myPosts || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => <PostCard post={item} index={index} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

// React Native version of PostScreen
const PostScreen = ({ route }) => {
  const { post } = route.params || {};
  const { currentUserAddress, likePost, commentOnPost } = useContext(chatAppContext);
  const { colors } = useTheme();
  const [commentText, setCommentText] = useState('');
  const [imageUrl, setImageUrl] = useState('https://placehold.co/300x200');
  const [isLiked, setIsLiked] = useState(false);

  const getRawHash = (imageHash) => {
    if (!imageHash) return null;
    // Check if it's already a raw hash
    if (/^Qm[1-9A-Za-z]{44}$/.test(imageHash)) {
      return imageHash;
    }
    // Extract hash from full URL
    const match = imageHash.match(/ipfs\/(Qm[1-9A-Za-z]{44})/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchImageData = async () => {
      if (!post?.imageHash) {
        console.log('No imageHash provided for post:', post);
        return;
      }

      const rawHash = getRawHash(post.imageHash);
      if (!rawHash) {
        console.log('Invalid imageHash:', post.imageHash);
        setImageUrl('https://placehold.co/300x200');
        return;
      }

      // Try fetching JSON
      try {
        const url = `https://gateway.pinata.cloud/ipfs/${rawHash}`;
        console.log('Fetching JSON from:', url);
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched JSON data:', data);
          setImageUrl(data.image || data.imageUrl || 'https://placehold.co/300x200');
          return;
        } else {
          console.error('Failed to fetch JSON:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching JSON:', error);
      }

      // Fallback to direct image URL
      console.log('Attempting direct image URL:', `https://gateway.pinata.cloud/ipfs/${rawHash}`);
      setImageUrl(`https://gateway.pinata.cloud/ipfs/${rawHash}`);
    };

    fetchImageData();
  }, [post?.imageHash]);

  const handleLike = () => {
    if (post?.owner && post?.id) {
      likePost(post.owner, post.id);
      setIsLiked(!isLiked);
    }
  };

  const handleComment = () => {
    if (commentText.trim() === '' || !post?.owner || !post?.id) return;
    commentOnPost(post.owner, post.id, commentText);
    setCommentText('');
  };

  if (!post || !post.owner || !post.content) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: colors.error }]}>Invalid post data</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={[styles.postScreenContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.postCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.cardGradient, { backgroundColor: colors.primary + '10' }]} />
          <View style={styles.postHeader}>
            <View style={styles.userInfo}>
              <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
                <MaterialIcons name="person" size={24} color={colors.primary} />
              </View>
              <View style={styles.userDetails}>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {post.owner.slice(0, 6)}...{post.owner.slice(-4)}
                </Text>
              </View>
            </View>
          </View>

          <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>

          {post.imageHash && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.postImage}
                resizeMode="cover"
                onError={(e) => console.error('Image load error:', e.nativeEvent.error)}
              />
            </View>
          )}

          <View style={styles.postFooter}>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialIcons name="favorite" size={20} color={isLiked ? colors.error : colors.primary} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>
                  {(post.likes || []).length}
                </Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="chat-bubble-outline" size={20} color={colors.primary} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>
                  {(post.comments || []).length}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: isLiked ? colors.error + '20' : colors.primary + '20' }]}
              onPress={handleLike}
            >
              <Text style={[styles.actionButtonText, { color: isLiked ? colors.error : colors.primary }]}>
                Like
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>Comment</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.commentInputContainer}>
            <TextInput
              style={[styles.commentInput, { borderColor: colors.border, color: colors.text }]}
              placeholder="Write a comment..."
              placeholderTextColor={colors.textSecondary}
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity
              style={[styles.commentButton, { backgroundColor: colors.primary }]}
              onPress={handleComment}
              disabled={commentText.trim() === ''}
            >
              <Text style={styles.commentButtonText}>Post</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.commentsSection}>
            <Text style={[styles.commentsTitle, { color: colors.text }]}>Comments</Text>
            {(post.comments || []).map((comment, index) => (
              <View key={index} style={styles.comment}>
                <Text style={[styles.commentText, { color: colors.text }]}>
                  <Text style={{ fontWeight: '600' }}>
                    {comment.commenter.slice(0, 6)}...{comment.commenter.slice(-4)}
                  </Text>
                  <Text> </Text>
                  <Text>{comment.commentText}</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postScreenContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 16,
    gap: 16,
  },
  postCard: {
    borderRadius: 24,
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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  postDate: {
    fontSize: 12,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
  },
  commentButton: {
    padding: 10,
    borderRadius: 8,
  },
  commentButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  commentsSection: {
    marginTop: 8,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  comment: {
    marginBottom: 8,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AllPostScreen;