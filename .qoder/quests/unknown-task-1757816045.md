# Implementing Dominica and Antigua & Barbuda Lottery Games

## Overview

## Overview

This document outlines the implementation plan for adding Dominica and Antigua & Barbuda lottery games to the Today's Numbers application. The implementation will follow the existing pattern used for other Caribbean islands like Jamaica, SVG, and Trinidad.

The feature will implement public main page cards for both islands with all their respective lottery games, following the schema, placeholder schedules, and mock JSON examples specified in the requirements.

Both islands will be fully supported on the public page with Card layout, proper schema, and ready to display real data once the scraper integration is complete.

## Architecture

The application follows a component-based architecture with the following key elements:

1. **LotteryContext**: Central state management for lottery data across all islands
2. **LotteryCard**: Reusable UI component for displaying lottery results
3. **lotteryAPI**: Service layer for communicating with the backend
4. **Dashboard**: Main view that displays the LotteryCard for the current island

The implementation will extend these existing components to support the new islands without modifying the core architecture.

## Component Architecture

### LotteryCard Component

The LotteryCard component will be used to display lottery results for both new islands. It already supports:
- Multiple games per island
- Multi-draw games with tabbed interface
- Responsive layout
- Interactive elements with hover effects
- Special styling for different islands (e.g., Jamaica has special styling)

For the new islands, we'll need to:
1. Add island name mappings in the `getIslandDisplayName` function
2. Ensure proper data formatting for the new game types

### Data Structure

The existing data structure will accommodate the new islands with these fields:
- `island`: String identifier ("Dominica" or "Antigua & Barbuda")
- `game`: Game name (e.g., "Play 4", "Super Lotto")
- `draw_date`: Date in YYYY-MM-DD format
- `draw_time`: Time or label (e.g., "Evening", "21:00")
- `draw_number`: Unique identifier for the draw
- `numbers`: Array of winning numbers
- `jackpot`: Jackpot amount if available
- `next_draw_date`: Optional next draw date
- `next_jackpot`: Optional next jackpot amount

## Implementation Plan

### 1. Update Island Name Mappings

In the LotteryCard component, we need to add mappings for the new islands:

```typescript
const getIslandDisplayName = (id: string): string => {
  const nameMap: { [key: string]: string } = {
    // ... existing mappings ...
    'dominica': 'Dominica',
    'antigua': 'Antigua & Barbuda',
  };
  return nameMap[id.toLowerCase()] || id.charAt(0).toUpperCase() + id.slice(1);
};
```

### 2. Define Game Schedules

Based on the requirements:

**Dominica Games:**
- Play 4: Monday-Saturday, multiple draws per day (Morning/Midday/Evening)
- Daily 3: Twice per day, Monday-Saturday
- Big 4: Monday-Saturday, multiple draws per day
- 1-Off: Similar schedule to Pick 2 or daily draws
- Pick 2: Monday-Saturday, multiple draws per day
- Super 6: Twice weekly (Tuesday & Friday evenings)

**Antigua & Barbuda Games:**
- Super Lotto: Once weekly (evening)
- Lucky Pick: Daily or frequent, usually evening

### 3. Mock Data Implementation

We'll add comprehensive mock data for both islands in the LotteryContext's `getMockData` function:

### 3. Mock Data Implementation

We'll add mock data for both islands in the LotteryContext's `getMockData` function:

For Dominica:
```typescript
// In the mock data section for dominica
games = [
  {
    id: 'dominica-play-4',
    game: 'Play 4',
    draws: [
      {
        draw_date: '2025-09-14',
        draw_time: 'Morning',
        draw_number: '20250914-P4-M',
        numbers: [1, 7, 3, 9],
        drawDateFormatted: '9/14/2025'
      },
      {
        draw_date: '2025-09-14',
        draw_time: 'Midday',
        draw_number: '20250914-P4-MD',
        numbers: [5, 2, 8, 4],
        drawDateFormatted: '9/14/2025'
      },
      {
        draw_date: '2025-09-14',
        draw_time: 'Evening',
        draw_number: '20250914-P4-E',
        numbers: [3, 15, 8, 22],
        drawDateFormatted: '9/14/2025'
      }
    ]
  },
  {
    id: 'dominica-daily-3',
    game: 'Daily 3',
    draws: [
      {
        draw_date: '2025-09-14',
        draw_time: 'Midday',
        draw_number: '20250914-D3-MD',
        numbers: [2, 8, 5],
        drawDateFormatted: '9/14/2025'
      },
      {
        draw_date: '2025-09-14',
        draw_time: 'Evening',
        draw_number: '20250914-D3-E',
        numbers: [7, 1, 9],
        drawDateFormatted: '9/14/2025'
      }
    ]
  },
  {
    id: 'dominica-big-4',
    game: 'Big 4',
    draws: [
      {
        draw_date: '2025-09-14',
        draw_time: 'Morning',
        draw_number: '20250914-B4-M',
        numbers: [4, 6, 2, 8],
        drawDateFormatted: '9/14/2025'
      },
      {
        draw_date: '2025-09-14',
        draw_time: 'Evening',
        draw_number: '20250914-B4-E',
        numbers: [1, 9, 3, 7],
        drawDateFormatted: '9/14/2025'
      }
    ]
  },
  {
    id: 'dominica-1-off',
    game: '1-Off',
    numbers: [5, 2, 8, 1, 9],
    draw_date: '2025-09-14',
    draw_time: 'Evening',
    draw_number: '20250914-1O',
    drawDateFormatted: '9/14/2025'
  },
  {
    id: 'dominica-pick-2',
    game: 'Pick 2',
    draws: [
      {
        draw_date: '2025-09-14',
        draw_time: 'Morning',
        draw_number: '20250914-P2-M',
        numbers: [3, 7],
        drawDateFormatted: '9/14/2025'
      },
      {
        draw_date: '2025-09-14',
        draw_time: 'Evening',
        draw_number: '20250914-P2-E',
        numbers: [9, 1],
        drawDateFormatted: '9/14/2025'
      }
    ]
  },
  {
    id: 'dominica-super-6',
    game: 'Super 6',
    numbers: [1, 9, 13, 15, 16, 19],
    draw_date: '2025-09-12',
    draw_time: '21:00',
    draw_number: '20250912-S6',
    drawDateFormatted: '9/12/2025',
    jackpotFormatted: 'EC$200,000'
  }
];
```

For Antigua & Barbuda:
```typescript
// In the mock data section for antigua
games = [
  {
    id: 'antigua-super-lotto',
    game: 'Super Lotto',
    numbers: [10, 12, 15, 16, 17, 7],
    draw_date: '2025-09-19',
    draw_time: '21:00',
    draw_number: '20250919-SL',
    drawDateFormatted: '9/19/2025',
    jackpotFormatted: 'EC$1,637,500'
  },
  {
    id: 'antigua-lucky-pick',
    game: 'Lucky Pick',
    numbers: [3, 8, 11, 12, 24, 4],
    draw_date: '2025-09-14',
    draw_time: 'Evening',
    draw_number: '20250914-LP',
    drawDateFormatted: '9/14/2025'
  }
];
```

### 4. Backend Integration

The backend scraper needs to be updated to:
1. Scrape lottery results from official sources for both islands
2. Return data in the same format as existing islands
3. Map the fields correctly to match the frontend expectations

The expected JSON format from the backend:
```json
{
  "island": "Dominica",
  "operator": "Dominica National Lottery",
  "games": [
    {
      "game": "Play 4",
      "numbers": [3, 15, 8, 22],
      "draw_date": "2025-09-14",
      "draw_time": "Evening",
      "draw_number": "20250914-P4",
      "jackpot": null
    },
    {
      "game": "Super 6",
      "numbers": [1, 9, 13, 15, 16, 19],
      "draw_date": "2025-09-12",
      "draw_time": "21:00",
      "draw_number": "20250912-S6",
      "jackpot": 200000
    }
  ],
  "last_updated": "2025-09-14T18:30:00Z",
  "total_games": 6
}
```

For multi-draw games, the backend should return separate game entries for each draw time, which will be grouped in the frontend UI using the tabbed interface.

### 5. Testing Strategy

Testing will include:

1. **Unit Testing**:
   - Verify mock data is correctly formatted
   - Test island name mappings
   - Validate multi-draw game handling

2. **Integration Testing**:
   - Confirm data flows correctly from context to UI components
   - Test responsive layout on different screen sizes
   - Verify error handling and loading states

3. **End-to-End Testing**:
   - Test card display for both islands
   - Verify all games are displayed correctly
   - Check mobile and desktop layouts
   - Test interaction with the "Details" button

4. **User Acceptance Testing**:
   - Validate that all required data fields are displayed
   - Confirm visual design matches existing patterns
   - Ensure performance is acceptable with mock data

## Data Models

### Island Data Model

The existing island data model will be extended to include the new islands:

```typescript
interface FormattedIslandData {
  id: string;              // 'dominica', 'antigua'
  island: string;          // 'Dominica', 'Antigua & Barbuda'
  displayName: string;     // Display name for UI
  operator?: string;       // Lottery operator name
  games: FormattedLotteryGame[];
  last_updated: string;    // ISO timestamp
  lastUpdatedFormatted: string; // Formatted timestamp for display
  total_games: number;     // Count of games
}
```

### Game Data Model

The game data model already supports all required fields:

```typescript
interface FormattedLotteryGame {
  id: string;              // Unique identifier
  game: string;            // Game name
  numbers: number[];       // Winning numbers
  draw_date: string;       // YYYY-MM-DD format
  draw_time?: string;      // Time or label
  draw_number?: string;    // Unique draw identifier
  jackpot?: number;        // Jackpot amount
  drawDateFormatted?: string;  // Formatted date for display
  jackpotFormatted?: string;   // Formatted jackpot for display
}
```

For multi-draw games, we'll use a draws array:
```typescript
interface MultiDrawGame extends FormattedLotteryGame {
  draws: FormattedLotteryGame[]; // Array of individual draws
}
```

This structure is already supported by the existing `LotteryCard` component, which can handle both single games and multi-draw games with tabbed interfaces.

The data models will support all required fields specified in the requirements:
- `island`: String identifier for the island
- `game`: Game name
- `draw_date`: Date in YYYY-MM-DD format
- `draw_time`: Time or label (e.g., "Evening", "21:00")
- `draw_number`: Unique identifier for the draw
- `numbers`: Array of winning numbers
- `jackpot`: Jackpot amount if available
- `next_draw_date`: Optional next draw date
- `next_jackpot`: Optional next jackpot amount

## Business Logic

### Multi-Draw Game Handling

The LotteryCard component already has logic to handle multi-draw games:
1. Identify multi-draw games using the `isMultiDrawGame` function
2. Render tabbed interface for games with multiple draws
3. Switch between draws using the tab interface

The function identifies multi-draw games by checking if the game name is in a predefined list or if it has a `draws` array with multiple entries.

### Data Formatting

The lotteryAPI service includes a `formatLotteryData` method that:
1. Converts raw API data to frontend-friendly format
2. Formats dates for display
3. Formats jackpots with currency formatting
4. Normalizes island IDs

This logic will work unchanged for the new islands, ensuring consistency with existing implementations.

## Testing

### Unit Tests

1. **LotteryCard Component Tests**:
   - Test island name mapping for new islands
   - Verify multi-draw game rendering
   - Check responsive layout behavior
   - Validate special styling (if any) for new islands
   - Test tab switching functionality for multi-draw games

2. **LotteryContext Tests**:
   - Test mock data generation for new islands
   - Verify data formatting logic
   - Check error handling and fallback mechanisms
   - Test backend connectivity checks

3. **lotteryAPI Tests**:
   - Test data formatting for new island data structures
   - Verify backend availability checking
   - Test error handling for network failures

### Integration Tests

1. **Data Flow Tests**:
   - Verify data flows from mock/real backend to UI components
   - Test context updates trigger re-renders
   - Validate WebSocket update handling
   - Test loading and error states

2. **UI Integration Tests**:
   - Test card display with various game types
   - Verify tab switching for multi-draw games
   - Check responsive behavior on different screen sizes
   - Test accessibility features

### End-to-End Tests

1. **User Journey Tests**:
   - Navigate to dashboard with new islands selected
   - View lottery card with all game types
   - Interact with multi-draw game tabs
   - Click "Details" button to navigate to island page
   - Verify all data fields are displayed correctly

2. **Cross-Browser Tests**:
   - Verify consistent rendering across browsers
   - Test responsive layouts on various devices
   - Test on mobile devices with different screen sizes

### User Acceptance Testing

1. **Functional Verification**:
   - Validate that all required data fields are displayed for each game
   - Confirm visual design matches existing patterns
   - Ensure performance is acceptable with mock data
   - Verify that all games for both islands are properly displayed

2. **Requirements Validation**:
   - Confirm all games listed in the requirements are implemented
   - Verify data fields match the specification
   - Check that placeholder schedules are correctly implemented
   - Validate that mock JSON examples match the implementation
