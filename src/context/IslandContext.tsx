import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Island {
  id: string;
  name: string;
  flag: string;
  country_code: string;
  timezone: string;
  currency: string;
  region: string;
  population?: number;
}

export const ISLANDS: Island[] = [
  { 
    id: 'st-vincent', 
    name: 'St. Vincent & Grenadines', 
    flag: '🇻🇨', 
    country_code: 'VC', 
    timezone: 'America/St_Vincent', 
    currency: 'XCD', 
    region: 'Windward Islands',
    population: 110000
  },
  { 
    id: 'grenada', 
    name: 'Grenada', 
    flag: '🇬🇩', 
    country_code: 'GD', 
    timezone: 'America/Grenada', 
    currency: 'XCD', 
    region: 'Windward Islands',
    population: 112000
  },
  { 
    id: 'barbados', 
    name: 'Barbados', 
    flag: '🇧🇧', 
    country_code: 'BB', 
    timezone: 'America/Barbados', 
    currency: 'BBD', 
    region: 'Lesser Antilles',
    population: 287000
  },
  { 
    id: 'jamaica', 
    name: 'Jamaica', 
    flag: '🇯🇲', 
    country_code: 'JM', 
    timezone: 'America/Jamaica', 
    currency: 'JMD', 
    region: 'Greater Antilles',
    population: 2961000
  },
  { 
    id: 'trinidad', 
    name: 'Trinidad & Tobago', 
    flag: '🇹🇹', 
    country_code: 'TT', 
    timezone: 'America/Port_of_Spain', 
    currency: 'TTD', 
    region: 'Lesser Antilles',
    population: 1399000
  },
  { 
    id: 'st-kitts', 
    name: 'St. Kitts & Nevis', 
    flag: '🇰🇳', 
    country_code: 'KN', 
    timezone: 'America/St_Kitts', 
    currency: 'XCD', 
    region: 'Leeward Islands',
    population: 53000
  },
  { 
    id: 'guyana', 
    name: 'Guyana', 
    flag: '🇬🇾', 
    country_code: 'GY', 
    timezone: 'America/Guyana', 
    currency: 'GYD', 
    region: 'South America',
    population: 787000
  },
  { 
    id: 'belize', 
    name: 'Belize', 
    flag: '🇧🇿', 
    country_code: 'BZ', 
    timezone: 'America/Belize', 
    currency: 'BZD', 
    region: 'Central America',
    population: 397000
  },
  { 
    id: 'antigua', 
    name: 'Antigua & Barbuda', 
    flag: '🇦🇬', 
    country_code: 'AG', 
    timezone: 'America/Antigua', 
    currency: 'XCD', 
    region: 'Leeward Islands',
    population: 98000
  },
  { 
    id: 'st-lucia', 
    name: 'St. Lucia', 
    flag: '🇱🇨', 
    country_code: 'LC', 
    timezone: 'America/St_Lucia', 
    currency: 'XCD', 
    region: 'Windward Islands',
    population: 183000
  },
  { 
    id: 'dominica', 
    name: 'Dominica', 
    flag: '🇩🇲', 
    country_code: 'DM', 
    timezone: 'America/Dominica', 
    currency: 'XCD', 
    region: 'Windward Islands',
    population: 72000
  },
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
      'GD': 'grenada', 
      'BB': 'barbados',
      'JM': 'jamaica',
      'TT': 'trinidad',
      'KN': 'st-kitts',
      'GY': 'guyana',
      'BZ': 'belize',
      'AG': 'antigua',
      'LC': 'st-lucia',
      'DM': 'dominica',
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