import { User, Vault, VaultItem, Recipient, ItemRecipient, Trigger, AuditLog } from '../types';

// Mock data from db.json
// In a real app, this would be fetched from an API or local storage
const mockData = require('../../db.json');

export const fetchUser = (): User => {
  return mockData.users[0];
};

export const fetchVaults = (): Vault[] => {
  return mockData.vaults;
};

export const fetchVaultItems = (vaultId?: string): VaultItem[] => {
  if (vaultId) {
    return mockData.vaultItems.filter((item: VaultItem) => item.vaultId === vaultId);
  }
  return mockData.vaultItems;
};

export const fetchRecipients = (): Recipient[] => {
  return mockData.recipients;
};

export const fetchItemRecipients = (vaultItemId?: string): ItemRecipient[] => {
  if (vaultItemId) {
    return mockData.itemRecipients.filter((ir: ItemRecipient) => ir.vaultItemId === vaultItemId);
  }
  return mockData.itemRecipients;
};

export const fetchTriggers = (vaultId?: string): Trigger[] => {
  if (vaultId) {
    return mockData.triggers.filter((trigger: Trigger) => trigger.vaultId === vaultId);
  }
  return mockData.triggers;
};

export const fetchAuditLogs = (userId?: string): AuditLog[] => {
  if (userId) {
    return mockData.auditLogs.filter((log: AuditLog) => log.userId === userId);
  }
  return mockData.auditLogs;
};

// Helper function to get vault summary data
export const getVaultSummary = () => {
  const vaults = fetchVaults();
  const vaultItems = fetchVaultItems();

  return {
    totalVaults: vaults.length,
    totalItems: vaultItems.length,
    activeVaults: vaults.filter(v => v.status === 'active').length,
    triggeredVaults: vaults.filter(v => v.status === 'triggered').length,
    plaintextItems: vaultItems.filter(item => item.type === 'plaintext').length,
    encryptedItems: vaultItems.filter(item => item.type === 'encrypted').length,
  };
};

// Helper function to get recipient summary data
export const getRecipientSummary = () => {
  const recipients = fetchRecipients();
  const itemRecipients = fetchItemRecipients();

  return {
    totalRecipients: recipients.length,
    verifiedRecipients: recipients.filter(r => r.verified).length,
    totalAssignments: itemRecipients.length,
  };
};
