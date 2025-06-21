import React from "react";
import "./HeroHostel.css";

export default function HeroHostel() {
  return (
    <section className="hero-bg">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-left">
            <h1>Conoce gente.</h1>
            <h2>¡Elige dónde quedarte y te mostraremos con quién!</h2>
            <div className="hero-doodle"></div>
          </div>
          <div className="hero-bubbles">
            <Bubble
              img="/avatars/1.png"
              flag="🇫🇷"
              message="Hostel bar, 9pm?"
              style={{ top: 10, left: 320 }}
            />
            <Bubble
              img="/avatars/2.png"
              flag="🇪🇸"
              message="Anyone else here solo travelling?"
              style={{ top: 80, left: 420 }}
            />
            <Bubble
              img="/avatars/3.png"
              flag="🇧🇷"
              message=""
              style={{ top: 140, left: 350 }}
            />
            <Bubble
              img="/avatars/4.png"
              flag="🇦🇷"
              message="Who's up for the walking tour?"
              style={{ top: 180, left: 470 }}
            />
          </div>
        </div>
        <div className="hero-search-outer">
          <form className="hero-search-form">
            <input type="text" placeholder="¿A dónde quieres ir?" />
            <div className="hero-search-field">
              <span>Llegada</span>
              <span>21 jun</span>
            </div>
            <div className="hero-search-field">
              <span>Salida</span>
              <span>24 jun</span>
            </div>
            <div className="hero-search-field">
              <span>Personas</span>
              <span>2</span>
            </div>
            <button type="submit" className="hero-search-btn">
              ¡Vamos! <span>→</span>
            </button>
          </form>
          <div className="hero-search-chips">
            <span>
              <span role="img" aria-label="calendar">📅</span> 
              <b>Cancelación gratuita</b> y <b>reservacion flexible</b> disponibles
            </span>
          </div>
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
