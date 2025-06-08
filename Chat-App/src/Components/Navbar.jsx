import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import { chatAppContext } from '../Context/ChatAppContext';
import { useTheme } from '../Context/ThemeContext';
import ModelScreen from '../screens/ModelScreen';
import ErrorMessage from './ErrorMessage';
import images from '../assets';
import { MaterialIcons } from '@expo/vector-icons';

const menuItems = [
  { menu: 'Home', path: 'Home' },
  { menu: 'Add-Friends', path: 'AllUsers' },
  { menu: 'Requests', path: 'PendingRequest' },
  { menu: 'Messenger', path: 'Chats' },
  { menu: 'Create Post', path: 'CreatePost' },
  { menu: 'Posts', path: 'TotalPostStack' },
  { menu: 'NFT-Market', path: 'NFTStack' },
  { menu: 'Services', path: 'ServicesStack' },
];

const Navbar = ({ navigation, route }) => {
  const {
    account,
    userName,
    userImage,
    connectWallet,
    createAccount,
    error,
    currentUserName,
  } = useContext(chatAppContext);
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [openModel, setOpenModel] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleProfilePress = () => {
    navigation.navigate('ProfileStack', {
      screen: 'ProfileMain'
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.innerContainer}>
        <View style={[styles.logoContainer, { backgroundColor: colors.surface }]}>
          <Image source={images.avatar1} style={styles.logo} resizeMode="contain" />
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={styles.menuContainer}
          showsHorizontalScrollIndicator={false}
        >
          {menuItems.map((el, i) => {
            const isActive = route?.name === el.path;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => navigation.navigate(el.path)}
                style={[
                  styles.menuItemContainer,
                  isActive && styles.activeMenuItemContainer,
                  hoveredItem === i && styles.hoveredMenuItemContainer,
                  { backgroundColor: isActive ? colors.primary + '20' : 'transparent' }
                ]}
                onMouseEnter={() => Platform.OS === 'web' && setHoveredItem(i)}
                onMouseLeave={() => Platform.OS === 'web' && setHoveredItem(null)}
              >
                <Text style={[
                  styles.menuItem,
                  { color: colors.text },
                  isActive && { color: colors.primary },
                  hoveredItem === i && { color: colors.primary },
                ]}>
                  {el.menu}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.walletContainer}>
          <TouchableOpacity 
            onPress={toggleTheme}
            style={[styles.themeButton, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.themeButtonText, { color: colors.text }]}>
              {isDarkMode ? '☀️' : '🌙'}
            </Text>
          </TouchableOpacity>

          {!account ? (
            <TouchableOpacity 
              onPress={connectWallet} 
              style={[styles.button, styles.connectButton, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.buttonText, { color: '#fff' }]}>Connect Wallet</Text>
            </TouchableOpacity>
          ) : !currentUserName ? (
            <TouchableOpacity 
              onPress={() => setOpenModel(true)} 
              style={[styles.button, styles.createAccountButton, { 
                backgroundColor: colors.surface,
                borderColor: colors.primary 
              }]}
            >
              <Image source={images.create2} style={styles.avatar} />
              <Text style={[styles.buttonText, { color: colors.text }]}>Create Account</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.userContainer, { 
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.primary + '40',
                paddingHorizontal: 12,
                paddingVertical: 6,
              }]}
              onPress={handleProfilePress}
            >
              <Image
                source={{ uri: userImage || 'https://via.placeholder.com/150' }}
                style={[styles.avatar, { borderColor: colors.primary }]}
              />
              <Text style={[styles.username, { color: colors.text }]}>
                {currentUserName || 'Anonymous'}
              </Text>
              <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {openModel && (
        <View style={[styles.modal, { 
          backgroundColor: colors.background + 'F0',
          borderTopColor: colors.border 
        }]}>
          <ModelScreen
            openBox={setOpenModel}
            title="WELCOME TO"
            head="CHAT BUDDY"
            info="This is a chat app where you can communicate in a decentralized and secure way."
            smallInfo="Kindly select your name..."
            images={images}
            functionName={createAccount}
            address={account}
          />
        </View>
      )}

      {error && <ErrorMessage error={error} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'web' ? 20 : 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    width: '100%',
    backdropFilter: 'blur(10px)',
    borderBottomWidth: 1,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    maxWidth: 1400,
    marginHorizontal: 'auto',
  },
  logoContainer: {
    borderRadius: 12,
    padding: 8,
  },
  logo: {
    width: 40,
    height: 40,
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  menuItemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    transition: 'all 0.3s ease',
  },
  activeMenuItemContainer: {
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
  },
  hoveredMenuItemContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItem: {
    fontSize: 15,
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  activeMenuItem: {
    fontWeight: '600',
  },
  hoveredMenuItem: {
    color: 'rgb(255, 149, 0)',
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 0 : 10,
    gap: 12,
  },
  themeButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  themeButtonText: {
    fontSize: 18,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    transition: 'all 0.3s ease',
  },
  connectButton: {
    backgroundColor: 'rgb(255, 149, 0)',
  },
  createAccountButton: {
    borderWidth: 1,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    gap: 8,
    cursor: 'pointer',
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
  },
  modal: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 70 : 100,
    left: 0,
    right: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
  },
});

export default Navbar;
