"use client";
import React, { useState, useRef } from "react";
import cities from "./data/cities.json";

interface City {
  name: string;
  country?: string;
  slug: string;
  properties?: number;
  booking_url: string;
}

export default function HomePage() {
  const [busqueda, setBusqueda] = useState("");
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtradas: City[] = busqueda
    ? (cities as City[]).filter(c =>
        c.name.toLowerCase().includes(busqueda.toLowerCase())
      )
    : [];

  // Selección de ciudad
  const handleSelect = (ciudad: City) => {
    setBusqueda(`${ciudad.name}${ciudad.country ? ', ' + ciudad.country : ''}`);
    setShow(false);
    setSelected(-1);
    inputRef.current?.blur();
  };

  // Teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!show || filtradas.length === 0) return;
    if (e.key === "ArrowDown") setSelected(s => Math.min(filtradas.length - 1, s + 1));
    if (e.key === "ArrowUp") setSelected(s => Math.max(0, s - 1));
    if (e.key === "Enter" && selected >= 0) {
      handleSelect(filtradas[selected]);
    }
    if (e.key === "Escape") { setShow(false); setSelected(-1); }
  };

  // Botón vamos
  const handleVamos = () => {
    const match = (cities as City[]).find(
      c => `${c.name}${c.country ? ', ' + c.country : ''}`.toLowerCase() === busqueda.toLowerCase()
    );
    if (match) window.open(match.booking_url, "_blank");
  };

  return (
    <main className="main-bg">
      <form
        className="search-bar-wrap"
        autoComplete="off"
        onSubmit={e => { e.preventDefault(); handleVamos(); }}
      >
        <div className="search-bar">
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
          />
          {busqueda && (
            <button
              type="button"
              className="clear-btn"
              aria-label="Limpiar"
              onClick={() => { setBusqueda(""); setShow(false); setSelected(-1); inputRef.current?.focus(); }}
            >
              <svg width={16} height={16} viewBox="0 0 20 20"><line x1="5" y1="5" x2="15" y2="15" stroke="#444" strokeWidth="2"/><line x1="15" y1="5" x2="5" y2="15" stroke="#444" strokeWidth="2"/></svg>
            </button>
          )}
          <button
            className="vamos-btn"
            type="submit"
            disabled={!busqueda}
          >
            ¡Vamos! <span style={{ marginLeft: 6 }}>→</span>
          </button>
        </div>

        {show && filtradas.length > 0 &&
          <ul className="dropdown">
            {filtradas.map((ciudad, i) => (
              <li
                key={ciudad.slug}
                className={i === selected ? "active" : ""}
                onMouseDown={() => handleSelect(ciudad)}
                onMouseEnter={() => setSelected(i)}
              >
                <div className="item-row">
                  <span className="city-emoji" role="img" aria-label="Ciudad">🏙️</span>
                  <div className="city-data">
                    <span className={i === selected ? "city-name bold" : "city-name"}>
                      {ciudad.name}
                    </span>
                    <span className="city-country">
                      {ciudad.country || "Argentina"}
                    </span>
                  </div>
                  {typeof ciudad.properties === "number" && (
                    <span className="city-props">{ciudad.properties} alojamientos</span>
                  )}
                  {i === selected && (
                    <span className="selected-check">
                      <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="8" stroke="#8f2fbf" strokeWidth="2"/>
                        <path d="M7 10.5L9.5 13 13 8.5" stroke="#8f2fbf" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        }
      </form>
      <style>{`
        .main-bg {
          min-height: 100vh;
          background: linear-gradient(180deg, #8f2fbf 0%, #e3defc 100%);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 80px;
        }
        .search-bar-wrap {
          width: 420px;
          position: relative;
        }
        .search-bar {
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 2px 14px #0002;
          padding: 8px 12px 8px 14px;
          gap: 8px;
        }
        .search-icon {
          display: flex;
        }
        .search-input {
          flex: 1 1 0%;
          border: none;
          outline: none;
          font-size: 1.18rem;
          background: none;
          padding: 11px 7px;
        }
        .clear-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          margin-right: 2px;
          display: flex;
          align-items: center;
        }
        .vamos-btn {
          background: #ff6600;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 1.11rem;
          font-weight: 600;
          padding: 10px 23px;
          margin: 0 3px 0 8px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .vamos-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
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
          margin: 0 8px;
        }
        .item-row {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 15px 12px;
          border-radius: 10px;
          transition: background 0.12s, border 0.14s;
          position: relative;
        }
        .dropdown li.active .item-row,
        .dropdown li:hover .item-row {
          background: #f0f4fa;
          border: 2px solid #8f2fbf;
        }
        .city-emoji {
          font-size: 1.3em;
        }
        .city-data {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .city-name {
          font-size: 1.07em;
          font-weight: 500;
        }
        .city-name.bold {
          font-weight: bold;
        }
        .city-country {
          font-size: 0.98em;
          color: #878787;
        }
        .city-props {
          color: #888;
          margin-left: 8px;
          font-size: 0.98em;
        }
        .selected-check {
          margin-left: 8px;
          display: flex;
        }
        @media (max-width: 600px) {
          .search-bar-wrap {
            width: 98vw;
            min-width: unset;
            max-width: 99vw;
          }
        }
      `}</style>
    </main>
  );
}
