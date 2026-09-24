export type Platform =
  | 'all'
  | 'telegram'
  | 'instagram'
  | 'youtube'
  | 'twitter'
  | 'tiktok'
  | 'discord'
  | 'steam'
  | 'reddit'
  | 'facebook';

export type EmailType =
  | 'Native Email Included'
  | 'Domain Email'
  | 'No Email'
  | 'Email Changeable';

export type SessionFormat =
  | 'TData'
  | 'Telethon Session'
  | 'Session+JSON'
  | 'Login:Password'
  | 'Cookie'
  | 'OAuth Token';

export type AccessType = 'exclusive' | 'shared_resell';

export type AccountOrigin =
  | 'Personal (Aged)'
  | 'Resale / Verified'
  | 'Resale (Shared / Multi-Login)'
  | 'Auto-Reg Clean'
  | 'Business / Creator';

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number; // e.g., 4.95
  dealsCount: number;
  positivePercent: number; // e.g., 99.2
  responseTime: string; // e.g. "< 5 min"
  verified: boolean;
  memberSince: string;
}

export interface DownloadFile {
  name: string;
  size: string;
  contentMock: string;
}

export interface DeliveryPayload {
  login: string;
  password?: string;
  token?: string;
  secretCode2FA?: string;
  emailAccess?: string;
  emailPassword?: string;
  sessionString?: string;
  downloadFiles?: DownloadFile[];
  files?: DownloadFile[];
  setupInstructions: string;
  liveOtpCode?: string;
  otpAutoFetchAvailable?: boolean;
  lastOtpTimestamp?: string;
}

export interface AccountListing {
  id: string;
  title: string;
  platform: Platform;
  country: {
    code: string; // e.g. "GB"
    name: string; // "United Kingdom"
    flag: string; // "🇬🇧"
  };
  priceINR: number;
  priceUSDT: number;
  origin: AccountOrigin;
  emailType: EmailType;
  phoneLinked: boolean;
  twoFactorAuth: boolean;
  sessionType: SessionFormat;
  followersOrStats: string; // e.g. "18.5K Followers", "2019 Aged", "1200+ Stars"
  regYear: number;
  warrantyHours: number; // e.g. 24, 48, 72
  autoDelivery: boolean;
  seller: Seller;
  description: string;
  tags: string[];
  views: number;
  favoritesCount: number;
  createdAt: string;
  status: 'active' | 'sold' | 'reserved';
  deliveryPayload: DeliveryPayload;
  featured?: boolean;
  accessType?: AccessType; // 'exclusive' or 'shared_resell'
  isResellShared?: boolean; // true if multi-user login enabled
  maxSimultaneousUsers?: number; // e.g. 5 or 10 users simultaneous login
  lztBasePriceINR?: number; // Base cost from LZT.market
  profitMarginPercent?: number; // Markup percentage applied
  profitINR?: number; // Net profit amount in INR
  isLztConnected?: boolean; // True if connected to LZT.market
  lztItemId?: number | string; // Official LZT item ID e.g. 10728492
  lztItemUrl?: string; // Direct link e.g. https://lzt.market/10728492
  lztCategory?: string; // e.g. "steam", "telegram", "discord"
  lztSellerName?: string; // LZT origin seller e.g. "LZT_PrimeStore"
  lztSyncStatus?: 'connected' | 'live' | 'instant_delivery';
  lztLastSyncTime?: string;
}

export interface FilterState {
  search: string;
  platform: Platform;
  selectedCountries: string[];
  minPrice: number | '';
  maxPrice: number | '';
  emailType: string;
  phoneLinked: 'all' | 'yes' | 'no';
  sessionType: string;
  autoDeliveryOnly: boolean;
  warrantyOnly: boolean;
  minRating: number;
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popularity';
  accessType?: 'all' | 'exclusive' | 'shared_resell';
  lztOnly?: boolean;
}

export type PaymentMethod =
  | 'WALLET_BALANCE'
  | 'INR_UPI'
  | 'INR_NETBANKING'
  | 'USDT_TON';

export interface Order {
  id: string;
  orderNumber: string;
  listingId: string;
  title: string;
  platform: Platform;
  countryFlag: string;
  priceINR: number;
  priceUSDT: number;
  paymentMethod: PaymentMethod;
  purchasedAt: string;
  warrantyExpiresAt: string;
  warrantyHours: number;
  status: 'active_guarantee' | 'completed' | 'disputed' | 'refunded' | 'pending_verification' | 'rejected_fake_utr';
  deliveryPayload: DeliveryPayload;
  sellerName: string;
  txHash?: string;
  lztItemId?: number | string;
  lztBasePriceINR?: number;
  profitINR?: number;
  lztPurchased?: boolean;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'purchase' | 'refund' | 'payout';
  amountINR: number;
  amountUSDT: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  txHash?: string;
  note?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  balanceINR: number;
  balanceUSDT: number;
  role: 'buyer' | 'seller' | 'admin';
  favorites: string[];
}
