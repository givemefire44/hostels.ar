"use client";
import React, { useState, useRef } from "react";
import cities from "../data/cities.json";

interface City {
  name: string;
  slug: string;
  properties: number;
  booking_url: string;
}

export default function CitySearch() {
  const [busqueda, setBusqueda] = useState("");
  const [show, setShow] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtradas: City[] = busqueda
    ? (cities as City[]).filter(c =>
        c.name.toLowerCase().includes(busqueda.toLowerCase())
      )
    : [];

  const handleSelect = (ciudad: City) => {
    setBusqueda(ciudad.name);
    setShow(false);
    setHovered(null);
    setSelectedCity(ciudad);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!show || filtradas.length === 0) return;
    if (e.key === "ArrowDown") setHovered(h => h === null ? 0 : Math.min(filtradas.length - 1, h! + 1));
    if (e.key === "ArrowUp") setHovered(h => h === null ? filtradas.length - 1 : Math.max(0, h! - 1));
    if (e.key === "Enter" && hovered !== null) {
      handleSelect(filtradas[hovered]);
    }
    if (e.key === "Escape") { setShow(false); setHovered(null); }
  };

  const handleVamos = () => {
    const match = (cities as City[]).find(
      c => c.name.toLowerCase() === busqueda.toLowerCase()
    );
    if (match) window.open(match.booking_url, "_blank");
  };

  return (
    <form
      className="search-bar-wrap"
      autoComplete="off"
      onSubmit={e => { e.preventDefault(); handleVamos(); }}
    >
      <div className="search-bar vedette">
        <span className="search-icon">
          <svg width={22} height={22} fill="none" stroke="#6c6c6c" strokeWidth="2" viewBox="0 0 24 24">
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
            setHovered(null);
          }}
          onFocus={() => { if (busqueda) setShow(true); }}
          onBlur={() => setTimeout(() => setShow(false), 120)}
          onKeyDown={handleKeyDown}
          className="search-input"
          style={{ fontWeight: 400 }}
        />
        {busqueda && (
          <button
            type="button"
            className="clear-btn"
            aria-label="Limpiar"
            onClick={() => { setBusqueda(""); setShow(false); setHovered(null); inputRef.current?.focus(); }}
          >
            <svg width={18} height={18} viewBox="0 0 20 20">
              <line x1="5" y1="5" x2="15" y2="15" stroke="#444" strokeWidth="2"/>
              <line x1="15" y1="5" x2="5" y2="15" stroke="#444" strokeWidth="2"/>
            </svg>
          </button>
        )}
        <button
          className="vamos-btn maize"
          type="submit"
          disabled={!busqueda}
        >
          ¡Buscar!
        </button>
      </div>
      {show && filtradas.length > 0 &&
        <ul className="dropdown">
          {filtradas.map((ciudad, i) => {
            const isActive = hovered === i;
            const isSelected = selectedCity && selectedCity.name === ciudad.name;
            return (
              <li
                key={ciudad.slug}
                className={`${isActive ? "active" : ""}`}
                onMouseDown={() => handleSelect(ciudad)}
                onMouseEnter={() => setHovered(i)}
              >
                <div className={`item-row${isActive ? " hovered" : ""}${isSelected ? " selected" : ""}`}>
                  <span className="city-icon" role="img" aria-label="Ciudad">🏙️</span>
                  <span className={`city-name${isActive || isSelected ? " bold" : ""}`}>
                    {ciudad.name}
                  </span>
                  <span className="city-props">
                    {ciudad.properties} alojamientos
                  </span>
                  {isActive && (
                    <span className="selected-check">
                      <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="8" stroke="#8f2fbf" strokeWidth="2"/>
                        <path d="M7 10.5L9.5 13 13 8.5" stroke="#8f2fbf" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      }
      <style>{`
        .search-bar-wrap {
          width: 100%;
          max-width: 780px;
          margin: 0 auto;
          position: relative;
          z-index: 4;
        }
        .search-bar.vedette {
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 22px;
          box-shadow: 0 5px 32px #0001;
          padding: 14px 18px 14px 22px;
          gap: 10px;
          min-height: 64px;
        }
        .search-icon {
          display: flex;
        }
        .search-input {
          flex: 1 1 0%;
          border: none;
          outline: none;
          font-size: 1.32rem;
          background: none;
          padding: 19px 9px 18px 9px;
          font-weight: 400;
        }
        .clear-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          margin-right: 1px;
          display: flex;
          align-items: center;
        }
        .vamos-btn.maize {
          background: #ffe236; /* Maíz */
          color: #6b4700;
          border: none;
          border-radius: 16px;
          font-size: 1.21rem;
          font-weight: 800;
          padding: 12px 40px;
          margin: 0 0 0 16px;
          cursor: pointer;
          box-shadow: 0 1px 6px #0001;
          transition: background 0.16s, color 0.16s;
        }
        .vamos-btn.maize:disabled {
          background: #eee;
          color: #bbb;
          cursor: not-allowed;
        }
        .vamos-btn.maize:hover:not(:disabled) {
          background: #ffb700; /* Naranja fuerte */
          color: #fff;
        }
        .dropdown {
          position: absolute;
          left: 0;
          top: 110%;
          width: 100%;
          background: #fff;
          border-radius: 15px;
          box-shadow: 0 8px 32px 0 #0003;
          z-index: 30;
          margin-top: 7px;
          padding: 0;
          list-style: none;
          max-height: 275px;
          overflow-y: auto;
        }
        .dropdown li {
          padding: 0;
          margin: 0 9px;
        }
        .item-row {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 14px 12px;
          border-radius: 10px;
          transition: background 0.13s, border 0.13s;
          position: relative;
          border: 2px solid transparent;
          background: none;
        }
        .item-row.hovered {
          background: #f0f4fa;
          border: 2px solid #8f2fbf;
        }
        .item-row.selected {
          font-weight: bold;
          color: #5e1f8a;
        }
        .city-icon {
          font-size: 1.25em;
        }
        .dropdown .city-name { color: #2d2d2d; }
        .dropdown .city-name.bold { color: #5e1f8a; }
        .city-name {
          font-size: 1.09em;
          font-weight: 500;
        }
        .city-name.bold {
          font-weight: bold;
        }
        .city-props {
          color: #888;
          margin-left: auto;
          font-size: 0.99em;
        }
        .selected-check {
          margin-left: 8px;
          display: flex;
        }
        @media (max-width: 900px) {
          .search-bar-wrap {
            max-width: 98vw;
          }
        }
        @media (max-width: 600px) {
          .search-bar.vedette { flex-direction: column; padding: 14px 7px; }
          .vamos-btn.maize { margin: 12px 0 0 0; width: 100%; }
          .search-bar-wrap { max-width: 100vw; }
        }
      `}</style>
    </form>
  );
}
