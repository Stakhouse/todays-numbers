TASK: Integrate the Python ScraperAgent with the React app.  
Scope: Start with St. Vincent & the Grenadines (SVG) lottery games.  
Location: Everything is inside the "dev" folder. The Python scraper is in `dev/ScraperAgent`.  
Frontend: React (Today's Numbers app).  
Backend: Python scraper, use FastAPI + WebSockets to transfer data.  

OBJECTIVE:
- Connect the Python scraper results (fetched from LotteryGuru) to the React app UI.  
- Use WebSockets for live transfer of data from the scraper → React.  
- Ensure React can fetch this data in real time and render the SVG Cards that are already built.

IMPLEMENTATION STEPS:

1. **Backend Setup (Python / ScraperAgent)**
   - Inside `ScraperAgent`, create a FastAPI app (`server.py`).
   - Add a WebSocket endpoint, e.g. `/ws/svg`.
   - When the scraper finishes pulling data (SVG: Super 6, Jafalato, 3D, Play 4), push the results as JSON to the WebSocket connection.
   - Example JSON format (must match the UI fields already defined):
     ```json
     {
       "island": "St. Vincent & the Grenadines",
       "game": "Super 6",
       "draw_date": "2025-09-13",
       "draw_time": "21:00",
       "draw_number": "20250913-S6",
       "numbers": [5, 9, 14, 22, 27, 31],
       "jackpot": "EC$150,000"
     }
     ```
   - The server should run with `uvicorn server:app --reload`.

2. **Frontend Setup (React app in dev folder)**
   - Inside the React app, connect to the WebSocket endpoint (`ws://localhost:8000/ws/svg`).
   - Write a WebSocket client hook or utility that listens for messages.
   - When a JSON message arrives, update state (e.g., `setSvgResults`) and render the corresponding Card(s).
   - Ensure the Cards refresh automatically when new data comes in.

3. **Transfer Portal (Integration)**
   - Keep all integration files inside the `dev` folder (so React + ScraperAgent live together for development).
   - Create a `dev/integration` or `dev/bridge` folder if needed, where small helpers (e.g., data adapters) live.
   - Data must flow like this:
     ```
     ScraperAgent (Python) → WebSocket (FastAPI) → React client (WebSocket hook) → SVG Cards
     ```

4. **Testing**
   - Run scraper manually (`python scraper_svg.py`) and confirm the data is emitted to `/ws/svg`.
   - Run React in dev mode and confirm SVG Cards update automatically with incoming WebSocket messages.
   - Use mock scraper data first; then confirm with real LotteryGuru fetches.

5. **Stop Condition**
   - Do not move to Jamaica or other islands until SVG pipeline is fully working.
   - Deliverables for this step:
     - Running WebSocket server in ScraperAgent.
     - React client successfully receiving data and rendering SVG Cards live.
     - Short README (integration.md) in `dev/` folder explaining how to run both sides together.

NOTES:
- Keep everything lightweight: no MongoDB, no external backend yet.  
- This is dev-only integration. Focus on WebSocket flow and React updates.  
