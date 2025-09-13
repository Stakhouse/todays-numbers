/**
 * Lottery API Service
 * Handles communication with the Python lottery backend
 */
import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface LotteryGame {
  game: string;
  numbers: number[];
  draw_date: string;
  jackpot?: number;
  draw_number?: string;
  draw_time?: string;
}

interface IslandResponse {
  island: string;
  operator?: string;
  games: LotteryGame[];
  last_updated: string;
  total_games: number;
}

interface FormattedLotteryGame extends LotteryGame {
  id: string;
  drawDateFormatted?: string | null;
  jackpotFormatted?: string | null;
}

interface FormattedIslandData {
  id: string;
  island: string;
  displayName: string;
  operator?: string;
  games: FormattedLotteryGame[];
  last_updated: string;
  lastUpdatedFormatted: string;
  total_games: number;
}

class LotteryAPI {
  private client: AxiosInstance;

  constructor() {
    // Use Vite environment variables with fallbacks to React App variables
    const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:8000';
    const apiVersion = import.meta.env.VITE_API_VERSION || import.meta.env.REACT_APP_API_VERSION || 'v1';
    const timeout = parseInt(import.meta.env.VITE_REQUEST_TIMEOUT || import.meta.env.REACT_APP_REQUEST_TIMEOUT || '30000');
    
    this.client = axios.create({
      baseURL: `${apiUrl}/api/${apiVersion}`,
      timeout: timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.config.url} - ${response.status}`);
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error?.response?.data || error.message);
        
        // Handle common errors
        if (error.response?.status === 404) {
          throw new Error('Lottery data not found');
        }
        if (error.response?.status === 500) {
          throw new Error('Server error. Please try again later.');
        }
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Unable to connect to Python scraper backend. Please check if the scraper services are running.');
        }
        
        throw new Error(error?.response?.data?.detail || error.message || 'Unknown error occurred');
      }
    );
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<any> {
    const response: AxiosResponse = await this.client.get('/health');
    return response.data;
  }

  /**
   * Get summary data for all islands
   */
  async getAllIslandsSummary(): Promise<IslandResponse[]> {
    const response: AxiosResponse<IslandResponse[]> = await this.client.get('/lottery/summary/all');
    return response.data;
  }

  /**
   * Get latest lottery numbers for a specific island
   * @param island - Island identifier (e.g., 'jamaica', 'barbados')
   */
  async getLatestNumbers(island: string): Promise<IslandResponse> {
    const response: AxiosResponse<IslandResponse> = await this.client.get(`/lottery/latest/${island.toLowerCase()}`);
    return response.data;
  }

  /**
   * Get historical lottery data for an island
   * @param island - Island identifier
   * @param days - Number of days to look back (default: 7)
   */
  async getHistoricalData(island: string, days: number = 7): Promise<any[]> {
    const response: AxiosResponse = await this.client.get(`/lottery/history/${island.toLowerCase()}?days=${days}`);
    return response.data;
  }

  /**
   * Get Python scraper status and health metrics for all islands
   * Returns connection status, uptime, success rates for each scraper
   */
  async getScraperStatus(): Promise<any> {
    const response: AxiosResponse = await this.client.get('/metrics/scraper-status');
    return response.data;
  }

  /**
   * Get specific game data for an island
   * @param island - Island identifier
   * @param game - Game name
   */
  async getGameData(island: string, game: string): Promise<any> {
    const response: AxiosResponse = await this.client.get(`/lottery/game/${island.toLowerCase()}/${game}`);
    return response.data;
  }

  /**
   * Get lottery statistics
   * @param island - Island identifier (optional)
   * @param days - Days to analyze (optional)
   */
  async getStatistics(island: string | null = null, days: number = 30): Promise<any> {
    let url = `/lottery/statistics?days=${days}`;
    if (island) {
      url += `&island=${island.toLowerCase()}`;
    }
    const response: AxiosResponse = await this.client.get(url);
    return response.data;
  }

  /**
   * Submit manual lottery results (admin feature)
   * @param lotteryData - Lottery result data
   */
  async submitManualResults(lotteryData: any): Promise<any> {
    const response: AxiosResponse = await this.client.post('/lottery/manual-entry', lotteryData);
    return response.data;
  }

  /**
   * Get WebSocket connection status for all islands
   * Admin feature to monitor Python scraper WebSocket connections
   */
  async getWebSocketStatus(): Promise<any> {
    const response: AxiosResponse = await this.client.get('/metrics/websocket-status');
    return response.data;
  }

  /**
   * Restart a specific Python scraper (admin feature)
   * @param island - Island identifier
   */
  async restartScraper(island: string): Promise<any> {
    const response: AxiosResponse = await this.client.post(`/admin/scraper/restart/${island.toLowerCase()}`);
    return response.data;
  }

  /**
   * Get detailed scraper performance metrics
   * @param island - Island identifier (optional)
   * @param hours - Hours to analyze (default: 24)
   */
  async getScraperMetrics(island: string | null = null, hours: number = 24): Promise<any> {
    let url = `/metrics/scraper-performance?hours=${hours}`;
    if (island) {
      url += `&island=${island.toLowerCase()}`;
    }
    const response: AxiosResponse = await this.client.get(url);
    return response.data;
  }

  /**
   * Utility method to format API data for React components
   * @param apiData - Raw API response
   */
  static formatLotteryData(apiData: IslandResponse[]): FormattedIslandData[] {
    if (!Array.isArray(apiData)) return [];
    
    return apiData.map(island => ({
      ...island,
      id: island.island?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
      displayName: island.island || 'Unknown Island',
      lastUpdatedFormatted: island.last_updated 
        ? new Date(island.last_updated).toLocaleString()
        : 'Unknown',
      games: island.games?.map(game => ({
        ...game,
        id: `${island.island}-${game.game}`.toLowerCase().replace(/\s+/g, '-'),
        drawDateFormatted: game.draw_date 
          ? new Date(game.draw_date).toLocaleDateString()
          : null,
        jackpotFormatted: game.jackpot 
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(game.jackpot)
          : null
      })) || []
    }));
  }

  /**
   * Check if Python scraper backend is available
   * Used to determine whether to use live data or fallback to mock data
   */
  async isBackendAvailable(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.warn('Python scraper backend not available:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }
}

// Export singleton instance
export const lotteryAPI = new LotteryAPI();
export default LotteryAPI;
export type { FormattedIslandData, FormattedLotteryGame, IslandResponse, LotteryGame };
