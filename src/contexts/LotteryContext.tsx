/**
 * Lottery Context
 * Manages lottery data state across the application
 */
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { lotteryAPI } from '../services/lotteryAPI';
import LotteryAPI, { FormattedIslandData } from '../services/lotteryAPI';
import { useWebSocket } from '../hooks/useWebSocket';

// Types imported from API service

// Use FormattedIslandData from the API service
type IslandData = FormattedIslandData;

interface LotteryState {
  islands: { [key: string]: IslandData };
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  backendConnected: boolean;
  refreshing: boolean;
}

interface LotteryContextType {
  state: LotteryState;
  actions: {
    fetchAllData: () => Promise<void>;
    fetchIslandData: (island: string) => Promise<void>;
    refreshData: () => Promise<void>;
    clearError: () => void;
    checkBackendStatus: () => Promise<boolean>;
  };
}

// Action types
type LotteryAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_REFRESHING'; payload: boolean }
  | { type: 'SET_ISLANDS'; payload: { [key: string]: IslandData } }
  | { type: 'UPDATE_ISLAND'; payload: { island: string; data: IslandData } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BACKEND_STATUS'; payload: boolean }
  | { type: 'SET_LAST_UPDATED'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: LotteryState = {
  islands: {},
  loading: false,
  error: null,
  lastUpdated: null,
  backendConnected: false,
  refreshing: false,
};

// Reducer
function lotteryReducer(state: LotteryState, action: LotteryAction): LotteryState {
  switch (action.type) {
    case 'SET_LOADING':
      return { 
        ...state, 
        loading: action.payload,
        error: action.payload ? null : state.error // Clear error when starting new load
      };
    
    case 'SET_REFRESHING':
      return { ...state, refreshing: action.payload };
    
    case 'SET_ISLANDS':
      return {
        ...state,
        islands: action.payload,
        loading: false,
        refreshing: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      };
    
    case 'UPDATE_ISLAND':
      return {
        ...state,
        islands: {
          ...state.islands,
          [action.payload.island]: action.payload.data,
        },
        lastUpdated: new Date().toISOString(),
      };
    
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.payload, 
        loading: false,
        refreshing: false
      };
    
    case 'SET_BACKEND_STATUS':
      return { ...state, backendConnected: action.payload };
    
    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
}

// Context
const LotteryContext = createContext<LotteryContextType | undefined>(undefined);

// Provider component
interface LotteryProviderProps {
  children: ReactNode;
}

export const LotteryProvider: React.FC<LotteryProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(lotteryReducer, initialState);

  // Handle WebSocket updates
  const handleWebSocketUpdate = (data: any) => {
    if (data.type === 'lottery_update') {
      const formattedData = LotteryAPI.formatLotteryData([data.data]);
      if (formattedData.length > 0) {
        dispatch({
          type: 'UPDATE_ISLAND',
          payload: { island: data.island, data: formattedData[0] }
        });
      }
    }
  };

  // Initialize WebSocket connection
  useWebSocket(import.meta.env.VITE_WS_URL || import.meta.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws/lottery-updates', {
    onUpdate: handleWebSocketUpdate,
    onConnect: () => {
      console.log('WebSocket connected to lottery updates');
      dispatch({ type: 'SET_BACKEND_STATUS', payload: true });
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected from lottery updates');
      // Don't set backend status to false immediately as we might reconnect
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
    }
  });

  // Check if mock data should be used
  const shouldUseMockData = () => {
    const enableMock = import.meta.env.VITE_ENABLE_MOCK_DATA || import.meta.env.REACT_APP_ENABLE_MOCK_DATA;
    return enableMock === 'true' && !state.backendConnected;
  };

  // Mock data fallback
  const getMockData = (): { [key: string]: IslandData } => {
    // All 11 supported Caribbean islands
    const mockIslands = [
      'st-vincent',
      'grenada',
      'barbados',
      'jamaica',
      'trinidad',
      'st-kitts',
      'guyana',
      'belize',
      'antigua',
      'st-lucia',
      'dominica'
    ];
    
    const mockData: { [key: string]: IslandData } = {};

    mockIslands.forEach(island => {
      // Create more realistic island names
      const islandNames: { [key: string]: string } = {
        'st-vincent': 'St. Vincent & Grenadines',
        'grenada': 'Grenada',
        'barbados': 'Barbados',
        'jamaica': 'Jamaica',
        'trinidad': 'Trinidad & Tobago',
        'st-kitts': 'St. Kitts & Nevis',
        'guyana': 'Guyana',
        'belize': 'Belize',
        'antigua': 'Antigua & Barbuda',
        'st-lucia': 'St. Lucia',
        'dominica': 'Dominica'
      };
      
      // Enhanced operators with accurate names from NextTask.md
      const operators: { [key: string]: string } = {
        'st-vincent': 'NLASVG / SVG Lottery',
        'grenada': 'NLA Grenada',
        'barbados': 'Barbados Lottery / mybarbadoslottery.com',
        'jamaica': 'Supreme Ventures / Jamaican Lottery',
        'trinidad': 'NLCB / Play Whe',
        'st-kitts': 'Saint Kitts & Nevis Lottery',
        'guyana': 'Guyana Lottery / National Lottery',
        'belize': 'Belize Government Lotteries / lotteries.bz',
        'antigua': 'Antigua & Barbuda Local Lottery',
        'st-lucia': 'St Lucia National Lottery',
        'dominica': 'DomLottery / Dominica National Lottery'
      };
      
      // For Jamaica, create specific games with correct fields based on NextTask.md
      let games;
      if (island === 'jamaica') {
        // Jamaica games with accurate draw times from Supreme Ventures
        games = [
          {
            id: 'jamaica-lotto',
            game: 'Lotto',
            numbers: [11, 23, 45, 9, 30, 5, 12], // Last number is bonus
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: 'LOTTO-WED-001',
            draw_time: 'Wednesday 20:25',
            frequency: 'Twice weekly',
            draw_times: ['Wednesday 20:25', 'Saturday 20:25'],
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'JMD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 50000000) + 10000000)
          },
          {
            id: 'jamaica-super-lotto',
            game: 'Super Lotto',
            numbers: [8, 19, 33, 42, 27, 6],
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: 'SLOTTO-TUE-001',
            draw_time: 'Tuesday 20:30',
            frequency: 'Twice weekly',
            draw_times: ['Tuesday 20:30', 'Friday 20:30'],
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'JMD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 100000000) + 20000000)
          },
          // Multi-draw Pick games with 5 daily draws
          {
            id: 'jamaica-pick-4-morning',
            game: 'Pick 4',
            numbers: [9, 2, 5, 1],
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: 'P4-08:30-001',
            draw_time: '08:30',
            frequency: '5 draws/day',
            draw_times: ['08:30', '10:30', '13:00', '17:00', '20:25'],
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'JMD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 500000) + 100000)
          },
          {
            id: 'jamaica-pick-3-morning',
            game: 'Pick 3',
            numbers: [3, 1, 7],
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: 'P3-08:30-001',
            draw_time: '08:30',
            frequency: '5 draws/day',
            draw_times: ['08:30', '10:30', '13:00', '17:00', '20:25'],
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'JMD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 250000) + 50000)
          },
          {
            id: 'jamaica-pick-2-morning',
            game: 'Pick 2',
            numbers: [4, 8],
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: 'P2-08:30-001',
            draw_time: '08:30',
            frequency: 'Daily',
            draw_times: ['08:30', '10:30', '13:00', '17:00', '20:25'],
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'JMD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 100000) + 25000)
          },
          {
            id: 'jamaica-cash-pot',
            game: 'Cash Pot',
            numbers: [5],
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: 'CP-DAILY-001',
            draw_time: 'Daily',
            frequency: 'Daily',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'JMD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 1000000) + 200000)
          },
          {
            id: 'jamaica-lucky-5',
            game: 'Lucky 5',
            numbers: [12, 25, 7, 33, 41],
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: 'L5-DAILY-001',
            draw_time: 'Daily',
            frequency: 'Daily',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'JMD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 2000000) + 500000)
          },
          {
            id: 'jamaica-top-draw',
            game: 'Top Draw',
            numbers: [9, 21, 35, 44, 2],
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: 'TD-MULTI-001',
            draw_time: 'Multiple draws/day',
            frequency: 'Multiple draws/day',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'JMD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 400000) + 80000)
          },
          {
            id: 'jamaica-dollaz',
            game: 'Dollaz!',
            numbers: [15, 22, 7],
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: 'DZ-VAR-001',
            draw_time: 'Variable',
            frequency: 'Variable',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'JMD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 500000) + 100000)
          },
          {
            id: 'jamaica-hot-pick',
            game: 'Hot Pick',
            numbers: [14],
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: 'HP-DAILY-001',
            draw_time: 'Daily',
            frequency: 'Daily',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'JMD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 300000) + 50000)
          },
          {
            id: 'jamaica-money-time',
            game: 'Money Time / Monsta Ball',
            numbers: [16, 31, 8, 43, 25, 39],
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: 'MT-PROMO-001',
            draw_time: 'Promotional / occasional',
            frequency: 'Promotional / occasional',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'JMD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 5000000) + 1000000)
          }
        ];
      } else if (island === 'st-vincent') {
        // St. Vincent & Grenadines games with enhanced draw times from NextTask.md
        games = [
          {
            id: 'svg-lotto',
            game: 'Lotto',
            numbers: [7, 11, 4, 2, 9, 15], // Last number is bonus
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: 'SVG-LOTTO-TUE-001',
            draw_time: 'Tuesday 21:00',
            frequency: 'Twice weekly',
            draw_times: ['Tuesday 21:00', 'Friday 21:00'],
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'XCD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 1000000) + 200000)
          },
          {
            id: 'svg-super-6',
            game: 'Super 6',
            numbers: [12, 18, 25, 33, 41, 45],
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: 'SVG-S6-TUE-001',
            draw_time: 'Tuesday 21:00',
            frequency: 'Twice weekly',
            draw_times: ['Tuesday 21:00', 'Friday 21:00'],
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'XCD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 500000) + 100000)
          },
          {
            id: 'svg-3d-day',
            game: '3D',
            numbers: [4, 8, 2],
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: 'SVG-3D-DAY-001',
            draw_time: 'Day',
            frequency: 'Multiple draws/day',
            draw_times: ['Day', 'Night'],
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'XCD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 25000) + 5000)
          },
          {
            id: 'svg-play-4-day',
            game: 'Play 4',
            numbers: [3, 7, 1, 5],
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: 'SVG-P4-DAY-001',
            draw_time: 'Day',
            frequency: 'Multiple draws/day',
            draw_times: ['Day', 'Night'],
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'XCD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 50000) + 10000)
          }
        ];
      } else {
        // Create island-specific games based on NextTask.md data
        if (island === 'trinidad') {
          games = [
            {
              id: 'trinidad-play-whe',
              game: 'Play Whe',
              numbers: [12], // Traditional Play Whe format - number only for TypeScript compatibility
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'PW-1030-001',
              draw_time: '10:30',
              frequency: 'Mon-Sat',
              draw_times: ['10:30', '13:00', '16:00', '19:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'TTD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 100000) + 20000),
              // Add custom field for Play Whe symbol representation
              playWheSymbol: 'Crab'
            },
            {
              id: 'trinidad-pick-2',
              game: 'Pick 2',
              numbers: [4, 7],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'P2-1030-001',
              draw_time: '10:30',
              frequency: 'Mon-Sat',
              draw_times: ['10:30', '13:00', '16:00', '19:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'TTD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 25000) + 5000)
            },
            {
              id: 'trinidad-pick-4',
              game: 'Pick 4',
              numbers: [8, 1, 5, 3],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'P4-1030-001',
              draw_time: '10:30',
              frequency: 'Mon-Sat',
              draw_times: ['10:30', '13:00', '16:00', '19:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'TTD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 75000) + 15000)
            },
            {
              id: 'trinidad-cash-pot',
              game: 'Cash Pot',
              numbers: [7],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'CP-VAR-001',
              draw_time: 'Variable',
              frequency: 'Variable',
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'TTD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 200000) + 40000)
            },
            {
              id: 'trinidad-win-for-life',
              game: 'Win for Life / Lotto Plus',
              numbers: [5, 12, 18, 24, 31, 37],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'WFL-SPEC-001',
              draw_time: 'Specific days',
              frequency: 'Specific days',
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'TTD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 1000000) + 200000)
            }
          ];
        } else if (island === 'st-lucia') {
          games = [
            {
              id: 'st-lucia-super-6',
              game: 'Super 6',
              numbers: [11, 25, 31, 38, 42, 47],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'SL-S6-TUE-001',
              draw_time: 'Tue 13:30',
              frequency: 'Twice weekly',
              draw_times: ['Tue 13:30', 'Fri 13:30'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 500000) + 100000)
            },
            {
              id: 'st-lucia-pick-2',
              game: 'Pick 2',
              numbers: [6, 9],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'SL-P2-0930-001',
              draw_time: '09:30',
              frequency: 'Mon-Sat 3 draws/day',
              draw_times: ['09:30', '13:30', '21:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 25000) + 5000)
            },
            {
              id: 'st-lucia-lucky-3',
              game: 'Lucky 3',
              numbers: [2, 7, 4],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'SL-L3-0930-001',
              draw_time: '09:30',
              frequency: 'Mon-Sat 3 draws/day',
              draw_times: ['09:30', '13:30', '21:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 30000) + 8000)
            },
            {
              id: 'st-lucia-big-4',
              game: 'Big 4',
              numbers: [3, 8, 1, 6],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'SL-B4-0930-001',
              draw_time: '09:30',
              frequency: 'Mon-Sat 3 draws/day',
              draw_times: ['09:30', '13:30', '21:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 50000) + 12000)
            },
            {
              id: 'st-lucia-power-play',
              game: 'Power Play',
              numbers: [7, 14, 21, 28, 35],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'SL-PP-WEEK-001',
              draw_time: 'Weekly / special draws',
              frequency: 'Weekly / special draws',
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 100000) + 25000)
            }
          ];
        } else if (island === 'barbados') {
          games = [
            {
              id: 'barbados-super-lotto',
              game: 'Super Lotto',
              numbers: [9, 18, 27, 33, 41, 45],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'BB-SL-EVE-001',
              draw_time: 'Evening (~21:00)',
              frequency: 'Twice weekly',
              draw_times: ['Evening (~21:00)'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'BBD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 2000000) + 400000)
            },
            {
              id: 'barbados-mega-6',
              game: 'Mega 6',
              numbers: [5, 12, 23, 35, 42, 48],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'BB-M6-TUE-001',
              draw_time: 'Tue ~20:00',
              frequency: 'Multiple per week',
              draw_times: ['Tue ~20:00', 'Thu ~20:00', 'Fri ~20:00', 'Sat ~20:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'BBD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 1000000) + 200000)
            },
            {
              id: 'barbados-pick-3',
              game: 'Pick 3',
              numbers: [7, 2, 9],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'BB-P3-1000-001',
              draw_time: '10:00',
              frequency: '4 draws/day',
              draw_times: ['10:00', '13:00', '18:00', '21:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'BBD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 25000) + 5000)
            },
            {
              id: 'barbados-pick-4',
              game: 'Pick 4',
              numbers: [4, 1, 8, 3],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'BB-P4-1000-001',
              draw_time: '10:00',
              frequency: '4 draws/day',
              draw_times: ['10:00', '13:00', '18:00', '21:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'BBD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 50000) + 10000)
            },
            {
              id: 'barbados-double-draw',
              game: 'Double Draw',
              numbers: [6, 9, 3],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'BB-DD-1227-001',
              draw_time: '12:27',
              frequency: 'Daily multiple draws',
              draw_times: ['12:27', '16:45', '18:53', '21:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'BBD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 75000) + 15000)
            }
          ];
        } else if (island === 'grenada') {
          games = [
            {
              id: 'grenada-daily-cash-4',
              game: 'Daily Cash 4',
              numbers: [7, 3, 9, 2],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'GR-DC4-MID-001',
              draw_time: 'Midday',
              frequency: 'Mon-Sat 2 draws/day',
              draw_times: ['Midday', 'Evening'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 25000) + 5000)
            },
            {
              id: 'grenada-daily-pick-3',
              game: 'Daily Pick 3',
              numbers: [5, 1, 8],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'GR-DP3-MID-001',
              draw_time: 'Midday',
              frequency: 'Mon-Sat 2 draws/day',
              draw_times: ['Midday', 'Evening'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 15000) + 3000)
            },
            {
              id: 'grenada-lotto',
              game: 'Lotto',
              numbers: [12, 25, 31, 7, 18, 33],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'GR-LOTTO-001',
              draw_time: 'Scheduled draws',
              frequency: 'Scheduled draws',
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 500000) + 100000)
            },
            {
              id: 'grenada-super-6',
              game: 'Super 6',
              numbers: [4, 11, 23, 29, 35, 41],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'GR-S6-001',
              draw_time: 'Twice weekly',
              frequency: 'Twice weekly',
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 300000) + 75000)
            }
          ];
        } else if (island === 'dominica') {
          games = [
            {
              id: 'dominica-play-4',
              game: 'Play 4',
              numbers: [6, 2, 8, 1],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'DOM-P4-MORN-001',
              draw_time: 'Morning',
              frequency: 'Mon-Sat',
              draw_times: ['Morning', 'Midday', 'Evening'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 50000) + 10000)
            },
            {
              id: 'dominica-daily-3',
              game: 'Daily 3',
              numbers: [4, 7, 3],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'DOM-D3-DAY-001',
              draw_time: 'Day',
              frequency: 'Mon-Sat twice/day',
              draw_times: ['Day', 'Night'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 25000) + 5000)
            },
            {
              id: 'dominica-big-4',
              game: 'Big 4',
              numbers: [9, 1, 5, 7],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'DOM-B4-001',
              draw_time: 'Mon-Sat',
              frequency: 'Mon-Sat',
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 75000) + 15000)
            },
            {
              id: 'dominica-pick-2',
              game: 'Pick 2',
              numbers: [3, 8],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'DOM-P2-001',
              draw_time: 'Mon-Sat',
              frequency: 'Mon-Sat',
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 15000) + 3000)
            },
            {
              id: 'dominica-1-off',
              game: '1-Off',
              numbers: [2],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'DOM-1OFF-001',
              draw_time: 'Varies / specialty',
              frequency: 'Varies / specialty',
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 10000) + 2000)
            },
            {
              id: 'dominica-super-6',
              game: 'Super 6',
              numbers: [11, 18, 25, 32, 39, 45],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'DOM-S6-001',
              draw_time: 'Twice weekly',
              frequency: 'Twice weekly',
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 200000) + 50000)
            }
          ];
        } else if (island === 'antigua') {
          games = [
            {
              id: 'antigua-super-lotto',
              game: 'Super Lotto',
              numbers: [5, 12, 19, 26, 33, 41],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'ANT-SL-TUE-001',
              draw_time: '~21:00',
              frequency: 'Weekly / Tue & Fri (check local)',
              draw_times: ['~21:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 1637500) + 500000)
            },
            {
              id: 'antigua-lucky-pick',
              game: 'Lucky Pick',
              numbers: [7, 14, 21, 28],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'ANT-LP-EVE-001',
              draw_time: 'Evening',
              frequency: 'Daily (evening)',
              draw_times: ['Evening'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 50000) + 10000)
            },
            {
              id: 'antigua-pick-3',
              game: 'Pick 3',
              numbers: [2, 8, 5],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'ANT-P3-001',
              draw_time: 'Multiple daily draws',
              frequency: 'Multiple daily draws',
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 25000) + 5000)
            },
            {
              id: 'antigua-pick-4',
              game: 'Pick 4',
              numbers: [1, 6, 3, 9],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'ANT-P4-001',
              draw_time: 'Multiple daily draws',
              frequency: 'Multiple daily draws',
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 75000) + 15000)
            }
          ];
        } else if (island === 'guyana') {
          games = [
            {
              id: 'guyana-lotto-supa-6',
              game: 'Lotto Supa 6',
              numbers: [8, 15, 22, 29, 36, 42],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'GUY-LS6-WED-001',
              draw_time: 'Wednesday 19:05',
              frequency: 'Twice weekly',
              draw_times: ['Wednesday 19:05', 'Saturday 19:05'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'GYD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 5000000) + 1000000)
            },
            {
              id: 'guyana-daily-millions',
              game: 'Daily Millions',
              numbers: [3, 17, 24, 31, 38],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'GUY-DM-2100-001',
              draw_time: '21:00',
              frequency: 'Daily',
              draw_times: ['21:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'GYD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 2000000) + 500000)
            },
            {
              id: 'guyana-lucky-3',
              game: 'Lucky 3',
              numbers: [6, 1, 9],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'GUY-L3-1905-001',
              draw_time: '19:05',
              frequency: 'Daily',
              draw_times: ['19:05'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'GYD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 100000) + 20000)
            },
            {
              id: 'guyana-pick-2',
              game: 'Pick 2',
              numbers: [4, 7],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'GUY-P2-AFT-001',
              draw_time: 'Afternoon / Evening',
              frequency: 'Daily',
              draw_times: ['Afternoon / Evening'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'GYD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 50000) + 10000)
            },
            {
              id: 'guyana-super-pay-day',
              game: 'Super Pay Day / Pay Day',
              numbers: [11, 23, 35, 41],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'GUY-SPD-FRI-001',
              draw_time: 'Fridays / weekly specials',
              frequency: 'Fridays / weekly specials',
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'GYD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 1000000) + 200000)
            }
          ];
        } else if (island === 'belize') {
          games = [
            {
              id: 'belize-boledo',
              game: 'Boledo',
              numbers: [7, 14, 21],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'BZ-BOL-2110-001',
              draw_time: '21:10',
              frequency: 'Daily',
              draw_times: ['21:10'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'BZD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 25000) + 5000)
            },
            {
              id: 'belize-pick-3',
              game: 'Pick 3',
              numbers: [2, 8, 5],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'BZ-P3-2000-001',
              draw_time: '20:00',
              frequency: 'Daily',
              draw_times: ['20:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'BZD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 15000) + 3000)
            },
            {
              id: 'belize-fantasy-5',
              game: 'Fantasy 5',
              numbers: [9, 16, 23, 31, 38],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'BZ-F5-TUE-001',
              draw_time: '20:00',
              frequency: 'Tue, Thu, Sat',
              draw_times: ['20:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'BZD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 100000) + 20000)
            },
            {
              id: 'belize-sunday-lottery',
              game: 'Sunday Lottery',
              numbers: [4, 12, 19, 27, 34, 41],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'BZ-SL-SUN-001',
              draw_time: 'Sunday 12:00',
              frequency: 'Weekly',
              draw_times: ['Sunday 12:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'BZD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 200000) + 50000)
            }
          ];
        } else if (island === 'st-kitts') {
          games = [
            {
              id: 'st-kitts-super-lotto',
              game: 'Super Lotto',
              numbers: [6, 13, 20, 27, 34, 41],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'SK-SL-TUE-001',
              draw_time: 'Tuesday 20:00',
              frequency: 'Twice weekly',
              draw_times: ['Tuesday 20:00', 'Friday 20:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 500000) + 100000)
            },
            {
              id: 'st-kitts-lucky-pick',
              game: 'Lucky Pick',
              numbers: [8, 15, 22, 29],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'SK-LP-2000-001',
              draw_time: '20:00',
              frequency: 'Daily (evening)',
              draw_times: ['20:00'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 50000) + 10000)
            },
            {
              id: 'st-kitts-pick-3',
              game: 'Pick 3',
              numbers: [3, 7, 1],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'SK-P3-MORN-001',
              draw_time: 'Morning',
              frequency: 'Multiple draws/day',
              draw_times: ['Morning', 'Evening'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 25000) + 5000)
            },
            {
              id: 'st-kitts-pick-4',
              game: 'Pick 4',
              numbers: [5, 2, 9, 6],
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: 'SK-P4-MORN-001',
              draw_time: 'Morning',
              frequency: 'Multiple draws/day',
              draw_times: ['Morning', 'Evening'],
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XCD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 75000) + 15000)
            }
          ];
        } else {
          // Final fallback for any unhandled islands
          games = [
            {
              id: `${island}-default-lotto`,
              game: 'Lotto',
              numbers: Array.from({ length: 6 }, () => Math.floor(Math.random() * 40) + 1),
              draw_date: new Date().toISOString().split('T')[0],
              draw_number: `${island.toUpperCase()}-DEFAULT-001`,
              draw_time: 'Weekly',
              frequency: 'Weekly',
              drawDateFormatted: new Date().toLocaleDateString(),
              jackpotFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
              }).format(Math.floor(Math.random() * 100000) + 20000)
            }
          ];
        }
      }

      mockData[island] = {
        id: island,
        island: islandNames[island] || island.charAt(0).toUpperCase() + island.slice(1),
        displayName: islandNames[island] || island.charAt(0).toUpperCase() + island.slice(1),
        operator: operators[island] || 'National Lottery',
        games: games,
        last_updated: new Date().toISOString(),
        lastUpdatedFormatted: new Date().toLocaleString(),
        total_games: games.length
      };
    });

    return mockData;
  };

  // Check backend status
  const checkBackendStatus = async (): Promise<boolean> => {
    try {
      const isAvailable = await lotteryAPI.isBackendAvailable();
      dispatch({ type: 'SET_BACKEND_STATUS', payload: isAvailable });
      return isAvailable;
    } catch (error) {
      console.warn('Backend status check failed:', error);
      dispatch({ type: 'SET_BACKEND_STATUS', payload: false });
      return false;
    }
  };

  // Fetch all islands data
  const fetchAllData = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // First check if backend is available
      const backendAvailable = await checkBackendStatus();
      
      if (!backendAvailable && shouldUseMockData()) {
        console.log('🎭 Using mock data - backend not available');
        const mockData = getMockData();
        dispatch({ type: 'SET_ISLANDS', payload: mockData });
        return;
      }

      if (!backendAvailable) {
        throw new Error('Backend service is not available');
      }

      // Fetch real data
      const data = await lotteryAPI.getAllIslandsSummary();
      const formattedData = LotteryAPI.formatLotteryData(data);
      
      // Convert array to object keyed by island ID
      const islandMap = formattedData.reduce((acc: { [key: string]: IslandData }, island: IslandData) => {
        acc[island.id] = island;
        return acc;
      }, {} as { [key: string]: IslandData });

      dispatch({ type: 'SET_ISLANDS', payload: islandMap });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to fetch lottery data:', errorMessage);
      
      // Use mock data as fallback if enabled
      if (shouldUseMockData()) {
        console.log('🎭 Falling back to mock data due to error');
        const mockData = getMockData();
        dispatch({ type: 'SET_ISLANDS', payload: mockData });
      } else {
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
    }
  };

  // Fetch specific island data
  const fetchIslandData = async (island: string): Promise<void> => {
    try {
      if (!state.backendConnected) {
        throw new Error('Backend not connected');
      }

      const data = await lotteryAPI.getLatestNumbers(island);
      const formattedData = LotteryAPI.formatLotteryData([data]);
      
      if (formattedData.length > 0) {
        dispatch({ 
          type: 'UPDATE_ISLAND', 
          payload: { 
            island: island.toLowerCase(), 
            data: formattedData[0] 
          } 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch island data';
      console.error(`Failed to fetch data for ${island}:`, errorMessage);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  // Refresh data
  const refreshData = async (): Promise<void> => {
    dispatch({ type: 'SET_REFRESHING', payload: true });
    await fetchAllData();
  };

  // Clear error
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Auto-refresh setup
  useEffect(() => {
    // Initial data fetch
    fetchAllData();

    // Set up auto-refresh if enabled
    const refreshInterval = parseInt(import.meta.env.VITE_REFRESH_INTERVAL || import.meta.env.REACT_APP_REFRESH_INTERVAL || '300000');
    
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        if (!state.loading && !state.refreshing) {
          refreshData();
        }
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, []);

  // Context value
  const contextValue: LotteryContextType = {
    state,
    actions: {
      fetchAllData,
      fetchIslandData,
      refreshData,
      clearError,
      checkBackendStatus,
    },
  };

  return (
    <LotteryContext.Provider value={contextValue}>
      {children}
    </LotteryContext.Provider>
  );
};

// Custom hook to use lottery context
export const useLottery = (): LotteryContextType => {
  const context = useContext(LotteryContext);
  if (!context) {
    throw new Error('useLottery must be used within a LotteryProvider');
  }
  return context;
};

// Export types for use in other components
export type { LotteryState, IslandData };
