"use client";
import React, { useState, useRef } from "react";
import cities from "./data/cities.json";

interface City {
  name: string;
  slug: string;
  properties: number;
  booking_url: string;
}

export default function HomePage() {
  const [busqueda, setBusqueda] = useState("");
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtradas = (cities as City[]).filter((c) =>
    c.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!show || filtradas.length === 0) return;
    if (e.key === "ArrowDown") setSelected((s) => Math.min(filtradas.length - 1, s + 1));
    if (e.key === "ArrowUp") setSelected((s) => Math.max(-1, s - 1));
    if (e.key === "Enter" && selected >= 0) {
      window.open(filtradas[selected].booking_url, "_blank");
      setShow(false);
      setBusqueda("");
      setSelected(-1);
    }
    if (e.key === "Escape") {
      setShow(false);
      setSelected(-1);
    }
  };

  // Al hacer click en el botón "¡Vamos!", abre la primera coincidencia si existe
  const handleVamos = () => {
    if (filtradas.length > 0) {
      window.open(filtradas[0].booking_url, "_blank");
      setBusqueda("");
      setShow(false);
      setSelected(-1);
    }
  };

  return (
    <main className="main-bg">
      <div className="searchbar-container">
        <div className="searchbar">
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
            onBlur={() => setTimeout(() => setShow(false), 100)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            className="search-input"
          />
          <button
            className="vamos-btn"
            onClick={handleVamos}
            disabled={filtradas.length === 0}
            tabIndex={0}
          >
            ¡Vamos! <span style={{ marginLeft: 6 }}>→</span>
          </button>
          {show && busqueda &&
            <ul className="suggestions">
              {filtradas.length === 0 ? (
                <li className="no-results">No se encontraron ciudades.</li>
              ) : (
                filtradas.map((ciudad, i) => (
                  <li
                    key={ciudad.slug}
                    tabIndex={0}
                    className={i === selected ? "selected" : ""}
                    onMouseDown={() => window.open(ciudad.booking_url, "_blank")}
                    onMouseEnter={() => setSelected(i)}
                  >
                    <span className="city-emoji" role="img" aria-label="City">🏙️</span>
                    <strong>{ciudad.name}</strong>
                    <span className="city-props">{ciudad.properties} alojamientos</span>
                  </li>
                ))
              )}
            </ul>
          }
        </div>
        <div className="info-row">
          <span className="calendar-confirmation">
            <svg width={24} height={24} fill="none" viewBox="0 0 24 24" style={{ verticalAlign: "middle" }}>
              <rect x="3" y="4" width="18" height="17" rx="3" fill="#fff" stroke="#4caf50" strokeWidth="2" />
              <path d="M7 11l3 3 5-5" stroke="#4caf50" strokeWidth="2" fill="none" />
              <rect x="7.5" y="2" width="1.5" height="4" rx="0.75" fill="#4caf50" />
              <rect x="15" y="2" width="1.5" height="4" rx="0.75" fill="#4caf50" />
            </svg>
            <b> Cancelación gratuita</b> y <b>reservacion flexible</b> disponibles
          </span>
        </div>
      </div>
      <style>{`
        .main-bg {
          min-height: 100vh;
          background: linear-gradient(180deg, #8f2fbf 0%, #e3defc 100%);
          padding-top: 56px;
        }
        .searchbar-container {
          max-width: 700px;
          margin: 0 auto;
        }
        .searchbar {
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 6px 32px #0001;
          padding: 0 0 0 16px;
          position: relative;
          min-height: 60px;
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
          padding: 18px 12px 18px 0;
          background: none;
        }
        .vamos-btn {
          background: #ff6600;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 1.16rem;
          font-weight: 600;
          padding: 10px 28px;
          margin: 8px 12px 8px 6px;
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
        .suggestions {
          position: absolute;
          left: 0;
          top: 100%;
          width: 100%;
          background: #fff;
          border: 1.5px solid #e3e3e3;
          border-top: none;
          border-radius: 0 0 16px 16px;
          box-shadow: 0 4px 32px #0001;
          z-index: 10;
          max-height: 280px;
          overflow-y: auto;
          margin-top: -2px;
          padding: 0;
        }
        .suggestions li {
          padding: 12px 20px;
          cursor: pointer;
          transition: background 0.12s;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.08em;
        }
        .suggestions li.selected,
        .suggestions li:hover,
        .suggestions li:focus {
          background: #f0f4fa;
        }
        .no-results {
          padding: 14px;
          color: #888;
        }
        .city-emoji {
          font-size: 1.2em;
          margin-right: 4px;
        }
        .city-props {
          color: #888;
          margin-left: 8px;
          font-size: 0.98em;
        }
        .info-row {
          margin-top: 18px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .calendar-confirmation {
          color: #222;
          font-size: 1.03em;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        @media (max-width: 600px) {
          .searchbar {
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            padding: 14px 6px 8px 8px;
            min-height: unset;
          }
          .vamos-btn {
            width: 100%;
            margin: 6px 0 0 0;
            font-size: 1.06em;
            padding: 10px 0;
          }
        }
      `}</style>
    </main>
  );
}
