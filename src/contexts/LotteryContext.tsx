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
      
      // Create different operators for each island
      const operators: { [key: string]: string } = {
        'st-vincent': 'SVG National Lottery',
        'grenada': 'Grenada National Lottery',
        'barbados': 'Barbados Lottery',
        'jamaica': 'Jamaica Lottery',
        'trinidad': 'Trinidad & Tobago Lottery',
        'st-kitts': 'St. Kitts-Nevis Lottery',
        'guyana': 'Guyana Lottery',
        'belize': 'Belize Lottery',
        'antigua': 'Antigua & Barbuda Lottery',
        'st-lucia': 'St. Lucia Lottery',
        'dominica': 'Dominica Lottery'
      };
      
      // For Jamaica, create specific games with correct fields
      let games;
      if (island === 'jamaica') {
        // Create specific games for Jamaica with correct placeholders
        games = [
          {
            id: 'jamaica-cash-pot',
            game: 'Cash Pot',
            numbers: [5],
            draw_date: new Date().toISOString(),
            draw_number: '2025090801',
            draw_time: '08:30',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 1000000) + 100000)
          },
          {
            id: 'jamaica-pick-3',
            game: 'Pick 3',
            numbers: [3, 1, 7],
            draw_date: new Date().toISOString(),
            draw_number: '2025090802',
            draw_time: '10:30',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 50000) + 10000)
          },
          {
            id: 'jamaica-pick-4',
            game: 'Pick 4',
            numbers: [9, 2, 5, 1],
            draw_date: new Date().toISOString(),
            draw_number: '2025090803',
            draw_time: '13:00',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 100000) + 20000)
          },
          {
            id: 'jamaica-lucky-5',
            game: 'Lucky 5',
            numbers: [12, 25, 7, 33, 41],
            draw_date: new Date().toISOString(),
            draw_number: '2025090804',
            draw_time: '20:25',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 2000000) + 500000)
          },
          {
            id: 'jamaica-lotto',
            game: 'Lotto',
            numbers: [11, 23, 45, 9, 30, 5],
            draw_date: new Date().toISOString(),
            draw_number: '20250909-TUE',
            draw_time: '20:30',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 5000000) + 1000000)
          },
          {
            id: 'jamaica-super-lotto',
            game: 'Super Lotto',
            numbers: [8, 19, 33, 42, 27, 6],
            draw_date: new Date().toISOString(),
            draw_number: '20250909-TUE',
            draw_time: '20:30',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 10000000) + 2000000)
          },
          {
            id: 'jamaica-dollaz',
            game: 'Dollaz!',
            numbers: [15, 22, 7],
            draw_date: new Date().toISOString(),
            draw_number: '2025090805',
            draw_time: '15:00',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 500000) + 100000)
          },
          {
            id: 'jamaica-hot-pick',
            game: 'Hot Pick',
            numbers: [14, 28, 3, 37],
            draw_date: new Date().toISOString(),
            draw_number: '2025090806',
            draw_time: '17:00',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 300000) + 50000)
          },
          {
            id: 'jamaica-top-draw',
            game: 'Top Draw',
            numbers: [9, 21, 35, 44, 2],
            draw_date: new Date().toISOString(),
            draw_number: '2025090807',
            draw_time: '18:00',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 400000) + 80000)
          },
          {
            id: 'jamaica-money-time',
            game: 'Money Time',
            numbers: [16, 31, 8, 43, 25, 39],
            draw_date: new Date().toISOString(),
            draw_number: '2025090808',
            draw_time: '19:00',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 800000) + 200000)
          },
          {
            id: 'jamaica-monsta-ball',
            game: 'Monsta Ball',
            numbers: [13, 26, 4, 38, 17],
            draw_date: new Date().toISOString(),
            draw_number: '2025090809',
            draw_time: '20:00',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 1500000) + 300000)
          }
        ];
      } else if (island === 'st-vincent') {
        // Create specific games for St. Vincent & Grenadines matching expected scraper format
        // Updated to match the exact requirements: Super 6, Lotto, 3D, Play 4
        games = [
          {
            id: 'svg-super-6',
            game: 'Super 6',
            numbers: [12, 18, 25, 33, 41, 45],
            draw_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            draw_number: '1234',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 500000) + 50000)
          },
          {
            id: 'svg-lotto',
            game: 'Lotto',
            numbers: [7, 11, 4, 2, 9],
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: '5678',
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 50000) + 10000)
          },
          {
            id: 'svg-3d',
            game: '3D',
            numbers: [4, 8, 2],
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: '9012',
            drawDateFormatted: new Date().toLocaleDateString()
          },
          {
            id: 'svg-play-4',
            game: 'Play 4',
            numbers: [3, 7, 1, 5],
            draw_date: new Date().toISOString().split('T')[0],
            draw_number: '3456',
            drawDateFormatted: new Date().toLocaleDateString()
          }
        ];
      } else {
        // Create multiple games for other islands
        games = [
          {
            id: `${island}-lotto`,
            game: 'National Lotto',
            numbers: Array.from({ length: 6 }, () => Math.floor(Math.random() * 40) + 1),
            draw_date: new Date().toISOString(),
            jackpot: Math.floor(Math.random() * 1000000) + 100000,
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 1000000) + 100000)
          },
          {
            id: `${island}-pick3`,
            game: 'Pick 3',
            numbers: Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)),
            draw_date: new Date().toISOString(),
            jackpot: Math.floor(Math.random() * 50000) + 10000,
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 50000) + 10000)
          },
          {
            id: `${island}-pick4`,
            game: 'Pick 4',
            numbers: Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)),
            draw_date: new Date().toISOString(),
            jackpot: Math.floor(Math.random() * 100000) + 20000,
            drawDateFormatted: new Date().toLocaleDateString(),
            jackpotFormatted: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(Math.floor(Math.random() * 100000) + 20000)
          }
        ];
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
