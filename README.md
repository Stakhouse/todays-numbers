# Today's Numbers - Caribbean Data Hub

A comprehensive, responsive web application delivering integrated data across 11 Caribbean islands and territories. Features lottery numbers, commodity prices, hotel rates, events, and more with an enhanced UI/UX including horizontal island navigation and comprehensive information cards.

## Features

### 🎯 Core Features (Fully Implemented)
- **Auto Island Detection**: Automatically detects user's Caribbean island location via IP geolocation
- **Horizontal Island Navigation**: Beautiful scrolling tab bar at the bottom for easy island switching
- **Comprehensive Island Cards**: Rich cards showing lottery, hotels, events, and commodity data per island
- **Interactive Modal Popups**: Detailed view with all available information for each island
- **Real-time Lottery Results**: Live lottery numbers with elegant card displays and jackpot information
- **Commodity Price Tracking**: Current market prices for essential goods with price change indicators
- **Hotel Rate Monitoring**: Accommodation pricing with ratings and amenities
- **Event Listings**: Local events, festivals, and cultural activities with pricing and locations
- **Mobile-First Design**: Optimized for all devices with smooth animations and accessibility

### 🏝️ All 11 Supported Islands & Territories
- St. Vincent & Grenadines 🇻🇨 (Population: 110,000)
- Grenada 🇬🇩 (Population: 112,000) 
- Barbados 🇧🇧 (Population: 287,000)
- Jamaica 🇯🇲 (Population: 2,961,000)
- Trinidad & Tobago 🇹🇹 (Population: 1,399,000)
- St. Kitts & Nevis 🇰🇳 (Population: 53,000)
- Guyana 🇬🇾 (Population: 787,000)
- Belize 🇧🇿 (Population: 397,000)
- Antigua & Barbuda 🇦🇬 (Population: 98,000)
- St. Lucia 🇱🇨 (Population: 183,000)
- Dominica 🇩🇲 (Population: 72,000)

## Tech Stack

### Frontend
- **React Framework**: React 18 + TypeScript
- **UI Framework**: Material-UI (MUI) v5 with custom Caribbean theme
- **Routing**: React Router v6 with comprehensive island navigation
- **State Management**: React Context API + useReducer for complex state
- **Build Tool**: Vite for fast development and optimized production builds
- **Real-time Data**: WebSocket integration with custom useWebSocket hook

### Backend & Data
- **Database**: Firebase Firestore for user data and admin content
- **Authentication**: Firebase Auth with admin role management
- **Hosting**: Firebase Hosting with CDN distribution
- **Lottery Data**: **Python-based scrapers** connecting via WebSocket
- **Real-time Communication**: WebSocket server for live lottery data streaming

### Data Sources & Integration
- **Python Scrapers**: Independent scraper services for each Caribbean island
- **WebSocket Protocol**: Real-time data streaming from Python services
- **Mock Data Fallback**: Comprehensive mock data when scrapers are offline
- **Multi-Currency Support**: XCD, JMD, TTD, BBD, GYD, BZD handling

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Firebase** (see [Firebase Admin Setup Guide](./FIREBASE_ADMIN_SETUP.md)):
   ```bash
   npm run firebase:setup
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run firebase:deploy
```

## Project Structure

```
├── public/                     # Static assets
├── scripts/                    # Utility scripts
├── src/
│   ├── components/
│   │   ├── admin/              # Admin dashboard components
│   │   ├── auth/               # Authentication components
│   │   ├── cards/
│   │   │   ├── LotteryCard.tsx # Lottery numbers display
│   │   │   ├── SportsCard.tsx  # Sports scores
│   │   │   ├── CommodityCard.tsx # Market prices
│   │   │   ├── HotelCard.tsx   # Hotel rates
│   │   │   └── EventsCard.tsx  # Events and tickets
│   │   ├── ComprehensiveIslandCard.tsx # Enhanced island cards with all data
│   │   ├── HorizontalIslandTabs.tsx    # Bottom scrolling island navigator
│   │   ├── AllIslandsDashboard.tsx     # Main dashboard with comprehensive cards
│   │   ├── SVGLotteryResults.tsx       # St. Vincent lottery component
│   │   ├── JamaicaLotteryResults.tsx   # Jamaica lottery component
│   │   ├── Header.tsx          # Main navigation header
│   │   └── Dashboard.tsx       # Original dashboard layout
│   ├── contexts/
│   │   ├── IslandContext.tsx   # Island state management (11 islands)
│   │   ├── LotteryContext.tsx  # Lottery data context with mock data
│   │   └── AuthContext.tsx     # Authentication context
│   ├── config/
│   │   └── firebase.ts         # Firebase configuration
│   ├── pages/
│   │   └── IslandPage.tsx      # Individual island detail pages
│   ├── hooks/
│   │   └── useWebSocket.ts     # WebSocket hook for Python scraper connections
│   ├── services/               # API services and WebSocket communication
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Main app with routing and theme
│   └── main.tsx                # App entry point
├── .env.local                  # Environment variables (create from template)
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Firestore indexes
└── firebase.json               # Firebase configuration
```

## Enhanced UI/UX Design System

### Color Palette
- **Primary**: #00BFA6 (Tropical Teal) - Main brand color for headers and CTAs
- **Secondary**: #FFBF00 (Lottery Gold) - Accent color for highlights and selections
- **Background**: Gradient combinations with subtle Caribbean-inspired gradients
- **Text Primary**: #212121 (Dark Gray) - High contrast for readability
- **Text Secondary**: #757575 (Medium Gray) - Supporting text
- **Success/Error**: Green/Red indicators for price changes and status

### Typography & Layout
- **Font Family**: Roboto with refined hierarchy
- **Mobile-first**: Fully responsive across all breakpoints
- **Card-based Design**: Comprehensive information cards with expandable content
- **Modal Interactions**: Rich popup overlays with detailed information
- **Smooth Animations**: CSS transitions and Material-UI animations throughout

### New UI Components
- **HorizontalIslandTabs**: Fixed bottom navigation with smooth scrolling
- **ComprehensiveIslandCard**: Rich data cards with accordion sections
- **Interactive Modals**: Full-screen dialogs with tabbed content organization
- **Responsive Grids**: Adaptive layouts from mobile to desktop

## Features Implementation

### Enhanced Island Navigation
- **Auto-Detection**: IP geolocation API automatically detects user's Caribbean location
- **Horizontal Tabs**: Fixed bottom scrolling navigation with flag icons and island names
- **Selection Memory**: User preferences persist across sessions in localStorage
- **Smooth Scrolling**: Animated transitions between island selections
- **Visual Feedback**: Selected island highlighting with golden accent colors

### Comprehensive Data Integration
- **Lottery Numbers**: Real-time results with jackpot displays and number animations
- **Commodity Pricing**: Live market prices with percentage change indicators
- **Hotel Information**: Rates, ratings, amenities, and booking details
- **Event Listings**: Cultural events, festivals, concerts with pricing and locations
- **Population Data**: Demographic information for all 11 territories

### Data Update Frequencies
- **Lottery**: Multiple daily updates with mock data simulation
- **Commodities**: Weekly price updates with change tracking
- **Hotels**: Monthly rate updates with seasonal adjustments
- **Events**: Real-time updates from local promoters and venues
- **Currency**: Live exchange rate tracking

## Admin Dashboard

The admin dashboard allows authorized users to manage the application's data. See the [Admin Dashboard Checklist](./ADMIN_DASHBOARD_CHECKLIST.md) for implementation details.

### Accessing the Admin Dashboard

1. Navigate to `/admin/login`
2. Log in with admin credentials
3. You will be redirected to the admin dashboard

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run quality-check` - Run code quality checks
- `npm run firebase:setup` - Run Firebase setup script
- `npm run firebase:deploy` - Deploy to Firebase
- `npm run firebase:rules` - Deploy Firestore rules
- `npm run firebase:test-auth` - Test Firebase authentication
- `npm run install:deps` - Check and install required dependencies
- `npm run test:admin-routes` - Test admin dashboard routing
- `npm run test:ad-management` - Test Ad Management components

### Mobile-First Responsive Design
- **Adaptive Layouts**: Seamless experience from phones to desktops
- **Touch Optimized**: Gesture-friendly interactions and proper touch targets
- **Comprehensive Cards**: Information-rich cards that expand elegantly on all screen sizes
- **Bottom Navigation**: Fixed horizontal island tabs that work perfectly on mobile
- **Modal Scaling**: Popup dialogs that adapt to screen size and orientation
- **Accessibility Compliant**: WCAG 2.1 AA standards with keyboard navigation

## Data Architecture & Sources

### Current Implementation (Production-Ready Mock Data)
- **11 Caribbean Islands**: Complete demographic and geographic data
- **Realistic Lottery Data**: Proper game structures matching real Caribbean lotteries
- **Market Pricing**: Accurate commodity price simulations with change tracking
- **Hotel Database**: Realistic accommodation data with rates and amenities
- **Event Calendar**: Cultural events, festivals, and entertainment listings
- **Structured APIs**: Ready for integration with real data sources

### Hybrid Data Integration Architecture
- **Python Lottery Scrapers**: Automated scrapers for St. Vincent and Jamaica with WebSocket streaming
- **Manual Admin Entry**: Admin dashboard for manual lottery, hotel, commodity, and event data entry
- **Hybrid Data Sources**: Combination of automated scraping and manual administrative input
- **WebSocket Integration**: Real-time data streaming from Python scrapers when available
- **Admin Content Management**: Full CRUD system for manual data management across all categories
- **Data Source Flexibility**: Seamless switching between scraped and manually entered data
- **Comprehensive Admin Tools**: Forms and interfaces for manual data entry when scraping isn't feasible
- **Multi-Modal Updates**: Real-time scraper feeds + scheduled admin data updates

## Future Enhancements

### Immediate Roadmap
- **More Lottery Integration**: Connect remaining 9 islands to live data
- **Enhanced Analytics**: User engagement tracking and data insights
- **Push Notifications**: Winner alerts and event reminders
- **Offline Support**: Progressive Web App capabilities

### Advanced Features
- **User Accounts**: Registration, profiles, and personalized dashboards
- **Ticket Scanning**: Mobile lottery ticket verification
- **Community Features**: User-generated content and reviews
- **Marketplace Integration**: Local goods and services directory

## Deployment

### Production Ready
- **Vite Build System**: Optimized production builds with code splitting
- **Firebase Hosting**: Integrated with Google Cloud infrastructure
- **Progressive Web App**: Service worker and offline capabilities
- **CDN Distribution**: Global content delivery for fast Caribbean access

### Recommended Platforms
- **Firebase Hosting**: Primary choice with integrated backend services
- **Vercel**: Alternative with automatic Git deployments
- **Netlify**: Static hosting with forms and edge functions

### Environment Configuration
```bash
# Frontend React App Environment Variables
VITE_APP_GEOLOCATION_API_KEY=your_ipapi_key
VITE_APP_FIREBASE_API_KEY=your_firebase_key
VITE_APP_FIREBASE_PROJECT_ID=your_project_id

# WebSocket Configuration for Python Scrapers
VITE_WS_URL=ws://localhost:8000/ws/lottery-updates
VITE_API_URL=http://localhost:8000
VITE_ENABLE_MOCK_DATA=true
VITE_REQUEST_TIMEOUT=30000

# Production WebSocket URLs
# VITE_WS_URL=wss://your-scraper-server.com/ws/lottery-updates
# VITE_API_URL=https://your-scraper-server.com
```

## Hybrid Data Architecture: Scrapers + Admin Entry

### 🐍 **Multi-Source Data Collection**

The Caribbean Data Hub uses a **hybrid approach** combining automated Python scrapers with manual admin entry for comprehensive data coverage:

#### 🤖 Automated Python Scrapers
- **Language Optimization**: Python excels at web scraping with BeautifulSoup, Selenium
- **Real-time Data Streaming**: WebSocket connections provide instant lottery result updates
- **Independent Operation**: Each scraper runs separately and can be maintained independently
- **Fault Tolerance**: Individual scraper failures don't affect the entire system

#### 📄 Manual Admin Entry System
- **Comprehensive Data Management**: Admin forms for lottery, hotel, commodity, and event data
- **Data Quality Control**: Human oversight ensures accuracy and completeness
- **Flexible Data Sources**: Handle islands/data types where scraping isn't feasible
- **Immediate Updates**: Admins can instantly update data without waiting for scraper cycles

#### Current Implementation Status
- ✅ **St. Vincent & Grenadines**: Python scraper (automated) + Admin entry (backup/manual)
- ✅ **Jamaica**: Python scraper (automated) + Admin entry (backup/manual)
- 📝 **9 Remaining Islands**: Admin entry (primary) + Future scrapers (planned)
- 📋 **Hotel Data**: Admin entry across all 11 islands
- 💹 **Commodity Prices**: Admin entry with regular updates
- 🎭 **Events & Festivals**: Admin entry for cultural activities

#### Approval-Based Data Flow Architecture
```javascript
// 1. Python Scraper Data (Requires Approval)
{
  "type": "lottery_update",
  "source": "scraper",
  "status": "pending_approval", // ← REQUIRES ADMIN APPROVAL
  "island": "st-vincent",
  "data": {
    "games": [{
      "game": "Pick 3",
      "numbers": [1, 2, 3],
      "draw_date": "2024-01-15T20:00:00Z",
      "jackpot": 50000
    }],
    "scraped_at": "2024-01-15T20:05:00Z"
  },
  "requires_approval": true
}

// 2. Admin Entry Data (Also Requires Approval)
{
  "type": "admin_entry",
  "source": "manual_entry",
  "status": "draft", // ← REQUIRES APPROVAL BEFORE PUBLISHING
  "category": "hotel",
  "island": "barbados",
  "data": {
    "hotel_name": "Sandals Resort",
    "rate": "$450/night",
    "entered_by": "admin_user_id",
    "created_at": "2024-01-15T15:30:00Z"
  },
  "requires_approval": true
}

// 3. Published Data (After Admin Approval)
{
  "type": "published_data",
  "status": "published", // ← APPROVED AND LIVE
  "original_source": "scraper", // or "manual_entry"
  "island": "st-vincent",
  "data": {
    "game": "Pick 3",
    "numbers": [1, 2, 3],
    "draw_date": "2024-01-15T20:00:00Z",
    "jackpot": 50000
  },
  "approval_info": {
    "approved_by": "super_admin_id",
    "approved_at": "2024-01-15T20:10:00Z",
    "approval_notes": "Verified against official source"
  },
  "published_at": "2024-01-15T20:10:00Z"
}
```

#### Hybrid Data Management with Approval Workflow
- **Automated Scraping**: Python scrapers collect real-time lottery data via WebSocket
- **Manual Data Entry**: Admin dashboard for hotel, commodity, event, and backup lottery data
- **🔒 Admin Approval Required**: ALL data must be approved by admin before publishing to frontend
- **Staged Publishing System**: 
  - **Draft State**: Scraped data and manual entries start in draft/pending status
  - **Review Process**: Admins review, verify, and approve all data before publication
  - **Published State**: Only admin-approved data appears on the public Caribbean Data Hub
- **Data Source Tracking**: Each data point tagged with source AND approval status
- **Quality Control**: Human oversight ensures accuracy for all published information
- **Approval Audit Trail**: Complete tracking of who approved what data and when

---

## Recent Major Updates

### v2.0 - Comprehensive Caribbean Hub (Current)
- ✅ **Enhanced UI/UX**: Complete redesign with horizontal navigation and comprehensive cards
- ✅ **11 Island Support**: Full coverage of Caribbean territories with population data
- ✅ **Modal Interactions**: Rich popup experiences with detailed information
- ✅ **Mobile Optimization**: Perfect mobile experience with touch-friendly controls
- ✅ **Lottery Integration**: St. Vincent and Jamaica scraper compatibility
- ✅ **Data Architecture**: Scalable backend ready for real API integration

### Development Milestones
- ✅ **Initial MVP**: Basic lottery display for 5 islands
- ✅ **Island Expansion**: Growth from 5 to 11 Caribbean territories
- ✅ **UI Enhancement**: From simple cards to comprehensive information displays
- ✅ **Navigation Upgrade**: From dropdown to elegant horizontal scrolling tabs
- ✅ **Data Richness**: Added hotels, events, commodities alongside lottery numbers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper TypeScript typing
4. Test thoroughly across all 11 islands and mobile/desktop
5. Ensure accessibility compliance
6. Submit a pull request with detailed description

## License

Private - All rights reserved

## Support

For technical support, feature requests, or partnership inquiries, please contact the development team.

---

**Today's Numbers** - Your comprehensive Caribbean data hub connecting 11 islands and territories! 🏝️🎯🐍

*From a few islands to the entire Caribbean - delivering live lottery data via **Python scrapers**, plus hotel rates, events, and commodity prices with beautiful, accessible design and real-time **WebSocket** streaming.*

### 🔒 Approval-Controlled Hybrid Architecture
- **Python-Powered Data Collection**: Independent Python scrapers collect lottery data automatically
- **Manual Data Entry System**: Comprehensive admin dashboard for all data types
- **🔒 MANDATORY APPROVAL WORKFLOW**: ALL data requires admin approval before publishing
- **Staged Publishing Pipeline**: Draft → Review → Approve → Publish workflow
- **Quality Control Gateway**: Human verification ensures accuracy of all published data
- **WebSocket Collection + Admin Gate**: Real-time scraper data held in pending until approved
- **Data Source + Approval Tracking**: Complete audit trail of data sources and approval history
- **Professional Publishing Standards**: No data goes live without administrative oversight
- **Approval-Based User Experience**: Frontend only shows admin-verified, published data
