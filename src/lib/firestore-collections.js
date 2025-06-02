import { db } from './firebase';
import { collection } from 'firebase/firestore';

// Define collection references
export const usersCollection = collection(db, 'users');
export const adminUsersCollection = collection(db, 'adminUsers');
export const rolesCollection = collection(db, 'roles');
export const vipSubscriptionsCollection = collection(db, 'vipSubscriptions');
export const vipAccessLogsCollection = collection(db, 'vipAccessLogs');
export const vipPredictionCategoriesCollection = collection(db, 'vipPredictionCategories');
export const vipPredictionsCollection = collection(db, 'vipPredictions');
export const packagesCollection = collection(db, 'packages');
export const reviewsCollection = collection(db, 'reviews');
export const analyticsCollection = collection(db, 'analytics');
export const settingsCollection = collection(db, 'settings');
export const activityLogsCollection = collection(db, 'activityLogs');
export const notificationsCollection = collection(db, 'notifications');

// Define collection schemas (for documentation purposes)
export const collectionSchemas = {
  users: {
    uid: 'string',
    email: 'string',
    displayName: 'string',
    role: 'string', // 'customer', 'admin', etc.
    createdAt: 'timestamp',
    lastLogin: 'timestamp',
    profile: 'object',
    status: 'string', // 'active', 'suspended', etc.
    subscriptions: 'array'
  },
  adminUsers: {
    uid: 'string',
    username: 'string',
    email: 'string',
    name: 'string',
    role: 'string', // 'Super Admin', 'Content Manager', etc.
    status: 'string', // 'active', 'inactive'
    lastLogin: 'timestamp',
    lastActivity: 'timestamp',
    createdAt: 'timestamp',
    twoFactorEnabled: 'boolean',
    notes: 'string',
    contactPhone: 'string'
  },
  roles: {
    id: 'string',
    name: 'string',
    description: 'string',
    permissions: 'array',
    createdBy: 'string',
    createdAt: 'timestamp',
    isSystem: 'boolean'
  },
  vipSubscriptions: {
    id: 'string',
    userId: 'string',
    packageId: 'string',
    startDate: 'timestamp',
    endDate: 'timestamp',
    status: 'string', // 'active', 'grace_period', 'expired'
    lastNotificationDate: 'timestamp',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  },
  vipAccessLogs: {
    id: 'string',
    subscriptionId: 'string',
    action: 'string',
    timestamp: 'timestamp'
  },
  vipPredictionCategories: {
    id: 'string',
    name: 'string',
    slug: 'string',
    description: 'string',
    successRate: 'number',
    totalPicks: 'number',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  },
  vipPredictions: {
    id: 'string',
    categoryId: 'string',
    homeTeam: 'string',
    awayTeam: 'string',
    league: 'string',
    matchTime: 'timestamp',
    prediction: 'string',
    odds: 'number',
    analysis: 'string',
    confidence: 'number',
    status: 'string', // 'pending', 'won', 'lost'
    result: 'string',
    isArchived: 'boolean',
    createdAt: 'timestamp',
    updatedAt: 'timestamp',
    createdBy: 'string',
    publishAt: 'timestamp'
  },
  packages: {
    id: 'string',
    name: 'string',
    description: 'string',
    price: 'number',
    duration: 'number', // in days
    features: 'array',
    isActive: 'boolean',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  },
  reviews: {
    id: 'string',
    userId: 'string',
    username: 'string',
    rating: 'number',
    content: 'string',
    status: 'string', // 'pending', 'approved', 'rejected'
    createdAt: 'timestamp',
    adminResponse: 'string'
  },
  analytics: {
    id: 'string',
    date: 'timestamp',
    metrics: 'object'
  },
  settings: {
    id: 'string',
    category: 'string',
    key: 'string',
    value: 'any',
    updatedAt: 'timestamp',
    updatedBy: 'string'
  },
  activityLogs: {
    id: 'string',
    action: 'string',
    admin: 'string',
    timestamp: 'timestamp',
    details: 'string'
  },
  notifications: {
    id: 'string',
    title: 'string',
    description: 'string',
    time: 'timestamp',
    type: 'string',
    priority: 'string',
    isRead: 'boolean',
    targetUsers: 'array'
  }
};