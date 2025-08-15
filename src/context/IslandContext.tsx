import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Island {
  id: string;
  name: string;
  flag: string;
}

export const ISLANDS: Island[] = [
  { id: 'st-vincent', name: 'St. Vincent & Grenadines', flag: '🇻🇨' },
  { id: 'st-lucia', name: 'St. Lucia', flag: '🇱🇨' },
  { id: 'dominica', name: 'Dominica', flag: '🇩🇲' },
  { id: 'grenada', name: 'Grenada', flag: '🇬🇩' },
  { id: 'trinidad', name: 'Trinidad & Tobago', flag: '🇹🇹' },
];

interface IslandContextType {
  currentIsland: Island;
  setCurrentIsland: (island: Island) => void;
  isLoading: boolean;
}

const IslandContext = createContext<IslandContextType | undefined>(undefined);

export const useIsland = () => {
  const context = useContext(IslandContext);
  if (context === undefined) {
    throw new Error('useIsland must be used within an IslandProvider');
  }
  return context;
};

interface IslandProviderProps {
  children: ReactNode;
}

// Simple island detection based on common Caribbean IP ranges
// In production, this would use a proper geolocation service
const detectUserIsland = async (): Promise<Island> => {
  try {
    // Simulate island detection - in real app, use IP geolocation service
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    // Map country codes to islands
    const countryToIsland: { [key: string]: string } = {
      'VC': 'st-vincent',
      'LC': 'st-lucia',
      'DM': 'dominica',
      'GD': 'grenada',
      'TT': 'trinidad',
    };
    
    const detectedIslandId = countryToIsland[data.country_code];
    if (detectedIslandId) {
      const island = ISLANDS.find(i => i.id === detectedIslandId);
      if (island) return island;
    }
  } catch (error) {
    console.log('Island detection failed, using default');
  }
  
  // Default to St. Vincent if detection fails
  return ISLANDS[0];
};

export const IslandProvider: React.FC<IslandProviderProps> = ({ children }) => {
  const [currentIsland, setCurrentIsland] = useState<Island>(ISLANDS[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeIsland = async () => {
      // Check if user has previously selected an island
      const savedIslandId = localStorage.getItem('selectedIsland');
      if (savedIslandId) {
        const savedIsland = ISLANDS.find(i => i.id === savedIslandId);
        if (savedIsland) {
          setCurrentIsland(savedIsland);
          setIsLoading(false);
          return;
        }
      }

      // Auto-detect user's island
      try {
        const detectedIsland = await detectUserIsland();
        setCurrentIsland(detectedIsland);
      } catch (error) {
        console.error('Failed to detect island:', error);
        // Keep default island (St. Vincent)
      }
      setIsLoading(false);
    };

    initializeIsland();
  }, []);

  const handleSetCurrentIsland = (island: Island) => {
    setCurrentIsland(island);
    localStorage.setItem('selectedIsland', island.id);
  };

  return (
    <IslandContext.Provider
      value={{
        currentIsland,
        setCurrentIsland: handleSetCurrentIsland,
        isLoading,
      }}
    >
      {children}
    </IslandContext.Provider>
  );
};