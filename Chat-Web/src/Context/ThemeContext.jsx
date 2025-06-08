import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === 'dark');

  useEffect(() => {
    setIsDarkMode(deviceTheme === 'dark');
  }, [deviceTheme]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? {
      background: '#000000',
      surface: 'rgba(255, 255, 255, 0.05)',
      primary: 'rgb(255, 149, 0)',
      text: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
      border: 'rgba(255, 255, 255, 0.1)',
      buttonBackground: 'rgba(255, 255, 255, 0.1)',
      buttonText: '#FFFFFF',
    } : {
      background: '#FFFFFF',
      surface: 'rgba(0, 0, 0, 0.05)',
      primary: 'rgb(255, 149, 0)',
      text: '#000000',
      textSecondary: 'rgba(0, 0, 0, 0.7)',
      border: 'rgba(0, 0, 0, 0.1)',
      buttonBackground: 'rgba(0, 0, 0, 0.05)',
      buttonText: '#000000',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 