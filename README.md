# Flashcard Learning App

A full-stack web application for creating, organising, and reviewing digital flashcards using active-recall techniques. Built with React (frontend) and FastAPI + MySQL (backend).

## Problem Statement

Memorising new material is hard without a structured system. Traditional static notes are passive — they do not challenge you to recall information. This app solves that by providing a digital flashcard platform where users can create, organise, review, and manage their own study cards. Each card hides the answer until the user actively chooses to reveal it, reinforcing active recall. When a card is flipped, a 10-second countdown begins — the card is automatically deleted when the timer expires. Cards are grouped by category so users can focus their study sessions on a specific subject area.

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 (component-based SPA) |
| Build tool | Vite 6 |
| Styling | CSS Modules (component-scoped, no external UI library) |
| Fonts | Plus Jakarta Sans via Google Fonts |
| State management | Custom React hook (`useFlashcards`) |
| HTTP client | Native `fetch` API (custom `request()` wrapper in `/services/api.js`) |
| Backend framework | FastAPI 0.115 (Python) |
| ASGI server | Uvicorn |
| ORM | SQLAlchemy 2.0 |
| Database migrations | Alembic |
| Database | MySQL 8.0 (local Docker container) |
| Data validation | Pydantic v2 |
| Environment config | `python-dotenv` |
| Local DB container | Docker / docker-compose |
| Routing | None (single-page, state-driven — no client-side router needed) |
| Deployment | Not deployed — runs locally (frontend port 5173, backend port 8000) |

## Features

- **Single-Page Application** — no page reloads; all content is dynamically rendered and updated in place
- **Create flashcards** — add a question, answer, and category via a modal form with client-side validation
- **Read and browse flashcards** — all cards are fetched from the database on load and displayed in a responsive grid
- **Update flashcards** — edit any card's question, answer, or category inline through the same modal
- **Auto-delete countdown** — flip a card to reveal the answer; a 10-second countdown starts automatically and deletes the card when it reaches zero. Once flipped, the card cannot be flipped back
- **Delete from collection** — open the edit modal on any card to permanently remove it from the deck
- **Dynamic category filtering** — filter pills are generated from the actual categories present in the database; new categories appear automatically as cards are created
- **3D flip animation** — click any card to flip it and reveal the answer with a CSS 3D transform
- **Colour-coded cards** — each card slot is assigned one of 8 rotating accent colours for quick visual distinction
- **Category autocomplete** — typing a category in the create/edit form suggests existing categories via a native `<datalist>`, so users stay consistent without being locked to a fixed list
- **Confirm dialog before deletion** — a focused `alertdialog` with keyboard support (Escape to cancel) prevents accidental permanent deletes
- **Error boundary** — a React class-based error boundary wraps the whole app; if a component crashes, users see a friendly message and a reload button instead of a blank screen
- **Toast notifications** — non-blocking success and error messages after every create, update, or delete action
- **Keyboard accessibility** — all interactive elements support keyboard navigation; modals trap focus and close on Escape
- **ARIA semantics** — dialogs use `role="dialog"` / `role="alertdialog"`, buttons have `aria-label` attributes
- **Responsive layout** — four-column grid on desktop, three on tablet, two on mobile
- **Seed data** — 20 pre-written flashcards across three categories (Python, Web, Databases) for immediate demonstration

## Folder Structure

```
Internet_Prgoramming/
│
├── README.md
├── .gitignore
├── docker-compose.yml              # Starts a local MySQL 8.0 container
│
├── database/                       # Plain-SQL setup files
│   ├── schema.sql                  # Creates the flashcards table
│   └── seed.sql                    # Inserts 20 sample flashcards
│
├── flashcard-app/                  # React frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── App.module.css
│       ├── components/
│       │   ├── Header/
│       │   ├── CategoryFilter/
│       │   ├── Flashcard/          # Card with flip + 10-second auto-delete countdown
│       │   ├── FlashcardGrid/
│       │   ├── CardModal/
│       │   ├── ConfirmDialog/
│       │   └── ErrorBoundary/
│       ├── hooks/
│       │   └── useFlashcards.js
│       ├── services/
│       │   └── api.js
│       └── utils/                  # (empty — reserved for future helpers)
│
└── flashcard_backend/              # Python FastAPI backend
    ├── requirements.txt
    ├── .env                        # Active config — copy from .env.local to create
    ├── .env.example                # Template showing all required variables
    ├── .env.local                  # Ready-to-use config for the local Docker MySQL
    ├── alembic.ini
    ├── alembic/
    │   └── versions/               # Database migration scripts
    └── app/
        ├── main.py                 # FastAPI app + CORS config
        ├── database.py             # SQLAlchemy engine (reads DB_* env vars)
        ├── models.py               # Flashcard ORM model
        ├── schemas.py              # Pydantic request/response schemas
        └── routers/
            └── flashcards.py       # CRUD endpoints: GET POST PUT DELETE /cards/
```

## Running Locally

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Python | 3.10+ | python.org |
| Node.js | 18+ | nodejs.org |
| Docker Desktop | any recent | docker.com/products/docker-desktop |

---

### Step 1 — Start the local MySQL database

```bash
# From the project root (Internet_Prgoramming/)
docker-compose up -d
```

Docker will:
1. Pull the `mysql:8.0` image (first run only)
2. Create the `flashcard_db` database
3. Run `database/schema.sql` to create the `flashcards` table
4. Run `database/seed.sql` to insert 20 sample cards

Wait about 10–15 seconds for MySQL to be ready. You can check with:

```bash
docker-compose ps        # should show "healthy"
docker-compose logs db   # inspect startup output
```

### Step 2 — Configure and start the backend

```bash
cd flashcard_backend

# Create a Python virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy the local config
cp .env.local .env

# Start the API server
uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`.

> **Note:** Alembic migrations are **not required** — `schema.sql` already creates the table via Docker. If you prefer Alembic: `alembic upgrade head`.

### Step 3 — Start the frontend

Open a new terminal:

```bash
cd flashcard-app
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. The app will load with the 20 seed cards.

### Stopping the local environment

```bash
# Stop the MySQL container (data is preserved)
docker-compose down

# Wipe all data and start completely fresh next time
docker-compose down -v
```

## Database Initialisation Reference

### Option A — Docker (recommended, automatic)

```bash
docker-compose up -d
# Schema and seed data are loaded automatically on first start.
```

### Option B — Manual SQL

```bash
mysql -h localhost -u flashcard_user -p < database/schema.sql
mysql -h localhost -u flashcard_user -p flashcard_db < database/seed.sql
```

### Option C — Alembic migrations

```bash
cd flashcard_backend
alembic upgrade head
```

## Environment Variables Reference

All backend configuration is read from `flashcard_backend/.env`.

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_NAME` | Database name | `flashcard_db` |
| `DB_USER` | Database user | `flashcard_user` |
| `DB_PASSWORD` | Database password | `flashcard_pass` |

## Challenges Overcome

**CORS configuration** — Connecting a React frontend to a FastAPI backend required careful setup of CORS headers. Early development was blocked by browser preflight rejections until allowed origins were explicitly set in `main.py`.

**3D card flip in pure CSS** — Implementing the flip animation required understanding `transform-style: preserve-3d` and `backface-visibility: hidden`. Getting both faces to sit exactly on top of each other without layout shifts took significant trial and error.

**Auto-delete countdown** — Adding a 10-second countdown that starts on flip, cancels when flipped back, and triggers a fade-out animation required careful use of `useEffect` and `useRef` to avoid stale closure bugs and timer leaks.

**Long content layout** — Cards have a fixed height set by the CSS grid. Long questions or answers previously overflowed silently. This was fixed by introducing a scrollable inner region (`min-height: 0` on flex children + `overflow-y: auto`) so text scrolls within the card without breaking the layout.

**Single modal for create and edit** — Designing one `CardModal` component that handles both modes (with pre-filled fields and different submit labels) without code duplication required a clean `mode` flag and conditional logic inside the hook.

**Consistent frontend state** — After update and delete operations, performing local state mutations in `useFlashcards` (rather than re-fetching the full list) avoids unnecessary network round-trips and keeps the UI feeling instant.
