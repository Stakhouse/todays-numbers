# Today’s Numbers — Product Requirements Document (PRD)

## Project Overview
**Today’s Numbers** is a Caribbean-wide public information website aggregating publicly available data across English-speaking islands.  
Users can browse information by island, access lottery results, commodity prices, sports scores, hotel rates, and events, all in a mobile-first, responsive React application.

**Core Goal:**  
Provide a trusted, easy-to-use hub while laying groundwork for account-based features that connect Caribbean people and encourage interaction, travel, and commerce.

---

## MVP Scope (Launch)

### 1. Public Features (No login required)
- **Lottery Numbers:** Automatically pulled via scrapers or APIs; updates aligned with official draw times (e.g., 3 times daily).
- **Commodity Prices:** Manual weekly updates.
- **Sports Scores:** Updates every 2–3 hours for regular games; live updates for major games.
- **Hotel Rates:** Manual updates weekly/monthly.
- **Events & Ticket Info:** Manual updates sourced from promoters.
- **Island Navigation & Search:**  
  - Default island-specific view.  
  - Optional global search across islands for events.  

### 2. Account-Ready Features (Skeleton for Future)
- Lottery number scan & tracking.  
- Notifications for lottery results (win/partial hits).  
- Mock games / daily lottery simulations.  
- Community/social features for uniting Caribbean users.

---

## Future Vision (Post-MVP)

### 1. Account-Based Features
- **Travel/Home-sharing:** Users list homes/apartments for swaps or rentals; facilitates affordable travel.  
- **Sourcing & Marketplace:** Users act as “sourcers” to source goods across islands; peer-to-peer transactions.

### 2. Monetization
- Early revenue: lottery sponsorships/partnerships.  
- Later revenue streams: home-sharing platform fees, marketplace commissions, premium account features.  
- Optional ads integration post-traction.

---

## Data Management
| Data Type            | Update Frequency    | Source                  | Entry Type |
|----------------------|------------------|------------------------|-----------|
| Lottery Numbers      | 3x daily          | Scraper/API            | Automated |
| Sports Scores        | 2–3 hrs / live for big games | Sports feeds or manual | Semi-automated/manual |
| Commodity Prices     | Weekly            | Admin/manual           | Manual    |
| Hotel Rates          | Weekly/monthly    | Admin/manual           | Manual    |
| Events & Tickets     | As promoted       | Promoters/Manual       | Manual    |

---

## Island Detection & Auto-Switch
- Detect user location via IP geolocation (MAC addresses not accessible on web).  
- Default view shows **data for detected island**.  
- Users can override via **drop-down menu** to switch to other islands.  
- Selected island persists for session or until user changes it.

---

## Tech Stack & Tools
- **Frontend:** React + MUI (responsive/mobile-first).  
- **Backend:** Node.js + Express (optional for APIs or scrapers).  
- **Database:** Firebase Firestore.  
- **Hosting:** Firebase Hosting / Vercel / Netlify.  
- **Storage:** Firebase Storage for images (lottery scans, event posters).  
- **Automation:** Scrapers/APIs for lottery; manual updates for other data.  
- **Notifications:** Push/email alerts for account-based lottery tracking.

---

## Access & User Levels
- **Public Access:** Browse all data without login.  
- **Account Required:**  
  - Lottery number tracking/scanning.  
  - Mock games / daily simulations.  
  - Community features.  
  - Travel/home-sharing & marketplace (future).

---

## Success Metrics
- User traffic (monthly unique visitors).  
- Engagement: time on site, return rate.  
- Adoption of account-based features post-launch.  
- Revenue growth: lottery partnerships, ads, home-sharing/marketplace commissions.

---

## Considerations & Constraints
- Data accuracy is crucial; manual updates must be reliable.  
- Automated scraping must respect source limits and legal restrictions.  
- Mobile-first design to accommodate primary Caribbean users.  
- MVP focuses on public information and lottery traction; account features are future enhancements.
