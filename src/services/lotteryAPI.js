/**
 * Lottery API Service
 * Handles communication with the Python lottery backend
 */
import axios from 'axios';

class LotteryAPI {
  constructor() {
    // Use Vite environment variables with fallbacks to React App variables
    const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:8000';
    const apiVersion = import.meta.env.VITE_API_VERSION || import.meta.env.REACT_APP_API_VERSION || 'v1';
    const timeout = parseInt(import.meta.env.VITE_REQUEST_TIMEOUT || import.meta.env.REACT_APP_REQUEST_TIMEOUT) || 30000;
    
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
          throw new Error('Unable to connect to lottery service. Please check if the backend is running.');
        }
        
        throw new Error(error?.response?.data?.detail || error.message || 'Unknown error occurred');
      }
    );
  }

  /**
   * Health check endpoint
   */
  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }

  /**
   * Get summary data for all islands
   */
  async getAllIslandsSummary() {
    const response = await this.client.get('/lottery/summary/all');
    return response.data;
  }

  /**
   * Get latest lottery numbers for a specific island
   * @param {string} island - Island identifier (e.g., 'jamaica', 'barbados')
   */
  async getLatestNumbers(island) {
    const response = await this.client.get(`/lottery/latest/${island.toLowerCase()}`);
    return response.data;
  }

  /**
   * Get historical lottery data for an island
   * @param {string} island - Island identifier
   * @param {number} days - Number of days to look back (default: 7)
   */
  async getHistoricalData(island, days = 7) {
    const response = await this.client.get(`/lottery/history/${island.toLowerCase()}?days=${days}`);
    return response.data;
  }

  /**
   * Get scraper status and metrics
   */
  async getScraperStatus() {
    const response = await this.client.get('/metrics/scraper-status');
    return response.data;
  }

  /**
   * Get specific game data for an island
   * @param {string} island - Island identifier
   * @param {string} game - Game name
   */
  async getGameData(island, game) {
    const response = await this.client.get(`/lottery/game/${island.toLowerCase()}/${game}`);
    return response.data;
  }

  /**
   * Get lottery statistics
   * @param {string} island - Island identifier (optional)
   * @param {number} days - Days to analyze (optional)
   */
  async getStatistics(island = null, days = 30) {
    let url = `/lottery/statistics?days=${days}`;
    if (island) {
      url += `&island=${island.toLowerCase()}`;
    }
    const response = await this.client.get(url);
    return response.data;
  }

  /**
   * Submit manual lottery results (admin feature)
   * @param {Object} lotteryData - Lottery result data
   */
  async submitManualResults(lotteryData) {
    const response = await this.client.post('/lottery/manual-entry', lotteryData);
    return response.data;
  }

  /**
   * Utility method to format API data for React components
   * @param {Array} apiData - Raw API response
   */
  static formatLotteryData(apiData) {
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
   * Check if backend is available
   */
  async isBackendAvailable() {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.warn('Backend not available:', error.message);
      return false;
    }
  }
}

// Export singleton instance
export const lotteryAPI = new LotteryAPI();
export default LotteryAPI;
