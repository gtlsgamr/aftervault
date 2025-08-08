import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import theme from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { getVaultSummary, getRecipientSummary, fetchUser } from '../../services/dataService';
import apiService from '../../services/apiService';
import { User } from '../../types';
import SecuritySetupModal from '../../components/SecuritySetupModal';

const HomeScreen: React.FC = () => {
  const { user: authUser } = useAuth();
  const navigation = useNavigation();
  const [userData, setUserData] = useState<User | null>(null);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [showSecuritySetup, setShowSecuritySetup] = useState(false);
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
    // Fetch data from our API
    const fetchData = async () => {
      try {
        const user = await fetchUser();
        const vaultData = await getVaultSummary();
        const recipientData = await getRecipientSummary();

        setUserData(user);
        setVaultSummary(vaultData);
        setRecipientSummary(recipientData);
        
        // Show security setup for new users (no vaults)
        if (vaultData.totalVaults === 0) {
          setShowSecuritySetup(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error state here if needed
      }
    };

    fetchData();
  }, []);


  const handleCheckIn = async () => {
    if (checkInLoading) return; // Prevent multiple submissions
    
    try {
      setCheckInLoading(true);
      
      // Perform check-in
      await apiService.checkIn();
      
      // Add a small delay to ensure backend has processed the check-in
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refresh user data to show updated check-in time
      const user = await fetchUser();
      setUserData(user);
      
      // Calculate days until next check-in using the fresh user data
      const calculateNextCheckIn = (freshUserData: typeof user) => {
        if (!freshUserData || !freshUserData.lastCheckInAt || !freshUserData.checkInIntervalDays) {
          return 0;
        }
        
        try {
          // Backend now converts timestamps to ISO strings
          const lastCheckInDate = new Date(freshUserData.lastCheckInAt);
          const nextCheckIn = new Date(lastCheckInDate.getTime() + (freshUserData.checkInIntervalDays * 24 * 60 * 60 * 1000));
          const now = new Date();
          
          if (isNaN(lastCheckInDate.getTime()) || isNaN(nextCheckIn.getTime())) {
            return 0;
          }
          
          const diff = Math.ceil((nextCheckIn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return Math.max(0, diff);
        } catch (error) {
          console.error('Error calculating days until check-in:', error);
          return 0;
        }
      };
      
      const daysUntilNext = calculateNextCheckIn(user);
      
      console.log('Check-in success - Fresh calculation:', {
        lastCheckInAt: user?.lastCheckInAt,
        checkInIntervalDays: user?.checkInIntervalDays,
        daysUntilNext
      });
      
      // Show success feedback
      Alert.alert(
        '✅ Check-in Successful',
        `Great! Your check-in has been recorded.\n\nNext check-in due: ${daysUntilNext} days`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error checking in:', error);
      Alert.alert(
        '❌ Check-in Failed',
        'There was a problem recording your check-in. Please check your internet connection and try again.',
        [{ text: 'Retry', onPress: handleCheckIn }, { text: 'Cancel', style: 'cancel' }]
      );
    } finally {
      setCheckInLoading(false);
    }
  };

  const formatDate = (dateValue: any) => {
    // Backend now converts timestamps to ISO strings, so we can handle them consistently
    const date = new Date(dateValue);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Memoized calculation to ensure proper updates when userData changes
  const daysUntilCheckIn = useMemo(() => {
    if (!userData || !userData.lastCheckInAt || !userData.checkInIntervalDays) {
      console.log('Check-in calculation: Missing required data', {
        hasUserData: !!userData,
        hasLastCheckIn: !!userData?.lastCheckInAt,
        hasInterval: !!userData?.checkInIntervalDays
      });
      return 0;
    }
    
    try {
      console.log('Check-in calculation data:', {
        lastCheckInAt: userData.lastCheckInAt,
        type: typeof userData.lastCheckInAt,
        intervalDays: userData.checkInIntervalDays
      });
      
      // Backend now converts timestamps to ISO strings
      const lastCheckInDate = new Date(userData.lastCheckInAt);
      const nextCheckIn = new Date(lastCheckInDate.getTime() + (userData.checkInIntervalDays * 24 * 60 * 60 * 1000));
      const now = new Date();
      
      // Check if dates are valid
      if (isNaN(lastCheckInDate.getTime()) || isNaN(nextCheckIn.getTime())) {
        console.log('Check-in calculation: Invalid dates', {
          lastCheckIn: userData.lastCheckInAt,
          parsedLastCheckIn: lastCheckInDate,
          interval: userData.checkInIntervalDays
        });
        return 0;
      }
      
      const diff = Math.ceil((nextCheckIn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const result = Math.max(0, diff);
      
      console.log('Check-in calculation:', {
        lastCheckIn: lastCheckInDate.toISOString(),
        nextCheckIn: nextCheckIn.toISOString(),
        now: now.toISOString(),
        diffDays: diff,
        result
      });
      
      return result;
    } catch (error) {
      console.error('Error calculating days until check-in:', error, userData.lastCheckInAt);
      return 0;
    }
  }, [userData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleSecuritySetupComplete = async () => {
    // Refresh data after setup is complete
    try {
      const user = await fetchUser();
      const vaultData = await getVaultSummary();
      const recipientData = await getRecipientSummary();

      setUserData(user);
      setVaultSummary(vaultData);
      setRecipientSummary(recipientData);
    } catch (error) {
      console.error('Error refreshing data after setup:', error);
    }
  };

  const handleStartSecuritySetup = () => {
    setShowSecuritySetup(true);
  };

  const handleCreateVault = () => {
    Alert.prompt(
      'Create New Vault',
      'Enter a name for your new vault',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Create',
          onPress: async (vaultName?: string) => {
            if (!vaultName?.trim()) {
              Alert.alert('Error', 'Please enter a vault name');
              return;
            }
            
            try {
              await apiService.createVault({ title: vaultName.trim() });
              Alert.alert('Success', `Vault "${vaultName}" created successfully!`);
              
              // Refresh vault summary
              const vaultData = await getVaultSummary();
              setVaultSummary(vaultData);
            } catch (error) {
              console.error('Error creating vault:', error);
              Alert.alert('Error', 'Failed to create vault. Please try again.');
            }
          }
        }
      ],
      'plain-text',
      'My Vault'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>
            {authUser?.displayName || userData?.displayName || userData?.email?.split('@')[0] || authUser?.email?.split('@')[0] || 'User'}
          </Text>
        </View>

        {/* Check-in Card */}
        <TouchableOpacity 
          style={[styles.checkInCard, checkInLoading && styles.checkInCardLoading]} 
          onPress={handleCheckIn}
          disabled={checkInLoading}
        >
          <View style={styles.checkInContent}>
            {checkInLoading ? (
              <>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.checkInTitle}>Processing Check-In...</Text>
              </>
            ) : (
              <>
                <Text style={styles.checkInTitle}>
                  {daysUntilCheckIn === 0 ? '⚠️ Check-In Due Today' : '✅ Daily Check-In'}
                </Text>
                <Text style={styles.checkInSubtitle}>
                  {daysUntilCheckIn === 0 
                    ? 'Tap to check in now' 
                    : `Next check-in in ${daysUntilCheckIn} days`}
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{vaultSummary.totalItems}</Text>
            <Text style={styles.statLabel}>Vault Items</Text>
            <Text style={styles.statSubtext}>
              {vaultSummary.plaintextItems} text • {vaultSummary.encryptedItems} files
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{recipientSummary.totalRecipients}</Text>
            <Text style={styles.statLabel}>Recipients</Text>
            <Text style={styles.statSubtext}>
              {recipientSummary.verifiedRecipients} verified • {recipientSummary.totalAssignments} assigned
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => (navigation as any).navigate('Vault')}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionEmoji}>🔐</Text>
              </View>
              <Text style={styles.quickActionTitle}>Add Vault Item</Text>
              <Text style={styles.quickActionSubtitle}>Store secure information</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => (navigation as any).navigate('Recipients')}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionEmoji}>👥</Text>
              </View>
              <Text style={styles.quickActionTitle}>Add Recipient</Text>
              <Text style={styles.quickActionSubtitle}>Manage trusted contacts</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={handleCreateVault}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionEmoji}>📁</Text>
              </View>
              <Text style={styles.quickActionTitle}>Create Vault</Text>
              <Text style={styles.quickActionSubtitle}>Organize your items</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => (navigation as any).navigate('Settings')}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionEmoji}>⚙️</Text>
              </View>
              <Text style={styles.quickActionTitle}>Settings</Text>
              <Text style={styles.quickActionSubtitle}>Configure preferences</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Status</Text>

          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={[styles.statusDot, {
                backgroundColor: vaultSummary.activeVaults > 0 ? theme.colors.success : theme.colors.warning
              }]} />
              <Text style={styles.statusTitle}>
                {vaultSummary.activeVaults > 0 ? 'Vault Active' : 'Setup Required'}
              </Text>
            </View>

            <Text style={styles.statusDescription}>
              {userData && vaultSummary.totalVaults > 0
                ? `Last check-in: ${formatDate(userData.lastCheckInAt)}`
                : 'Complete your vault setup to secure your legacy'
              }
            </Text>
            
            {vaultSummary.totalVaults === 0 && (
              <TouchableOpacity style={styles.setupButton} onPress={handleStartSecuritySetup}>
                <Text style={styles.setupButtonText}>🚀 Start Security Setup</Text>
              </TouchableOpacity>
            )}

            <View style={styles.statusMetrics}>
              <View style={styles.statusMetric}>
                <Text style={styles.metricValue}>{userData?.checkInIntervalDays || 0}</Text>
                <Text style={styles.metricLabel}>Days Interval</Text>
              </View>
              <View style={styles.statusMetric}>
                <Text style={styles.metricValue}>{vaultSummary.totalVaults}</Text>
                <Text style={styles.metricLabel}>Active Vaults</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      
      {/* Security Setup Modal */}
      <SecuritySetupModal
        visible={showSecuritySetup}
        onClose={() => setShowSecuritySetup(false)}
        onComplete={handleSecuritySetupComplete}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: theme.colors.primary,
  },
  greeting: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  userName: {
    fontSize: theme.typography.fontSize.xxlarge,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  checkInCard: {
    backgroundColor: theme.colors.accent,
    marginHorizontal: theme.layout.screenPadding,
    marginVertical: 16,
    borderRadius: 16,
    padding: 20,
    ...theme.shadows.md,
  },
  checkInCardLoading: {
    opacity: 0.7,
    backgroundColor: theme.colors.textMuted,
  },
  checkInContent: {
    alignItems: 'center',
  },
  checkInTitle: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  checkInSubtitle: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surfaceElevated,
    marginHorizontal: 8,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  statSubtext: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xlarge,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionTitle: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 14,
  },
  statusCard: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 16,
    padding: 20,
    ...theme.shadows.sm,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusTitle: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  statusDescription: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  statusMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusMetric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.accent,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
  },
  bottomSpacer: {
    height: 32,
  },
  setupButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.layout.borderRadius.lg,
    alignItems: 'center',
    marginTop: theme.spacing.md,
    ...theme.shadows.md,
  },
  setupButtonText: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
});

export default HomeScreen;
