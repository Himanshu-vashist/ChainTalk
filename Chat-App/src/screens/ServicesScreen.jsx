import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ServicesScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Services</Text>

      <Pressable
        style={styles.serviceCard}
        onPress={() => navigation.navigate('TokensScreen')}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="wallet" size={30} color="#f9a826" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.heading}>View My Tokens</Text>
          <Text style={styles.description}>
            See the tokens you've earned or bought on the platform.
          </Text>
        </View>
      </Pressable>

      {/* Additional services can be added here similarly */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#f9a826',
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  serviceCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#f9a826',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  heading: {
    color: '#f9a826',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
  },
});

export default ServicesScreen;
