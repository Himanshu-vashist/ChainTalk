import React, { useContext, useState, useRef, useEffect } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { chatAppContext } from "../Context/ChatAppContext";
import { useTheme } from '../Context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

const CreateNFTScreen = () => {
  const { createNFT, loading, error } = useContext(chatAppContext);
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

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

  const handleCreate = async () => {
    if (!title || !description || !price) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await createNFT(title, description, price);
      navigation.goBack();
    } catch (err) {
      console.error("Error creating NFT:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
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
              style={[styles.input, { 
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter NFT title"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              }]}
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
              style={[styles.input, { 
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              }]}
              value={price}
              onChangeText={setPrice}
              placeholder="Enter price in ETH"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          {error && (
            <View style={[styles.errorContainer, { backgroundColor: colors.error + '10' }]}>
              <MaterialIcons name="error-outline" size={20} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? (
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
});

export default CreateNFTScreen;