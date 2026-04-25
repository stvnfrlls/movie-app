import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useMovieSearch } from "../hooks/useMovieSearch";
import MovieCard from "../components/MovieCard";
import DetailPanel from "../components/DetailPanel";
import Pagination from "../components/Pagination";

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
    const { selectedType } = useOutletContext();

    const {
        query,
        handleQueryChange,
        movies,
        total,
        totalPages,
        page,
        setPage,
        selectedYear,
        handleYearChange,
        sortOrder,
        setSortOrder,
        loading,
        error,
    } = useMovieSearch({ selectedType });
  
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const isMobile = window.innerWidth <= 900;
        if (selectedId && isMobile) {
        document.body.style.overflow = "hidden";
        } else {
        document.body.style.overflow = "";
        }
        return () => {
        document.body.style.overflow = "";
        };
    }, [selectedId]);

    const handleClose = () => setSelectedId(null);

    const hasResults = movies.length > 0;
    const hasQuery = query.length >= 2;

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

                    <input id="searchInput" type="text" placeholder="Search movies, shows, directors…" autoComplete="off" value={query} onChange={(e) => handleQueryChange(e.target.value)} />

                    {loading && <div className="spinner" />}

                    {query && !loading && (
                        <button className="search-clear" onClick={() => handleQueryChange("")}>✕</button>
                    )}
                </div>
            </section>

            {hasQuery && (
                <div className="filters">
                    <span className="filter-label">Year</span>
                    {YEAR_FILTERS.map((f) => (
                        <button key={f.value} className={`filter-btn ${selectedYear === f.value ? "active" : ""}`} onClick={() => handleYearChange(f.value)}> {f.label}</button>
                    ))}
                </div>
            )}

            {hasQuery && !error && (
                <div className="results-bar">
                    <span className="results-count">
                        {loading ? ("Searching…") : (<><span>{total.toLocaleString()}</span> results for "{query}"</>)}
                    </span>
                    <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="relevance">Relevance</option>
                        <option value="year_desc">Newest first</option>
                        <option value="year_asc">Oldest first</option>
                        <option value="title_asc">A → Z</option>
                    </select>
                </div>
            )}

            <div className="main">
                <div>
                    <div className="movie-grid">
                        {loading && Array(8).fill(null).map((_, i) => (
                            <div key={i} className="skeleton-card">
                                <div className="skeleton-poster" />
                                <div className="skeleton-info">
                                <div className="skeleton-line" />
                                <div className="skeleton-line short" />
                                </div>
                            </div>
                        ))}

                        {!loading && error && (
                            <div className="empty-state">
                                <div className="empty-icon">⬡</div>
                                <p className="empty-title">Nothing found.</p>
                                <p className="empty-sub">{error}</p>
                            </div>
                        )}

                        {!loading && !hasQuery && (
                            <div className="welcome-state" style={{ gridColumn: "1 / -1" }}>
                                <p className="welcome-text">Search for your favourite film to begin.</p>
                                <div className="suggest-chips">
                                {["Inception","The Godfather","Dune","Breaking Bad","Parasite","Interstellar",].map((term) => (
                                    <span key={term} className="suggest-chip" onClick={() => handleQueryChange(term)}>{term}</span>
                                ))}
                                </div>
                            </div>
                        )}

                        {!loading && hasResults && movies.map((movie) => (
                            <MovieCard key={movie.imdbID} movie={movie} isSelected={movie.imdbID === selectedId} onClick={() => setSelectedId(movie.imdbID)} />
                        ))}
                    </div>

                    {!loading && totalPages > 1 && (
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => {
                            setPage(p);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}/>
                    )}
                </div>

                <DetailPanel imdbId={selectedId} onClose={handleClose} />
            </div>

            <div className={`detail-backdrop ${selectedId ? "visible" : ""}`} onClick={handleClose} aria-hidden="true"/>
        </>
    );
}
