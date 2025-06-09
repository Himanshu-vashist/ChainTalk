import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { chatAppContext } from '../Context/ChatAppContext';
import { useTheme } from '../Context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

const CreatePostScreen = () => {
  const { createPost } = useContext(chatAppContext);
  const { colors } = useTheme();
  const [content, setContent] = useState('');
  const [originalImage, setOriginalImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

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
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const pickImage = async (type) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please grant media permissions to pick an image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      if (type === 'original') {
        setOriginalImage(result.assets[0]);
      } else if (type === 'preview') {
        setPreviewImage(result.assets[0]);
      }
    }
  };

  const uploadToPinata = async (uri) => {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const formData = new FormData();
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('file', { uri, name: filename, type });
    formData.append('pinataMetadata', JSON.stringify({ name: filename }));

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer YOUR_PINATA_JWT`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handlePost = async () => {
    if (content.trim() === '') {
      Alert.alert('Validation', 'Post content cannot be empty.');
      return;
    }
    if (!originalImage) {
        Alert.alert('Validation', 'Please select an original image for your post.');
        return;
    }
    setUploading(true);
    try {
      let originalImageUrl = '';
      if (originalImage) originalImageUrl = await uploadToPinata(originalImage.uri);
      
      // Preview image is uploaded but its hash is not sent to the smart contract
      let previewImageUrl = '';
      if (previewImage) previewImageUrl = await uploadToPinata(previewImage.uri);

      await createPost(content, originalImageUrl); // Only original image hash sent to contract
      setContent('');
      setOriginalImage(null);
      setPreviewImage(null);
      Alert.alert('Success', 'Post created successfully.');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.mainContent,
            {
              opacity: fadeAnim,
              transform: [
                { translateY },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <View style={[styles.headerSection, { backgroundColor: colors.surface }]}>
            <View style={[styles.headerGradient, { backgroundColor: colors.primary + '20' }]} />
            <Text style={[styles.heading, { color: colors.text }]}>
              Create <Text style={[styles.highlight, { color: colors.primary }]}>Post</Text>
            </Text>
            <Text style={[styles.subHeading, { color: colors.textSecondary }]}>
              Share your thoughts and images on the blockchain!
            </Text>
          </View>

          <View style={[styles.contentSection, { backgroundColor: colors.surface }]}>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.textSecondary}
              multiline
              value={content}
              onChangeText={setContent}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.imagePicker, { backgroundColor: colors.primary }]}
                onPress={() => pickImage('original')}
                activeOpacity={0.8}
              >
                <MaterialIcons name="image" size={20} color="#fff" />
                <Text style={styles.imagePickerText}>
                  {originalImage ? 'Change Original Image' : 'Add Original Image'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.imagePicker, { backgroundColor: colors.secondary }]}
                onPress={() => pickImage('preview')}
                activeOpacity={0.8}
              >
                <MaterialIcons name="collections" size={20} color="#fff" />
                <Text style={styles.imagePickerText}>
                  {previewImage ? 'Change Preview Image' : 'Add Preview Image'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.postButton,
                  { backgroundColor: colors.primary },
                  uploading && styles.postButtonDisabled,
                ]}
                onPress={handlePost}
                disabled={uploading || !originalImage}
                activeOpacity={0.8}
              >
                {uploading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <MaterialIcons name="send" size={20} color="#fff" />
                    <Text style={styles.postButtonText}>Post</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {originalImage && (
              <View style={styles.imagePreviewContainer}>
                <Text style={[styles.previewLabel, { color: colors.text }]}>Original Image Preview:</Text>
                <Image
                  source={{ uri: originalImage.uri }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={[styles.removeImage, { backgroundColor: colors.error }]}
                  onPress={() => setOriginalImage(null)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            )}

            {previewImage && (
              <View style={styles.imagePreviewContainer}>
                <Text style={[styles.previewLabel, { color: colors.text }]}>Preview Image Preview:</Text>
                <Image
                  source={{ uri: previewImage.uri }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={[styles.removeImage, { backgroundColor: colors.error }]}
                  onPress={() => setPreviewImage(null)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    height: '60%',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  highlight: {
    // color will be set by theme
  },
  subHeading: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  contentSection: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
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
  textArea: {
    minHeight: 120,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 16,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  postButtonDisabled: {
    opacity: 0.6,
  },
  imagePreviewContainer: {
    marginTop: 10,
    alignItems: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeImageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreatePostScreen;