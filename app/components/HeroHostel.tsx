"use client";
import React, { useState } from "react";
import "./HeroHostel.css";

const CITIES = [
  "Buenos Aires",
  "Mendoza",
  "Córdoba",
  "Bariloche",
  "Salta",
  "Mar del Plata",
  "Rosario",
];

export default function HeroHostel() {
  const [city, setCity] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filtered, setFiltered] = useState(CITIES);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCity(val);
    setShowDropdown(!!val);
    setFiltered(
      CITIES.filter((c) =>
        c.toLowerCase().includes(val.toLowerCase())
      )
    );
  };
  const handleSelect = (city: string) => {
    setCity(city);
    setShowDropdown(false);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Buscando hostels en ${city || "..."}`);
  };

  return (
    <section className="hero-bg">
      <div className="container">
        <div className="hero-panel">
          <div className="hero-panel-content">
            <div className="hero-left">
              <h1>Conoce gente.</h1>
              <h2>¡Elige dónde quedarte y te mostraremos con quién!</h2>
            </div>
            <div className="hero-bubbles">
              <Bubble
                img="/avatars/1.png"
                flag="🇫🇷"
                message="Hostel bar, 9pm?"
                style={{ top: 20, left: 320 }}
              />
              <Bubble
                img="/avatars/2.png"
                flag="🇪🇸"
                message="Anyone else here solo travelling?"
                style={{ top: 85, left: 400 }}
              />
              <Bubble
                img="/avatars/3.png"
                flag="🇧🇷"
                message=""
                style={{ top: 145, left: 330 }}
              />
              <Bubble
                img="/avatars/4.png"
                flag="🇦🇷"
                message="Who's up for the walking tour?"
                style={{ top: 200, left: 450 }}
              />
            </div>
          </div>
          <form className="hero-search-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="hero-search-group">
              <input
                type="text"
                value={city}
                onChange={handleChange}
                onFocus={() => setShowDropdown(!!city)}
                placeholder="¿A dónde quieres ir?"
                className="hero-search-input"
                autoComplete="off"
              />
              {showDropdown && filtered.length > 0 && (
                <ul className="hero-search-dropdown">
                  {filtered.map((cityName) => (
                    <li
                      key={cityName}
                      onClick={() => handleSelect(cityName)}
                    >
                      {cityName}
                    </li>
                  ))}
                </ul>
              )}
              <button type="submit" className="hero-search-btn">
                Buscar
              </button>
            </div>
          </form>
        </div>
        <div className="hero-search-chips">
          <span>
            <span role="img" aria-label="calendar">📅</span> 
            <b>Cancelación gratuita</b> y <b>reservación flexible</b> disponibles
          </span>
        </div>
      </div>
    </section>
  );
}

function Bubble({ img, flag, message, style = {} }) {
  return (
    <div className="hero-bubble" style={style}>
      <div className="hero-bubble-avatar">
        <img src={img} alt="" />
        <span className="hero-bubble-flag">{flag}</span>
      </div>
      {message && <div className="hero-bubble-msg">{message}</div>}
    </div>
  );
}
