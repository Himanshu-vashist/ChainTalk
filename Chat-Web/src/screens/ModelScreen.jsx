import React, { useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { chatAppContext } from "../Context/ChatAppContext";

const ModelScreen = () => {
    const { createAccount } = useContext(chatAppContext);
    const [form, setForm] = useState({ name: "", physicalAddress: "" });
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");

    const handleInputChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission required", "Permission to access media is needed!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            base64: false, // Explicitly disable base64
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
            console.log("Selected image:", result.assets[0]); // Debug image object
        }
    };

    const uploadToPinata = async (image) => {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const formData = new FormData();

        // Handle base64 or file URI
        let fileUri = image.uri;
        let fileType = image.mimeType || "image/jpeg";
        let fileName = image.fileName || `photo.jpg`;

        // If uri is a base64 data URL, convert to Blob
        if (fileUri.startsWith("data:image")) {
            const base64String = fileUri.split(",")[1];
            const binaryString = atob(base64String);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: fileType });
            formData.append("file", blob, fileName);
        } else {
            // Handle file URI
            fileUri = Platform.OS === "ios" ? fileUri.replace("file://", "") : fileUri;
            const fileExtension = fileUri.split(".").pop()?.toLowerCase() || "jpg";
            fileType = fileExtension === "jpg" ? "image/jpeg" : `image/${fileExtension}`;
            fileName = image.fileName || `photo.${fileExtension}`;

            formData.append("file", {
                uri: fileUri,
                name: fileName,
                type: fileType,
            });
        }

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2OWZjZjE4Yi04YzIxLTQxNTMtODQ3NS0xMTI2ODUxZjY4NjciLCJlbWFpbCI6InVqamF3YWxrdW1hcm11a2hlcmplZTMzNUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMzZiNmEwNTRlMGMyOTRiNjNkYzgiLCJzY29wZWRLZXlTZWNyZXQiOiJlMTdkOTU2N2JmYWU1MjRmN2Y3Y2MyYzRhOTk4N2ZhZWQ1NTZlYTY3NjY0NzFjNjI4ZGFmNzQzMmVhMjg3NmFlIiwiZXhwIjoxNzc3MTg3NjkyfQ.mCuTmFcV0b7zGWVX6h1gJSE3vFkd_prv-TwKrv_VrgQ`,
                },
                body: formData,
            });

            const data = await res.json();
            console.log("Pinata response:", JSON.stringify(data, null, 2)); // Debug response
            if (!res.ok) throw new Error(data.error?.details || data.error || "Upload to Pinata failed");
            return data.IpfsHash; // Return only the IPFS hash
        } catch (error) {
            console.error("Pinata upload error:", error);
            throw new Error("Image upload failed: " + error.message);
        }
    };

    const handleSubmit = async () => {
        if (!form.name || !form.physicalAddress || !image) {
            setError("All fields are required");
            return;
        }

        try {
            const imageHash = await uploadToPinata(image);

            await createAccount({
                name: form.name,
                physicalAddress: form.physicalAddress,
                imageHash: imageHash, // Pass IPFS hash directly
            });

            setForm({ name: "", physicalAddress: "" });
            setImage(null);
            setError("");
            Alert.alert("Success", "Account created successfully!");
        } catch (err) {
            console.error("Submit error:", err);
            setError(err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Create Your <Text style={styles.highlight}>Account</Text>
            </Text>
            <Text style={styles.subtitle}>Join the blockchain chat app</Text>
            <Text style={styles.note}>Ensure all fields are completed accurately.</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#aaa"
                value={form.name}
                onChangeText={(value) => handleInputChange("name", value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Physical Address"
                placeholderTextColor="#aaa"
                value={form.physicalAddress}
                onChangeText={(value) => handleInputChange("physicalAddress", value)}
            />

            <TouchableOpacity onPress={pickImage} style={styles.uploadBtn}>
                <Text style={styles.uploadText}>{image ? "Image Selected" : "Pick an Image"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {image && (
                <Image
                    source={{ uri: image.uri }}
                    style={styles.preview}
                    resizeMode="contain"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
    },
    highlight: {
        color: "orange",
    },
    subtitle: {
        color: "#ccc",
        textAlign: "center",
        marginTop: 8,
        fontSize: 14,
    },
    note: {
        color: "#aaa",
        textAlign: "center",
        fontSize: 12,
        marginVertical: 10,
    },
    input: {
        backgroundColor: "#1e1e1e",
        padding: 12,
        borderRadius: 6,
        marginVertical: 6,
        color: "#fff",
    },
    uploadBtn: {
        backgroundColor: "#333",
        padding: 12,
        borderRadius: 6,
        marginVertical: 10,
        alignItems: "center",
    },
    uploadText: {
        color: "orange",
        fontWeight: "600",
    },
    button: {
        backgroundColor: "orange",
        padding: 14,
        borderRadius: 6,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: 10,
    },
    preview: {
        marginTop: 16,
        width: "100%",
        height: 180,
        borderRadius: 6,
    },
});

export default ModelScreen;