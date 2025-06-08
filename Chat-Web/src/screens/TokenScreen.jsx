import React, { useEffect, useContext } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { chatAppContext } from "../Context/ChatAppContext";

const TokenScreen = () => {
  const { fetchMyRewards, myRewardTokens, error } = useContext(chatAppContext);

  useEffect(() => {
    fetchMyRewards();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Your Reward Tokens</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.tokenBox}>
          <Text style={styles.tokenText}>
            <Text style={styles.bold}>Total Earned:</Text> {myRewardTokens} Tokens
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TokenScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#f0f0f0",
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  tokenBox: {
    backgroundColor: "#111",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: "#f9a826",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  tokenText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
    color: "#f9a826",
  },
  error: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
});