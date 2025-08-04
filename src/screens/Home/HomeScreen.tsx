import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Button from '../../components/Button';
import theme from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';

const HomeScreen: React.FC = () => {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to AfterVault</Text>

        <View style={styles.userInfo}>
          <Text style={styles.label}>Logged in as:</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <Text style={styles.description}>
          This is your secure vault for storing important information that will be shared with your trusted contacts if something happens to you.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            loading={loading}
            disabled={loading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    flex: 1,
    padding: theme.spacing.large,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.xxlarge,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
    marginBottom: theme.spacing.large,
    textAlign: 'center',
  },
  userInfo: {
    backgroundColor: theme.colors.lightGray,
    padding: theme.spacing.medium,
    borderRadius: theme.layout.borderRadius,
    marginBottom: theme.spacing.large,
  },
  label: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.darkGray,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.black,
  },
  description: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.darkGray,
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
});

export default HomeScreen;
