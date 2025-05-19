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

export interface Announcement {
  id: number;
  title: string;
  content: string;
  publishDate: string;
  expiryDate: string;
  status: string;
  targetAudience: string;
  author: string;
  createdAt: string;
  views: number;
  clicks: number;
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
  popular: boolean;
  subscribers: number;
  conversionRate: number;
}

export interface PerformanceData {
  overall: {
    total: number;
    won: number;
    lost: number;
    successRate: number;
    averageOdds: number;
    roi: number;
  };
  byMonth: Array<{
    month: string;
    successRate: number;
    roi: number;
  }>;
  bySport: Array<{
    sport: string;
    successRate: number;
    roi: number;
  }>;
  byType: Array<{
    type: string;
    successRate: number;
    roi: number;
  }>;
  comparison: {
    vip: { successRate: number; roi: number };
    free: { successRate: number; roi: number };
  };
}