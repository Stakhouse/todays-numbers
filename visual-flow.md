# Today’s Numbers — Visual Flow & User Navigation

This file contains the full visual flow for the **Today’s Numbers** app, including auto-island detection, navigation between islands and categories, and account features skeleton. All flows are represented in **Mermaid.js** syntax for easy visualization.

---

## 1. Landing & Auto-Island Detection

```mermaid
flowchart TD
    A[Landing Page] --> B{Detect User Island?}
    B -- Yes --> C[Load Island Dashboard]
    B -- No --> D[Default to St. Vincent Dashboard]
    C --> E[Island Data Cards]
    D --> E
    E --> F[Lottery Numbers Card]
    E --> G[Sports Scores Card]
    E --> H[Commodity Prices Card]
    E --> I[Hotel Rates Card]
    E --> J[Events & Tickets Card]
    E --> K[Island Switch Dropdown]

Notes:

Island detection via IP geolocation (or device info).

Default dashboard shows user’s island data.

Dropdown allows switching islands anytime.

2. Island Navigation & Categories
flowchart TD
    A[Island Tabs / Menu] --> B[St. Vincent Tab]
    A --> C[St. Lucia Tab]
    A --> D[Dominica Tab]
    A --> E[Grenada Tab]
    A --> F[Trinidad Tab]

    B --> G[Lottery Numbers]
    B --> H[Sports Scores]
    B --> I[Commodity Prices]
    B --> J[Hotel Rates]
    B --> K[Events & Tickets]


Notes:

Tabs allow easy switching between islands.

Within each island, cards display data by category.

3. Dashboard Cards & Layout
flowchart TD
    A[Dashboard] --> B[Card: Lottery Numbers]
    A --> C[Card: Sports Scores]
    A --> D[Card: Commodity Prices]
    A --> E[Card: Hotel Rates]
    A --> F[Card: Events & Tickets]

    B --> B1[Update via Scraper/API]
    C --> C1[Update every 2–3 hrs; live for major games]
    D --> D1[Update weekly]
    E --> E1[Update weekly/monthly]
    F --> F1[Update manually by promoters]


Notes:

Each card is a self-contained MUI component.

Supports responsive layout (mobile: stacked, tablet/desktop: multi-column).

4. Search Functionality
flowchart TD
    A[Search Bar] --> B{Island-specific or Network-wide?}
    B -- Island --> C[Filter results for current island]
    B -- Network --> D[Filter results across all islands]


Notes:

Default search is island-specific.

Option for network-wide search (e.g., events, lotteries).

5. Account/Login Skeleton (Future Features)
flowchart TD
    A[Login/Signup] --> B[Lottery Number Scan & Tracking]
    A --> C[Notifications for Wins/Partial Hits]
    A --> D[Mock Games / Daily Simulations]
    A --> E[Community / Social Features]
    A --> F[Travel/Home-sharing & Marketplace (Future)]


Notes:

Account-based features are MVP skeleton.

Supports future notifications, games, and community interactions.

6. Island Switch Dropdown Flow
flowchart TD
    A[Island Dropdown] --> B[User selects St. Vincent]
    A --> C[User selects St. Lucia]
    A --> D[User selects Dominica]
    A --> E[User selects Grenada]
    A --> F[User selects Trinidad]
    B --> G[Load St. Vincent Dashboard]
    C --> H[Load St. Lucia Dashboard]
    D --> I[Load Dominica Dashboard]
    E --> J[Load Grenada Dashboard]
    F --> K[Load Trinidad Dashboard]


Notes:

Dropdown accessible from top navigation.

Overrides auto-island detection for session.

7. Full Navigation Summary
flowchart TD
    Start[Landing Page] --> AutoDetect{Detect Island?}
    AutoDetect -- Yes --> IslandDashboard[Dashboard: User Island]
    AutoDetect -- No --> IslandDashboardDefault[Dashboard: Default Island]

    IslandDashboard --> Cards[Data Cards]
    Cards --> Lottery[Lottery Numbers]
    Cards --> Sports[Sports Scores]
    Cards --> Prices[Commodity Prices]
    Cards --> Hotels[Hotel Rates]
    Cards --> Events[Events & Tickets]

    Cards --> Dropdown[Island Switch]
    Dropdown --> Switch[Switch Island Dashboard]

    Cards --> Search[Search Bar]
    Search --> Filter[Filter Results]

    IslandDashboard --> Login[Login / Signup (Future)]
    Login --> AccountFeatures[Lottery Scan, Notifications, Mock Games, Community, Home-sharing]


This file now contains all major visual flows, showing:

Landing and auto-detection

Island navigation & switch

Category-specific dashboards/cards

Search and account skeletons