/*import React, { createContext, useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { ChatAppAddress, ChatAppABI, NFTAddress, NFTABI, TokenAddress, TokenABI } from '../contracts/constants';

export const chatAppContext = createContext();

export const ChatAppProvider = ({ children }) => {
    const title = "Hey welcome to blockchain";

    const [account, setAccount] = useState("");
    const [username, setUserName] = useState("");
    const [friendLists, setFriendLists] = useState([]);
    const [friendMsg, setFriendMsg] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [error, setError] = useState("");
    const [currentUserName, setCurrentUserName] = useState("");
    const [currentUserAddress, setCurrentUserAddress] = useState("");
    const [myPosts, setMyPosts] = useState([]);
    const [friendsPosts, setFriendsPosts] = useState([]);
    const [allNFTs, setAllNFTs] = useState([]);
    const [myNFTs, setMyNFTs] = useState([]);
    const [myRewardTokens, setMyRewardTokens] = useState("0");
    const [userImages, setUserImages] = useState({});
    const [contract, setContract] = useState(null);
    const [showUserCard, setShowUserCard] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const getProvider = () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            return new BrowserProvider(window.ethereum);
        }
        throw new Error('Please install MetaMask to use this app');
    };

    const connectWallet = async () => {
        try {
            setLoading(true);
            setError("");

            if (typeof window === 'undefined' || !window.ethereum) {
                throw new Error('Please install MetaMask to use this app');
            }

            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });

            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found');
            }

            const provider = getProvider();
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            // Set up event listeners for account changes
            window.ethereum.on('accountsChanged', async (newAccounts) => {
                if (newAccounts.length === 0) {
                    setAccount("");
                    setContract(null);
                } else {
                    setAccount(newAccounts[0]);
                    await fetchData();
                }
            });

            // Set up event listener for chain changes
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });

            return address;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            setError(error.message || 'Failed to connect wallet');
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (account && userList && userList.length > 0) {
            console.log('Debug - Current state:', {
                account,
                userListLength: userList.length,
                friendAddresses: friendLists.map(f => f[1]),
                pendingAddresses: pendingRequests.map(r => r[1]),
                sentAddresses: sentRequests.map(r => r[1])
            });

            const filtered = userList.filter(user => {
                const userAddress = user[1];
                const isNotCurrentUser = userAddress.toLowerCase() !== account.toLowerCase();
                const isNotFriend = !friendLists.some(friend => friend[1].toLowerCase() === userAddress.toLowerCase());
                const isNotPending = !pendingRequests.some(req => req[1].toLowerCase() === userAddress.toLowerCase());
                const isNotSent = !sentRequests.some(req => req[1].toLowerCase() === userAddress.toLowerCase());

                console.log('Debug - User filter:', {
                    address: userAddress,
                    isNotCurrentUser,
                    isNotFriend,
                    isNotPending,
                    isNotSent
                });

                // Only include users that are not the current user and not already in any list
                return isNotCurrentUser && (isNotFriend && isNotPending && isNotSent);
            });

            console.log('Debug - Filtered users:', filtered);
            setAvailableUsers(filtered);
        }
    }, [account, userList, friendLists, pendingRequests, sentRequests]);

    const fetchUserImage = async (imageHash) => {
        try {
            if (!imageHash) return 'https://via.placeholder.com/100';
            
            // Try multiple IPFS gateways
            const gateways = [
                'https://ipfs.io/ipfs/',
                'https://gateway.ipfs.io/ipfs/',
                'https://cloudflare-ipfs.com/ipfs/',
                'https://dweb.link/ipfs/'
            ];

            for (const gateway of gateways) {
                try {
                    const response = await fetch(`${gateway}${imageHash}`);
                    if (!response.ok) continue;
                    
                    const data = await response.json();
                    if (data && data.image) {
                        return data.image;
                    }
                } catch (error) {
                    console.log(`Failed to fetch from ${gateway}:`, error);
                    continue;
                }
            }
            
            // If all gateways fail, return placeholder
            return 'https://via.placeholder.com/100';
        } catch (error) {
            console.log('Error fetching user image:', error);
            return 'https://via.placeholder.com/100';
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const connectAccount = await connectWallet();
            if (!connectAccount) {
                throw new Error("Wallet not connected");
            }
            setAccount(connectAccount);

            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);
            setContract(contract);

            console.log('Fetching all users...');
            const allUsers = await contract.getAllUsers();
            console.log('All users fetched:', allUsers);
            
            // Convert Proxy objects to regular arrays
            const userArray = Array.from(allUsers).map(user => [
                user[0], // name
                user[1], // address
                user[2]  // imageHash
            ]);
            setUserList(userArray);

            console.log('Fetching friend data...');
            const [friends, pendingReqs, sentReqs] = await Promise.all([
                contract.getFriends(),
                contract.getPendingRequests(),
                contract.getSentRequests()
            ]);

            // Convert Proxy objects to regular arrays
            const friendArray = Array.from(friends).map(friend => [
                friend[0], // name
                friend[1], // address
                friend[2]  // imageHash
            ]);
            const pendingArray = Array.from(pendingReqs).map(req => [
                req[0], // name
                req[1], // address
                req[2]  // imageHash
            ]);
            const sentArray = Array.from(sentReqs).map(req => [
                req[0], // name
                req[1], // address
                req[2]  // imageHash
            ]);

            console.log('Friend data fetched:', {
                friendList: friendArray,
                pendingReqs: pendingArray,
                sentReqs: sentArray
            });

            setFriends(friendArray);
            setPendingRequests(pendingArray);
            setSentRequests(sentArray);

            // Fetch user images
            const userImages = {};
            for (const user of userArray) {
                if (user[2]) { // Check if user has imageHash
                    userImages[user[1]] = await fetchUserImage(user[2]);
                }
            }
            setUserImages(userImages);

            // Fetch additional data
            await Promise.all([
                fetchAllNFTs(),
                fetchMyNFTs(),
                fetchMyRewards()
            ]);

        } catch (error) {
            console.log('Error in fetchData:', error);
            setError(error.message || 'Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initializeApp = async () => {
            try {
                if (typeof window !== 'undefined' && window.ethereum) {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        await fetchData();
                    }
                }
            } catch (error) {
                console.error('Error initializing app:', error);
                setError(error.message);
            }
        };

        initializeApp();

        // Cleanup function to remove event listeners
        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners('accountsChanged');
                window.ethereum.removeAllListeners('chainChanged');
            }
        };
    }, []);

    const createAccount = async ({ name, physicalAddress, imageHash }) => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.createAccount(name, physicalAddress, imageHash);
            setLoading(true);
            await tx.wait();
            setLoading(false);

            await new Promise(resolve => setTimeout(resolve, 3000));

            const updatedUserName = await contract.getUsername(account);
            if (!updatedUserName || updatedUserName === "0x") {
                throw new Error("User not created or empty data returned.");
            }

            setUserName(updatedUserName);
            setCurrentUserName(updatedUserName);
            setCurrentUserAddress(account);
            setUserList(await contract.getAllAppUser());
        } catch (err) {
            console.error("Error creating account:", err);
            setError("Error in creating account");
        }
    };

    const sendFriendRequest = async (friendAddress) => {
        try {
            if (!friendAddress) return setError("Friend address cannot be empty");

            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.sendFriendRequest(friendAddress);
            setLoading(true);
            await tx.wait();
            setLoading(false);
        } catch (err) {
            console.error("Error sending friend request:", err);
            setError("Error in sending friend request");
        }
    };

    const acceptFriendRequest = async (friendAddress) => {
        try {
            if (!friendAddress) return setError("Friend address cannot be empty");

            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.acceptFriendRequest(friendAddress);
            setLoading(true);
            await tx.wait();
            setLoading(false);
        } catch (err) {
            console.error("Error accepting friend request:", err);
            setError("Error in accepting friend request");
        }
    };

    const rejectRequest = async (fromaddress) => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.rejectFriendRequest(fromaddress);
            await tx.wait();
        } catch (err) {
            console.error("Error rejecting friend request:", err);
            setError("Error in rejecting friend request");
        }
    };

    const readMessage = async (friendAddress) => {
        try {
            if (!friendAddress) {
                setError("Friend address is required");
                return;
            }

            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            setLoading(true);
            const messages = await contract.readMessage(friendAddress);
            
            // Convert messages to array if it's not already
            const messageArray = Array.isArray(messages) ? messages : [];
            
            // Sort messages by timestamp
            const sortedMessages = messageArray.sort((a, b) => a.timestamp - b.timestamp);
            
            // Ensure messages have all required fields
            const validMessages = sortedMessages.filter(msg => 
                msg && 
                msg.sender && 
                msg.msg && 
                msg.timestamp
            );
            
            console.log('Fetched messages:', validMessages); // Debug log
            setFriendMsg(validMessages);
            setError(null);
        } catch (err) {
            console.error("Error reading message:", err);
            setError(err.message || "No messages found");
            setFriendMsg([]);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async ({ msg, address }) => {
        try {
            if (!msg || !address) {
                setError("Message and address cannot be empty");
                return;
            }

            if (!msg.trim()) {
                setError("Message cannot be empty");
                return;
            }

            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            setLoading(true);
            const tx = await contract.sendMessage(address, msg.trim());
            await tx.wait();
            
            // Refresh messages after sending
            await readMessage(address);
            setError(null);
        } catch (err) {
            console.error("Error sending message:", err);
            setError(err.message || "Error in sending message");
        } finally {
            setLoading(false);
        }
    };

    // Add a function to check if messages exist
    const checkMessages = async (friendAddress) => {
        try {
            if (!friendAddress) return false;

            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            const messages = await contract.readMessage(friendAddress);
            return Array.isArray(messages) && messages.length > 0;
        } catch (err) {
            console.error("Error checking messages:", err);
            return false;
        }
    };

    const readUser = async (userAddress) => {
        try {
            const provider = getProvider();
            const contract = new Contract(ChatAppAddress, ChatAppABI, provider);

            const userName = await contract.getUsername(userAddress);
            setCurrentUserName(userName);
            setCurrentUserAddress(userAddress);
        } catch (err) {
            console.error("Error fetching user details:", err);
            setError("Unable to fetch user details");
        }
    };

    // Post Functions...
    const createPost = async (content, imageHash) => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.createPost(content, imageHash);
            setLoading(true);
            await tx.wait();
            setLoading(false);

            await fetchMyPosts();
        } catch (err) {
            console.error("Error creating post:", err);
            setError("Error in creating post: " + err.message);
        }
    };

    const fetchMyPosts = async () => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            if (!(await contract.checkUserExists(await signer.getAddress()))) {
                setError("User not registered. Please create an account.");
                return;
            }

            setMyPosts(await contract.getMyPosts());
        } catch (err) {
            console.error("Error fetching my posts:", err);
            setError("Error fetching my posts: " + err.message);
        }
    };

    const fetchFriendsPosts = async () => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            if (!(await contract.checkUserExists(await signer.getAddress()))) {
                setError("User not registered. Please create an account.");
                return;
            }

            setFriendsPosts(await contract.getFriendsPosts());
        } catch (err) {
            console.error("Error fetching friends' posts:", err);
            setError("Error fetching friends' posts: " + err.message);
        }
    };

    const likePost = async (friendAddress, postId) => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.likePost(friendAddress, postId);
            setLoading(true);
            await tx.wait();
            setLoading(false);

            await fetchFriendsPosts();
        } catch (err) {
            console.error("Error liking post:", err);
            setError("Error in liking post");
        }
    };

    const commentOnPost = async (friendAddress, postId, commentText) => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.commentOnPost(friendAddress, postId, commentText);
            setLoading(true);
            await tx.wait();
            setLoading(false);

            await fetchFriendsPosts();
        } catch (err) {
            console.error("Error commenting on post:", err);
            setError("Error in commenting on post");
        }
    };

    // NFT Functions...
    const createNFT = async (title, price, description, originalHash, previewHash) => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.addNFT(title, price, description, originalHash, previewHash);
            setLoading(true);
            await tx.wait();
            setLoading(false);

            await fetchAllNFTs();
            await fetchMyNFTs();
        } catch (err) {
            console.error("Error creating NFT:", err);
            setError("Error in creating NFT: " + err.message);
        }
    };

    const fetchAllNFTs = async () => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            setAllNFTs(await contract.getAllNFTs());
        } catch (err) {
            console.error("Error fetching all NFTs:", err);
            setError("Error fetching NFTs: " + err.message);
        }
    };

    const fetchMyNFTs = async () => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            setMyNFTs(await contract.getMyNFTs());
        } catch (err) {
            console.error("Error fetching my NFTs:", err);
            setError("Error fetching my NFTs: " + err.message);
        }
    };

    const buyNFT = async (tokenId, price) => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.buyNFT(tokenId, { value: price });
            setLoading(true);
            await tx.wait();
            setLoading(false);

            await fetchAllNFTs();
            await fetchMyNFTs();
        } catch (err) {
            console.error("Error buying NFT:", err);
            setError("Error in buying NFT: " + err.message);
        }
    };

    const fetchMyRewards = async () => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new Contract(ChatAppAddress, ChatAppABI, signer);

            const reward = await contract.getMyRewards();
            setMyRewardTokens(reward.toString());
        } catch (err) {
            console.error("Failed to fetch rewards:", err);
            setError("Unable to fetch your rewards");
        }
    };

    useEffect(() => {
        if (account) setCurrentUserAddress(account);
    }, [account]);

    return (
        <chatAppContext.Provider
            value={{
                title,
                account,
                username,
                friendLists,
                friendMsg,
                loading,
                error,
                currentUserName,
                currentUserAddress,
                userList,
                pendingRequests,
                sentRequests,
                availableUsers,
                connectWallet,
                readMessage,
                createAccount,
                sendFriendRequest,
                acceptFriendRequest,
                rejectRequest,
                sendMessage,
                checkMessages,
                readUser,
                createPost,
                fetchMyPosts,
                fetchFriendsPosts,
                likePost,
                commentOnPost,
                myPosts,
                friendsPosts,
                allNFTs,
                myNFTs,
                myRewardTokens,
                createNFT,
                fetchAllNFTs,
                getMyNFTs: fetchMyNFTs,
                buyNFT,
                fetchMyRewards,
                userImages,
                showUserCard,
                setShowUserCard,
                selectedUser,
                setSelectedUser,
            }}
        >
            {children}
        </chatAppContext.Provider>
    );
};
*/
import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { CheckIfWalletConnected, connectWallet } from "../Utils/apiFeatures";
import { ChatAppAddress, ChatAppABI } from "./constants";

export const chatAppContext = createContext();

export const ChatAppProvider = ({ children }) => {
    const title = "Hey welcome to blockchain";

    // State declarations
    const [account, setAccount] = useState("");
    const [username, setUsername] = useState("");
    const [friendLists, setFriendLists] = useState([]);
    const [friendMsg, setFriendMsg] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [error, setError] = useState("");
    const [currentUserName, setCurrentUserName] = useState("");
    const [currentUserAddress, setCurrentUserAddress] = useState("");
    const [myPosts, setMyPosts] = useState([]);
    const [friendsPosts, setFriendsPosts] = useState([]);
    const [allNFTs, setAllNFTs] = useState([]);
    const [myNFTs, setMyNFTs] = useState([]);
    const [myRewardTokens, setMyRewardTokens] = useState("0");

    // Get Ethereum provider
    const getProvider = () => {
        if (!window.ethereum) {
            throw new Error("No Ethereum provider found. Please install MetaMask.");
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        provider.resolveName = async () => null; // Disable ENS resolution
        return provider;
    };

    // Wallet connection with retry logic
    const connectWalletWithRetry = async (retries = 3, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
            try {
                setLoading(true);
                const address = await connectWallet();
                if (!address) throw new Error("No accounts found");
                setAccount(address);
                return address;
            } catch (err) {
                console.error(`Attempt ${i + 1} failed:`, err);
                if (i < retries - 1) await new Promise((resolve) => setTimeout(resolve, delay));
            } finally {
                setLoading(false);
            }
        }
        setError("Failed to connect wallet after multiple attempts");
        return null;
    };

    // Fetch data with validation
    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const connectAccount = await connectWalletWithRetry();
            if (!connectAccount) throw new Error("Wallet not connected");

            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            // Fetch username
            const userName = await contract.getUsername(connectAccount);
            if (userName && userName !== "0x") {
                setUsername(userName);
                setCurrentUserName(userName);
                setCurrentUserAddress(connectAccount);
            }

            // Fetch all users with validation
            const allUsers = await contract.getAllAppUser();
            if (!Array.isArray(allUsers)) {
                throw new Error("Invalid user list format");
            }
            const userArray = allUsers.map((user) => ({
                name: user.name || "",
                accountAddress: user.accountAddress || user.pubkey || "",
                imageHash: user.imageHash || "",
            }));
            setUserList(userArray);

            // Fetch friend-related data
            const [friends, pendingReqs, sentReqs] = await Promise.all([
                contract.getMyFriendList(),
                contract.getMyPendingRequests(),
                contract.getMySentRequests(),
            ]);

            setFriendLists(friends.map((f) => ({
                name: f.name || "",
                pubkey: f.pubkey || "",
                imageHash: f.imageHash || "",
            })));
            setPendingRequests(pendingReqs.map((r) => r.toLowerCase()));
            setSentRequests(sentReqs.map((r) => r.toLowerCase()));

            // Fetch additional data
            await Promise.all([fetchAllNFTs(), fetchMyNFTs(), fetchMyRewards()]);
        } catch (err) {
            console.error("Error in fetchData:", err);
            setError(err.message || "Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Filter available users
    useEffect(() => {
        if (!account || !userList.length) return;
        const friendAddresses = friendLists.map((f) => f.pubkey.toLowerCase());
        const pendingAddresses = pendingRequests.map((a) => a.toLowerCase());
        const sentAddresses = sentRequests.map((a) => a.toLowerCase());

        const filtered = userList.filter(
            (user) =>
                user.accountAddress.toLowerCase() !== account.toLowerCase() &&
                !friendAddresses.includes(user.accountAddress.toLowerCase()) &&
                !pendingAddresses.includes(user.accountAddress.toLowerCase()) &&
                !sentAddresses.includes(user.accountAddress.toLowerCase())
        );
        setAvailableUsers(filtered);
    }, [account, userList, friendLists, pendingRequests, sentRequests]);

    // Initialize app on mount
    useEffect(() => {
        const initializeApp = async () => {
            try {
                const isConnected = await CheckIfWalletConnected();
                if (isConnected) {
                    await fetchData();
                }
            } catch (err) {
                console.error("Error initializing app:", err);
                setError("Failed to initialize app");
            }
        };
        initializeApp();

        // Cleanup event listeners
        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners("accountsChanged");
                window.ethereum.removeAllListeners("chainChanged");
            }
        };
    }, []);

    // Account creation
    const createAccount = async ({ name, physicalAddress, imageHash }) => {
        try {
            setLoading(true);
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.createAccount(name, physicalAddress, imageHash);
            await tx.wait();

            await new Promise((resolve) => setTimeout(resolve, 3000));

            const updatedUserName = await contract.getUsername(account);
            if (!updatedUserName || updatedUserName === "0x") {
                throw new Error("User not created or empty data returned.");
            }

            setUsername(updatedUserName);
            setCurrentUserName(updatedUserName);
            setCurrentUserAddress(account);
            setUserList(await contract.getAllAppUser());
        } catch (err) {
            console.error("Error creating account:", err);
            setError("Error in creating account: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Friend request functions
    const sendFriendRequest = async (friendAddress) => {
        try {
            if (!ethers.isAddress(friendAddress)) {
                throw new Error("Invalid friend address");
            }
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.sendFriendRequest(friendAddress);
            setLoading(true);
            await tx.wait();
            setSentRequests([...sentRequests, friendAddress.toLowerCase()]);
        } catch (err) {
            console.error("Error sending friend request:", err);
            setError("Error in sending friend request: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const acceptFriendRequest = async (friendAddress) => {
        try {
            if (!ethers.isAddress(friendAddress)) {
                throw new Error("Invalid friend address");
            }
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.acceptFriendRequest(friendAddress);
            setLoading(true);
            await tx.wait();
            setFriendLists([...friendLists, { pubkey: friendAddress, name: "", imageHash: "" }]);
            setPendingRequests(pendingRequests.filter((r) => r.toLowerCase() !== friendAddress.toLowerCase()));
        } catch (err) {
            console.error("Error accepting friend request:", err);
            setError("Error in accepting friend request: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const rejectFriendRequest = async (fromAddress) => {
        try {
            if (!ethers.isAddress(fromAddress)) {
                throw new Error("Invalid address");
            }
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.rejectFriendRequest(fromAddress);
            await tx.wait();
            setPendingRequests(pendingRequests.filter((r) => r.toLowerCase() !== fromAddress.toLowerCase()));
        } catch (err) {
            console.error("Error rejecting friend request:", err);
            setError("Error in rejecting friend request: " + err.message);
        }
    };

    // Messaging functions
    const sendMessage = async ({ msg, address }) => {
        try {
            if (!msg.trim() || !ethers.isAddress(address)) {
                throw new Error("Message and valid address are required");
            }
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            setLoading(true);
            const tx = await contract.sendMessage(address, msg.trim());
            await tx.wait();
            await readMessage(address);
        } catch (err) {
            console.error("Error sending message:", err);
            setError("Error in sending message: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const readMessage = async (friendAddress) => {
        try {
            if (!ethers.isAddress(friendAddress)) {
                throw new Error("Invalid friend address");
            }
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const messages = await contract.readMessage(friendAddress);
            const validMessages = Array.isArray(messages)
                ? messages
                    .filter((msg) => msg && msg.sender && msg.msg && msg.timestamp)
                    .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
                : [];
            setFriendMsg(validMessages);
        } catch (err) {
            console.error("Error reading messages:", err);
            setError("No messages found: " + err.message);
            setFriendMsg([]);
        }
    };

    const checkMessages = async (friendAddress) => {
        try {
            if (!ethers.isAddress(friendAddress)) return false;
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const messages = await contract.readMessage(friendAddress);
            return Array.isArray(messages) && messages.length > 0;
        } catch (err) {
            console.error("Error checking messages:", err);
            return false;
        }
    };

    const readUser = async (userAddress) => {
        try {
            if (!ethers.isAddress(userAddress)) {
                throw new Error("Invalid user address");
            }
            const provider = getProvider();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, provider);

            const userName = await contract.getUsername(userAddress);
            setCurrentUserName(userName);
            setCurrentUserAddress(userAddress);
        } catch (err) {
            console.error("Error fetching user details:", err);
            setError("Unable to fetch user details: " + err.message);
        }
    };

    // Post functions
    const createPost = async (content, imageHash) => {
        try {
            if (!content.trim()) {
                throw new Error("Post content cannot be empty");
            }
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.createPost(content, imageHash || "");
            setLoading(true);
            await tx.wait();
            await fetchMyPosts();
        } catch (err) {
            console.error("Error creating post:", err);
            setError("Error in creating post: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyPosts = async () => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            if (!(await contract.checkUserExists(await signer.getAddress()))) {
                throw new Error("User not registered. Please create an account.");
            }

            const posts = await contract.getMyPosts();
            setMyPosts(Array.isArray(posts) ? posts : []);
        } catch (err) {
            console.error("Error fetching my posts:", err);
            setError("Error fetching my posts: " + err.message);
        }
    };

    const fetchFriendsPosts = async () => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            if (!(await contract.checkUserExists(await signer.getAddress()))) {
                throw new Error("User not registered. Please create an account.");
            }

            const posts = await contract.getFriendsPosts();
            setFriendsPosts(Array.isArray(posts) ? posts : []);
        } catch (err) {
            console.error("Error fetching friends' posts:", err);
            setError("Error fetching friends' posts: " + err.message);
        }
    };

    const likePost = async (friendAddress, postId) => {
        try {
            if (!ethers.isAddress(friendAddress) || !Number.isInteger(Number(postId))) {
                throw new Error("Invalid friend address or post ID");
            }
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.likePost(friendAddress, postId);
            setLoading(true);
            await tx.wait();
            await fetchFriendsPosts();
        } catch (err) {
            console.error("Error liking post:", err);
            setError("Error in liking post: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const commentOnPost = async (friendAddress, postId, commentText) => {
        try {
            if (!ethers.isAddress(friendAddress) || !Number.isInteger(Number(postId)) || !commentText.trim()) {
                throw new Error("Invalid friend address, post ID, or comment text");
            }
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.commentOnPost(friendAddress, postId, commentText);
            setLoading(true);
            await tx.wait();
            await fetchFriendsPosts();
        } catch (err) {
            console.error("Error commenting on post:", err);
            setError("Error in commenting on post: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // NFT functions
    const createNFT = async (title, price, description, originalHash, previewHash) => {
        try {
            if (!title.trim() || !ethers.parseEther(price.toString()) || !description.trim()) {
                throw new Error("Invalid NFT details");
            }
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.addNFT(title, price, description, originalHash || "", previewHash || "");
            setLoading(true);
            await tx.wait();
            await Promise.all([fetchAllNFTs(), fetchMyNFTs()]);
        } catch (err) {
            console.error("Error creating NFT:", err);
            setError("Error in creating NFT: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllNFTs = async () => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const nfts = await contract.getAllNFTs();
            setAllNFTs(Array.isArray(nfts) ? nfts : []);
        } catch (err) {
            console.error("Error fetching all NFTs:", err);
            setError("Error fetching NFTs: " + err.message);
        }
    };

    const fetchMyNFTs = async () => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const nfts = await contract.getMyNFTs();
            setMyNFTs(Array.isArray(nfts) ? nfts : []);
        } catch (err) {
            console.error("Error fetching my NFTs:", err);
            setError("Error fetching my NFTs: " + err.message);
        }
    };

    const buyNFT = async (tokenId, price) => {
        try {
            if (!Number.isInteger(Number(tokenId)) || !ethers.parseEther(price.toString())) {
                throw new Error("Invalid token ID or price");
            }
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.buyNFT(tokenId, { value: ethers.parseEther(price.toString()) });
            setLoading(true);
            await tx.wait();
            await Promise.all([fetchAllNFTs(), fetchMyNFTs()]);
        } catch (err) {
            console.error("Error buying NFT:", err);
            setError("Error in buying NFT: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyRewards = async () => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const reward = await contract.getMyRewards();
            setMyRewardTokens(reward.toString());
        } catch (err) {
            console.error("Failed to fetch rewards:", err);
            setError("Unable to fetch your rewards: " + err.message);
        }
    };

    useEffect(() => {
        if (account) setCurrentUserAddress(account);
    }, [account]);

    return (
        <chatAppContext.Provider
            value={{
                title,
                account,
                username,
                friendLists,
                friendMsg,
                loading,
                error,
                currentUserName,
                currentUserAddress,
                userList,
                pendingRequests,
                sentRequests,
                availableUsers,
                CheckIfWalletConnected,
                connectWallet: connectWalletWithRetry,
                readMessage,
                createAccount,
                sendFriendRequest,
                acceptFriendRequest,
                rejectFriendRequest,
                sendMessage,
                checkMessages,
                readUser,
                createPost,
                fetchMyPosts,
                fetchFriendsPosts,
                likePost,
                commentOnPost,
                myPosts,
                friendsPosts,
                createNFT,
                fetchAllNFTs,
                fetchMyNFTs,
                buyNFT,
                allNFTs,
                myNFTs,
                fetchMyRewards,
                myRewardTokens,
            }}
        >
            {children}
        </chatAppContext.Provider>
    );
};