
# Web3 Social Media Platform

A decentralized social media platform built with React Native and Expo, featuring Web3 integration, NFT support, and real-time chat functionality.

## Features

### Social Features
- 📱 **User Profiles & Authentication**
  - Web3 wallet integration
  - Profile customization
  - User achievements and rewards
  - Friend system with pending requests

- 📝 **Content Creation**
  - Create and share posts
  - Generate AI-powered content
  - View friends' posts
  - Post interactions and engagement

- 💬 **Real-time Chat**
  - Instant messaging
  - Emoji support
  - Chat history
  - Online status indicators

### Web3 Features
- 🎨 **NFT Integration**
  - Create and mint NFTs
  - NFT marketplace
  - NFT gallery
  - Token management

- 💰 **Token System**
  - Token rewards
  - Achievement system
  - Token transactions
  - Wallet integration

## Tech Stack

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

3. Start the development server:
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
   ```

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

## Key Features Implementation

### Authentication
- Web3 wallet integration using WalletConnect
- Secure token storage using AsyncStorage
- Protected routes and navigation

### NFT Features
- NFT creation and minting
- Marketplace integration
- Gallery view
- Token management

### Social Features
- Real-time chat using WebSocket
- Post creation and sharing
- Friend system
- Notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Expo and React Native
- Web3 integration powered by ethers.js and WalletConnect
- UI components and icons from various open-source libraries
