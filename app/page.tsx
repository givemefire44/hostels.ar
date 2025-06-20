"use client";
import React, { useState, useRef } from "react";
import cities from "./data/cities.json"; // Asegurate que tu cities.json esté bien

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

  const filtradas = busqueda
    ? (cities as City[]).filter(c =>
        c.name.toLowerCase().startsWith(busqueda.toLowerCase())
      )
    : [];

  // Manejo de teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!show || filtradas.length === 0) return;
    if (e.key === "ArrowDown") setSelected(s => Math.min(filtradas.length - 1, s + 1));
    if (e.key === "ArrowUp") setSelected(s => Math.max(0, s - 1));
    if (e.key === "Enter" && selected >= 0) {
      handleSelect(filtradas[selected]);
    }
    if (e.key === "Escape") { setShow(false); setSelected(-1); }
  };

  // Al seleccionar ciudad
  const handleSelect = (ciudad: City) => {
    setBusqueda(ciudad.name);
    setShow(false);
    setSelected(-1);
    // Automáticamente hace click en el botón si querés:
    window.open(ciudad.booking_url, "_blank");
  };

  // Click en ¡Vamos!
  const handleVamos = () => {
    const match = (cities as City[]).find(c => c.name.toLowerCase() === busqueda.toLowerCase());
    if (match) window.open(match.booking_url, "_blank");
  };

  return (
    <main className="main-bg">
      <form
        className="searchbar-container"
        onSubmit={e => { e.preventDefault(); handleVamos(); }}
        autoComplete="off"
      >
        <div className="searchbar">
          <span className="search-icon">
            <svg width={18} height={18} fill="none" stroke="#6c6c6c" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="¿A dónde quieres ir?"
            value={busqueda}
            onChange={e => {
              setBusqueda(e.target.value);
              setShow(true);
              setSelected(-1);
            }}
            onFocus={() => { if (busqueda) setShow(true); }}
            onBlur={() => setTimeout(() => setShow(false), 120)}
            onKeyDown={handleKeyDown}
            className="search-input"
            style={{ fontWeight: busqueda ? "bold" : undefined }}
          />
          <button
            className="vamos-btn"
            type="submit"
            disabled={!busqueda}
          >
            ¡Vamos! <span style={{ marginLeft: 6 }}>→</span>
          </button>
        </div>
        {show && filtradas.length > 0 &&
          <ul className="suggestions-dropdown">
            {filtradas.map((ciudad, i) => (
              <li
                key={ciudad.slug}
                tabIndex={0}
                className={i === selected ? "selected" : ""}
                onMouseDown={() => handleSelect(ciudad)}
                onMouseEnter={() => setSelected(i)}
              >
                <span className="city-emoji" role="img" aria-label="Ciudad">🏙️</span>
                <span className="city-name">
                  {ciudad.name}
                </span>
                <span className="city-props">
                  {ciudad.properties} alojamientos
                </span>
              </li>
            ))}
          </ul>
        }
      </form>
      <style>{`
        .main-bg {
          min-height: 100vh;
          background: linear-gradient(180deg, #a34fcb 0%, #c973d9 100%);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 80px;
        }
        .searchbar-container {
          position: relative;
          width: 430px;
        }
        .searchbar {
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 14px #0002;
          padding: 7px 10px 7px 14px;
          gap: 8px;
        }
        .search-icon {
          display: flex;
        }
        .search-input {
          flex: 1 1 0%;
          border: none;
          outline: none;
          font-size: 1.20rem;
          background: none;
          padding: 10px 7px;
          font-weight: bold;
        }
        .vamos-btn {
          background: #ff6600;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          padding: 10px 23px;
          margin: 0 3px 0 9px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .vamos-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .suggestions-dropdown {
          position: absolute;
          left: 0;
          top: 105%;
          width: 100%;
          background: #fff;
          border-radius: 15px;
          box-shadow: 0 8px 32px 0 #0003;
          z-index: 20;
          margin-top: 8px;
          padding: 0;
          list-style: none;
          max-height: 260px;
          overflow-y: auto;
        }
        .suggestions-dropdown li {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 18px;
          cursor: pointer;
          border: 2px solid transparent;
          font-size: 1.05em;
          transition: background 0.14s, border 0.14s;
          border-radius: 10px;
          margin: 3px 8px;
        }
        .suggestions-dropdown li.selected,
        .suggestions-dropdown li:hover,
        .suggestions-dropdown li:focus {
          background: #f0f4fa;
          border: 2px solid #a34fcb;
          font-weight: bold;
        }
        .city-emoji {
          font-size: 1.18em;
        }
        .city-name {
          font-size: 1.07em;
          font-weight: 500;
        }
        .city-props {
          color: #888;
          font-size: 0.99em;
          margin-left: auto;
        }
        @media (max-width: 600px) {
          .searchbar-container {
            width: 99vw;
            min-width: unset;
            max-width: 99vw;
          }
        }
      `}</style>
    </main>
  );
}
