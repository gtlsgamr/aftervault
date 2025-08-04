// types.ts

// ---------- Enums ----------

export type VaultStatus = 'active' | 'triggered' | 'archived';
export type VaultItemType = 'plaintext' | 'encrypted';
export type DeliveryStatus = 'pending' | 'delivered' | 'expired' | 'cancelled';
export type ContactPreference = 'email' | 'sms' | 'both';
export type TriggerStatus = 'pending' | 'delivered' | 'cancelled';
export type DeliveryMethod = 'email' | 'sms' | 'app';
export type DeliveryEventStatus = 'pending' | 'sent' | 'failed' | 'expired' | 'fallback_used';
export type AuditEvent =
    | 'check_in'
    | 'vault_created'
    | 'vault_deleted'
    | 'trigger_fired'
    | 'email_opened'
    | 'delivery_failed'
    | 'fallback_used';

// ---------- Core Interfaces ----------

export interface User {
    id: string;
    email: string;
    phone?: string;
    displayName?: string;
    avatarUrl?: string;

    proUser: boolean;
    lastCheckInAt: Date;
    checkInIntervalDays: number;

    createdAt: Date;
    updatedAt: Date;
}

export interface Vault {
    id: string;
    ownerId: string;
    title: string;

    status: VaultStatus;
    triggerAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}

export interface VaultItem {
    id: string;
    vaultId: string;
    title: string;
    type: VaultItemType;

    content?: string;               // For plaintext
    encryptedBlobUrl?: string;      // For encrypted blob

    releaseAfterDays: number;
    expiresAfterDays?: number;

    deliveryStatus: DeliveryStatus;
    deliveryAttempts: number;

    createdAt: Date;
    updatedAt: Date;
}

export interface Recipient {
    id: string;
    ownerId: string;
    name: string;
    email: string;
    phone?: string;

    verified: boolean;
    contactPreference: ContactPreference;

    createdAt: Date;
    updatedAt: Date;
}

export interface DeliveryPolicy {
    retryLimit: number;
    reminderIntervalDays: number;
    autoExpireAfterDays?: number;
}

export interface ItemRecipient {
    id: string;
    vaultItemId: string;
    recipientId: string;

    fallbackRecipientId?: string;
    fallbackDelayDays?: number;

    deliveryPolicy: DeliveryPolicy;

    createdAt: Date;
}

export interface Trigger {
    id: string;
    vaultId: string;
    ownerId: string;

    triggeredAt: Date;
    resolvedAt?: Date;
    status: TriggerStatus;

    checkInMissedAt: Date;
}

export interface Delivery {
    id: string;
    triggerId: string;
    vaultItemId: string;
    recipientId: string;

    method: DeliveryMethod;
    status: DeliveryEventStatus;

    sentAt: Date;
    openedAt?: Date;
    acknowledgedAt?: Date;

    retries: number;
    lastReminderAt?: Date;
    fallbackUsed: boolean;
}

export interface AuditLog {
    id: string;
    userId?: string;
    vaultId?: string;
    itemId?: string;
    recipientId?: string;

    eventType: AuditEvent;
    timestamp: Date;
    details?: Record<string, any>;
}

export interface EncryptedBlob {
    cipherText: string;
    iv: string;
    salt: string;
    keyHash?: string;
    createdAt: Date;
}
