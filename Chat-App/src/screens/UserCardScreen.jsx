import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { chatAppContext } from '../Context/ChatAppContext';

const UserCardScreen = ({ el }) => {
  const { sendFriendRequest } = useContext(chatAppContext);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const name = el[0];
  const accountAddress = el[1];
  const jsonHash = el[2];

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await fetch(`https://gateway.pinata.cloud/ipfs/${jsonHash}`);
        if (response.ok) {
          const data = await response.json();
          setImageUrl(data.image || null);
        }
      } catch (error) {
        console.log("Error fetching JSON:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJsonData();
  }, [jsonHash]);

  const handleSendRequest = () => {
    sendFriendRequest(accountAddress);
    Alert.alert('Request Sent', `Friend request sent to ${name}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        {loading ? (
          <ActivityIndicator size="large" color="#f9a826" />
        ) : (
          <Image
            source={{ uri: imageUrl || 'https://via.placeholder.com/100' }}
            style={styles.image}
            onError={() => console.log('Image failed to load')}
          />
        )}
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.address}>{accountAddress.slice(0, 25)}...</Text>
        <TouchableOpacity style={styles.button} onPress={handleSendRequest}>
          <Text style={styles.buttonText}>Send Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 16,
    margin: 10,
    width: screenWidth * 0.9,
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  imageWrapper: {
    marginBottom: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoBox: {
    alignItems: 'center',
  },
  name: {
    color: '#f9a826',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  address: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ff6600',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default UserCardScreen;
