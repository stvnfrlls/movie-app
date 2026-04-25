export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Build page number array with ellipsis markers
  const buildPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push("…");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("…");
    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}>
        ←
      </button>

      {buildPages().map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="page-ellipsis">
            …
          </span>
        ) : (
          <button
            key={p}
            className={`page-btn ${p === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(p)}>
            {p}
          </button>
        ),
      )}

      <button
        className="page-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}>
        →
      </button>
    </div>
  );
}
