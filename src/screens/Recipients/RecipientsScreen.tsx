import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import theme from '../../theme/theme';
import { fetchRecipients, fetchItemRecipients } from '../../services/dataService';
import { Recipient, ItemRecipient } from '../../types';

const RecipientsScreen: React.FC = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [itemRecipients, setItemRecipients] = useState<ItemRecipient[]>([]);

  const loadRecipients = useCallback(() => {
    const data = fetchRecipients();
    setRecipients(data);

    // Select the first recipient by default if available
    if (data.length > 0 && !selectedRecipient) {
      setSelectedRecipient(data[0]);
    }
  }, [selectedRecipient]);

  useEffect(() => {
    loadRecipients();
  }, [loadRecipients]);

  const handleRecipientSelect = (recipient: Recipient) => {
    setSelectedRecipient(recipient);

    // Load item assignments for this recipient
    const allItemRecipients = fetchItemRecipients();
    const filteredItemRecipients = allItemRecipients.filter(
      ir => ir.recipientId === recipient.id
    );
    setItemRecipients(filteredItemRecipients);
  };

  const handleAddRecipient = () => {
    // In a real app, this would open a form to add a new recipient
    Alert.alert(
      'Add New Recipient',
      'This would open a form to add a new trusted contact.',
      [{ text: 'OK' }]
    );
  };

  const getContactPreferenceLabel = (preference: string) => {
    switch (preference) {
      case 'email':
        return 'Email Only';
      case 'sms':
        return 'SMS Only';
      case 'both':
        return 'Email & SMS';
      default:
        return preference;
    }
  };

  const renderRecipientCard = ({ item }: { item: Recipient }) => (
    <TouchableOpacity
      style={[
        styles.recipientCard,
        selectedRecipient?.id === item.id && styles.selectedRecipientCard
      ]}
      onPress={() => handleRecipientSelect(item)}
    >
      <View style={styles.recipientHeader}>
        <Text style={styles.recipientName}>{item.name}</Text>
        {item.verified ? (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        ) : (
          <View style={styles.unverifiedBadge}>
            <Text style={styles.unverifiedText}>Unverified</Text>
          </View>
        )}
      </View>

      <View style={styles.contactInfo}>
        <Text style={styles.contactLabel}>Email:</Text>
        <Text style={styles.contactValue}>{item.email}</Text>
      </View>

      {item.phone && (
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Phone:</Text>
          <Text style={styles.contactValue}>{item.phone}</Text>
        </View>
      )}

      <View style={styles.contactInfo}>
        <Text style={styles.contactLabel}>Contact Preference:</Text>
        <Text style={styles.contactValue}>
          {getContactPreferenceLabel(item.contactPreference)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderAssignmentItem = ({ item }: { item: ItemRecipient }) => (
    <View style={styles.assignmentCard}>
      <Text style={styles.assignmentTitle}>Item Assignment</Text>

      <View style={styles.assignmentDetail}>
        <Text style={styles.assignmentLabel}>Item ID:</Text>
        <Text style={styles.assignmentValue}>{item.vaultItemId}</Text>
      </View>

      {item.fallbackRecipientId && (
        <View style={styles.assignmentDetail}>
          <Text style={styles.assignmentLabel}>Fallback Recipient:</Text>
          <Text style={styles.assignmentValue}>{item.fallbackRecipientId}</Text>
        </View>
      )}

      {item.fallbackDelayDays && (
        <View style={styles.assignmentDetail}>
          <Text style={styles.assignmentLabel}>Fallback Delay:</Text>
          <Text style={styles.assignmentValue}>{item.fallbackDelayDays} days</Text>
        </View>
      )}

      <View style={styles.policySection}>
        <Text style={styles.policyTitle}>Delivery Policy</Text>

        <View style={styles.policyDetail}>
          <Text style={styles.policyLabel}>Retry Limit:</Text>
          <Text style={styles.policyValue}>{item.deliveryPolicy.retryLimit}</Text>
        </View>

        <View style={styles.policyDetail}>
          <Text style={styles.policyLabel}>Reminder Interval:</Text>
          <Text style={styles.policyValue}>{item.deliveryPolicy.reminderIntervalDays} days</Text>
        </View>

        {item.deliveryPolicy.autoExpireAfterDays && (
          <View style={styles.policyDetail}>
            <Text style={styles.policyLabel}>Auto-Expire After:</Text>
            <Text style={styles.policyValue}>{item.deliveryPolicy.autoExpireAfterDays} days</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderEmptyAssignments = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No item assignments for this recipient</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipients</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddRecipient}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.recipientsSection}>
          <Text style={styles.sectionTitle}>Your Trusted Contacts</Text>
          <FlatList
            data={recipients}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={renderRecipientCard}
            contentContainerStyle={styles.recipientsList}
          />
        </View>

        {selectedRecipient && (
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Item Assignments</Text>
            <FlatList
              data={itemRecipients}
              keyExtractor={(item) => item.id}
              renderItem={renderAssignmentItem}
              ListEmptyComponent={renderEmptyAssignments}
              contentContainerStyle={styles.assignmentsList}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  title: {
    fontSize: theme.typography.fontSize.xlarge,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
  },
  addButton: {
    backgroundColor: theme.colors.black,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.layout.borderRadius,
  },
  addButtonText: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.medium,
  },
  content: {
    flex: 1,
    padding: theme.spacing.medium,
  },
  recipientsSection: {
    marginBottom: theme.spacing.large,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
    marginBottom: theme.spacing.medium,
  },
  recipientsList: {
    paddingBottom: theme.spacing.small,
  },
  recipientCard: {
    width: 250,
    backgroundColor: theme.colors.white,
    borderRadius: theme.layout.borderRadius,
    padding: theme.spacing.medium,
    marginRight: theme.spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  selectedRecipientCard: {
    borderColor: theme.colors.black,
    borderWidth: 2,
  },
  recipientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.small,
  },
  recipientName: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#e6f7e6', // light green
    paddingHorizontal: theme.spacing.small,
    paddingVertical: 2,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: '#2e7d32', // dark green
  },
  unverifiedBadge: {
    backgroundColor: '#ffe6e6', // light red
    paddingHorizontal: theme.spacing.small,
    paddingVertical: 2,
    borderRadius: 12,
  },
  unverifiedText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: '#c62828', // dark red
  },
  contactInfo: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
  },
  contactLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.darkGray,
    width: 120,
  },
  contactValue: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.black,
    flex: 1,
  },
  detailsSection: {
    flex: 1,
  },
  assignmentsList: {
    flexGrow: 1,
  },
  assignmentCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.layout.borderRadius,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  assignmentTitle: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
    marginBottom: theme.spacing.small,
  },
  assignmentDetail: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
  },
  assignmentLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.darkGray,
    width: 140,
  },
  assignmentValue: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.black,
    flex: 1,
  },
  policySection: {
    backgroundColor: theme.colors.lightGray,
    padding: theme.spacing.small,
    borderRadius: theme.layout.borderRadius,
    marginTop: theme.spacing.small,
  },
  policyTitle: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
    marginBottom: theme.spacing.small,
  },
  policyDetail: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
  },
  policyLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.darkGray,
    width: 140,
  },
  policyValue: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.black,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.large,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.darkGray,
    textAlign: 'center',
  },
});

export default RecipientsScreen;
