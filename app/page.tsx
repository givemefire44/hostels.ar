"use client";

import React, { useState, useRef } from "react";
import cities from "./data/cities.json"; // Cambia el path si tu cities.json está en otro lado

interface City {
  name: string;
  slug: string;
  properties: number;
  booking_url: string;
}

export default function HomePage() {
  const [busqueda, setBusqueda] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtra las ciudades según lo que escribas
  const ciudadesFiltradas = (cities as City[]).filter((c) =>
    c.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Cierra las sugerencias al perder foco (con delay para permitir el click)
  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100);
  };

  // Abre el link de Booking al seleccionar una ciudad
  const handleSelect = (url: string) => {
    window.open(url, "_blank");
    setBusqueda(""); // Limpiar input
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  return (
    <main style={{ maxWidth: 500, margin: "0 auto", padding: 32 }}>
      <h1 style={{ fontSize: "2rem", textAlign: "center", marginBottom: 32 }}>
        🏨 Hostels.ar
      </h1>
      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar ciudad..."
          value={busqueda}
          onChange={e => {
            setBusqueda(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={handleBlur}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ddd",
            fontSize: 18,
            marginBottom: 0,
          }}
          autoComplete="off"
        />

        {showSuggestions && busqueda && (
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              position: "absolute",
              width: "100%",
              background: "#fff",
              border: "1px solid #ddd",
              borderTop: "none",
              zIndex: 10,
              maxHeight: 220,
              overflowY: "auto",
              boxShadow: "0 2px 8px #0002"
            }}
          >
            {ciudadesFiltradas.length === 0 ? (
              <li style={{ padding: 12, color: "#888" }}>No se encontraron ciudades.</li>
            ) : (
              ciudadesFiltradas.map((ciudad) => (
                <li
                  key={ciudad.slug}
                  tabIndex={0}
                  style={{
                    padding: 12,
                    cursor: "pointer",
                    borderBottom: "1px solid #f0f0f0",
                    background: "#fff"
                  }}
                  onMouseDown={() => handleSelect(ciudad.booking_url)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSelect(ciudad.booking_url);
                  }}
                >
                  <strong>{ciudad.name}</strong>
                  <span style={{ color: "#888", marginLeft: 8 }}>
                    ({ciudad.properties} alojamientos)
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </main>
  );
}
