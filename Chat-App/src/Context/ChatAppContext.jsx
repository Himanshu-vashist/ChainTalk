
// import React, { useState, useEffect } from "react";

// import { useNavigation } from '@react-navigation/native';
// import { CheckIfWalletConnected, connectWallet } from "../Utils/apiFeatures";
// import { ethers } from "ethers";
// import { ChatAppAddress, ChatAppABI } from "./constants";

// export const chatAppContext = React.createContext();

// export const ChatAppProvider = ({ children }) => {
//     const navigation = useNavigation();
//     const title = "Hey welcome to blockchain";

//     const [account, setAccount] = useState("");
//     const [username, setUserName] = useState("");
//     const [friendLists, setFriendLists] = useState([]);
//     const [friendMsg, setFriendMsg] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [userList, setUserList] = useState([]);
//     const [pendingRequests, setPendingRequests] = useState([]);
//     const [sentRequests, setSentRequests] = useState([]);
//     const [availableUsers, setAvailableUsers] = useState([]); // New state for filtered users
//     const [error, setError] = useState("");
//     const [currentUserName, setCurrentUserName] = useState("");
//     const [currentUserAddress, setCurrentUserAddress] = useState("");
//     const [myPosts, setMyPosts] = useState([]);
//     const [friendsPosts, setFriendsPosts] = useState([]);
//     const [allNFTs, setAllNFTs] = useState([]);
//     const [myNFTs, setMyNFTs] = useState([]);
//     const [myRewardTokens, setMyRewardTokens] = useState("0");

//     const getProvider = () => {
//         if (!window.ethereum) {
//             throw new Error("No Ethereum provider found. Please install MetaMask.");
//         }
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         provider.resolveName = async () => null;
//         return provider;
//     };

//     // Filter users to show only those who are not friends, not pending, and not sent requests
//     useEffect(() => {
//         if (!account || !userList.length) return;

//         const friendAddresses = friendLists.map(friend => friend.pubkey.toLowerCase());
//         const pendingAddresses = pendingRequests.map(addr => addr.toLowerCase());
//         const sentAddresses = sentRequests.map(addr => addr.toLowerCase());

//         const filteredUsers = userList.filter(user => {
//             const userAddress = user.accountAddress.toLowerCase();
//             return (
//                 userAddress !== account.toLowerCase() && // Exclude current user
//                 !friendAddresses.includes(userAddress) && // Exclude friends
//                 !pendingAddresses.includes(userAddress) && // Exclude pending requests
//                 !sentAddresses.includes(userAddress) // Exclude sent requests
//             );
//         });

//         setAvailableUsers(filteredUsers);
//     }, [account, userList, friendLists, pendingRequests, sentRequests]);

//     const fetchData = async () => {
//         try {
//             const connectAccount = await connectWallet();
//             if (!connectAccount) throw new Error("Wallet not connected");
//             setAccount(connectAccount);

//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

//             const userName = await contract.getUsername(connectAccount);
//             if (userName) {
//                 setUserName(userName);
//                 setCurrentUserName(userName);
//                 setCurrentUserAddress(connectAccount);
//             }

//             const friends = await contract.getMyFriendList();
//             setFriendLists(friends);

//             const users = await contract.getAllAppUser();
//             setUserList(users);

//             const pending = await contract.getMyPendingRequests();
//             setPendingRequests(pending);

//             const sent = await contract.getMySentRequests();
//             setSentRequests(sent);

//             await fetchAllNFTs();
//             await fetchMyNFTs();
//             await fetchMyRewards();
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             setError("Please connect your wallet");
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const createAccount = async ({ name, physicalAddress, imageHash }) => {
//         try {
//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

//             const tx = await contract.createAccount(name, physicalAddress, imageHash);
//             setLoading(true);
//             await tx.wait();
//             setLoading(false);

//             await new Promise((resolve) => setTimeout(resolve, 3000));

//             const updatedUserName = await contract.getUsername(account);
//             if (!updatedUserName || updatedUserName === "0x") {
//                 throw new Error("User not created or empty data returned.");
//             }

//             setUserName(updatedUserName);
//             setCurrentUserName(updatedUserName);
//             setCurrentUserAddress(account);

//             const updatedUserList = await contract.getAllAppUser();
//             setUserList(updatedUserList);

//            navigation.navigate("/");
//         } catch (error) {
//             console.error("Error creating account:", error);
//             setError("Error in creating account");
//         }
//     };

//     const sendFriendRequest = async (friendAddress) => {
//         try {
//             if (!friendAddress) {
//                 return setError("Friend address cannot be empty");
//             }

//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

//             const tx = await contract.sendFriendRequest(friendAddress);
//             setLoading(true);
//             await tx.wait();
//             setLoading(false);

//             navigation.navigate("/");
//             window.location.reload();
//         } catch (error) {
//             console.error("Error sending friend request:", error);
//             setError("Error in sending friend request");
//         }
//     };

//     const acceptFriendRequest = async (friendAddress) => {
//         try {
//             if (!friendAddress) {
//                 return setError("Friend address cannot be empty");
//             }

//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

//             const tx = await contract.acceptFriendRequest(friendAddress);
//             setLoading(true);
//             await tx.wait();
//             setLoading(false);

//            navigation.navigate("/");
//             window.location.reload();
//         } catch (error) {
//             console.error("Error accepting friend request:", error);
//             setError("Error in accepting friend request");
//         }
//     };

//     const sendMessage = async ({ msg, address }) => {
//         try {
//             if (!msg || !address) {
//                 return setError("Message and address cannot be empty");
//             }

//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

//             const tx = await contract.sendMessage(address, msg);
//             setLoading(true);
//             await tx.wait();
//             setLoading(false);

//             const updatedMessages = await contract.readMessage(address);
//             setFriendMsg(updatedMessages);
//         } catch (error) {
//             console.error("Error sending message:", error);
//             setError("Error in sending message");
//         }
//     };

//     const readMessage = async (friendAddress) => {
//         try {
//             if (!friendAddress) return;

//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

//             const messages = await contract.readMessage(friendAddress);
//             setFriendMsg(messages);
//         } catch (error) {
//             console.error("Error reading message:", error);
//             setError("No message found");
//         }
//     };

//     const readUser = async (userAddress) => {
//         try {
//             const provider = getProvider();
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, provider);

//             const userName = await contract.getUsername(userAddress);
//             setCurrentUserName(userName);
//             setCurrentUserAddress(userAddress);
//         } catch (error) {
//             console.error("Error fetching user details:", error);
//             setError("Unable to fetch user details");
//         }
//     };

//     const rejectRequest = async (fromaddress) => {
//         try {
//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);
//             const tx = await contract.rejectFriendRequest(fromaddress);
//             await tx.wait();
//             console.log("Friend request rejected successfully");
//         } catch (error) {
//             console.error("Error rejecting friend request:", error);
//             setError("Error in rejecting friend request");
//         }
//     };

//     useEffect(() => {
//         if (account) {
//             setCurrentUserAddress(account);
//         }
//     }, [account]);

//     // Post section
//     const createPost = async (content, imageHash) => {
//         try {
//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const signerAddress = await signer.getAddress();
//             console.log("Creating post with address:", signerAddress);
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

//             const tx = await contract.createPost(content, imageHash);
//             setLoading(true);
//             console.log("Create post tx hash:", tx.hash);
//             await tx.wait();
//             setLoading(false);

//             await fetchMyPosts();
//         } catch (error) {
//             console.error("Error creating post:", error);
//             setError("Error in creating post: " + error.message);
//         }
//     };

//     const fetchMyPosts = async () => {
//         try {
//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const signerAddress = await signer.getAddress();
//             console.log("Fetching my posts for address:", signerAddress);
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

//             const isUserRegistered = await contract.checkUserExists(signerAddress);
//             console.log("Is user registered for my posts?", isUserRegistered);
//             if (!isUserRegistered) {
//                 setError("User not registered. Please create an account.");
//                 return;
//             }

//             const posts = await contract.getMyPosts();
//             console.log("My posts fetched:", posts);
//             setMyPosts(posts);
//         } catch (error) {
//             console.error("Error fetching my posts:", error);
//             setError("Error fetching my posts: " + error.message);
//         }
//     };

//     const fetchFriendsPosts = async () => {
//         try {
//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const signerAddress = await signer.getAddress();
//             console.log("Fetching friends' posts for address:", signerAddress);
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

//             const isUserRegistered = await contract.checkUserExists(signerAddress);
//             console.log("Is user registered for friends' posts?", isUserRegistered);
//             if (!isUserRegistered) {
//                 setError("User not registered. Please create an account.");
//                 return;
//             }

//             const posts = await contract.getFriendsPosts();
//             console.log("Friends' posts fetched:", posts);
//             setFriendsPosts(posts);
//         } catch (error) {
//             console.error("Error fetching friends' posts:", error);
//             setError("Error fetching friends' posts: " + error.message);
//         }
//     };

//     const likePost = async (friendAddress, postId) => {
//         try {
//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

//             const tx = await contract.likePost(friendAddress, postId);
//             setLoading(true);
//             await tx.wait();
//             setLoading(false);

//             await fetchFriendsPosts();
//         } catch (error) {
//             console.error("Error liking post:", error);
//             setError("Error in liking post");
//         }
//     };

//     const commentOnPost = async (friendAddress, postId, commentText) => {
//         try {
//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

//             const tx = await contract.commentOnPost(friendAddress, postId, commentText);
//             setLoading(true);
//             await tx.wait();
//             setLoading(false);

//             await fetchFriendsPosts();
//         } catch (error) {
//             console.error("Error commenting on post:", error);
//             setError("Error in commenting on post");
//         }
//     };

//     // NFT section
//     const createNFT = async (title, price, description, originalHash, previewHash) => {
//         try {
//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);
//             const tx = await contract.addNFT(title, price, description, originalHash, previewHash);
//             setLoading(true);
//             await tx.wait();
//             await fetchAllNFTs();
//             await fetchMyNFTs();
//             navigation.navigate("/nft-market");
//         } catch (error) {
//             console.error("Error creating NFT:", error);
//             setError("Error in creating NFT: " + error.message);
//         }
//     };

//     const fetchAllNFTs = async () => {
//         try {
//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);
//             const nfts = await contract.getAllNFTs();
//             setAllNFTs(nfts);
//         } catch (error) {
//             console.error("Error fetching all NFTs:", error);
//             setError("Error fetching NFTs: " + error.message);
//         }
//     };

//     const fetchMyNFTs = async () => {
//         try {
//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);
//             const nfts = await contract.getMyNFTs();
//             setMyNFTs(nfts);
//         } catch (error) {
//             console.error("Error fetching my NFTs:", error);
//             setError("Error fetching my NFTs: " + error.message);
//         }
//     };

//     const buyNFT = async (tokenId, price) => {
//         try {
//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);
//             const tx = await contract.buyNFT(tokenId, { value: price });
//             setLoading(true);
//             await tx.wait();
//             setLoading(false);
//             await fetchAllNFTs();
//             await fetchMyNFTs();
//         } catch (error) {
//             console.error("Error buying NFT:", error);
//             setError("Error in buying NFT: " + error.message);
//         }
//     };

//     const fetchMyRewards = async () => {
//         try {
//             const provider = getProvider();
//             const signer = await provider.getSigner();
//             const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);
//             const reward = await contract.getMyRewards();
//             console.log("Raw reward (wei):", reward.toString());
//             setMyRewardTokens(reward.toString()); // Store raw wei value
//         } catch (error) {
//             console.error("Failed to fetch rewards:", error);
//             setError("Unable to fetch your rewards");
//         }
//     };

//     return (
//         <chatAppContext.Provider
//             value={{
//                 title,
//                 account,
//                 username,
//                 friendLists,
//                 friendMsg,
//                 loading,
//                 error,
//                 currentUserName,
//                 currentUserAddress,
//                 userList,
//                 pendingRequests,
//                 sentRequests,
//                 availableUsers, // Expose filtered users
//                 CheckIfWalletConnected,
//                 connectWallet,
//                 readMessage,
//                 createAccount,
//                 sendFriendRequest,
//                 acceptFriendRequest,
//                 sendMessage,
//                 readUser,
//                 rejectRequest,
//                 createPost,
//                 fetchMyPosts,
//                 fetchFriendsPosts,
//                 likePost,
//                 commentOnPost,
//                 myPosts,
//                 friendsPosts,
//                 createNFT,
//                 fetchAllNFTs,
//                 fetchMyNFTs,
//                 buyNFT,
//                 allNFTs,
//                 myNFTs,
//                 fetchMyRewards,
//                 myRewardTokens
//             }}
//         >
//             {children}
//         </chatAppContext.Provider>
//     );
// };
import React, { useState, useEffect } from "react";
import { CheckIfWalletConnected, connectWallet } from "../Utils/apiFeatures";
import { ethers } from "ethers";
import { ChatAppAddress, ChatAppABI } from "./constants";

export const chatAppContext = React.createContext();

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

    const getProvider = () => {
        if (!window.ethereum) throw new Error("No Ethereum provider found.");
        const provider = new ethers.BrowserProvider(window.ethereum);
        provider.resolveName = async () => null;
        return provider;
    };

    useEffect(() => {
        if (!account || !userList.length) return;
        const friendAddresses = friendLists.map(f => f.pubkey.toLowerCase());
        const pendingAddresses = pendingRequests.map(a => a.toLowerCase());
        const sentAddresses = sentRequests.map(a => a.toLowerCase());

        const filtered = userList.filter(user => {
            const addr = user.accountAddress.toLowerCase();
            return (
                addr !== account.toLowerCase() &&
                !friendAddresses.includes(addr) &&
                !pendingAddresses.includes(addr) &&
                !sentAddresses.includes(addr)
            );
        });
        setAvailableUsers(filtered);
    }, [account, userList, friendLists, pendingRequests, sentRequests]);

    const fetchData = async () => {
        try {
            const connectAccount = await connectWallet();
            if (!connectAccount) throw new Error("Wallet not connected");
            setAccount(connectAccount);

            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const userName = await contract.getUsername(connectAccount);
            if (userName) {
                setUserName(userName);
                setCurrentUserName(userName);
                setCurrentUserAddress(connectAccount);
            }

            setFriendLists(await contract.getMyFriendList());
            setUserList(await contract.getAllAppUser());
            setPendingRequests(await contract.getMyPendingRequests());
            setSentRequests(await contract.getMySentRequests());

            await fetchAllNFTs();
            await fetchMyNFTs();
            await fetchMyRewards();
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Please connect your wallet");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const createAccount = async ({ name, physicalAddress, imageHash }) => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

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
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

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
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

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
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.rejectFriendRequest(fromaddress);
            await tx.wait();
        } catch (err) {
            console.error("Error rejecting friend request:", err);
            setError("Error in rejecting friend request");
        }
    };

    const sendMessage = async ({ msg, address }) => {
        try {
            if (!msg || !address) return setError("Message and address cannot be empty");

            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.sendMessage(address, msg);
            setLoading(true);
            await tx.wait();
            setLoading(false);

            setFriendMsg(await contract.readMessage(address));
        } catch (err) {
            console.error("Error sending message:", err);
            setError("Error in sending message");
        }
    };

    const readMessage = async (friendAddress) => {
        try {
            if (!friendAddress) return;

            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            setFriendMsg(await contract.readMessage(friendAddress));
        } catch (err) {
            console.error("Error reading message:", err);
            setError("No message found");
        }
    };

    const readUser = async (userAddress) => {
        try {
            const provider = getProvider();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, provider);

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
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

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
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

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
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

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
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

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
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

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
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

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
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

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
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

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
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

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
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

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
                CheckIfWalletConnected,
                connectWallet,
                readMessage,
                createAccount,
                sendFriendRequest,
                acceptFriendRequest,
                sendMessage,
                readUser,
                rejectRequest,
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
                myRewardTokens
            }}
        >
            {children}
        </chatAppContext.Provider>
    );
};
