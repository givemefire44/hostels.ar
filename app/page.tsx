"use client";
import React, { useState, useRef } from "react";
import cities from "./data/cities.json";

// =============== Buscador Predictivo (reutilizable) ===============
interface City {
  name: string;
  slug: string;
  properties: number;
  booking_url: string;
}

function BuscadorHero() {
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
            <svg width={16} height={16} viewBox="0 0 20 20">
              <line x1="5" y1="5" x2="15" y2="15" stroke="#444" strokeWidth="2"/>
              <line x1="15" y1="5" x2="5" y2="15" stroke="#444" strokeWidth="2"/>
            </svg>
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
            )
          })}
        </ul>
      }
      <style>{`
        .search-bar-wrap {
          width: 100%;
          max-width: 525px;
          margin: 0 auto;
          position: relative;
          z-index: 4;
        }
        .search-bar {
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 22px #0002;
          padding: 9px 12px 9px 16px;
          gap: 10px;
        }
        .search-icon {
          display: flex;
        }
        .search-input {
          flex: 1 1 0%;
          border: none;
          outline: none;
          font-size: 1.21rem;
          background: none;
          padding: 12px 7px;
          font-weight: 400;
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
          font-weight: 700;
          padding: 10px 25px;
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
          font-size: 1.07em;
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
        @media (max-width: 600px) {
          .search-bar-wrap {
            width: 98vw;
            min-width: unset;
            max-width: 99vw;
          }
        }
      `}</style>
    </form>
  );
}

// ======================= HOME PAGE =======================
export default function HomePage() {
  // Ejemplo de imágenes de stock libres, reemplaza por las tuyas
  const TESTIMONIAL_IMG = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400&q=80";
  const HOSTEL_IMG = "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80";

  return (
    <main className="home-main">
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Conocé <span className="color-violeta">gente increíble</span> viajando
          </h1>
          <p className="hero-lead">
            Elegí tu hostel, reservá y descubrí quién más va a estar allí. Viajar nunca fue tan divertido.
          </p>
          <div className="buscador-vedette-wrap">
            <BuscadorHero />
          </div>
          <div className="hero-bubbles">
            <div className="bubble">¿Alguien sale hoy?</div>
            <div className="bubble">¿Quién va al tour?</div>
            <div className="bubble">¡Busco compas de mate!</div>
          </div>
        </div>
      </section>

      {/* VENTAJAS */}
      <section className="ventajas">
        <div className="ventaja-card yellow">
          <h3>Ver perfiles de viajeros</h3>
          <p>Descubrí con quién vas a compartir el hostel antes de llegar.</p>
        </div>
        <div className="ventaja-card cyan">
          <h3>Unite al chat del hostel</h3>
          <p>Conectá con otros y organizá planes antes del viaje.</p>
        </div>
        <div className="ventaja-card purple">
          <h3>Eventos y actividades</h3>
          <p>Sumate a tours, cenas y experiencias grupales únicas.</p>
        </div>
      </section>

      {/* TESTIMONIO */}
      <section className="testimonio">
        <img src={TESTIMONIAL_IMG} alt="Viajera feliz en hostel" className="testimonio-img" />
        <div className="testimonio-txt">
          <p className="testimonio-quote">
            “Llegué sola y terminé viajando con amigos de todo el mundo. Reservar por acá fue la mejor decisión.” 
          </p>
          <span className="testimonio-name">Camila, 25 años, Argentina</span>
        </div>
      </section>

      {/* MIRÁ QUIÉN VA */}
      <section className="mirar-quien-va">
        <div className="mqv-bg">
          <div className="mqv-card">
            <img src={HOSTEL_IMG} alt="Hostel destacado" className="mqv-img" />
            <div>
              <h4>Los Patios Hostel</h4>
              <span>Medellín, Colombia</span>
            </div>
          </div>
          <div className="mqv-avatars">
            {[1,2,3,4,5].map(i => (
              <img key={i} src={`https://randomuser.me/api/portraits/men/${i+30}.jpg`} alt="Avatar viajero" className="mqv-avatar" />
            ))}
          </div>
          <h2>
            Mirá <span className="color-yellow">quién va</span>.
          </h2>
          <p>
            Conectá con otros viajeros que están en el mismo hostel o ciudad que vos.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final">
        <h2>¡Empezá tu aventura hostelera!</h2>
        <button className="cta-btn">Reservá ahora</button>
      </section>

      {/* STYLES */}
      <style>{`
        :root {
          --violeta: #8f2fbf;
          --naranja: #ff6600;
          --amarillo: #FFDE1A;
          --cyan: #18e0ff;
          --gris: #333;
        }
        .home-main {
          font-family: 'Inter', Arial, sans-serif;
          background: #f8f6fc;
          color: var(--gris);
        }
        /* HERO */
        .hero {
          background: linear-gradient(120deg, var(--violeta) 30%, #ff8c2b 100%);
          padding: 54px 0 48px 0;
          color: #fff;
          position: relative;
        }
        .hero-content {
          max-width: 700px;
          margin: 0 auto;
          padding: 0 18px;
          text-align: center;
        }
        .hero h1 {
          font-size: 2.55rem;
          font-weight: 800;
          margin-bottom: 16px;
        }
        .color-violeta { color: var(--amarillo); }
        .hero-lead { font-size: 1.2rem; margin-bottom: 32px; }
        .buscador-vedette-wrap {
          margin-bottom: 22px;
          margin-top: 8px;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .hero-bubbles {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        .bubble {
          background: #fff8;
          color: #fff;
          border-radius: 16px;
          padding: 7px 15px;
          font-size: 1rem;
          box-shadow: 0 2px 8px #0001;
          margin-bottom: 5px;
        }

        /* VENTAJAS */
        .ventajas {
          display: flex;
          gap: 22px;
          max-width: 940px;
          margin: 45px auto 0;
          padding: 0 18px;
          flex-wrap: wrap;
        }
        .ventaja-card {
          flex: 1 1 225px;
          background: #fff;
          border-radius: 15px;
          padding: 35px 22px 28px 22px;
          font-weight: 600;
          box-shadow: 0 2px 14px #0001;
          min-width: 220px;
          margin-bottom: 16px;
        }
        .ventaja-card.yellow { background: var(--amarillo); color: #402800; }
        .ventaja-card.cyan { background: var(--cyan); color: #134850; }
        .ventaja-card.purple { background: var(--violeta); color: #fff; }

        /* TESTIMONIO */
        .testimonio {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          background: #fff;
          border-radius: 18px;
          max-width: 760px;
          margin: 48px auto 0;
          box-shadow: 0 2px 14px #0001;
          padding: 32px 24px;
          flex-wrap: wrap;
        }
        .testimonio-img {
          width: 108px;
          height: 108px;
          object-fit: cover;
          border-radius: 50%;
          box-shadow: 0 2px 8px #0001;
        }
        .testimonio-txt { max-width: 420px; }
        .testimonio-quote {
          font-size: 1.13rem;
          font-style: italic;
          margin-bottom: 13px;
        }
        .testimonio-name {
          font-size: 1.02rem;
          color: #8f2fbf;
          font-weight: 700;
        }

        /* MIRÁ QUIÉN VA */
        .mirar-quien-va {
          background: var(--violeta);
          color: #fff;
          margin-top: 56px;
          padding: 55px 0 50px 0;
        }
        .mqv-bg {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          position: relative;
        }
        .mqv-card {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #fff;
          color: #333;
          border-radius: 13px;
          box-shadow: 0 3px 10px #0003;
          width: 340px;
          margin: 0 auto 14px auto;
          padding: 10px 15px;
          position: relative;
          z-index: 2;
        }
        .mqv-img {
          width: 55px;
          height: 55px;
          border-radius: 10px;
          object-fit: cover;
        }
        .mqv-avatars {
          display: flex;
          justify-content: center;
          gap: 7px;
          margin-bottom: 18px;
        }
        .mqv-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
          border: 2.5px solid #fff;
        }
        .mirar-quien-va h2 {
          font-size: 2.1rem;
          font-weight: 800;
          margin: 16px 0 3px 0;
        }
        .color-yellow { color: var(--amarillo);}
        .mirar-quien-va p { font-size: 1.1rem; margin-bottom: 0; }

        /* CTA FINAL */
        .cta-final {
          background: #fff;
          border-radius: 15px;
          max-width: 780px;
          margin: 42px auto 24px auto;
          padding: 35px 18px 38px 18px;
          text-align: center;
          box-shadow: 0 2px 14px #0001;
        }
        .cta-final h2 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 18px;
        }
        .cta-btn {
          background: var(--naranja);
          color: #fff;
          border: none;
          border-radius: 13px;
          font-size: 1.18rem;
          font-weight: 700;
          padding: 13px 38px;
          cursor: pointer;
          transition: background 0.13s;
        }
        .cta-btn:hover { background: #ff7d33; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .ventajas { flex-direction: column; gap: 0; }
          .ventaja-card { min-width: unset; }
          .testimonio { flex-direction: column; gap: 12px; }
        }
        @media (max-width: 650px) {
          .hero-content, .mqv-bg, .cta-final, .ventajas, .testimonio { padding: 0 6vw; }
          .mqv-card { width: 100%; min-width: unset; }
        }
        @media (max-width: 500px) {
          .hero h1 { font-size: 1.4rem; }
          .mirar-quien-va h2 { font-size: 1.12rem; }
          .testimonio-quote { font-size: 1rem; }
          .mqv-card { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </main>
  );
}
