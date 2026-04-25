# Cinerama

A dark, cinema-themed movie search app built with React and the [OMDB API](https://www.omdbapi.com/). Search any film, series, or episode — click a result to see the full detail panel with ratings, cast, plot, and box office data.

![favicon](./favicon.svg)

---

## Features

- Full-text search with debouncing against the OMDB API
- Filter by type — Films, Series, Episodes, or All
- Filter results by year or decade
- Sort by relevance, year (newest/oldest), or title
- Detail panel showing synopsis, IMDb rating, Rotten Tomatoes, Metacritic, cast, director, runtime, box office
- Skeleton loading states and graceful error handling
- Paginated results (10 per page, OMDB max)
- Responsive — sidebar panel on desktop, slide-up bottom sheet on mobile
- Grain texture overlay, amber accent palette, Playfair Display + DM Sans typography

---

## Tech Stack

- [React 18](https://react.dev/) with [React Router v6](https://reactrouter.com/)
- [Vite](https://vitejs.dev/) for dev server and bundling
- Vanilla CSS with custom properties — no UI framework
- [OMDB API](https://www.omdbapi.com/) — free tier supports 1,000 daily requests

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/stvnfrlls/movie-app.git
cd movie-app
npm install
```

### 2. Get an OMDB API key

Register for a free key at [omdbapi.com](https://www.omdbapi.com/apikey.aspx). The free tier allows 1,000 requests/day, which is enough for development.

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
VITE_OMDB_API_KEY=your_api_key_here
```

Vite only exposes variables prefixed with `VITE_` to the client bundle. Never commit your `.env` file — it's already in `.gitignore`.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 5. Build for production

```bash
npm run build
```

---

## Project Structure

```
cinerama/
├── src/
│   ├── components/
│   │   ├── DetailPanel.jsx   # Movie detail sidebar / mobile bottom sheet
│   │   ├── MovieCard.jsx     # Grid card with poster, title, year, type
│   │   └── Pagination.jsx    # Page controls with ellipsis
│   ├── hooks/
│   │   └── useMovieSearch.js # Search state, debounce, year/sort logic
│   ├── layouts/
│   │   └── MainLayout.jsx    # Header, nav, Outlet wrapper
│   ├── pages/
│   │   └── Home.jsx          # Search, filters, grid, detail panel
│   ├── index.css             # All styles — design tokens, layout, responsive
│   └── main.jsx              # React entry point, router setup
├── .env                      # VITE_OMDB_API_KEY (not committed)
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_OMDB_API_KEY` | Yes | Your OMDB API key from omdbapi.com |

---

## OMDB API Notes

The app uses two OMDB endpoints:

- **Search** (`?s=...&type=...&y=...&page=...`) — returns up to 10 results per page with a total count. Used by `useMovieSearch`.
- **Detail** (`?i=tt1234567&plot=full`) — returns full metadata for a single title. Used by `DetailPanel` on card click.

OMDB does not support sorting natively — year and title sorts are applied client-side on the current page of results only. If you need accurate cross-page sorting, you would need to fetch all pages first, which is impractical at 1,000 req/day on the free tier.

---

## License

MIT