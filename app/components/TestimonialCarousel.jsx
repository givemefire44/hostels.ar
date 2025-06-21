import React, { useState } from "react";

const testimonials = [
  {
    quote: "¡Increíble experiencia! Conocí amigos de todo el mundo.",
    author: "María, Argentina",
  },
  {
    quote: "El hostel organizó actividades todos los días. ¡Nunca estuve solo!",
    author: "John, UK",
  },
  {
    quote: "Me sentí seguro y bienvenido desde el primer día.",
    author: "Lucas, Brasil",
  },
];

export default function TestimonialCarousel() {
  const [active, setActive] = useState(0);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 2px 16px #0001",
      maxWidth: 540,
      margin: "48px auto",
      padding: 32,
      textAlign: "center",
      position: "relative"
    }}>
      <blockquote style={{ fontSize: "1.3rem", fontStyle: "italic", color: "#7e2fbf" }}>
        “{testimonials[active].quote}”
      </blockquote>
      <div style={{ marginTop: 12, color: "#444", fontWeight: 600 }}>
        — {testimonials[active].author}
      </div>
      <div style={{ marginTop: 24 }}>
        {testimonials.map((_, i) => (
          <button
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              margin: "0 6px",
              background: i === active ? "#7e2fbf" : "#e0d4ef",
              border: "none",
              cursor: "pointer"
            }}
            onClick={() => setActive(i)}
            aria-label={`Show testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
