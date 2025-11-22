Flask Frontend (minimal)

Quick start (PowerShell):

```powershell
python -m venv venv
; .\venv\Scripts\Activate.ps1
; pip install -r requirements.txt
; python app.py
```

- Open http://localhost:5000 in your browser.
- The page has a small form that sends JSON to `/api/echo` and displays the response.
CMMS Frontend (Flask-served static UI)

Quick start (PowerShell):

```powershell
python -m venv venv
; .\venv\Scripts\Activate.ps1
; pip install -r requirements.txt
; python app.py
```

- Open `http://localhost:5000` in your browser.
- Pages: Dashboard, Assets, Work Orders — all UI is client-side.

How it works
- The Flask app only serves templates and static files; there is no server-side database.
- Data (assets and work orders) is stored in the browser using `localStorage` under keys `cmms_assets_v1` and `cmms_workorders_v1`.
- The project includes `static/cmms.js` which provides basic add/list behavior and seeds example data on first run.

Resetting data
- To clear seeded/demo data, open the browser dev tools and run:

```javascript
localStorage.removeItem('cmms_assets_v1');
localStorage.removeItem('cmms_workorders_v1');
```

Next steps you might want
- Replace `localStorage` with real API calls to your backend.
- Add authentication, editing, filtering, or export features.
