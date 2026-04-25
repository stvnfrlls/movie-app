import { useState, useEffect, useRef, useCallback } from "react";

const OMDB_BASE = "https://www.omdbapi.com/";

export function useMovieSearch({ selectedType }) {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [selectedYear, setSelectedYear] = useState("");
    const [sortOrder, setSortOrder] = useState("relevance");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiKey] = useState(
        () => import.meta.env.VITE_OMDB_API_KEY || ""
    );

    const debounceRef = useRef(null);

    const fetchMovies = useCallback(
        async (searchQuery, pageNum, year) => {
            if (!apiKey || searchQuery.length < 2) return;
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({ apikey: apiKey, s: searchQuery, page: pageNum });
            if (selectedType) params.set("type", selectedType);

            const isDecade = ["2010s", "2000s", "1990s"].includes(year);
            if (year && !isDecade) params.set("y", year);

            try {
                const res = await fetch(`${OMDB_BASE}?${params}`);
                const data = await res.json();

                if (data.Response === "False") {
                    setError(data.Error || "No results found.");
                    setMovies([]);
                    setTotal(0);
                    return;
                }

                let results = data.Search || [];

                if (year === "2010s") results = results.filter((m) => m.Year >= "2010" && m.Year <= "2019");
                if (year === "2000s") results = results.filter((m) => m.Year >= "2000" && m.Year <= "2009");
                if (year === "1990s") results = results.filter((m) => m.Year <= "1999");

                setMovies(results);
                setTotal(parseInt(data.totalResults) || 0);
            } catch {
                setError("Network error. Please check your connection.");
                setMovies([]);
            } finally {
                setLoading(false);
            }
        },
        [apiKey, selectedType]
    );

    useEffect(() => {
        if (query.length >= 2) fetchMovies(query, page, selectedYear);
    }, [page, selectedYear, selectedType]);

    const handleQueryChange = useCallback(
        (val) => {
            setQuery(val);
            setPage(1);
            clearTimeout(debounceRef.current);
            if (val.length < 2) { setMovies([]); setTotal(0); return; }
            debounceRef.current = setTimeout(() => fetchMovies(val, 1, selectedYear), 400);
        },
        [fetchMovies, selectedYear]
    );

    const handleYearChange = (year) => {
        setSelectedYear(year);
        setPage(1);
    };

    const sortedMovies = [...movies].sort((a, b) => {
        if (sortOrder === "year_desc") return (b.Year || "").localeCompare(a.Year || "");
        if (sortOrder === "year_asc") return (a.Year || "").localeCompare(b.Year || "");
        if (sortOrder === "title_asc") return a.Title.localeCompare(b.Title);
        return 0;
    });

    const totalPages = Math.ceil(total / 10);

    return {
        query, handleQueryChange,
        movies: sortedMovies,
        total, totalPages,
        page, setPage,
        selectedYear, handleYearChange,
        sortOrder, setSortOrder,
        loading, error,
    };
}