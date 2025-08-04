import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList,  Alert } from 'react-native';
import theme from '../../theme/theme';
import { fetchVaults, fetchVaultItems } from '../../services/dataService';
import { Vault, VaultItem } from '../../types';
import Button from '../../components/Button';

const VaultScreen: React.FC = () => {
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);

  const loadVaultItems = useCallback((vaultId: string) => {
    const items = fetchVaultItems(vaultId);
    setVaultItems(items);
  }, []);

  const loadVaults = useCallback(() => {
    const data = fetchVaults();

    // Select the first vault by default if available
    if (data.length > 0 && !selectedVault) {
      setSelectedVault(data[0]);
      loadVaultItems(data[0].id);
    }
  }, [selectedVault, loadVaultItems]);

  useEffect(() => {
    loadVaults();
  }, [loadVaults]);

  const handleAddItem = () => {
    if (!selectedVault) {
      Alert.alert('Error', 'Please select a vault first');
      return;
    }

    // In a real app, this would open a form to add a new item
    Alert.alert(
      'Add New Item',
      'This would open a form to add a new item to the vault.',
      [{ text: 'OK' }]
    );
  };

  const renderVaultItem = ({ item }: { item: VaultItem }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <View style={[
          styles.itemTypeBadge,
          item.type === 'plaintext' ? styles.plaintextBadge : styles.encryptedBadge
        ]}>
          <Text style={styles.itemTypeText}>{item.type}</Text>
        </View>
      </View>

      {item.type === 'plaintext' && item.content && (
        <View style={styles.contentPreview}>
          <Text style={styles.contentText} numberOfLines={2}>
            {item.content}
          </Text>
        </View>
      )}

      {item.type === 'encrypted' && (
        <View style={styles.contentPreview}>
          <Text style={styles.encryptedText}>Encrypted content</Text>
        </View>
      )}

      <View style={styles.itemFooter}>
        <Text style={styles.itemMeta}>
          Release after: {item.releaseAfterDays} days
        </Text>
        {item.expiresAfterDays && (
          <Text style={styles.itemMeta}>
            Expires after: {item.expiresAfterDays} days
          </Text>
        )}
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No items in this vault</Text>
      <Button
        title="Add Item"
        onPress={handleAddItem}
        style={styles.addButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Vault</Text>
      </View>

      <View style={styles.content}>
        {selectedVault && (
          <>
            <View style={styles.vaultHeader}>
              <Text style={styles.vaultTitle}>{selectedVault.title}</Text>
              <View style={[styles.statusBadge, styles[`${selectedVault.status}Badge`]]}>
                <Text style={styles.statusText}>{selectedVault.status}</Text>
              </View>
            </View>

            <FlatList
              data={vaultItems}
              keyExtractor={(item) => item.id}
              renderItem={renderVaultItem}
              ListEmptyComponent={renderEmptyList}
              contentContainerStyle={styles.listContent}
            />

            {vaultItems.length > 0 && (
              <Button
                title="Add New Item"
                onPress={handleAddItem}
                style={styles.addButton}
              />
            )}
          </>
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
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  title: {
    fontSize: theme.typography.fontSize.xlarge,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
  },
  vaultSelector: {
    paddingVertical: theme.spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  vaultTab: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.layout.borderRadius,
    backgroundColor: theme.colors.lightGray,
  },
  selectedVaultTab: {
    backgroundColor: theme.colors.black,
  },
  vaultTabText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.darkGray,
  },
  selectedVaultTabText: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.medium,
  },
  content: {
    flex: 1,
    padding: theme.spacing.medium,
  },
  vaultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  vaultTitle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.small,
    paddingVertical: theme.spacing.xs,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#e6f7e6', // light green
  },
  triggeredBadge: {
    backgroundColor: '#ffe6e6', // light red
  },
  archivedBadge: {
    backgroundColor: '#e6e6e6', // light gray
  },
  statusText: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.medium,
  },
  listContent: {
    flexGrow: 1,
  },
  itemCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.layout.borderRadius,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.small,
  },
  itemTitle: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
    flex: 1,
  },
  itemTypeBadge: {
    paddingHorizontal: theme.spacing.small,
    paddingVertical: 2,
    borderRadius: 12,
  },
  plaintextBadge: {
    backgroundColor: '#e6f7e6', // light green
  },
  encryptedBadge: {
    backgroundColor: '#e6e6ff', // light blue
  },
  itemTypeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  contentPreview: {
    backgroundColor: theme.colors.lightGray,
    padding: theme.spacing.small,
    borderRadius: theme.layout.borderRadius,
    marginBottom: theme.spacing.small,
  },
  contentText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.darkGray,
  },
  encryptedText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.darkGray,
    fontStyle: 'italic',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemMeta: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.darkGray,
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
    marginBottom: theme.spacing.large,
    textAlign: 'center',
  },
  addButton: {
    marginTop: theme.spacing.medium,
  },
});

export default VaultScreen;
