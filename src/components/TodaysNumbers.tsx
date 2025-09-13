import React from 'react';
import './TodaysNumbers.css';
import { useLottery } from '../contexts/LotteryContext';

interface TodaysNumbersProps {
  selectedIslands?: string[];
}

const TodaysNumbers: React.FC<TodaysNumbersProps> = ({ selectedIslands = ['jamaica', 'barbados', 'svg'] }) => {
  const { state, actions } = useLottery();
  const { islands, loading, error, lastUpdated } = state;

  const formatCurrency = (amount: number) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getNumberColor = (number: number, gameType: string) => {
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
          <button onClick={() => actions.refreshData()} disabled={loading} className="refresh-btn">
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
          <button onClick={() => actions.fetchAllData()}>Retry</button>
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
                  {island.games.slice(0, 2).map((game: any, idx: number) => (
                    <div key={idx} className="game">
                      <div className="game-header">
                        <h4>{game.game}</h4>
                        {game.jackpot && (
                          <span className="jackpot">
                            {formatCurrency(game.jackpot)}
                          </span>
                        )}
                        {game.jackpotFormatted && (
                          <span className="jackpot">
                            {game.jackpotFormatted}
                          </span>
                        )}
                      </div>
                      
                      {/* Display draw information for Jamaica games */}
                      <div className="draw-info">
                        {game.draw_date && (
                          <div className="draw-date">
                            Date: {new Date(game.draw_date).toLocaleDateString()}
                          </div>
                        )}
                        {game.draw_time && (
                          <div className="draw-time">
                            Time: {game.draw_time}
                          </div>
                        )}
                        {game.draw_number && (
                          <div className="draw-number">
                            Draw #: {game.draw_number}
                          </div>
                        )}
                      </div>
                      
                      <div className="numbers">
                        {game.numbers.map((number: number, numIdx: number) => (
                          <span 
                            key={numIdx} 
                            className={`number-ball ${getNumberColor(number, game.game)}`}
                          >
                            {number}
                          </span>
                        ))}
                      </div>
                      
                      {/* Display pending message if fields are missing */}
                      {!game.draw_date && !game.draw_time && !game.draw_number && game.numbers.length === 0 && (
                        <div className="pending">Pending</div>
                      )}
                    </div>
                  ))}
                  
                  {island.games.length > 2 && (
                    <div className="view-more">
                      +{island.games.length - 2} more games available
                    </div>
                  )}
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