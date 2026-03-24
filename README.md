# FlashCard Learning App

## Problem Statement

Memorising new material is hard without a structured system. Traditional static notes are passive — they don't challenge you to recall information. This app solves that by providing a digital flashcard platform where users can create, organise, review, and manage their own study cards. Each card hides the answer until the user actively chooses to reveal it, reinforcing active recall. Cards are grouped by category so users can focus their study sessions on a specific subject area.

---

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
| Database | MySQL (remote, hosted on AWS EC2) |
| Data validation | Pydantic v2 |
| Environment config | `python-dotenv` |
| Deployment | Not deployed (runs locally: frontend on port 5173, backend on port 8000) |

---

## Features

- **Single-Page Application** — no page reloads; all content is dynamically rendered and updated in place
- **Create flashcards** — add a question, answer, and category via a modal form with client-side validation
- **Read and browse flashcards** — all cards are fetched from the database on load and displayed in a responsive grid
- **Update flashcards** — edit any card's question, answer, or category inline through the same modal
- **Delete flashcards** — flip a card to reveal the answer, then press Delete; a confirmation dialog prevents accidental deletion
- **Dynamic category filtering** — filter pills are generated from the actual categories present in the database; new categories appear automatically as cards are created
- **3D flip animation** — click any card to flip it and reveal the answer with a CSS 3D transform; click again or press "Flip Back" to return to the question
- **Colour-coded cards** — each card slot is assigned one of 8 rotating accent colours for quick visual distinction
- **Featured first card** — the first card in the grid is displayed larger as a visual anchor
- **Toast notifications** — non-blocking success and error messages after every create, update, or delete action
- **Keyboard accessibility** — all interactive elements support keyboard navigation; modals trap focus and close on Escape
- **ARIA semantics** — dialogs use `role="dialog"` / `role="alertdialog"`, buttons have `aria-label` attributes
- **Responsive layout** — four-column grid on desktop, three on tablet, two on mobile
- **Seed data** — 20 pre-written flashcards across three categories for immediate demonstration

---

## Folder Structure

```
Internet_Prgoramming/
│
├── README.md
│
├── flashcard-app/                  # React frontend
│   ├── index.html                  # Single HTML entry point
│   ├── vite.config.js              # Vite + React plugin config
│   ├── package.json
│   └── src/
│       ├── main.jsx                # React DOM entry point
│       ├── App.jsx                 # Root component; composes all views
│       ├── App.module.css
│       ├── index.css               # Global reset and font setup
│       ├── components/             # One folder per UI component
│       │   ├── Header/             # App title, card count badge, New Card button
│       │   ├── CategoryFilter/     # Pill buttons for filtering by category
│       │   ├── Flashcard/          # Individual card with flip animation
│       │   ├── FlashcardGrid/      # Responsive grid layout for all cards
│       │   ├── CardModal/          # Create / edit modal form
│       │   ├── ConfirmDialog/      # Delete confirmation dialog
│       │   └── ErrorBoundary/      # Catches unhandled React errors; shows fallback UI
│       ├── hooks/
│       │   └── useFlashcards.js    # All state and API side-effects in one hook
│       ├── services/
│       │   └── api.js              # Thin wrapper around fetch for all API calls
│       └── utils/
│           └── constants.js        # Shared constants (category list)
│
└── flashcard_backend/              # Python FastAPI backend
    ├── requirements.txt
    ├── .env                        # Database connection string — excluded from git via .gitignore
    ├── .env.example                # Template showing required environment variables
    ├── alembic.ini                 # Alembic migration config
    ├── alembic/versions/           # Database migration scripts
    ├── seed.py                     # Script to populate the database with sample cards
    └── app/
        ├── main.py                 # FastAPI app instantiation and CORS config
        ├── database.py             # SQLAlchemy engine and session setup
        ├── models.py               # Flashcard ORM model (id, question, answer, category, created_at)
        ├── schemas.py              # Pydantic schemas for request/response validation
        └── routers/
            └── flashcards.py       # CRUD route handlers: GET, POST, PUT, DELETE /cards/
```

---

## Challenges Overcome

Connecting a React frontend to a remote MySQL database via a FastAPI backend required careful configuration of CORS headers — early development was blocked by browser preflight rejections until allowed origins and headers were explicitly set in `main.py`. Implementing the 3D card flip purely in CSS required understanding `transform-style: preserve-3d` and `backface-visibility: hidden`, and getting both the front and back faces to sit exactly on top of each other without layout shifts took significant trial and error. Designing a single `CardModal` component that handles both create and edit modes (with pre-filled fields and different submit labels) without duplicating code required a clean props-driven approach using a `mode` flag and conditional logic inside the hook. Keeping state consistent between the backend and the frontend — especially after update and delete operations — meant the `useFlashcards` hook had to perform local state mutations rather than re-fetching the full list after every operation, which reduced unnecessary network round-trips and kept the UI feeling instant.

---

## Getting Started

### Backend

```bash
cd flashcard_backend
pip install -r requirements.txt
cp .env.example .env        # then fill in your database credentials
alembic upgrade head        # run migrations
python seed.py              # optional: load sample data
uvicorn app.main:app --reload
```

### Frontend

```bash
cd flashcard-app
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.
