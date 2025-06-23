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
    if (e.key === "ArrowDown")
      setHovered(h => h === null ? 0 : Math.min(filtradas.length - 1, h! + 1));
    if (e.key === "ArrowUp")
      setHovered(h => h === null ? filtradas.length - 1 : Math.max(0, h! - 1));
    if (e.key === "Enter" && hovered !== null) {
      handleSelect(filtradas[hovered]);
    }
    if (e.key === "Escape") {
      setShow(false);
      setHovered(null);
    }
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
        />
        {busqueda && (
          <button
            type="button"
            className="clear-btn"
            aria-label="Limpiar"
            onClick={() => {
              setBusqueda("");
              setShow(false);
              setHovered(null);
              inputRef.current?.focus();
            }}
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
  <span className="buscar-text">¡Buscar!</span>
  <span className="buscar-arrow" aria-hidden="true">
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" stroke="#18120b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12.5" x2="19" y2="12.5"/>
      <polyline points="12.5,6 19,12.5 12.5,19"/>
    </svg>
  </span>
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
                className={isActive ? "active" : ""}
                onMouseDown={() => handleSelect(ciudad)}
                onMouseEnter={() => setHovered(i)}
              >
                <div className={
                  "item-row" +
                  (isActive ? " hovered" : "") +
                  (isSelected ? " selected" : "")
                }>
                  <span className="city-icon" role="img" aria-label="Ciudad">🏙️</span>
                  <span className={
                    "city-name" + ((isActive || isSelected) ? " bold" : "")
                  }>
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
    </form>
  );
}
