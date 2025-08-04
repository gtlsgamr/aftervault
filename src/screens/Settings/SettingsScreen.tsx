import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import theme from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { fetchUser } from '../../services/dataService';
import Button from '../../components/Button';

const SettingsScreen: React.FC = () => {
  const { signOut, loading } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = React.useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [checkInReminders, setCheckInReminders] = React.useState(true);

  const user = fetchUser();

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

  const renderSettingItem = (
    title: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    description?: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.lightGray, true: theme.colors.primary }}
        thumbColor={theme.colors.white}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.userInfoCard}>
            <Text style={styles.userInfoTitle}>Account Information</Text>

            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Email:</Text>
              <Text style={styles.userInfoValue}>{user.email}</Text>
            </View>

            {user.phone && (
              <View style={styles.userInfoItem}>
                <Text style={styles.userInfoLabel}>Phone:</Text>
                <Text style={styles.userInfoValue}>{user.phone}</Text>
              </View>
            )}

            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Account Created:</Text>
              <Text style={styles.userInfoValue}>{formatDate(user.createdAt.toString())}</Text>
            </View>

            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Last Check-in:</Text>
              <Text style={styles.userInfoValue}>{formatDate(user.lastCheckInAt.toString())}</Text>
            </View>

            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Account Type:</Text>
              <View style={[
                styles.accountTypeBadge,
                user.proUser ? styles.proAccountBadge : styles.freeAccountBadge
              ]}>
                <Text style={styles.accountTypeText}>
                  {user.proUser ? 'Pro Account' : 'Free Account'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          {!user.proUser && (
            <TouchableOpacity style={[styles.actionButton, styles.upgradeButton]}>
              <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          {renderSettingItem(
            'Notifications',
            notificationsEnabled,
            setNotificationsEnabled,
            'Receive notifications about vault activity'
          )}

          {renderSettingItem(
            'Biometric Authentication',
            biometricsEnabled,
            setBiometricsEnabled,
            'Use Face ID or Touch ID to secure your account'
          )}

          {renderSettingItem(
            'Dark Mode',
            darkModeEnabled,
            setDarkModeEnabled,
            'Use dark theme throughout the app'
          )}

          {renderSettingItem(
            'Check-in Reminders',
            checkInReminders,
            setCheckInReminders,
            'Receive reminders to check in before triggers activate'
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check-in Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Check-in Interval</Text>
              <Text style={styles.settingDescription}>
                How often you need to check in to prevent triggers
              </Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{user.checkInIntervalDays} days</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Modify Check-in Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Two-Factor Authentication</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Help Center</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Contact Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signOutSection}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            loading={loading}
            disabled={loading}
          />
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
  header: {
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  title: {
    fontSize: theme.typography.fontSize.xlarge,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
  },
  section: {
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
    marginBottom: theme.spacing.medium,
  },
  userInfoCard: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.layout.borderRadius,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
  userInfoTitle: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
    marginBottom: theme.spacing.small,
  },
  userInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.small,
  },
  userInfoLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.darkGray,
    width: 120,
  },
  userInfoValue: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.black,
    flex: 1,
  },
  accountTypeBadge: {
    paddingHorizontal: theme.spacing.small,
    paddingVertical: 2,
    borderRadius: 12,
  },
  proAccountBadge: {
    backgroundColor: '#e6f7e6', // light green
  },
  freeAccountBadge: {
    backgroundColor: '#e6e6ff', // light blue
  },
  accountTypeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  actionButton: {
    backgroundColor: theme.colors.lightGray,
    padding: theme.spacing.medium,
    borderRadius: theme.layout.borderRadius,
    marginBottom: theme.spacing.small,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.black,
    fontWeight: theme.typography.fontWeight.medium,
  },
  upgradeButton: {
    backgroundColor: theme.colors.primary,
  },
  upgradeButtonText: {
    color: theme.colors.white,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.black,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.darkGray,
  },
  valueContainer: {
    backgroundColor: theme.colors.lightGray,
    paddingHorizontal: theme.spacing.small,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.layout.borderRadius,
  },
  valueText: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.black,
  },
  signOutSection: {
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.large,
  },
});

export default SettingsScreen;
