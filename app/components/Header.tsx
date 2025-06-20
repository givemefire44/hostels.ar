import React from "react";
import CitySearch from "./CitySearch"; // Asegúrate de tener este componente ya creado

const chips = [
  "Cancelación gratis",
  "Reserva flexible",
  "Desayuno incluido",
  "Hostels verificados",
  "Pago en destino"
];

const burbujas = [
  {
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    txt: "Reservé en minutos, súper fácil."
  },
  {
    img: "https://randomuser.me/api/portraits/men/41.jpg",
    txt: "Gran variedad de hostels y ubicaciones."
  },
  {
    img: "https://randomuser.me/api/portraits/women/21.jpg",
    txt: "Cancelé gratis y sin problemas."
  },
  {
    img: "https://randomuser.me/api/portraits/men/30.jpg",
    txt: "Ideal para viajes espontáneos."
  }
];

export default function Header() {
  return (
    <header className="header-hero">
      <div className="header-top">
        <span className="logo">
          Hostels<span className="logo-ar">.ar</span>
        </span>
      </div>
      <div className="header-buscador">
        <h1 className="header-title">
          Reservá fácil y viajá mejor
          <span className="header-sub">
            Más hostels, mejores precios y experiencias aseguradas.
          </span>
        </h1>
        <CitySearch />
        <div className="chips">
          {chips.map((chip, i) => (
            <button key={i} className="chip">{chip}</button>
          ))}
        </div>
        <div className="burbujas">
          {burbujas.map((b, i) => (
            <div key={i} className="burbuja">
              <img src={b.img} alt="" />
              <span>{b.txt}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .header-hero {
          background: linear-gradient(120deg, #8f2fbf 60%, #ffb700 100%);
          padding: 0 0 48px 0;
          box-shadow: 0 2px 16px #0001;
          position: relative;
        }
        .header-top {
          max-width: 1220px;
          margin: 0 auto;
          padding: 0 22px;
          height: 74px;
          display: flex;
          align-items: center;
        }
        .logo {
          font-size: 2.35rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -2px;
          text-shadow: 0 2px 8px #0002;
        }
        .logo-ar { color: #ffb700; }
        .header-buscador {
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 0 0 0;
        }
        .header-title {
          color: #fff;
          font-size: 2.25rem;
          font-weight: 900;
          margin: 12px 0 12px 0;
          text-align: center;
          letter-spacing: -1px;
          text-shadow: 0 2px 12px #0002;
        }
        .header-sub {
          display: block;
          font-size: 1.12rem;
          font-weight: 500;
          color: #fff9;
          margin-top: 7px;
          letter-spacing: 0;
        }
        /* Chips */
        .chips {
          display: flex;
          gap: 10px;
          margin: 18px 0 8px 0;
          flex-wrap: wrap;
          justify-content: center;
        }
        .chip {
          background: #fff;
          color: #8f2fbf;
          border: none;
          border-radius: 16px;
          padding: 8px 22px;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          box-shadow: 0 2px 8px #0001;
          transition: background 0.13s, color 0.13s;
        }
        .chip:hover {
          background: #ffb700;
          color: #fff;
        }
        /* Burbujas */
        .burbujas {
          display: flex;
          gap: 16px;
          margin-top: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .burbuja {
          display: flex;
          align-items: center;
          background: #fff5;
          border-radius: 18px;
          padding: 6px 17px 6px 6px;
          box-shadow: 0 2px 10px #0001;
        }
        .burbuja img {
          width: 38px; height: 38px; border-radius: 50%; margin-right: 12px; object-fit: cover;
        }
        .burbuja span {
          color: #fff;
          font-weight: 500;
          font-size: 1.06rem;
          text-shadow: 0 2px 10px #0001;
        }
        @media (max-width: 900px) {
          .header-buscador { max-width: 97vw; }
          .header-top { padding: 0 4vw; }
        }
        @media (max-width: 600px) {
          .header-buscador { padding: 9px 2vw 0 2vw; }
          .logo { font-size: 1.3rem; }
          .burbuja img { width: 26px; height: 26px;}
          .chip { font-size: 0.98rem; padding: 6px 12px;}
          .header-title { font-size: 1.3rem;}
        }
      `}</style>
    </header>
  );
}
