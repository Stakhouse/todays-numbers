# Today's Numbers - Caribbean Data Hub

A responsive, mobile-first web application delivering public and community data across Caribbean islands including lottery numbers, sports scores, commodity prices, hotel rates, and events.

## Features

### 🎯 Core Features (MVP)
- **Auto Island Detection**: Automatically detects user's Caribbean island location
- **Island Switching**: Easy dropdown to switch between islands
- **Lottery Numbers**: Real-time lottery results with beautiful number displays
- **Sports Scores**: Live and recent match results
- **Commodity Prices**: Weekly updated local market prices
- **Hotel Rates**: Current accommodation pricing
- **Events & Tickets**: Local events and ticket availability

### 🏝️ Supported Islands
- St. Vincent & Grenadines 🇻🇨
- St. Lucia 🇱🇨
- Dominica 🇩🇲
- Grenada 🇬🇩
- Trinidad & Tobago 🇹🇹

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **Styling**: MUI Theme + Custom Components
- **State Management**: React Context API + React Query
- **Build Tool**: Vite
- **Backend**: Firebase (Authentication, Firestore)

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
│   │       ├── LotteryCard.tsx # Lottery numbers display
│   │       ├── SportsCard.tsx  # Sports scores
│   │       ├── CommodityCard.tsx # Market prices
│   │       ├── HotelCard.tsx   # Hotel rates
│   │       └── EventsCard.tsx  # Events and tickets
│   │   ├── Header.tsx          # Main navigation with island selector
│   │   └── Dashboard.tsx       # Main dashboard layout
│   ├── config/
│   │   └── firebase.ts         # Firebase configuration
│   ├── context/
│   │   ├── IslandContext.tsx   # Island state management
│   │   └── AuthContext.tsx     # Authentication context
│   ├── hooks/                  # Custom React hooks
│   ├── services/               # API and service functions
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Main app component with theme
│   └── main.tsx                # App entry point
├── .env.local                  # Environment variables (create from template)
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Firestore indexes
└── firebase.json               # Firebase configuration
```

## Design System

### Color Palette
- **Primary**: #00BFA6 (Tropical Teal)
- **Secondary**: #FFBF00 (Lottery Gold)
- **Background**: #E0F7FA (Light Cyan)
- **Text Primary**: #212121 (Dark Gray)
- **Text Secondary**: #757575 (Medium Gray)
- **CTA Buttons**: #FF5722 (Orange)

### Typography
- **Font Family**: Roboto
- **Mobile-first**: Responsive font sizes
- **Hierarchy**: Clear distinction between data types

## Features Implementation

### Island Detection
- Uses IP geolocation API for automatic detection
- Falls back to St. Vincent if detection fails
- User selection persists in localStorage

### Data Updates
- **Lottery**: 3x daily (simulated with mock data)
- **Sports**: Every 2-3 hours, live for major games
- **Commodities**: Weekly updates
- **Hotels**: Weekly/monthly updates
- **Events**: Updated by promoters

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

### Responsive Design
- Mobile-first approach
- Stacked cards on mobile
- Multi-column grid on tablets/desktop
- Touch-friendly interface

## Future Enhancements

### Account-Based Features (Post-MVP)
- User registration and login
- Lottery ticket scanning and tracking
- Win notifications
- Mock lottery games
- Community features

### Advanced Features
- Home-sharing platform
- Marketplace for goods sourcing
- Push notifications
- Offline support (PWA)
- Admin dashboard for data management

## Data Sources

### Current (Mock Data)
- All data is currently simulated for development
- Realistic Caribbean-specific content
- Proper data structures for easy API integration

### Production Integration
- **Lottery**: Web scrapers or official APIs
- **Sports**: Sports data feeds
- **Commodities**: Manual admin entry
- **Hotels**: Manual admin entry or booking APIs
- **Events**: Manual promoter submissions

## Deployment

### Recommended Platforms
- **Vercel**: Automatic deployments from Git
- **Netlify**: Static site hosting with forms
- **Firebase Hosting**: Google Cloud integration

### Environment Variables
```bash
# Add to .env file for production
REACT_APP_GEOLOCATION_API_KEY=your_api_key
REACT_APP_SPORTS_API_KEY=your_sports_api_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile and desktop
5. Submit a pull request

## License

Private - All rights reserved

## Support

For technical support or feature requests, please contact the development team.

---

**Today's Numbers** - Connecting the Caribbean, one number at a time! 🏝️🎯