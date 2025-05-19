import { WinningTicket, Announcement, SubscriptionPackage, VipPredictionPerformance } from "../types";

// Mock winning tickets data
export const winningTickets: WinningTicket[] = [
  {
    id: 1,
    title: "Weekend Multi-bet Winner",
    image: "/images/tickets/ticket1.jpg",
    odds: "12.5",
    winnings: "$625.00",
    stake: "$50.00",
    date: "2023-11-12",
    status: "active",
    featured: true,
    matches: [
      { teams: "Arsenal vs Chelsea", prediction: "Arsenal Win", result: "2-0" },
      { teams: "Man City vs Liverpool", prediction: "Over 2.5 Goals", result: "3-1" },
      { teams: "Bayern vs Dortmund", prediction: "Both Teams to Score", result: "2-1" }
    ],
    uploadedBy: "admin",
    uploadedAt: "2023-11-12T14:30:00Z"
  },
  {
    id: 2,
    title: "Midweek Accumulator",
    image: "/images/tickets/ticket2.jpg",
    odds: "8.75",
    winnings: "$437.50",
    stake: "$50.00",
    date: "2023-11-08",
    status: "active",
    featured: false,
    matches: [
      { teams: "Real Madrid vs Barcelona", prediction: "Real Madrid Win", result: "3-1" },
      { teams: "PSG vs Lyon", prediction: "PSG Win", result: "2-0" }
    ],
    uploadedBy: "admin",
    uploadedAt: "2023-11-08T18:45:00Z"
  },
  {
    id: 3,
    title: "Champions League Special",
    image: "/images/tickets/ticket3.jpg",
    odds: "21.0",
    winnings: "$1050.00",
    stake: "$50.00",
    date: "2023-11-01",
    status: "archived",
    featured: false,
    matches: [
      { teams: "Man Utd vs Juventus", prediction: "Draw", result: "1-1" },
      { teams: "Inter vs Atletico", prediction: "Under 2.5 Goals", result: "1-0" },
      { teams: "Ajax vs Porto", prediction: "Ajax Win", result: "2-0" },
      { teams: "Napoli vs Benfica", prediction: "Both Teams to Score", result: "2-1" }
    ],
    uploadedBy: "admin",
    uploadedAt: "2023-11-01T20:15:00Z"
  }
];

// Mock VIP prediction performance data
export const vipPredictionPerformance: VipPredictionPerformance = {
  overall: {
    total: 124,
    won: 89,
    lost: 35,
    successRate: 71.8,
    averageOdds: 1.85,
    roi: 32.8
  },
  comparison: {
    vip: { successRate: 71.8, roi: 32.8 },
    free: { successRate: 52.4, roi: 12.3 }
  }
};

// Mock announcements data
export const announcements: Announcement[] = [
  {
    id: 1,
    title: "New VIP Features Released",
    content: "We've added new features to our VIP subscription including early access to predictions and enhanced statistics.",
    publishDate: "2023-11-15",
    expiryDate: "2023-12-15", // Fixed: changed 'expi' to 'expiryDate'
    status: "active",
    targetAudience: "vip",
    author: "admin",
    createdAt: "2023-11-14T10:30:00Z",
    views: 245,
    clicks: 78
  }
  // Add more announcements as needed
];

// Add subscription packages data
export const subscriptionPackages: SubscriptionPackage[] = [
  // Add your subscription packages here
];