
import React, { useContext, useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Platform,
} from "react-native";
import { chatAppContext } from "../Context/ChatAppContext";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const ChatsScreen = () => {
    const {
        friendLists,
        friendMsg,
        sendMessage,
        readMessage,
        checkMessages,
        loading,
        error,
    } = useContext(chatAppContext);
    const [selectedFriend, setSelectedFriend] = useState(null); // Store friend object
    const [message, setMessage] = useState("");
    const [hasMessages, setHasMessages] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        if (selectedFriend) {
            readMessage(selectedFriend.pubkey); // Use pubkey for messaging
            checkMessages(selectedFriend.pubkey).then(setHasMessages);
        }
    }, [selectedFriend, readMessage, checkMessages]);

    const handleSend = async () => {
        if (!selectedFriend) {
            alert("Please select a friend to chat with");
            return;
        }

        if (!message.trim()) {
            alert("Message cannot be empty");
            return;
        }

        try {
            await sendMessage({
                msg: message,
                address: selectedFriend.pubkey, // Use pubkey for sending message
            });
            setMessage("");
        } catch (err) {
            alert(err.message || "Failed to send message");
        }
    };

    const renderMessage = (msg, index) => {
        if (!msg || !msg.msg || !msg.sender) return null;

        const isSender = msg.sender.toLowerCase() === selectedFriend?.pubkey.toLowerCase();
        return (
            <View
                key={index}
                style={[
                    styles.messageBubble,
                    isSender ? styles.receivedMessage : styles.sentMessage,
                ]}
            >
                <Text style={styles.messageText}>{msg.msg}</Text>
                <Text style={styles.timestamp}>
                    {new Date(Number(msg.timestamp) * 1000).toLocaleTimeString()}
                </Text>
            </View>
        );
    };

    // Format address for display
    const formatAddress = (address) => {
        if (!address) return "";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chats</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.friendList}>
                    <ScrollView>
                        {friendLists.length === 0 ? (
                            <Text style={styles.emptyText}>No friends yet</Text>
                        ) : (
                            friendLists.map((friend, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.friendItem,
                                        selectedFriend?.pubkey === friend.pubkey && styles.selectedFriend,
                                    ]}
                                    onPress={() => setSelectedFriend(friend)}
                                >
                                    <Text style={styles.friendName}>
                                        {friend.name || formatAddress(friend.pubkey)}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>
                </View>

                <View style={styles.chatArea}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#6C5CE7" />
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : !selectedFriend ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                Select a friend to start chatting
                            </Text>
                        </View>
                    ) : !hasMessages ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                No messages yet. Start the conversation!
                            </Text>
                        </View>
                    ) : (
                        <ScrollView
                            style={styles.messageList}
                            contentContainerStyle={{ paddingBottom: 16 }}
                            ref={(ref) => {
                                if (ref) ref.scrollToEnd({ animated: true });
                            }}
                        >
                            {friendMsg.map(renderMessage)}
                        </ScrollView>
                    )}

                    {selectedFriend && (
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Type a message..."
                                placeholderTextColor="#666"
                                maxLength={500}
                                multiline
                            />
                            <TouchableOpacity
                                style={[
                                    styles.sendButton,
                                    !message.trim() && styles.disabledButton,
                                ]}
                                onPress={handleSend}
                                disabled={loading || !message.trim()}
                            >
                                <MaterialIcons
                                    name="send"
                                    size={24}
                                    color={message.trim() ? "#6C5CE7" : "#999"}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1A1A1A",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#2D2D2D",
        borderBottomWidth: 1,
        borderBottomColor: "#3D3D3D",
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    content: {
        flex: 1,
        flexDirection: "row",
    },
    friendList: {
        width: 120,
        backgroundColor: "#2D2D2D",
        borderRightWidth: 1,
        borderRightColor: "#3D3D3D",
    },
    friendItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#3D3D3D",
    },
    selectedFriend: {
        backgroundColor: "#3D3D3D",
    },
    friendName: {
        color: "white",
        fontSize: 12,
    },
    chatArea: {
        flex: 1,
        backgroundColor: "#1A1A1A",
    },
    messageList: {
        flex: 1,
        padding: 16,
    },
    messageBubble: {
        maxWidth: "80%",
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    sentMessage: {
        backgroundColor: "#6C5CE7",
        alignSelf: "flex-end",
        borderBottomRightRadius: 4,
    },
    receivedMessage: {
        backgroundColor: "#3D3D3D",
        alignSelf: "flex-start",
        borderBottomLeftRadius: 4,
    },
    messageText: {
        color: "white",
        fontSize: 16,
    },
    timestamp: {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 10,
        marginTop: 4,
        alignSelf: "flex-end",
    },
    inputContainer: {
        flexDirection: "row",
        padding: 16,
        backgroundColor: "#2D2D2D",
        borderTopWidth: 1,
        borderTopColor: "#3D3D3D",
    },
    input: {
        flex: 1,
        backgroundColor: "#3D3D3D",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        color: "white",
        marginRight: 8,
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#3D3D3D",
        justifyContent: "center",
        alignItems: "center",
    },
    disabledButton: {
        opacity: 0.5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    errorText: {
        color: "#FF6B6B",
        textAlign: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    emptyText: {
        color: "#666",
        textAlign: "center",
        fontSize: 16,
    },
});

export default ChatsScreen;