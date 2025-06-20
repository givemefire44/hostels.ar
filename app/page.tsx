"use client";
import React, { useState, useRef } from "react";
import cities from "./data/cities.json";

interface City { name: string; slug: string; properties: number; booking_url: string; }

export default function HomePage() {
  const [busqueda, setBusqueda] = useState("");
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtradas = (cities as City[]).filter(c =>
    c.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!show || filtradas.length === 0) return;
    if (e.key === "ArrowDown") setSelected(s => Math.min(filtradas.length - 1, s + 1));
    if (e.key === "ArrowUp") setSelected(s => Math.max(-1, s - 1));
    if (e.key === "Enter" && selected >= 0) {
      window.open(filtradas[selected].booking_url, "_blank");
      setShow(false); setBusqueda(""); setSelected(-1);
    }
    if (e.key === "Escape") { setShow(false); setSelected(-1); }
  };

  return (
    <main style={{ maxWidth: 500, margin: "0 auto", padding: 32, position: "relative" }}>
      <h1 style={{ textAlign: "center", marginBottom: 32 }}>🏨 Hostels.ar</h1>
      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar ciudad o destino..."
          value={busqueda}
          onChange={e => { setBusqueda(e.target.value); setShow(true); setSelected(-1); }}
          onFocus={() => setShow(true)}
          onBlur={() => setTimeout(() => setShow(false), 100)}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: "12px",
            border: "1.5px solid #bdbdbd",
            fontSize: "1.1rem",
            boxShadow: "0 2px 8px #0001",
            marginBottom: 0,
          }}
          autoComplete="off"
        />
        {show && busqueda &&
          <ul className="suggestions">
            {filtradas.length === 0 ? (
              <li style={{ padding: 14, color: "#888" }}>No se encontraron ciudades.</li>
            ) : (
              filtradas.map((ciudad, i) => (
                <li
                  key={ciudad.slug}
                  tabIndex={0}
                  className={i === selected ? "selected" : ""}
                  onMouseDown={() => window.open(ciudad.booking_url, "_blank")}
                  onMouseEnter={() => setSelected(i)}
                  style={{
                    background: i === selected ? "#f0f4fa" : "#fff",
                  }}
                >
                  <img src="/icon-city.svg" alt="" width={22} height={22} style={{ marginRight: 8 }} />
                  <div>
                    <strong>{ciudad.name}</strong>
                    <div className="city-props">{ciudad.properties} alojamientos</div>
                  </div>
                </li>
              ))
            )}
          </ul>
        }
      </div>
      <style>{`
        ul.suggestions {
          position: absolute;
          width: 100%;
          background: #fff;
          border: 1px solid #bdbdbd;
          border-top: none;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 8px 24px #0002;
          z-index: 10;
          max-height: 300px;
          overflow-y: auto;
          margin-top: -1px;
          padding: 0;
        }
        ul.suggestions li {
          padding: 14px 16px;
          cursor: pointer;
          transition: background 0.12s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        ul.suggestions li.selected, ul.suggestions li:hover, ul.suggestions li:focus {
          background: #f0f4fa;
        }
        ul.suggestions li + li {
          border-top: 1px solid #f7f7f7;
        }
        ul.suggestions .city-props {
          color: #888;
          font-size: 0.95em;
        }
      `}
      </style>
    </main>
  );
}
