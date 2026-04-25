import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const [selectedType, setSelectedType] = useState("movie");

  const navItems = [
    { label: "Films", value: "movie" },
    { label: "Series", value: "series" },
    { label: "Episodes", value: "episode" },
    { label: "All", value: "" },
  ];

  return (
    <div className="app-wrapper">
      <header>
        <div className="header-inner">
          <a href="#" className="logo">
            <span className="logo-dot"></span>
            Cinerama
          </a>

          <nav className="header-nav">
            {navItems.map((item) => (
              <button
                key={item.value}
                className={`nav-pill ${selectedType === item.value ? "active" : ""}`}
                onClick={() => setSelectedType(item.value)}>
                {" "}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <Outlet context={{ selectedType }} />
    </div>
  );
}
