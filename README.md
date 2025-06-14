# 🌐 Web3 Social Media Platform

A decentralized social media platform built with **React Native**, **Expo**, and **Web3**, featuring NFT integration, real-time chat, token rewards, and more.

🚀 **Live Demo**: [https://chin-talk-web.vercel.app/](https://chin-talk-web.vercel.app/)

---

## 📌 Key Features

---

### 1. 🏠 Home Page

- Dynamic feed overview
- Prompt login or create account
- Showcase trending posts and NFTs  
<img src="https://github.com/user-attachments/assets/d490d925-2501-496e-9df4-2a9a51ab7c0c" width="100%" />

---

### 2. 🆕 Create Account (Web3 Login)

- MetaMask & WalletConnect support
- Profile auto-creation with wallet
- Secure session handling

---

### 3. 🧑‍🤝‍🧑 Add Friends

- Browse other users
- Add new friends via profile or suggestions  
<img src="https://github.com/user-attachments/assets/b29fee77-a7ff-4a6f-a6e3-f1fe6927980b" width="80%" />

---

### 4. 🔔 Friend Requests

- View incoming and outgoing requests
- Accept or reject requests  
<img src="https://github.com/user-attachments/assets/d55be86f-4256-4d89-ad3f-0f2206eaf02f" width="80%" />

---

### 5. 💬 Messenger (Real-time Chat)

- 1-on-1 and group chat
- File sharing, emoji, reactions
- Read receipts and online status  
<img src="https://github.com/user-attachments/assets/09ceb0b3-a6d6-4e0d-83ed-c1d423c54ff3" width="80%" />

---

### 6. 📝 Create Post

- AI-powered content generation
- Media upload, text formatting
- Post scheduling and drafts  
<img src="https://github.com/user-attachments/assets/43a1910c-3daa-4f6f-a98a-8e6fcdbf24f9" width="80%" />  
<img src="https://github.com/user-attachments/assets/d6060242-9766-482b-b17e-e9122eec2e5a" width="80%" />

---

### 7. 👀 View Posts & Feed

- See your posts, friends’ posts, and global feed
- Infinite scroll with comments and reactions  
<img src="https://github.com/user-attachments/assets/00946170-4502-41bf-9f1a-7234085732f2" width="80%" />  
<img src="https://github.com/user-attachments/assets/70d619a7-3d8f-4247-b414-26c240dc6c12" width="80%" />  
<img src="https://github.com/user-attachments/assets/733253e4-05f3-4e28-aae3-0c056b0389f5" width="80%" />

---

### 8. 🎨 NFT Marketplace

- Mint NFTs, set royalties, and preview items
- Browse, search, and bid on NFTs  
<img src="https://github.com/user-attachments/assets/0a922d44-fce5-452a-a136-860dc1eb537b" width="80%" />  
<img src="https://github.com/user-attachments/assets/89395827-e373-4815-a504-4c8894e2828a" width="80%" />  
<img src="https://github.com/user-attachments/assets/e814a303-6aa1-4b6f-97be-8c0f6ae91818" width="80%" />  
<img src="https://github.com/user-attachments/assets/9dc0baa6-a83d-4710-97d7-29b515c39a25" width="80%" />

---

### 9. 🪙 Token System

- View & transfer token balance
- Earn rewards via engagement
- Leaderboards and badges  
<img src="https://github.com/user-attachments/assets/52072ea2-e3bd-4a3f-8997-6ec9cbdb77d2" width="80%" />  
<img src="https://github.com/user-attachments/assets/2919ab45-de28-4ef7-923b-7d93669eeb59" width="80%" />

---

### 10. 👤 User Profile

- Display achievements, NFTs, post history
- Customizable layout and privacy settings  
<img src="https://github.com/user-attachments/assets/21008a36-b8da-455f-98ab-00ce3d786cd8" width="80%" />

---

### 11. 🔔 Notifications

- Real-time alerts for posts, messages, and transactions
- Notification center with read/unread and filters

---

## 🧰 Tech Stack

### Frontend
- React Native, Expo
- React Navigation, Gesture Handler

### Web3
- ethers.js, WalletConnect, Web3Modal

### Other Libraries
- Axios, date-fns, AsyncStorage
- Expo Image & Document Picker
- React Native Vector Icons

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Expo CLI
- MetaMask (or WalletConnect-compatible wallet)

### Installation

```bash
# Clone repo
git clone https://github.com/ujjawal-mukherjee/CSIweek2.git
cd CSIweek2

# Install dependencies
npm install

# Start development
npm start


   ## Project Structure

```
src/
├── Components/     # Reusable UI components
├── screens/        # Application screens
│   ├── AllFriendPostScreen.jsx
│   ├── AllUserScreen.jsx
│   ├── ChatsScreen.jsx
│   ├── CreateNftScreen.jsx
│   ├── GeneratePostScreen.jsx
│   ├── HomeScreen.jsx
│   ├── MarketScreen.jsx
│   ├── ProfileScreen.jsx
│   └── ...
├── Backend/        # Backend services
├── Context/        # React Context providers
├── contracts/      # Smart contract integration
├── navigation/     # Navigation configuration
├── Utils/          # Utility functions
├── assets/         # Static assets
└── test/          # Test files
```



