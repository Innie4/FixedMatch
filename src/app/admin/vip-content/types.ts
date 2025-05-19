// Update the types file with the correct type definitions
export interface Announcement {
  id: number;
  title: string;
  content: string;
  publishDate: string;
  expiryDate: string;
  targetAudience: string;
  views: number;
  clicks: number;
  status: "published" | "scheduled" | "expired" | "draft"; // Changed to union type
  author: string;
  createdAt: string;
}

export interface WinningTicket {
  id: number;
  title: string;
  image: string;
  odds: string;
  winnings: string;
  stake: string;
  date: string;
  status: string;
  featured: boolean;
  matches: Array<{
    teams: string;
    prediction: string;
    result: string;
  }>;
  uploadedBy: string;
  uploadedAt: string;
}

export interface SubscriptionPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  discountedPrice: number | null;
  duration: number;
  durationType: string;
  features: string[];
  status: string;
  subscribers: number;
  conversionRate: number;
  featured: boolean;
  popular: boolean;
}

// Individual performance data point
export interface VipPredictionPerformance {
  period: string;
  totalPredictions: number;
  successRate: number;
  averageOdds: number;
  profit: number;
  roi: number;
  comparison: {
    vip: { successRate: number; roi: number };
    free: { successRate: number; roi: number };
  };
}

// Performance data structure expected by the PerformanceTab component
export interface VipPerformanceData {
  overall: {
    total: number;
    won: number;
    lost: number;
    successRate: number;
    averageOdds: number;
    roi: number;
  };
  comparison: {
    vip: {
      successRate: number;
      roi: number;
    };
    free: {
      successRate: number;
      roi: number;
    };
  };
}