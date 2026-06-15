export interface MatchEvent {
  id: string;
  minute: number;
  type: 'goal' | 'card' | 'sub' | 'info' | 'whistle';
  description: string;
  team?: 'home' | 'away';
  player?: string;
}

export interface MatchStats {
  possession: [number, number]; // [home, away]
  shots: [number, number];
  shotsOnTarget: [number, number];
  fouls: [number, number];
  corners: [number, number];
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  homeScore: number;
  awayScore: number;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'live' | 'finished';
  competition: string;
  events: MatchEvent[];
  stats: MatchStats;
}

export interface PlayerStats {
  goals: number;
  assists: number;
  matchesPlayed: number;
  cleanSheets?: number;
  yellowCards: number;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  nationality: string;
  avatar: string;
  stats: PlayerStats;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: 'Match Report' | 'Training' | 'Interview' | 'Exclusive' | 'Behind the Scenes';
  image: string;
  likes: number;
  views: number;
  isBehindTheScenes: boolean;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  host: string;
  audioUrl?: string;
  likes: number;
}

export interface FootballReel {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  likes: number;
  commentsCount: number;
  uploader: string;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number; // in TZS or USD (let's use TZS - Tanzanian Shilling)
  description: string;
  image: string;
  category: 'Jersey' | 'Apparel' | 'Accessory' | 'Membership';
  sizes?: string[];
  inStock: boolean;
}

export interface MemberAchievement {
  id: string;
  title: string;
  description: string;
  pointsGranted: number;
  unlockedAt?: string;
}

export interface MatchTicket {
  id: string;
  matchId: string;
  matchTitle: string;
  venue: string;
  date: string;
  time: string;
  ticketClass: 'VIP' | 'Regular' | 'Diehard';
  price: number;
  seatNumber: string;
  purchasedAt: string;
  qrValue: string;
}

export interface OrderItem {
  id: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  price: number;
  quantity: number;
  size?: string;
}

export interface ShopOrder {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  purchasedAt: string;
  status: 'Pending' | 'Paid' | 'Delivered';
}

export interface MemberProfile {
  name: string;
  email: string;
  membershipNo: string;
  tier: 'Fan' | 'Silver' | 'Gold' | 'Platinum';
  points: number;
  achievements: MemberAchievement[];
  tickets: MatchTicket[];
  orders: ShopOrder[];
  isSubscribed: boolean;
  subscriptionExpiredAt?: string;
}
