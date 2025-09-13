# Caribbean Lottery Scraper - React Integration Guide

This guide provides detailed instructions for developers integrating the Caribbean Lottery Scraper backend with a React admin dashboard. The scraper system is built with Python/FastAPI and provides both REST API endpoints and WebSocket connections for real-time data updates.

## Backend Architecture Overview

The backend consists of:
- **Python scrapers** that fetch lottery data from Caribbean island sources
- **FastAPI backend** that exposes REST endpoints and WebSocket connections
- **PostgreSQL database** for persistent storage
- **Redis cache** for performance optimization
- **WebSocket manager** for real-time updates

## API Endpoints

### Base URL
```
http://localhost:8000/api/v1
```

### Core Endpoints

1. **Health Check**
   ```
   GET /health
   ```
   Returns system status, database connectivity, and active scraper count.

2. **All Islands Summary**
   ```
   GET /lottery/summary/all
   ```
   Returns latest results for all Caribbean islands in a single request.
   
   Response format:
   ```json
   [
     {
       "island": "Jamaica",
       "operator": "Supreme Ventures",
       "games": [
         {
           "game": "Lotto",
           "numbers": [1, 2, 3, 4, 5, 6],
           "draw_date": "2023-12-01T18:00:00Z",
           "jackpot": 100000.0
         }
       ],
       "last_updated": "2023-12-01T18:05:00Z",
       "total_games": 10
     }
   ]
   ```

3. **Specific Island Latest Results**
   ```
   GET /lottery/latest/{island}
   ```
   Islands: jamaica, barbados, trinidad, grenada, stlucia, dominica, antigua, stkitts, guyana, belize, svg
   
   Response format:
   ```json
   [
     {
       "island": "Jamaica",
       "operator": "Supreme Ventures",
       "game": "Lotto",
       "numbers": [1, 2, 3, 4, 5, 6],
       "draw_date": "2023-12-01T18:00:00Z",
       "jackpot": 100000.0,
       "draw_number": "1234",
       "fetched_at": "2023-12-01T18:05:00Z",
       "approved": true
     }
   ]
   ```

4. **Historical Data**
   ```
   GET /lottery/history/{island}?days=7
   ```
   Returns historical lottery data for a specific island.

5. **Scraper Status**
   ```
   GET /metrics/scraper-status
   ```
   Returns status information for all scrapers.

### Webhook Endpoints

1. **Scraper Data Submission**
   ```
   POST /lottery/webhook/update
   Headers: Authorization: Bearer {WEBHOOK_SECRET_TOKEN}
   ```
   Accepts lottery data from scrapers.

2. **WebSocket Endpoint**
   ```
   WebSocket /ws/lottery-updates
   ```
   Real-time updates for lottery data changes.

## Integration Instructions

### 1. API Service Layer

Create an API service to handle all backend communications:

```javascript
// services/lotteryAPI.js
import axios from 'axios';

class LotteryAPI {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
      timeout: 30000,
    });
  }

  async getAllIslandsSummary() {
    const response = await this.client.get('/lottery/summary/all');
    return response.data;
  }

  async getLatestNumbers(island) {
    const response = await this.client.get(`/lottery/latest/${island}`);
    return response.data;
  }

  async getHistoricalData(island, days = 7) {
    const response = await this.client.get(`/lottery/history/${island}?days=${days}`);
    return response.data;
  }

  async getScraperStatus() {
    const response = await this.client.get('/metrics/scraper-status');
    return response.data;
  }
}

export const lotteryAPI = new LotteryAPI();
```

### 2. WebSocket Integration

Implement WebSocket connection for real-time updates:

```javascript
// hooks/useWebSocket.js
import { useEffect, useRef } from 'react';

export const useWebSocket = (onUpdate) => {
  const wsRef = useRef(null);

  useEffect(() => {
    // Create WebSocket connection
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws/lottery-updates';
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      // Subscribe to all islands
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        islands: ['jamaica', 'barbados', 'svg', 'trinidad', 'grenada', 'stlucia', 'dominica', 'antigua', 'stkitts', 'guyana', 'belize']
      }));
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'lottery_update' && onUpdate) {
          onUpdate(data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (wsRef.current) {
          wsRef.current = new WebSocket(wsUrl);
        }
      }, 5000);
    };

    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [onUpdate]);

  return wsRef.current;
};
```

### 3. React Context for State Management

Create a context provider for managing lottery data:

```javascript
// contexts/LotteryContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { lotteryAPI } from '../services/lotteryAPI';
import { useWebSocket } from '../hooks/useWebSocket';

const LotteryContext = createContext();

const initialState = {
  islands: {},
  loading: false,
  error: null,
  lastUpdated: null,
  scraperStatus: null
};

function lotteryReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ISLANDS':
      return {
        ...state,
        islands: action.payload,
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString()
      };
    case 'UPDATE_ISLAND':
      return {
        ...state,
        islands: {
          ...state.islands,
          [action.payload.island]: action.payload.data
        },
        lastUpdated: new Date().toISOString()
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_SCRAPER_STATUS':
      return { ...state, scraperStatus: action.payload };
    default:
      return state;
  }
}

export const LotteryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(lotteryReducer, initialState);

  const fetchData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await lotteryAPI.getAllIslandsSummary();
      const islandMap = data.reduce((acc, island) => {
        acc[island.island.toLowerCase()] = island;
        return acc;
      }, {});
      dispatch({ type: 'SET_ISLANDS', payload: islandMap });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const fetchScraperStatus = async () => {
    try {
      const status = await lotteryAPI.getScraperStatus();
      dispatch({ type: 'SET_SCRAPER_STATUS', payload: status });
    } catch (error) {
      console.error('Error fetching scraper status:', error);
    }
  };

  // Handle WebSocket updates
  const handleWebSocketUpdate = (data) => {
    dispatch({
      type: 'UPDATE_ISLAND',
      payload: { island: data.island, data: data.data }
    });
  };

  useWebSocket(handleWebSocketUpdate);

  useEffect(() => {
    fetchData();
    fetchScraperStatus();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // 5 minutes
    const statusInterval = setInterval(fetchScraperStatus, 60 * 1000); // 1 minute
    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <LotteryContext.Provider value={{ state, fetchData, dispatch }}>
      {children}
    </LotteryContext.Provider>
  );
};

export const useLottery = () => {
  const context = useContext(LotteryContext);
  if (!context) {
    throw new Error('useLottery must be used within a LotteryProvider');
  }
  return context;
};
```

### 4. Today's Numbers Component

Example component for displaying today's numbers:

```jsx
// components/TodaysNumbers.jsx
import React from 'react';
import { useLottery } from '../contexts/LotteryContext';

const TodaysNumbers = ({ selectedIslands = ['jamaica', 'barbados', 'svg'] }) => {
  const { state, fetchData } = useLottery();
  const { islands, loading, error, lastUpdated } = state;

  const formatCurrency = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getNumberColor = (number, gameType) => {
    if (gameType && gameType.toLowerCase().includes('lotto')) {
      if (number <= 10) return 'red';
      if (number <= 20) return 'blue';
      if (number <= 30) return 'green';
      return 'purple';
    }
    return 'blue';
  };

  if (loading && Object.keys(islands).length === 0) {
    return <div className="loading">Loading lottery numbers...</div>;
  }

  return (
    <div className="todays-numbers">
      <div className="header">
        <h2>Today's Numbers</h2>
        <div className="controls">
          <button onClick={fetchData} disabled={loading} className="refresh-btn">
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          {lastUpdated && (
            <span className="last-updated">
              Updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={fetchData}>Retry</button>
        </div>
      )}

      <div className="islands-grid">
        {selectedIslands.map(islandKey => {
          const island = islands[islandKey];
          
          return (
            <div key={islandKey} className="island-card">
              <div className="island-header">
                <h3>{island?.island || islandKey}</h3>
                {island?.operator && (
                  <span className="operator">{island.operator}</span>
                )}
              </div>

              {island?.games ? (
                <div className="games">
                  {island.games.map((game, idx) => (
                    <div key={idx} className="game">
                      <div className="game-header">
                        <h4>{game.game}</h4>
                        {game.jackpot && (
                          <span className="jackpot">
                            {formatCurrency(game.jackpot)}
                          </span>
                        )}
                      </div>
                      
                      <div className="numbers">
                        {game.numbers.map((number, numIdx) => (
                          <span 
                            key={numIdx} 
                            className={`number-ball ${getNumberColor(number, game.game)}`}
                          >
                            {number}
                          </span>
                        ))}
                      </div>
                      
                      {game.draw_date && (
                        <div className="draw-date">
                          {new Date(game.draw_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No lottery data available</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodaysNumbers;
```

## Environment Variables

Create a `.env` file in your React project root:

```bash
# .env
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_WS_URL=ws://localhost:8000/ws/lottery-updates
```

## Error Handling

Implement proper error boundaries and handling:

```javascript
// components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong with the lottery component.</h2>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

## Data Refresh Strategy

The integration implements multiple data refresh strategies:

1. **Initial Load**: Fetches all data on component mount
2. **Polling**: Automatically refreshes every 5 minutes
3. **Manual Refresh**: User can manually trigger refresh
4. **Real-time Updates**: WebSocket pushes updates as they happen
5. **Scraper Status**: Monitors scraper health every minute

## Security Considerations

1. **API Authentication**: Webhook endpoints require authentication tokens
2. **HTTPS**: All production communications should use HTTPS
3. **Rate Limiting**: Backend implements rate limiting to prevent abuse
4. **Input Validation**: All data is validated before processing

## Performance Optimization

1. **Caching**: Backend uses Redis for frequently accessed data
2. **Pagination**: Historical data endpoints support pagination
3. **Selective Updates**: WebSocket only sends updates for subscribed islands
4. **Efficient Polling**: Polling intervals are optimized for performance

## Troubleshooting

Common issues and solutions:

1. **Connection Refused**: Ensure backend server is running on port 8000
2. **CORS Errors**: Check backend CORS configuration
3. **WebSocket Connection Failed**: Verify WebSocket endpoint URL
4. **No Data Displayed**: Check if scrapers are running and data is being collected
5. **Authentication Errors**: Verify WEBHOOK_SECRET_TOKEN is correctly configured

## Testing

To test the integration:

1. Start the backend server:
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

2. Start the React frontend:
   ```bash
   npm start
   ```

3. Verify data is displayed in the Today's Numbers component
4. Check WebSocket connection in browser developer tools
5. Test manual refresh functionality
6. Verify error handling with backend stopped

This integration guide provides a complete foundation for connecting the Caribbean Lottery Scraper backend with your React admin dashboard.