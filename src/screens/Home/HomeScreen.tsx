import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Button from '../../components/Button';
import theme from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { getVaultSummary, getRecipientSummary, fetchUser } from '../../services/dataService';
import { User } from '../../types';

const HomeScreen: React.FC = () => {
  const { user: authUser, signOut, loading } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [vaultSummary, setVaultSummary] = useState({
    totalVaults: 0,
    totalItems: 0,
    activeVaults: 0,
    triggeredVaults: 0,
    plaintextItems: 0,
    encryptedItems: 0,
  });
  const [recipientSummary, setRecipientSummary] = useState({
    totalRecipients: 0,
    verifiedRecipients: 0,
    totalAssignments: 0,
  });

  useEffect(() => {
    // Fetch data from our mock database
    const user = fetchUser();
    const vaultData = getVaultSummary();
    const recipientData = getRecipientSummary();

    setUserData(user);
    setVaultSummary(vaultData);
    setRecipientSummary(recipientData);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to AfterVault</Text>

          <View style={styles.userInfo}>
            <Text style={styles.label}>Logged in as:</Text>
            <Text style={styles.email}>{authUser?.email || userData?.email}</Text>
            {userData && (
              <View style={styles.userDetails}>
                <Text style={styles.userDetail}>Last check-in: {formatDate(userData.lastCheckInAt.toString())}</Text>
                <Text style={styles.userDetail}>Check-in interval: {userData.checkInIntervalDays} days</Text>
              </View>
            )}
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Vault Items Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{vaultSummary.activeVaults > 0 ? "Active" : "Inactive"}</Text>
                <Text style={styles.summaryLabel}>Vault Status</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{vaultSummary.totalItems}</Text>
                <Text style={styles.summaryLabel}>Total Items</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{vaultSummary.plaintextItems}</Text>
                <Text style={styles.summaryLabel}>Plaintext Items</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{vaultSummary.encryptedItems}</Text>
                <Text style={styles.summaryLabel}>Encrypted Items</Text>
              </View>
            </View>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Recipients Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{recipientSummary.totalRecipients}</Text>
                <Text style={styles.summaryLabel}>Total Recipients</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{recipientSummary.verifiedRecipients}</Text>
                <Text style={styles.summaryLabel}>Verified</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{recipientSummary.totalAssignments}</Text>
                <Text style={styles.summaryLabel}>Assignments</Text>
              </View>
            </View>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.large,
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
    marginBottom: theme.spacing.small,
  },
  userDetails: {
    marginTop: theme.spacing.small,
  },
  userDetail: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.darkGray,
    marginBottom: theme.spacing.xs,
  },
  summarySection: {
    backgroundColor: theme.colors.lightGray,
    padding: theme.spacing.medium,
    borderRadius: theme.layout.borderRadius,
    marginBottom: theme.spacing.large,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
    marginBottom: theme.spacing.medium,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.medium,
    borderRadius: theme.layout.borderRadius,
    marginBottom: theme.spacing.small,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.xlarge,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.darkGray,
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
    marginBottom: theme.spacing.large,
  },
});

export default HomeScreen;
