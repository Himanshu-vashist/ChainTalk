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
        });

        if (!result.cancelled) {
            setImage(result.assets[0]);
        }
    };

    const uploadToPinata = async (image) => {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const formData = new FormData();

        const uriParts = image.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("file", {
            uri: image.uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
        });

        formData.append("pinataMetadata", JSON.stringify({ name: image.fileName || "avatar" }));

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2OWZjZjE4Yi04YzIxLTQxNTMtODQ3NS0xMTI2ODUxZjY4NjciLCJlbWFpbCI6InVqamF3YWxrdW1hcm11a2hlcmplZTMzNUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMzZiNmEwNTRlMGMyOTRiNjNkYzgiLCJzY29wZWRLZXlTZWNyZXQiOiJlMTdkOTU2N2JmYWU1MjRmN2Y3Y2MyYzRhOTk4N2ZhZWQ1NTZlYTY3NjY0NzFjNjI4ZGFmNzQzMmVhMjg3NmFlIiwiZXhwIjoxNzc3MTg3NjkyfQ.mCuTmFcV0b7zGWVX6h1gJSE3vFkd_prv-TwKrv_VrgQ`,
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload to Pinata failed");
            return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
        } catch (error) {
            throw new Error("Image upload failed: " + error.message);
        }
    };

    const uploadMetadataToPinata = async (name, address, imageUrl) => {
        const jsonData = { name, physicalAddress: address, image: imageUrl };

        try {
            const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer YOUR_PINATA_JWT_HERE`,
                },
                body: JSON.stringify(jsonData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Metadata upload failed");
            return data.IpfsHash;
        } catch (err) {
            throw new Error("Metadata upload failed: " + err.message);
        }
    };

    const handleSubmit = async () => {
        if (!form.name || !form.physicalAddress || !image) {
            setError("All fields are required");
            return;
        }

        try {
            const imageUrl = await uploadToPinata(image);
            const metadataHash = await uploadMetadataToPinata(
                form.name,
                form.physicalAddress,
                imageUrl
            );

            await createAccount({
                name: form.name,
                physicalAddress: form.physicalAddress,
                imageHash: metadataHash,
            });

            setForm({ name: "", physicalAddress: "" });
            setImage(null);
            setError("");
            Alert.alert("Success", "Account created successfully!");
        } catch (err) {
            console.error(err);
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
