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
  status: 'active' | 'inactive' | 'error' | 'connecting';
  lastRun: Date;
  nextRun?: Date;
  successRate: number;
  errorMessage?: string;
  totalRuns: number;
  successfulRuns: number;
  // Python-specific fields
  pythonVersion?: string;
  scraperVersion?: string;
  websocketConnected: boolean;
  lastWebsocketMessage?: Date;
  uptime: number; // seconds
  memoryUsage?: number; // MB
  cpuUsage?: number; // percentage
}

// WebSocket connection status
export interface WebSocketConnectionStatus {
  island: string;
  connected: boolean;
  lastMessageReceived?: Date;
  lastMessageSent?: Date;
  connectionUptime: number; // seconds
  messagesReceived: number;
  messagesSent: number;
  reconnectAttempts: number;
  lastError?: string;
}

// Python scraper performance metrics
export interface ScraperPerformanceMetrics {
  island: string;
  timeRange: {
    start: Date;
    end: Date;
  };
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number; // milliseconds
  dataPointsScraped: number;
  errorsEncountered: string[];
  uptimePercentage: number;
}

// Data source types for hybrid system
export type DataSource = 'scraper' | 'admin_entry' | 'manual' | 'imported';

// Approval status for all data entries
export type ApprovalStatus = 
  | 'draft'           // Initial state for manual entries
  | 'pending_approval' // Scraped data or submitted manual entries
  | 'approved'        // Admin approved, ready to publish
  | 'published'       // Live on frontend
  | 'rejected'        // Admin rejected
  | 'requires_changes' // Admin requested modifications
  | 'archived';       // Removed from active use

// Approval information
export interface ApprovalInfo {
  status: ApprovalStatus;
  approvedBy?: string;     // admin user ID who approved
  approvedAt?: Date;
  rejectedBy?: string;     // admin user ID who rejected
  rejectedAt?: Date;
  approvalNotes?: string;  // admin comments on approval/rejection
  changeRequests?: string; // specific changes requested
  approvalLevel: 'island_admin' | 'super_admin' | 'auto_approved';
}

// Base interface for all data entries with source tracking AND approval workflow
export interface BaseDataEntry {
  id: string;
  island: string;
  source: DataSource;
  approval: ApprovalInfo;  // MANDATORY APPROVAL INFO
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;      // admin user ID who created
  lastModifiedBy?: string; // admin user ID who last modified
  publishedAt?: Date;      // when it went live on frontend
  isActive: boolean;
  notes?: string;
}

// Combined lottery data (scraped + manual)
export interface LotteryDataEntry extends BaseDataEntry {
  game: string;
  numbers: number[];
  drawDate: Date;
  jackpot?: number;
  currency?: string;
  metadata?: {
    scraper?: {
      confidence: number;
      version: string;
      source_url?: string;
      websocket_received_at?: Date;
    };
    admin?: {
      enteredBy: string;
      verified: boolean;
      override_reason?: string;
    };
  };
}

// Hotel data entry (admin-entered)
export interface HotelDataEntry extends BaseDataEntry {
  hotelName: string;
  location: string;
  rate: number;
  currency: string;
  rateType: 'per_night' | 'per_week' | 'all_inclusive';
  rating?: number;
  amenities: string[];
  roomTypes: Array<{
    type: string;
    rate: number;
    available: number;
  }>;
  seasonalRates?: Array<{
    season: string;
    startDate: Date;
    endDate: Date;
    rate: number;
  }>;
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

// Commodity price entry (admin-entered)
export interface CommodityDataEntry extends BaseDataEntry {
  commodityName: string;
  category: 'food' | 'fuel' | 'household' | 'building_materials' | 'other';
  price: number;
  currency: string;
  unit: string; // 'per lb', 'per liter', 'per gallon', etc.
  previousPrice?: number;
  changePercentage?: number;
  marketLocation?: string;
  supplier?: string;
  qualityGrade?: string;
}

// Event data entry (admin-entered)
export interface EventDataEntry extends BaseDataEntry {
  eventName: string;
  eventType: 'carnival' | 'music_festival' | 'cultural' | 'sports' | 'religious' | 'other';
  description: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  venue?: string;
  ticketPrice?: number;
  currency?: string;
  organizer: string;
  capacity?: number;
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
    socialMedia?: string[];
  };
  tags: string[];
}

// Approval workflow management interfaces
export interface ApprovalQueueItem {
  id: string;
  dataType: 'lottery' | 'hotel' | 'commodity' | 'event';
  island: string;
  title: string;           // human-readable title
  summary: string;         // brief description of data
  source: DataSource;
  submittedAt: Date;
  submittedBy?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedReviewTime: number; // minutes
  dataPreview: any;       // preview of the actual data
  requiresSpecialPermission?: boolean;
}

// Batch approval operations
export interface BatchApprovalRequest {
  itemIds: string[];
  action: 'approve' | 'reject' | 'request_changes';
  notes?: string;
  approverUserId: string;
}

// Approval workflow statistics
export interface ApprovalWorkflowStats {
  pendingCount: number;
  approvedToday: number;
  rejectedToday: number;
  averageApprovalTime: number; // minutes
  oldestPendingItem?: {
    id: string;
    title: string;
    daysPending: number;
  };
  approvalsByAdmin: Record<string, number>; // admin ID -> approval count
  approvalsByDataType: Record<string, number>;
  approvalsByIsland: Record<string, number>;
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
