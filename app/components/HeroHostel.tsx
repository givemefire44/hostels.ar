import React from "react";
import "./HeroHostel.css";

export default function HeroHostel() {
  return (
    <section className="hostel-hero">
      <div className="hostel-hero-content">
        <div className="hostel-hero-left">
          <h1 className="hostel-hero-title">Conoce gente.</h1>
          <h2 className="hostel-hero-subtitle">
            ¡Elige dónde quedarte y te mostraremos con quién!
          </h2>
          <div className="hostel-hero-doodle"></div>
        </div>
        <div className="hostel-hero-bubbles">
          {/* Solo burbujas/avatars, no mencionar el rostro */}
          <Bubble
            img="/avatars/1.png"
            flag="🇫🇷"
            message="Hostel bar, 9pm?"
            style={{ top: "24px", left: "80px" }}
          />
          <Bubble
            img="/avatars/2.png"
            flag="🇪🇸"
            message="Anyone else here solo travelling?"
            style={{ top: "100px", left: "180px" }}
          />
          <Bubble
            img="/avatars/3.png"
            flag="🇧🇷"
            message=""
            style={{ top: "50px", left: "300px" }}
          />
          <Bubble
            img="/avatars/4.png"
            flag="🇦🇷"
            message="Who's up for the walking tour?"
            style={{ top: "150px", left: "320px" }}
          />
        </div>
      </div>
      {/* El buscador lo agregamos en el próximo paso */}
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
