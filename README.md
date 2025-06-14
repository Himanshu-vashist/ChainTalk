# Social Media Web Application

A modern, responsive social media web application built with React, featuring real-time chat, post sharing, and user interactions.

## Features

- 🔐 **Authentication**
  - User registration and login
  - Secure password handling
  - Protected routes

- 👥 **User Management**
  - User profiles
  - Friend system
  - User search functionality
  - Profile customization

- 📱 **Posts & Content**
  - Create and share posts
  - View friends' posts
  - Like and interact with posts
  - Responsive post layout

- 💬 **Real-time Chat**
  - Instant messaging
  - Chat history
  - Online status indicators
  - Message notifications

- 🎨 **Modern UI/UX**
  - Responsive design for all screen sizes
  - Clean and intuitive interface
  - Smooth animations
  - Dark/Light mode support

## Tech Stack

- **Frontend**
  - React.js
  - Tailwind CSS
  - React Router
  - Context API for state management

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - Socket.IO for real-time features

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   cd [project-directory]
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Main application screens
├── context/        # Context providers
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
└── App.jsx         # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [Heroicons](https://heroicons.com/)
- UI components inspired by modern design patterns
- Thanks to all contributors who have helped shape this project
