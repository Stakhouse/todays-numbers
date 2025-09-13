/**
 * Admin Dashboard Type Definitions
 * 
 * This file contains TypeScript interfaces for the Admin Dashboard components
 * and data models used throughout the Today's Numbers admin system.
 */

// Island data type
export interface Island {
  id: string;
  name: string;
  code: string; // Country code (e.g., 'vc' for St. Vincent)
  flag: string; // Flag emoji or image URL
  isActive: boolean;
  timezone: string;
}

// Ad submission types
export type AdCategory = 'lottery' | 'sports' | 'hotel' | 'event' | 'commodity';
export type AdStatus = 'pending' | 'approved' | 'rejected';

// Main ad submission interface
export interface AdSubmission {
  id: string;
  title: string;
  category: AdCategory;
  islandId: string;
  status: AdStatus;
  submittedBy: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  data: any; // Category-specific data
  notes?: string;
  imageUrl?: string;
  expiresAt?: Date;
}

// Category-specific data interfaces
export interface LotteryAdData {
  drawDate: Date;
  lotteryType: string;
  jackpot?: number;
  numbers?: number[];
  specialNumbers?: number[];
}

export interface SportsAdData {
  gameDate: Date;
  sportType: string;
  teams: {
    home: string;
    away: string;
  };
  scores?: {
    home: number;
    away: number;
  };
  status: 'scheduled' | 'live' | 'final';
  highlights?: string;
}

export interface HotelAdData {
  hotelName: string;
  location: string;
  startDate: Date;
  endDate: Date;
  roomTypes: Array<{
    type: string;
    price: number;
    currency: string;
    available: number;
  }>;
  amenities: string[];
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export interface EventAdData {
  eventName: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  ticketPrice?: number;
  currency?: string;
  organizer: string;
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export interface CommodityAdData {
  commodityName: string;
  category: string;
  price: number;
  currency: string;
  unit: string;
  seller?: string;
  location?: string;
  availableQuantity?: number;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

// Admin user interface
export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'super_admin' | 'island_admin';
  islandAccess: string[]; // Array of island IDs this admin can manage
  lastLogin?: Date;
  createdAt: Date;
  isActive: boolean;
}

// Audit log entry interface
export interface AuditLogEntry {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resourceType: 'ad' | 'user' | 'island' | 'system';
  resourceId?: string;
  details: any;
  timestamp: Date;
  ipAddress?: string;
}

// Filter options for ad submissions list
export interface AdSubmissionFilters {
  status?: AdStatus | 'all';
  category?: AdCategory | 'all';
  islandId?: string | 'all';
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

// Scraped lottery data interfaces
export interface ScrapedLotteryResult {
  id: string;
  island: string;
  game: string;
  numbers: number[];
  drawDate: Date;
  jackpot?: number;
  currency?: string;
  source: 'scraper' | 'manual' | 'api';
  scraperVersion?: string;
  confidence?: number; // Scraper confidence level (0-1)
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScraperStatus {
  id: string;
  island: string;
  status: 'active' | 'inactive' | 'error';
  lastRun: Date;
  nextRun?: Date;
  successRate: number;
  errorMessage?: string;
  totalRuns: number;
  successfulRuns: number;
}

// Combined lottery data (scraped + manual)
export interface LotteryDataEntry {
  id: string;
  island: string;
  game: string;
  numbers: number[];
  drawDate: Date;
  jackpot?: number;
  currency?: string;
  source: 'scraper' | 'manual' | 'admin';
  isActive: boolean;
  metadata?: {
    scraper?: {
      confidence: number;
      version: string;
      source_url?: string;
    };
    admin?: {
      enteredBy: string;
      notes?: string;
    };
    verification?: {
      isVerified: boolean;
      verifiedBy?: string;
      verifiedAt?: Date;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard statistics interface
export interface DashboardStats {
  totalSubmissions: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  submissionsByCategory: Record<AdCategory, number>;
  submissionsByIsland: Record<string, number>;
  recentActivity: AuditLogEntry[];
  lotteryStats?: {
    totalResults: number;
    scrapedResults: number;
    manualResults: number;
    verifiedResults: number;
    recentScrapes: number;
    scraperUptime: number;
  };
}
