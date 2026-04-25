import { useState, useEffect } from "react";

const OMDB_BASE = "https://www.omdbapi.com/";

function parseRatingPct(val) {
  if (!val) return 0;
  if (val.includes("/100")) return parseInt(val);
  if (val.includes("/10")) return parseFloat(val) * 10;
  if (val.includes("%")) return parseInt(val);
  return 0;
}

export default function DetailPanel({ imdbId, onClose }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imdbId) {
      setMovie(null);
      return;
    }

    const apiKey = import.meta.env.VITE_OMDB_API_KEY;
    if (!apiKey) return;

    setLoading(true);
    setError(null);

    fetch(`${OMDB_BASE}?apikey=${apiKey}&i=${imdbId}&plot=full`)
      .then((res) => res.json())
      .then((data) => {
        if (data.Response === "False") {
          setError(data.Error);
          return;
        }
        setMovie(data);
      })
      .catch(() => setError("Network error."))
      .finally(() => setLoading(false));
  }, [imdbId]);

  if (!imdbId) {
    return (
      <aside className="detail-panel empty">
        <div className="detail-empty-icon">◈</div>
        <p className="detail-empty-text">
          Select a film
          <br />
          to see details
        </p>
      </aside>
    );
  }

  if (loading) {
    return (
      <aside className="detail-panel">
        <div className="sheet-handle" aria-hidden="true" />
        <div className="detail-loading">
          <div className="detail-spinner" />
          <span className="detail-spinner-text">Fetching details…</span>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="detail-panel">
        <div className="sheet-handle" aria-hidden="true" />
        <button className="detail-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="detail-loading">
          <p style={{ color: "var(--red)", fontSize: "13px" }}>{error}</p>
        </div>
      </aside>
    );
  }

  if (!movie) return null;

  const imdbRating = movie.imdbRating !== "N/A" ? movie.imdbRating : null;
  const ratings = movie.Ratings || [];

  return (
    <aside className="detail-panel">
      <div className="detail-poster-wrap">
        <div className="sheet-handle" aria-hidden="true" />

        {movie.Poster && movie.Poster !== "N/A" ? (
          <img className="detail-poster" src={movie.Poster} alt={movie.Title} />
        ) : (
          <div
            className="detail-poster"
            style={{
              background: "var(--bg-raised)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              opacity: 0.2,
            }}>
            🎞
          </div>
        )}
        <div className="detail-poster-gradient" />
        <button
          className="detail-close"
          onClick={onClose}
          aria-label="Close panel">
          ✕
        </button>
      </div>

      <div className="detail-content">
        <span className="detail-type-badge">{movie.Type || "N/A"}</span>
        <h2 className="detail-title">{movie.Title}</h2>

        {movie.Plot && movie.Plot !== "N/A" && (
          <>
            <p className="detail-section-label">Synopsis</p>
            <p className="detail-plot">{movie.Plot}</p>
          </>
        )}

        <div className="detail-stats">
          <div className="stat-box">
            <div className="stat-label">Year</div>
            <div className="stat-value">{movie.Year || "—"}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Runtime</div>
            <div className="stat-value" style={{ fontSize: "13px" }}>
              {movie.Runtime || "—"}
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-label">IMDb</div>
            <div className="stat-value gold">★ {imdbRating || "—"}</div>
          </div>
        </div>

        {movie.Genre && movie.Genre !== "N/A" && (
          <>
            <p className="detail-section-label">Genre</p>
            <div className="detail-meta-row">
              {movie.Genre.split(",").map((g) => (
                <span key={g} className="meta-chip">
                  {g.trim()}
                </span>
              ))}
            </div>
          </>
        )}

        <div className="detail-people">
          {[
            { key: "Director", val: movie.Director },
            { key: "Cast", val: movie.Actors },
            { key: "Written by", val: movie.Writer },
            { key: "Country", val: movie.Country },
            { key: "Language", val: movie.Language },
            { key: "Box office", val: movie.BoxOffice },
          ]
            .filter(({ val }) => val && val !== "N/A")
            .map(({ key, val }) => (
              <div key={key} className="people-row">
                <span className="people-key">{key}</span>
                <span className="people-val" style={key === "Box office" ? { color: "var(--amber)" } : {}}>
                  {val}
                </span>
              </div>
            ))}
        </div>

        {ratings.length > 0 && (
          <div className="detail-ratings">
            <p
              className="detail-section-label"
              style={{ marginBottom: "0.75rem" }}>
              Ratings
            </p>
            {ratings.map((r) => (
              <div key={r.Source} className="rating-row">
                <span className="rating-source">{r.Source}</span>
                <div className="rating-bar">
                  <div className="rating-fill" style={{ width: `${parseRatingPct(r.Value)}%` }}/>
                </div>
                <span className="rating-val">{r.Value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
