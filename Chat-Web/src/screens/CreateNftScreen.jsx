import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Animated,
  KeyboardAvoidingView,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { chatAppContext } from '../Context/ChatAppContext';
import { useTheme } from '../Context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { parseEther } from 'ethers';

const CreateNFTScreen = () => {
  const { createNFT, loading, error } = useContext(chatAppContext);
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalImage, setOriginalImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [originalHash, setOriginalHash] = useState('');
  const [previewHash, setPreviewHash] = useState('');
  const [uploadError, setUploadError] = useState('');
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
      base64: false,
    });
    if (!result.canceled) {
      if (type === 'original') {
        setOriginalImage(result.assets[0]);
        setOriginalHash('');
      } else if (type === 'preview') {
        setPreviewImage(result.assets[0]);
        setPreviewHash('');
      }
    }
  };

  const uploadToPinata = async (image) => {
    if (!image) throw new Error('No image selected');
    setUploading(true);

    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const formData = new FormData();

    let fileName = image.fileName || `photo.${image.uri.split('.').pop()?.toLowerCase() || 'jpg'}`;
    let fileType = image.type || `image/${fileName.split('.').pop()?.toLowerCase() === 'jpg' ? 'jpeg' : fileName.split('.').pop() || 'jpeg'}`;
    let file;

    if (Platform.OS === 'web') {
      try {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        file = new File([blob], fileName, { type: fileType });
      } catch (err) {
        console.error('Blob fetch error:', err);
        throw new Error('Failed to process image blob');
      }
    } else {
      let fileUri = image.uri;
      if (Platform.OS === 'ios' && fileUri.startsWith('file://')) {
        fileUri = fileUri.replace('file://', '');
      }
      file = { uri: fileUri, name: fileName, type: fileType };
    }

    formData.append('file', file);
    formData.append('pinataMetadata', JSON.stringify({ name: fileName }));

    try {
      const res = await fetch(url, {
        method: 'POST',
         headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2OWZjZjE4Yi04YzIxLTQxNTMtODQ3NS0xMTI2ODUxZjY4NjciLCJlbWFpbCI6InVqamF3YWxrdW1hcm11a2hlcmplZTMzNUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMzZiNmEwNTRlMGMyOTRiNjNkYzgiLCJzY29wZWRLZXlTZWNyZXQiOiJlMTdkOTU2N2JmYWU1MjRmN2Y3Y2MyYzRhOTk4N2ZhZWQ1NTZlYTY3NjY0NzFjNjI4ZGFmNzQzMmVhMjg3NmFlIiwiZXhwIjoxNzc3MTg3NjkyfQ.mCuTmFcV0b7zGWVX6h1gJSE3vFkd_prv-TwKrv_VrgQ`, // Replace with valid JWT
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.details || data.error || 'Upload failed');
      return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    } catch (err) {
      console.error('Pinata upload error:', err);
      throw new Error(`Image upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    if (!title || !description || !price || !originalImage || !previewImage) {
      Alert.alert('Validation', 'Please fill in all fields and select both images');
      return;
    }

    // Validate price is a number
    if (isNaN(price) || price <= 0) {
      Alert.alert('Validation', 'Please enter a valid positive price');
      return;
    }

    try {
      setUploadError('');
      let finalOriginalHash = originalHash;
      let finalPreviewHash = previewHash;

      if (originalImage && !originalHash) {
        finalOriginalHash = await uploadToPinata(originalImage);
        setOriginalHash(finalOriginalHash);
      }

      if (previewImage && !previewHash) {
        finalPreviewHash = await uploadToPinata(previewImage);
        setPreviewHash(finalPreviewHash);
      }

      const priceInWei = parseEther(price.toString());
      await createNFT(title, description, priceInWei, finalOriginalHash, finalPreviewHash);
      navigation.goBack();
      Alert.alert('Success', 'NFT created successfully.');
    } catch (err) {
      console.error('Error creating NFT:', err);
      setUploadError(err.message || 'Error creating NFT');
      Alert.alert('Error', err.message || 'Error creating NFT');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Create NFT</Text>
        <View style={styles.headerRight} />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Title</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter NFT title"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter NFT description"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Price (ETH)</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={price}
              onChangeText={setPrice}
              placeholder="Enter price in ETH"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Original Image</Text>
            <TouchableOpacity
              style={[styles.fileButton, { backgroundColor: colors.primary + '20' }]}
              onPress={() => pickImage('original')}
            >
              <Text style={[styles.fileButtonText, { color: colors.primary }]}>
                {originalImage ? 'Change Original Image' : 'Select Original Image'}
              </Text>
            </TouchableOpacity>
            {originalImage && (
              <View style={styles.imagePreviewContainer}>
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
            {originalHash && (
              <Text style={[styles.hashText, { color: colors.textSecondary }]}>
                IPFS Hash: {originalHash.substring(0, 10)}...{originalHash.substring(originalHash.length - 5)}
              </Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Preview Image</Text>
            <TouchableOpacity
              style={[styles.fileButton, { backgroundColor: colors.primary + '20' }]}
              onPress={() => pickImage('preview')}
            >
              <Text style={[styles.fileButtonText, { color: colors.primary }]}>
                {previewImage ? 'Change Preview Image' : 'Select Preview Image'}
              </Text>
            </TouchableOpacity>
            {previewImage && (
              <View style={styles.imagePreviewContainer}>
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
            {previewHash && (
              <Text style={[styles.hashText, { color: colors.textSecondary }]}>
                IPFS Hash: {previewHash.substring(0, 10)}...{previewHash.substring(previewHash.length - 5)}
              </Text>
            )}
          </View>

          {(error || uploadError) && (
            <View style={[styles.errorContainer, { backgroundColor: colors.error + '10' }]}>
              <MaterialIcons name="error-outline" size={20} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error || uploadError}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={handleCreate}
            disabled={loading || uploading}
          >
            {loading || uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons name="add-circle" size={20} color="#fff" />
                <Text style={styles.createButtonText}>Create NFT</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  fileButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  fileButtonText: {
    fontSize: 16,
  },
  hashText: {
    fontSize: 12,
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 24,
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    marginTop: 10,
    alignItems: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 6,
  },
  removeImage: {
    position: 'absolute',
    top: 0,
    right: 0,
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
  }
});

export default CreateNFTScreen;
