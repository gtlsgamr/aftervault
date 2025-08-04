/**
 * AfterVault App
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, SafeAreaView } from 'react-native';
import OnboardingScreen from './src/screens/Onboarding/OnboardingScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';
import HomeScreen from './src/screens/Home/HomeScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import theme from './src/theme/theme';

// Simple app navigation
const AppContent = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { user } = useAuth();

  // Handle navigation from onboarding to login
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Determine which screen to show
  const renderScreen = () => {
    if (showOnboarding) {
      return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    }

    if (user) {
      return <HomeScreen />;
    }

    return <LoginScreen />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      {renderScreen()}
    </SafeAreaView>
  );
};

// Wrap the app with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});

export default App;
