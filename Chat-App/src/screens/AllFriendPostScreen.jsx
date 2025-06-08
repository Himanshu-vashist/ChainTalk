import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { chatAppContext } from '../Context/ChatAppContext';

import PostListScreen from '../screens/PostListScreen';

const AllFriendPostScreen = () => {
  const {
    fetchFriendsPosts,
    friendsPosts,
  } = useContext(chatAppContext);

  useEffect(() => {
    fetchFriendsPosts();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Friends' Posts</Text>
        <View style={styles.postListContainer}>
          <PostListScreen posts={friendsPosts} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f9a826',
    marginBottom: 20,
    textAlign: 'center',
  },
  postListContainer: {
    width: '100%',
  },
});

export default AllFriendPostScreen;
