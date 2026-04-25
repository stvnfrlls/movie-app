export default function MovieCard({ movie, isSelected, onClick }) {
  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <div
      className={`movie-card ${isSelected ? "selected" : ""}`}
      onClick={onClick}>
      {hasPoster ? (
        <img
          className="card-poster"
          src={movie.Poster}
          alt={movie.Title}
          loading="lazy"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextElementSibling.style.display = "flex";
          }}
        />
      ) : null}

      <div
        className="card-poster-placeholder"
        style={{ display: hasPoster ? "none" : "flex" }}>
        <span className="placeholder-icon">🎞</span>
        <span style={{ fontSize: "10px", color: "var(--text-3)" }}>
          No poster
        </span>
      </div>

      <div className="card-overlay">
        <button className="overlay-btn">View details</button>
      </div>

      <div className="card-info">
        <div className="card-title">{movie.Title}</div>
        <div className="card-meta">
          <span className="card-year">{movie.Year || "—"}</span>
          <span className="card-type">{movie.Type || "N/A"}</span>
        </div>
      </div>
    </div>
  );
}
