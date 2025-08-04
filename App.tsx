import React, { useState } from 'react';
import { StatusBar, StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OnboardingScreen from './src/screens/Onboarding/OnboardingScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';
import HomeScreen from './src/screens/Home/HomeScreen';
import VaultScreen from './src/screens/Vault/VaultScreen';
import RecipientsScreen from './src/screens/Recipients/RecipientsScreen';
import SettingsScreen from './src/screens/Settings/SettingsScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import theme from './src/theme/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Tab icon component to avoid defining components during render
interface TabIconProps {
  name: string;
  label: string;
  color: string;
}

const TabIcon: React.FC<TabIconProps> = ({ name, label, color }) => (
  <View style={styles.tabIconContainer}>
    <MaterialIcons name={name} size={24} color={color} />
    <Text style={[styles.tabLabel, { color }]} numberOfLines={1} ellipsizeMode="tail">{label}</Text>
  </View>
);

// Factory function to create tabBarIcon functions
const createTabBarIcon = (name: string, label: string) => {
  return function tabBarIcon({ color }: { color: string }) {
    return <TabIcon name={name} label={label} color={color} />;
  };
};

// Create a bottom tab navigator
const Tab = createBottomTabNavigator();

// Main app navigation with bottom tabs
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.black,
        tabBarInactiveTintColor: theme.colors.darkGray,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.lightGray,
          paddingTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: createTabBarIcon("home", "Home"),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Vault"
        component={VaultScreen}
        options={{
          tabBarIcon: createTabBarIcon("lock", "Vault"),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Recipients"
        component={RecipientsScreen}
        options={{
          tabBarIcon: createTabBarIcon("people", "Recipients"),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: createTabBarIcon("settings", "Settings"),
          tabBarLabel: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

// Simple app navigation
const AppContent = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { user } = useAuth();

  // Handle navigation from onboarding to log in
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Determine which screen to show
  const renderScreen = () => {
    if (showOnboarding) {
      return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    }

    if (user) {
      return <MainNavigator />;
    }

    return <LoginScreen />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      <NavigationContainer>
        {renderScreen()}
      </NavigationContainer>
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
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    width: '100%',
    textAlign: 'center',
  },
});

export default App;
