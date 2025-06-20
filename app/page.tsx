"use client";
import React, { useState, useRef } from "react";
import cities from "./data/cities.json";

interface City {
  name: string;
  slug: string;
  properties: number;
  booking_url: string;
  country?: string; // Puedes agregar país si lo tienes
}

export default function HomePage() {
  const [busqueda, setBusqueda] = useState("");
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtradas = (cities as City[]).filter((c) =>
    c.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Cuando selecciona una ciudad, traslada el nombre al input
  const handleSelect = (i: number) => {
    setBusqueda(filtradas[i].name);
    setShow(false);
    setSelected(-1);
    // Si quieres abrir el link directamente, también puedes: window.open(filtradas[i].booking_url, "_blank");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!show || filtradas.length === 0) return;
    if (e.key === "ArrowDown") setSelected(s => Math.min(filtradas.length - 1, s + 1));
    if (e.key === "ArrowUp") setSelected(s => Math.max(0, s - 1));
    if (e.key === "Enter" && selected >= 0) {
      handleSelect(selected);
    }
    if (e.key === "Escape") { setShow(false); setSelected(-1); }
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #8f2fbf 0%, #e3defc 100%)", paddingTop: 56 }}>
      <div className="searchbar-container">
        <div className="searchbar-big">
          <span className="search-icon">
            <svg width={20} height={20} fill="none" stroke="#6c6c6c" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="¿A dónde quieres ir?"
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setShow(true); setSelected(-1); }}
            onFocus={() => setShow(true)}
            onBlur={() => setTimeout(() => setShow(false), 120)}
            onKeyDown={handleKeyDown}
            className="search-input"
            autoComplete="off"
          />
          {busqueda && (
            <button className="clear-btn" onClick={() => setBusqueda("")} aria-label="Limpiar búsqueda">
              <svg width={18} height={18} viewBox="0 0 20 20"><line x1="5" y1="5" x2="15" y2="15" stroke="#444" strokeWidth="2"/><line x1="15" y1="5" x2="5" y2="15" stroke="#444" strokeWidth="2"/></svg>
            </button>
          )}
        </div>
        {show && busqueda &&
          <ul className="suggestions-dropdown">
            {filtradas.length === 0 ? (
              <li className="no-results">No se encontraron ciudades.</li>
            ) : (
              filtradas.map((ciudad, i) => (
                <li
                  key={ciudad.slug}
                  tabIndex={0}
                  className={i === selected ? "selected" : ""}
                  onMouseDown={() => handleSelect(i)}
                  onMouseEnter={() => setSelected(i)}
                >
                  <span className="city-emoji" role="img" aria-label="Ciudad">🏙️</span>
                  <div className="city-data">
                    <span className={i === selected ? "city-name bold" : "city-name"}>
                      {ciudad.name}
                    </span>
                    <span className="city-country">{ciudad.country || "Argentina"}</span>
                  </div>
                  {i === selected && (
                    <span className="selected-check">
                      <svg width={20} height={20} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#8f2fbf" strokeWidth="2"/><path d="M7 10.5L9 12.5L13 8.5" stroke="#8f2fbf" strokeWidth="2" strokeLinecap="round"/></svg>
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        }
      </div>
      <style>{`
        .searchbar-container {
          max-width: 550px;
          margin: 0 auto;
        }
        .searchbar-big {
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 14px #0002;
          padding: 8px 16px;
          position: relative;
          min-height: 54px;
          gap: 10px;
        }
        .search-icon {
          display: flex;
          align-items: center;
        }
        .search-input {
          flex: 1 1 0%;
          border: none;
          outline: none;
          font-size: 1.15rem;
          background: none;
          padding: 14px 8px;
        }
        .clear-btn {
          background: none;
          border: none;
          cursor: pointer;
          margin-right: 6px;
          display: flex;
          align-items: center;
        }
        .suggestions-dropdown {
          position: absolute;
          left: 0;
          top: 60px;
          width: 100%;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 8px 32px 0 #0003;
          z-index: 20;
          margin-top: 6px;
          padding: 0;
          list-style: none;
          max-height: 320px;
          overflow-y: auto;
          min-width: 350px;
        }
        .suggestions-dropdown li {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 22px;
          cursor: pointer;
          border: 2px solid transparent;
          font-size: 1.08em;
          transition: background 0.14s, border 0.14s;
        }
        .suggestions-dropdown li.selected,
        .suggestions-dropdown li:hover,
        .suggestions-dropdown li:focus {
          background: #f0f4fa;
          font-weight: bold;
          border: 2px solid #8f2fbf;
          outline: none;
        }
        .no-results {
          color: #888;
          padding: 18px;
          font-size: 1em;
        }
        .city-emoji {
          font-size: 1.3em;
          margin-right: 4px;
        }
        .city-data {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .city-name {
          font-size: 1.09em;
        }
        .city-name.bold {
          font-weight: bold;
        }
        .city-country {
          font-size: 0.96em;
          color: #888;
        }
        .selected-check {
          margin-left: 8px;
          display: flex;
        }
        @media (max-width: 600px) {
          .searchbar-container, .suggestions-dropdown {
            min-width: unset;
            width: 97vw;
          }
        }
      `}</style>
    </main>
  );
}
