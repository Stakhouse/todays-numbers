# Trinidad & Tobago and Grenada Lottery Integration Design

## Overview

This document outlines the design for implementing Trinidad & Tobago and Grenada lottery games in the Today's Numbers application. The implementation will follow the same pattern used for Jamaica and SVG, providing public main page card schema and integration for both islands.

The task requires implementing support for:
- **Trinidad & Tobago**: Cash Pot, Lotto Plus, Pick 2, Pick 4, Play Whe, Win for Life
- **Grenada**: Daily Cash 4, Daily Pick 3, Lotto, Super 6

Both islands are already defined in the system with IDs `trinidad` and `grenada` respectively.

## Architecture

The implementation will follow the existing architecture pattern established for other Caribbean islands in the application:

1. **Data Layer**: Extend the existing `LotteryContext` and `LotteryAPI` to handle Trinidad & Tobago and Grenada data
2. **Component Layer**: Create new components or extend existing ones to display the lottery data
3. **Routing Layer**: Ensure proper routing for the new island pages
4. **UI Layer**: Implement card-based display for the main page and detailed views for individual island pages

## Component Architecture

### Trinidad & Tobago Components

The Trinidad & Tobago implementation will include:

1. **Main Page Card Integration**
   - Extend the existing `LotteryCard` component to display Trinidad & Tobago games
   - Support for 6 games: Cash Pot, Lotto Plus, Pick 2, Pick 4, Play Whe, Win for Life
   - Each game will display: game title, draw date, draw time, draw number (or "N/A"), numbers, and jackpot (if available)

2. **Detailed Island Page**
   - Create a specialized component `TrinidadLotteryResults.tsx` similar to `JamaicaLotteryResults.tsx`
   - Display all 6 games with proper formatting and styling
   - Each game will show detailed information in a card layout

### Grenada Components

The Grenada implementation will include:

1. **Main Page Card Integration**
   - Extend the existing `LotteryCard` component to display Grenada games
   - Support for 4 games: Daily Cash 4, Daily Pick 3, Lotto, Super 6
   - Handle missing information gracefully with "Pending" or "N/A" for draw_number or jackpot

2. **Detailed Island Page**
   - Create a specialized component `GrenadaLotteryResults.tsx` similar to `SVGLotteryResults.tsx`
   - Handle multiple draws per day for Daily Cash 4 and Daily Pick 3 with tabbed interface (Morning, Evening)
   - Support for single draw games (Lotto, Super 6) without tabs

## Data Models & Schema

### Trinidad & Tobago Data Structure

```json
{
  "island": "Trinidad & Tobago",
  "game": "Win for Life",
  "draw_date": "2025-09-12",
  "draw_time": "Friday Evening",
  "draw_number": "20250912-WFL",
  "numbers": [10, 17, 18, 19, 26, 27, 3],
  "jackpot": "TT$4,800,000"
}
```

### Grenada Data Structure

```json
{
  "island": "Grenada",
  "game": "Daily Cash 4",
  "draw_date": "2025-09-12",
  "draw_time": "Evening",
  "draw_number": "20250912-DC4-E",
  "numbers": [3, 1, 9, 9],
  "jackpot": null
}
```

For multi-draw games in Grenada (Daily Cash 4 and Daily Pick 3), the structure will be:

```json
{
  "island": "Grenada",
  "game": "Daily Cash 4",
  "draws": [
    {
      "draw_date": "2025-09-12",
      "draw_time": "Morning",
      "draw_number": "20250912-DC4-M",
      "numbers": [1, 2, 3, 4]
    },
    {
      "draw_date": "2025-09-12",
      "draw_time": "Evening",
      "draw_number": "20250912-DC4-E",
      "numbers": [5, 6, 7, 8]
    }
  ]
}
```

### Required Data Fields

For both islands, the following fields are required for each card/JSON entry:
- `island` (string): e.g. "Trinidad & Tobago" or "Grenada"
- `game` (string): e.g. "Pick 2", "Lotto Plus", "Super 6"
- `draw_date` (YYYY-MM-DD): Date of the draw
- `draw_time` (string): Time or label like "Morning" / "Evening" / "Day" / "Night"
- `draw_number` (string or null): Draw identifier
- `numbers` (array): Array of numbers or digits
- `jackpot` (string/number or null): Jackpot amount if available

For multi-draw games, the `draws` array replaces individual draw fields:
- `draws` (array): Array of draw objects, each containing draw_date, draw_time, draw_number, and numbers

## Business Logic Layer

### Data Handling

1. **Mock Data Fallback**: Extend the existing mock data system in `LotteryContext` to include Trinidad & Tobago and Grenada
2. **API Integration**: Ensure the `LotteryAPI` service can handle data for the new islands
3. **Data Formatting**: Implement proper formatting for Trinidad & Tobago (TT$) and Grenada (XCD$) currencies
4. **Number Color Coding**: Implement appropriate color coding for different game types

### Game-Specific Logic

#### Trinidad & Tobago Games
- **Cash Pot**: Single draw per day, typically 5 numbers
- **Lotto Plus**: Single draw per day, typically 6 numbers
- **Pick 2**: Single draw per day, 2 numbers
- **Pick 4**: Single draw per day, 4 numbers
- **Play Whe**: Single draw per day, typically 1 number
- **Win for Life**: Single draw per day, typically 7 numbers (6 main + 1 bonus)

#### Grenada Games
- **Daily Cash 4**: Two draws per day (Morning and Evening), 4 numbers each
- **Daily Pick 3**: Two draws per day (Morning and Evening), 3 numbers each
- **Lotto**: Single draw per day, typically 6 numbers
- **Super 6**: Single draw per day, typically 6 numbers

## UI/UX Design

### Main Page Cards

The main page cards will follow the existing design pattern:
- Island name with flag emoji
- Game title
- Draw date and time
- Draw number (or "N/A")
- Numbers displayed in colored balls
- Jackpot amount (if available)

Color coding for numbers:
- Trinidad & Tobago: Based on game type (e.g., Lotto Plus numbers 1-10 in red, 11-20 in blue, etc.)
- Grenada: Based on game type (e.g., Pick 3 numbers 0-3 in orange, 4-6 in blue, 7-9 in green)

### Detailed Island Pages

The detailed island pages will include:
- Island header with flag and information
- Tabbed interface for different sections (Lottery, History, Statistics, All Data)
- Game cards with detailed information
- Multi-draw support for Grenada games with tabbed interface

For the detailed views:
- Trinidad & Tobago: Create `TrinidadLotteryResults.tsx` following the pattern of `JamaicaLotteryResults.tsx`
- Grenada: Create `GrenadaLotteryResults.tsx` following the pattern of `SVGLotteryResults.tsx`

### Responsive Design

The implementation will maintain responsiveness across:
- Mobile devices: Single column layout with stacked game cards
- Tablets: Two column layout for game cards
- Desktop computers: Three or four column layout depending on screen size

## Integration Points

### Existing Components to Extend

1. **LotteryCard.tsx**: Extend to properly display Trinidad & Tobago and Grenada games
2. **LotteryContext.tsx**: Add mock data for the new islands in the `getMockData` function
3. **IslandPage.tsx**: Add specialized handling for Trinidad & Tobago and Grenada in the conditional rendering section
4. **App.tsx**: Ensure proper routing (already supported through dynamic routing)
5. **IslandContext.tsx**: Verify Trinidad & Tobago and Grenada are properly defined (they already are)

### New Components to Create

1. **TrinidadLotteryResults.tsx**: Specialized component for Trinidad & Tobago detailed view, based on `JamaicaLotteryResults.tsx`
2. **GrenadaLotteryResults.tsx**: Specialized component for Grenada detailed view, based on `SVGLotteryResults.tsx`

### Files to Create

1. **src/components/TrinidadLotteryResults.tsx**: Detailed view component for Trinidad & Tobago
2. **src/components/GrenadaLotteryResults.tsx**: Detailed view component for Grenada

## Testing Strategy

### Unit Tests

1. Test data formatting functions for Trinidad & Tobago and Grenada
2. Test mock data generation
3. Test component rendering with mock data
4. Test multi-draw functionality for Grenada games

### Integration Tests

1. Test API integration with real data (when available)
2. Test WebSocket updates for the new islands
3. Test responsive design across different screen sizes
4. Test integration with existing `LotteryContext` and data flow

### User Acceptance Testing

1. Verify layout and responsiveness on mobile and desktop
2. Confirm numbers and data display correctly using the provided mock JSON
3. Test multi-draw functionality for Grenada games with tabbed interface
4. Validate currency formatting for both islands (TT$ for Trinidad & Tobago, XCD$ for Grenada)
5. Test error handling for missing data scenarios

### Mock Data Validation

Use the exact mock JSON examples provided in the requirements to verify:
- Trinidad & Tobago games display correctly with all required fields
- Grenada games display correctly with multi-draw support
- Numbers are properly formatted and color-coded
- Jackpot amounts display with correct currency symbols
- Missing data is handled gracefully with "N/A" or "Pending" indicators

## Implementation Plan

### Phase 1: Data Layer Implementation
- Extend `LotteryContext` with mock data for Trinidad & Tobago and Grenada using the exact JSON examples from the requirements
- Update `LotteryAPI` to handle the new islands
- Implement proper data formatting functions
- Add Trinidad & Tobago (TT$) and Grenada (XCD$) currency formatting
- Ensure multi-draw games (Daily Cash 4 and Daily Pick 3 for Grenada) are properly structured with draws array

### Phase 2: Component Development
- Create `TrinidadLotteryResults.tsx` following the pattern of `JamaicaLotteryResults.tsx`
- Create `GrenadaLotteryResults.tsx` following the pattern of `SVGLotteryResults.tsx`
- Extend existing components to support the new islands
- Implement multi-draw support for Grenada games with tabbed interface

### Phase 3: UI Integration
- Integrate new components into the main page via `LotteryCard` component
- Add proper routing for detailed island pages in `App.tsx`
- Implement responsive design for all new components
- Ensure consistent styling with existing Caribbean island components

### Phase 4: Testing and Validation
- Conduct unit testing of new components with mock data
- Perform integration testing with the existing `LotteryContext`
- Execute user acceptance testing on multiple device sizes
- Validate with mock JSON data provided in requirements
- Test error handling for missing data scenarios

## Dependencies

The implementation depends on:
1. Existing React and Material-UI framework
2. Firebase integration for real-time data (when available)
3. Python scraper backend for real data (when available)
4. WebSocket connection for real-time updates
5. Existing `LotteryContext` for state management
6. Existing routing infrastructure in `App.tsx`

## Error Handling

The implementation will handle:
1. Missing data gracefully with "Pending" or "N/A" displays
2. Backend connection failures with fallback to mock data
3. Data formatting errors with appropriate default values
4. UI rendering errors with fallback components
5. Invalid or malformed data with graceful degradation

### Edge Cases to Handle

1. **Missing Fields**: Handle cases where draw_number or jackpot fields are null or missing
2. **Empty Numbers Array**: Handle games with no winning numbers available
3. **Invalid Dates**: Handle malformed date strings gracefully
4. **Network Errors**: Provide appropriate error messages when API calls fail
5. **Large Number Sets**: Ensure proper display of games with many numbers (e.g., Win for Life with 7 numbers)
6. **Multi-draw Failures**: Handle cases where one draw succeeds but another fails for Grenada games

## Validation Criteria

The implementation will be considered complete when:
1. Trinidad & Tobago and Grenada appear on the main public page with correct card displays
2. All required games for both islands are displayed with proper data fields
3. Multi-draw games for Grenada show tabbed interface for Morning/Evening draws
4. Currency formatting is correct (TT$ for Trinidad & Tobago, XCD$ for Grenada)
5. Missing data is handled gracefully with "N/A" or "Pending" indicators
6. Layout is responsive on mobile and desktop devices
7. Detailed island pages load correctly with all game information
8. Mock data matches the exact JSON examples provided in requirements

## Performance Considerations

1. Efficient data fetching and caching
2. Lazy loading for detailed island pages
3. Optimized rendering for card components
4. Minimal re-renders through proper state management
5. Memoization of expensive formatting functions
6. Conditional rendering to avoid unnecessary component updates