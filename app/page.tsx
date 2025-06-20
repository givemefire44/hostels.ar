"use client";
import React, { useState, useRef } from "react";
import cities from "./data/cities.json"; // asegurate que tu cities.json tenga los campos name, slug, properties, booking_url, country

interface City {
  name: string;
  slug: string;
  properties: number;
  booking_url: string;
  country?: string;
}

export default function HomePage() {
  const [busqueda, setBusqueda] = useState("");
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrado de ciudades
  const filtradas = (cities as City[]).filter(c =>
    c.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Cuando seleccionás una ciudad, traslada al input y oculta el desplegable
  const handleSelect = (i: number) => {
    setBusqueda(filtradas[i].name);
    setShow(false);
    setSelected(-1);
    // Si querés abrir el link de Booking automáticamente, descomentá:
    // window.open(filtradas[i].booking_url, "_blank");
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

  // Al hacer click en "¡Vamos!", abre la primera coincidencia si existe
  const handleVamos = () => {
    if (filtradas.length > 0) {
      window.open(filtradas[0].booking_url, "_blank");
    }
  };

  return (
    <main className="main-bg">
      <div className="searchbar-container">
        <div className="searchbar">
          <span className="search-icon">
            <svg width={20} height={20} fill="none" stroke="#6c6c6c" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
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
            style={{ fontWeight: busqueda ? "bold" : undefined }}
          />
          <button
            className="vamos-btn"
            onClick={handleVamos}
            disabled={!filtradas.length}
            tabIndex={0}
          >
            ¡Vamos! <span style={{ marginLeft: 6 }}>→</span>
          </button>
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
                  <span className="city-icon" role="img" aria-label="Ciudad">🏙️</span>
                  <div className="city-data">
                    <span className={`city-name${i === selected ? " strong" : ""}`}>
                      {ciudad.name}
                    </span>
                    <span className="city-country">{ciudad.country || "Argentina"}</span>
                  </div>
                  {i === selected && (
                    <span className="selected-check">
                      <svg width={18} height={18} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#8f2fbf" strokeWidth="2"/><path d="M7 10.5L9.5 13 13 8.5" stroke="#8f2fbf" strokeWidth="2" strokeLinecap="round"/></svg>
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        }
      </div>
      <style>{`
        .main-bg {
          min-height: 100vh;
          background: linear-gradient(180deg, #8f2fbf 0%, #e3defc 100%);
          padding-top: 56px;
        }
        .searchbar-container {
          max-width: 520px;
          margin: 0 auto;
          padding-top: 40px;
        }
        .searchbar {
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 17px;
          box-shadow: 0 2px 14px #0002;
          padding: 8px 12px 8px 14px;
          min-height: 52px;
          gap: 6px;
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
          padding: 13px 7px;
        }
        .vamos-btn {
          background: #ff6600;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 1.17rem;
          font-weight: 600;
          padding: 10px 26px;
          margin: 0 5px 0 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background 0.15s;
          box-shadow: 0 2px 8px #ff660015;
        }
        .vamos-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .suggestions-dropdown {
          position: absolute;
          left: 0;
          top: 100%;
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
        }
        .suggestions-dropdown li {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 23px;
          cursor: pointer;
          border: 2px solid transparent;
          font-size: 1.08em;
          transition: background 0.14s, border 0.14s;
          border-radius: 14px;
          margin: 4px 8px;
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
        .city-icon {
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
        .city-name.strong {
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
