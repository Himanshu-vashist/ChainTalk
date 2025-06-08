import React, { useRef, useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { chatAppContext } from '../Context/ChatAppContext';
import { MaterialIcons } from '@expo/vector-icons';

import enc from '../assets/enc.jpg';
import network from '../assets/network.jpg';
import cover from '../assets/cover.png';
import buddy from '../assets/buddy.png';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 400;
  const { colors } = useTheme();
  const { account, currentUserName } = useContext(chatAppContext);
  const scrollRef = useRef(null);
  const [featuresOffsetY, setFeaturesOffsetY] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const renderSection = (content, style) => (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      {content}
    </Animated.View>
  );

  const renderQuickAction = (icon, title, onPress) => (
    <TouchableOpacity
      style={[styles.quickAction, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '15' }]}>
        <MaterialIcons name={icon} size={24} color={colors.primary} />
      </View>
      <Text style={[styles.quickActionText, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <Animated.ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Hero Section */}
          <View style={[styles.heroSection, { backgroundColor: colors.surface }]}>
            <View style={styles.heroText}>
              <Text style={[styles.title, { color: colors.text }]}>
                Welcome to <Text style={[styles.highlight, { color: colors.primary }]}>ChainTalk</Text>
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Experience the power of decentralized and secure messaging.
              </Text>
              {!account ? (
                <TouchableOpacity 
                  style={[styles.getStartedBtn, { backgroundColor: colors.primary }]} 
                  onPress={() => navigation.navigate('AllUsers')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.getStartedText}>Connect Wallet</Text>
                  <MaterialIcons name="account-balance-wallet" size={20} color="#fff" style={styles.btnIcon} />
                </TouchableOpacity>
              ) : !currentUserName ? (
                <TouchableOpacity 
                  style={[styles.getStartedBtn, { backgroundColor: colors.primary }]} 
                  onPress={() => navigation.navigate('AllUsers')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.getStartedText}>Create Account</Text>
                  <MaterialIcons name="person-add" size={20} color="#fff" style={styles.btnIcon} />
                </TouchableOpacity>
              ) : (
                <View style={styles.quickActionsContainer}>
                  {renderQuickAction('chat', 'Chats', () => navigation.navigate('Chats'))}
                  {renderQuickAction('people', 'Friends', () => navigation.navigate('AllUsers'))}
                  {renderQuickAction('add-photo-alternate', 'Create Post', () => navigation.navigate('CreatePost'))}
                  {renderQuickAction('store', 'NFT Market', () => navigation.navigate('NFTStack'))}
                </View>
              )}
            </View>
            <Image source={buddy} style={styles.heroImage} resizeMode="contain" />
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <FeatureCard 
              image={enc} 
              title="End-to-End Encryption" 
              description="Your messages are completely private and secure."
              colors={colors}
              icon="🔒"
            />
            <FeatureCard 
              image={network} 
              title="Decentralized Network" 
              description="No central servers – pure peer-to-peer communication."
              colors={colors}
              icon="🌐"
            />
            <FeatureCard 
              image={cover} 
              title="Seamless Communication" 
              description="Fast, reliable, and real-time chat experience."
              colors={colors}
              icon="⚡"
            />
          </View>

          {/* Stats Section */}
          <View style={[styles.statsSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Platform Stats</Text>
            <View style={styles.statsGrid}>
              <StatItem 
                icon="people" 
                value="10K+" 
                label="Active Users"
                colors={colors}
              />
              <StatItem 
                icon="chat" 
                value="1M+" 
                label="Messages"
                colors={colors}
              />
              <StatItem 
                icon="store" 
                value="5K+" 
                label="NFTs"
                colors={colors}
              />
              <StatItem 
                icon="security" 
                value="100%" 
                label="Secure"
                colors={colors}
              />
            </View>
          </View>

          {/* Benefits Section */}
          <View style={[styles.benefitsSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Why Choose ChainTalk?</Text>
            <View style={styles.benefitsGrid}>
              <BenefitItem 
                icon="🔒" 
                title="Secure" 
                description="End-to-end encryption for all messages"
                colors={colors}
              />
              <BenefitItem 
                icon="⚡" 
                title="Fast" 
                description="Lightning-fast message delivery"
                colors={colors}
              />
              <BenefitItem 
                icon="🌐" 
                title="Decentralized" 
                description="No central servers, pure P2P"
                colors={colors}
              />
              <BenefitItem 
                icon="🔐" 
                title="Private" 
                description="Your data stays with you"
                colors={colors}
              />
            </View>
          </View>

          {/* Footer */}
          <View style={[styles.footer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              © 2025 ChainTalk. Built on Decentralization.
            </Text>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

const FeatureCard = ({ image, title, description, colors, icon }) => (
  <Animated.View 
    style={[
      styles.featureCard, 
      { 
        backgroundColor: colors.surface,
        transform: [{ scale: 1 }],
      }
    ]}
  >
    <View style={styles.featureImageContainer}>
      <Image source={image} style={styles.featureImage} />
      <View style={[styles.iconOverlay, { backgroundColor: colors.primary }]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
    </View>
    <View style={styles.featureContent}>
      <Text style={[styles.featureTitle, { color: colors.primary }]}>{title}</Text>
      <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>{description}</Text>
    </View>
  </Animated.View>
);

const StatItem = ({ icon, value, label, colors }) => (
  <View style={[styles.statItem, { backgroundColor: colors.background }]}>
    <MaterialIcons name={icon} size={24} color={colors.primary} />
    <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
  </View>
);

const BenefitItem = ({ icon, title, description, colors }) => (
  <Animated.View 
    style={[
      styles.benefitItem, 
      { 
        backgroundColor: colors.background,
        transform: [{ scale: 1 }],
      }
    ]}
  >
    <View style={[styles.benefitIconContainer, { backgroundColor: colors.primary + '15' }]}>
      <Text style={styles.benefitIcon}>{icon}</Text>
    </View>
    <Text style={[styles.benefitTitle, { color: colors.text }]}>{title}</Text>
    <Text style={[styles.benefitDesc, { color: colors.textSecondary }]}>{description}</Text>
  </Animated.View>
);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  heroText: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  highlight: {
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 24,
  },
  getStartedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 16,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  btnIcon: {
    marginLeft: 4,
  },
  heroImage: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    marginTop: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  quickAction: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    width: (screenWidth - 80) / 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  featuresSection: {
    padding: 16,
    gap: 16,
    marginBottom: 16,
  },
  featureCard: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  featureImageContainer: {
    position: 'relative',
  },
  featureImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  iconOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  featureContent: {
    padding: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsSection: {
    padding: 24,
    marginBottom: 16,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 16,
  },
  statItem: {
    width: (screenWidth - 80) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  benefitsSection: {
    padding: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  benefitItem: {
    width: (screenWidth - 80) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitIcon: {
    fontSize: 24,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 12,
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  footerText: {
    fontSize: 14,
  },
});

export default HomeScreen;

