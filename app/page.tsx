"use client";
import React, { useState, useRef } from "react";
import cities from "./data/cities.json";

// =========== Buscador Predictivo (ajustado para ser la vedette) ===========
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
            )
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

// =========== Carrusel de Testimonios (mock) ===========
const testimonios = [
  {
    nombre: "Valentina, 27 años",
    pais: "Uruguay",
    texto: "¡Conocí amigos para toda la vida en mi primer viaje sola! El ambiente de hostel es único.",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg"
  },
  {
    nombre: "Lucas, 30 años",
    pais: "Argentina",
    texto: "Reservé por Hostels.ar y terminé viajando con un grupo de personas increíbles. ¡Experiencia 10 puntos!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    nombre: "Sofía, 23 años",
    pais: "Chile",
    texto: "Me animé a charlar en el chat del hostel antes de llegar y ya tenía planes para salir apenas pisé la ciudad.",
    avatar: "https://randomuser.me/api/portraits/women/81.jpg"
  }
];

function CarruselTestimonios() {
  const [index, setIndex] = useState(0);
  const next = () => setIndex(i => (i + 1) % testimonios.length);
  const prev = () => setIndex(i => (i - 1 + testimonios.length) % testimonios.length);

  return (
    <div className="testi-carrusel">
      <button className="carrusel-btn left" onClick={prev} aria-label="Anterior">‹</button>
      <div className="testi-card">
        <img src={testimonios[index].avatar} alt={testimonios[index].nombre} className="testi-avatar" />
        <p className="testi-txt">“{testimonios[index].texto}”</p>
        <span className="testi-nombre">{testimonios[index].nombre} · {testimonios[index].pais}</span>
      </div>
      <button className="carrusel-btn right" onClick={next} aria-label="Siguiente">›</button>
      <style>{`
        .testi-carrusel {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin: 32px 0 40px 0;
        }
        .testi-card {
          background: #fff;
          border-radius: 17px;
          box-shadow: 0 2px 14px #0001;
          padding: 38px 32px;
          text-align: center;
          min-width: 260px;
          max-width: 370px;
        }
        .testi-avatar {
          width: 66px; height: 66px; border-radius: 50%; margin-bottom: 13px; object-fit: cover;
        }
        .testi-txt { font-size: 1.08rem; margin-bottom: 10px; }
        .testi-nombre { font-size: 0.97rem; color: #8f2fbf; font-weight: 700;}
        .carrusel-btn {
          background: #fff5;
          border: none;
          font-size: 2.5rem;
          color: #8f2fbf;
          border-radius: 50%;
          width: 48px; height: 48px;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
        }
        .carrusel-btn:hover { background: #ffb700; color: #fff; }
        @media (max-width: 600px) {
          .testi-card { padding: 18px 5vw; min-width: 180px; max-width: 90vw;}
          .testi-carrusel { gap: 4px;}
          .carrusel-btn { width: 38px; height: 38px; font-size: 1.8rem;}
        }
      `}</style>
    </div>
  );
}

// =========== Header fijo (logo + acciones mock) ===========
function Header() {
  return (
    <header className="header-main">
      <div className="header-content">
        <span className="logo">Hostels<span className="logo-ar">.ar</span></span>
        <nav className="header-nav">
          <a href="#">Agregá tu propiedad</a>
          <a href="#">Español</a>
          <a href="#">ARS</a>
          <button className="avatar-btn" aria-label="Usuario">
            <svg width={28} height={28} fill="#ddd" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><circle cx="12" cy="20" r="7" fill="none" stroke="#222" strokeWidth="2"/></svg>
          </button>
        </nav>
      </div>
      <style>{`
        .header-main {
          width: 100vw;
          background: #fff;
          box-shadow: 0 2px 12px #0001;
          position: fixed;
          top: 0; left: 0; z-index: 100;
          padding: 0;
          min-height: 67px;
        }
        .header-content {
          max-width: 1220px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 67px;
          padding: 0 22px;
        }
        .logo {
          font-size: 2.06rem;
          font-weight: 900;
          color: #8f2fbf;
          letter-spacing: -2px;
        }
        .logo-ar { color: #ffb700; }
        .header-nav {
          display: flex; gap: 16px; align-items: center;
        }
        .header-nav a {
          color: #5d239c;
          font-weight: 600;
          text-decoration: none;
          font-size: 1rem;
          margin-right: 6px;
        }
        .avatar-btn {
          background: #f4f2fa; border: none; border-radius: 50%;
          width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
          margin-left: 7px; cursor: pointer;
        }
        @media (max-width: 700px) {
          .header-content { padding: 0 4vw; }
          .logo { font-size: 1.3rem; }
          .header-nav a { font-size: 0.97rem; }
        }
      `}</style>
    </header>
  );
}

// =========== Página Principal ===========
export default function HomePage() {
  // Imagen hero de fondo
  const heroBg = "linear-gradient(120deg, #8f2fbf 60%, #ffb700 100%)";
  // Avatars para burbujas sociales
  const heroAvatars = [
    { img: "https://randomuser.me/api/portraits/women/44.jpg", txt: "¿Quién sale a recorrer?" },
    { img: "https://randomuser.me/api/portraits/men/41.jpg", txt: "¿Hay mate?" },
    { img: "https://randomuser.me/api/portraits/women/21.jpg", txt: "¿Vamos al bar del hostel?" },
    { img: "https://randomuser.me/api/portraits/men/30.jpg", txt: "¿Quién va al walking tour?" }
  ];

  return (
    <div>
      <Header />
      <main className="home-main">
        {/* HERO */}
        <section className="hero" style={{ background: heroBg }}>
          <div className="hero-content">
            <h1>
              Conocé gente.<br />
              <span className="hero-sub">¡Elegí dónde quedarte y te mostramos con quién!</span>
            </h1>
            <div className="hero-bubbles">
              {heroAvatars.map((a, i) => (
                <div className="bubble-avatar" key={i}>
                  <img src={a.img} alt="" />
                  <span>{a.txt}</span>
                </div>
              ))}
            </div>
            <div className="hero-buscador">
              <BuscadorHero />
            </div>
          </div>
        </section>

        {/* TESTIMONIOS CARRUSEL */}
        <section className="testimonios">
          <h2 className="testimonios-title">
            <span className="color-violeta">Historias reales</span> de viajeros como vos
          </h2>
          <CarruselTestimonios />
        </section>

        {/* RESTO DE LA HOME: ejemplo sección "conectá antes de viajar" */}
        <section className="conecta-viajeros">
          <div className="conecta-txt">
            <h2>
              Ayudándote <span className="color-violeta">a conectar con viajeros</span>.<br />
              <span className="color-fucsia">Incluso antes</span> de que llegues a tu hostel.
            </h2>
            <p>
              Hablá con otros viajeros, planeá actividades y sentite parte de la comunidad desde el primer minuto. 
            </p>
            <button className="cta-btn">Descubrí las novedades</button>
          </div>
          <div className="conecta-img">
            <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=420&q=80" alt="Viajeros en hostel" />
          </div>
        </section>

        {/* MIRÁ QUIÉN VA */}
        <section className="mirar-quien-va">
          <div className="mqv-bg">
            <div className="mqv-card">
              <img src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80" alt="Hostel destacado" className="mqv-img" />
              <div>
                <h4>Los Patios Hostel</h4>
                <span>Medellín, Colombia</span>
              </div>
            </div>
            <div className="mqv-avatars">
              {[1,2,3,4,5].map(i => (
                <img key={i} src={`https://randomuser.me/api/portraits/men/${i+23}.jpg`} alt="Avatar viajero" className="mqv-avatar" />
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
      </main>
      {/* GLOBAL STYLES */}
      <style>{`
        body { background: #faf9fd; }
        .home-main {
          font-family: 'Inter', Arial, sans-serif;
          background: #faf9fd;
          color: #222;
          margin-top: 67px;
        }
        /* HERO */
        .hero {
          min-height: 410px;
          padding: 80px 0 44px 0;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .hero-content {
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
          padding: 0 18px;
          text-align: center;
          position: relative;
        }
        .hero h1 {
          font-size: 2.7rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 16px;
          text-shadow: 0 2px 8px #0002;
        }
        .hero-sub {
          font-size: 1.28rem;
          font-weight: 500;
          color: #fff9;
        }
        .hero-buscador {
          margin: 38px auto 0 auto;
          width: 97%;
          max-width: 790px;
        }
        .hero-bubbles {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 26px;
          margin-bottom: -8px;
          flex-wrap: wrap;
        }
        .bubble-avatar {
          display: flex; align-items: center; background: #fff3;
          border-radius: 18px; padding: 6px 17px 6px 6px;
          box-shadow: 0 2px 10px #0001;
        }
        .bubble-avatar img {
          width: 36px; height: 36px; border-radius: 50%; margin-right: 10px; object-fit: cover;
        }
        .bubble-avatar span {
          color: #fff; font-weight: 500; font-size: 1.01rem;
          text-shadow: 0 2px 10px #0001;
        }
        /* TESTIMONIOS */
        .testimonios {
          background: none;
          padding: 40px 0 0 0;
        }
        .testimonios-title {
          text-align: center;
          font-size: 2.08rem;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .color-violeta { color: #8f2fbf; }
        /* CONECTA VIAJEROS */
        .conecta-viajeros {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 25px;
          background: #fff;
          border-radius: 30px;
          box-shadow: 0 2px 14px #0001;
          max-width: 860px;
          margin: 38px auto 0 auto;
          padding: 45px 24px 35px 30px;
          flex-wrap: wrap;
        }
        .conecta-txt { max-width: 450px; }
        .conecta-txt h2 {
          font-size: 1.55rem; font-weight: 900; margin-bottom: 9px;
        }
        .color-fucsia { color: #e10086; }
        .conecta-txt p { font-size: 1.08rem; margin-bottom: 14px;}
        .cta-btn {
          background: #ffe236;
          color: #6b4700;
          border: none;
          border-radius: 13px;
          font-size: 1.1rem;
          font-weight: 800;
          padding: 11px 33px;
          cursor: pointer;
          transition: background 0.13s, color 0.13s;
        }
        .cta-btn:hover { background: #ffb700; color: #fff;}
        .conecta-img img {
          width: 210px; height: 210px; border-radius: 24px; object-fit: cover;
          box-shadow: 0 2px 14px #0002;
        }
        /* MIRÁ QUIÉN VA */
        .mirar-quien-va {
          background: #8f2fbf;
          color: #fff;
          margin-top: 60px;
          padding: 64px 0 56px 0;
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
        .color-yellow { color: #ffe236;}
        .mirar-quien-va p { font-size: 1.1rem; margin-bottom: 0; }
        /* RESPONSIVE */
        @media (max-width: 1020px) {
          .hero-content { max-width: 99vw; }
        }
        @media (max-width: 900px) {
          .hero-buscador { max-width: 97vw; }
          .conecta-viajeros { flex-direction: column; gap: 8px; }
        }
        @media (max-width: 650px) {
          .hero-content, .mqv-bg, .conecta-viajeros, .testimonios { padding: 0 2vw; }
          .mqv-card { width: 100%; min-width: unset; }
        }
        @media (max-width: 500px) {
          .hero h1 { font-size: 1.3rem; }
          .mirar-quien-va h2 { font-size: 1.1rem; }
          .testimonios-title { font-size: 1.15rem;}
          .conecta-txt h2 { font-size: 1rem;}
          .mqv-card { flex-direction: column; align-items: flex-start; }
          .conecta-img img { width: 98vw; height: auto; border-radius: 18px;}
        }
      `}</style>
    </div>
  );
}
