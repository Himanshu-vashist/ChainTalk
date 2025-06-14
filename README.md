# Web3 Social Media Platform

A decentralized social media platform built with React Native and Expo, featuring Web3 integration, NFT support, and real-time chat functionality.

🚀 Live Now: https://chin-talk-web.vercel.app/
## Features

### 1. Web3 Authentication & Profile
- **Wallet Integration**
  - Connect with MetaMask and other Web3 wallets
  - Secure wallet connection using WalletConnect
  - Automatic session management
  - Profile creation and linking with wallet address
![home](https://github.com/user-attachments/assets/d490d925-2501-496e-9df4-2a9a51ab7c0c)



### 2. Social Feed & Posts
- **Content Creation**
  - Create text and media posts
  - AI-powered content generation
  - Rich text formatting
  - Media upload support (images, documents)
  - Post scheduling and drafts
  - ![post-home](https://github.com/user-attachments/assets/00946170
  - -![post-your](https://github.com/user-attachments/assets/70d619a7-3d8f-4247-b414-26c240dc6c12)
4502-41bf-9f1a-7234085732f2)
    ![post-friend](https://github.com/user-attachments/assets/733253e4-05f3-4e28-aae3-0c056b0389f5)

![create post](https://github.com/user-attachments/assets/43a1910c-3daa-4f6f-a98a-8e6fcdbf24f9)
![generate post](https://github.com/user-attachments/assets/d6060242-9766-482b-b17e-e9122eec2e5a)

- **Feed Features**
  - Infinite scroll feed
  - Post categorization
  - Engagement metrics
  - Share and repost functionality
  - Comment system

[Add screenshot of feed and post creation]

### 3. NFT Marketplace
- **NFT Creation**
  - Mint new NFTs
  - Upload and customize NFT metadata
  - Set royalty fees
  - Batch minting support
  - Preview before minting

- **Marketplace Features**
  - Browse available NFTs
  - Filter and search functionality
  - Price history and statistics
  - Bidding system
  - Direct purchase options

![nft-market-home](https://github.com/user-attachments/assets/0a922d44-fce5-452a-a136-860dc1eb537b)
![nft-marketplace](https://github.com/user-attachments/assets/89395827-e373-4815-a504-4c8894e2828a)
![nft my](https://github.com/user-attachments/assets/e814a303-6aa1-4b6f-97be-8c0f6ae91818)
![nft-creatw](https://github.com/user-attachments/assets/9dc0baa6-a83d-4710-97d7-29b515c39a25)


### 4. Token System
- **Token Management**
  - View token balance
  - Transfer tokens
  - Transaction history
  - Token rewards for engagement
  - Staking options

- **Achievements & Rewards**
  - Achievement tracking
  - Reward distribution
  - Milestone celebrations
  - Leaderboard system
  - Special badges and rewards
![profile](https://github.com/user-attachments/assets/52072ea2-e3bd-4a3f-8997-6ec9cbdb77d2)

![token](https://github.com/user-attachments/assets/2919ab45-de28-4ef7-923b-7d93669eeb59)


### 5. Real-time Chat
- **Messaging Features**
  - One-on-one chat
  - Group chat support
  - Emoji and sticker support
  - File sharing
  - Message reactions
 
    ![messenger](https://github.com/user-attachments/assets/09ceb0b3-a6d6-4e0d-83ed-c1d423c54ff3)


- **Chat Management**
  - Chat history
  - Message search
  - Online status indicators
  - Read receipts
  - Message notifications



### 6. Friend System
- **Social Connections**
  - Friend requests
  - Friend suggestions
  - Connection management
  - Privacy settings
  - Block and report functionality
![pr](https://github.com/user-attachments/assets/b29fee77-a7ff-4a6f-a6e3-f1fe6927980b)

- **Social Features**
  - Activity feed
  - Friend recommendations
  - Mutual connections
  - Social graph visualization
  - Connection strength indicators

[Add screenshot of friend system]
![pending request](https://github.com/user-attachments/assets/d55be86f-4256-4d89-ad3f-0f2206eaf02f)

### 7. User Profile
- **Profile Features**
  - Customizable profile
  - NFT gallery display
  - Achievement showcase
  - Activity history
  - Profile verification
![profile](https://github.com/user-attachments/assets/21008a36-b8da-455f-98ab-00ce3d786cd8)

- **Settings & Preferences**
  - Notification preferences
  - Privacy controls
  - Theme customization
  - Language selection
  - Account security


### 8. Notifications
- **Notification Types**
  - Friend requests
  - Post interactions
  - NFT activities
  - Token transactions
  - System updates

- **Notification Management**
  - Real-time notifications
  - Notification center
  - Custom notification settings
  - Read/unread status
  - Notification filters

### Frontend
- React Native
- Expo
- React Navigation
- React Native Reanimated
- React Native Gesture Handler

### Web3 Integration
- ethers.js
- WalletConnect
- Web3Modal

### Additional Libraries
- Axios for API calls
- date-fns for date manipulation
- AsyncStorage for local storage
- React Native Vector Icons
- Expo Image Picker
- Expo Document Picker

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- MetaMask or other Web3 wallet

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

    Start the development server:
   ```bash
   npm start
   ```

4. Run on your preferred platform:
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For Web
   npm run web

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



