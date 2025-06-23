import React from "react";

const lugares = [
  {
    nombre: "Buenos Aires",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80",
    url: "#",
  },
  {
    nombre: "Córdoba",
    img: "https://images.unsplash.com/photo-1509228468518-cacfd7ad2a6b?auto=format&fit=crop&w=400&q=80",
    url: "#",
  },
  {
    nombre: "Rosario",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", // Imagen genérica
    url: "#",
  },
  {
    nombre: "Mendoza",
    img: "https://images.unsplash.com/photo-1444065381814-865dc9da92c0?auto=format&fit=crop&w=400&q=80",
    url: "#",
  },
  {
    nombre: "Bariloche",
    img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80",
    url: "#",
  },
  {
    nombre: "El Calafate",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    url: "#",
  },
  {
    nombre: "Salta",
    img: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80",
    url: "#",
  },
  {
    nombre: "Cataratas del Iguazú",
    img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=400&q=80",
    url: "#",
  },
];

export default function LugaresPopularesArg() {
  return (
    <section className="lugares-populares">
      <h2>¡Inspírate!</h2>
      <p className="lugares-populares-desc">
        Descubrí los lugares más populares de Argentina para vivir aventuras inolvidables.
      </p>
      <div className="lugares-populares-grid">
        {lugares.map((lugar) => (
          <a
            href={lugar.url}
            key={lugar.nombre}
            className="lugar-card"
            aria-label={`Ver más de ${lugar.nombre}`}
          >
            <img src={lugar.img} alt={lugar.nombre} loading="lazy" />
            <span className="lugar-card-titulo">{lugar.nombre}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
