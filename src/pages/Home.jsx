const YEAR_FILTERS = [
  { label: "All time", value: "" },
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
  { label: "2022", value: "2022" },
  { label: "2010s", value: "2010s" },
  { label: "2000s", value: "2000s" },
  { label: "90s & earlier", value: "1990s" },
];

export default function Home() {
    return (
        <>
            <section className="hero">
                <p className="hero-eyebrow">Powered by OMDB</p>
                <h1 className="hero-title">Discover <em>great</em><br /> cinema.</h1>
                <p className="hero-sub">Search any film, series, or episode from the world's largest movie database.</p>

                <div className="search-wrap">
                    <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
                    </svg>

                    <input id="searchInput" type="text" placeholder="Search movies, shows, directors…" autoComplete="off" value="" />
                </div>
            </section>

            <div className="filters">
                <span className="filter-label">Year</span>
                {YEAR_FILTERS.map((f) => (
                    <button key={f.value} className="filter-btn"> {f.label}</button>
                ))}
            </div>

            <div className="main">
                <div className="movie-grid">
                    <div className="welcome-state" style={{ gridColumn: "1 / -1" }}>
                        <p className="welcome-text">Search for your favourite film to begin.</p>
                        <div className="suggest-chips">
                        {["Inception","The Godfather","Dune","Breaking Bad","Parasite","Interstellar",].map((term) => (
                            <span key={term} className="suggest-chip">{term}</span>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
