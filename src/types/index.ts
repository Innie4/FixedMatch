export interface Prediction {
  id: number;
  league: string;
  leagueLogo: string;
  homeTeam: string;
  homeTeamLogo: string;
  awayTeam: string;
  awayTeamLogo: string;
  matchTime: string;
  prediction: string;
  confidence: number;
  status: string;
  result?: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular: boolean;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: string;
}

export interface PaymentConfirmation {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  transactionId: string;
}

export interface WinningTicket {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: string;
  createdAt: string;
  imageUrl: string;
  description: string;
}

export interface VIPContent {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebSocketMessage {
  type: string;
  payload: unknown;
  timestamp: number;
}

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  status: number;
}

export type EmailTemplate = 
  | 'welcome'
  | 'passwordReset'
  | 'paymentConfirmation'
  | 'vipActivated'
  | 'predictionUpdate'
  | 'paymentSubmitted' 