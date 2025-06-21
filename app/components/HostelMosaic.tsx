import React from "react";

// Usa las imágenes reales o dummies por ahora
const hostels = [
  {
    name: "Casa Gracia",
    location: "Barcelona, Spain",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Salty Jackal",
    location: "Swakopmund, Namibia",
    img: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Casa Angel Hostel",
    location: "Oaxaca, Mexico",
    img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Viajero Tayrona",
    location: "Buritaca, Colombia",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Generator",
    location: "Barcelona, Spain",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Selina Cancun",
    location: "Cancun, Mexico",
    img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Base Sydney",
    location: "Sydney, Australia",
    img: "https://images.unsplash.com/photo-1465101178521-c1a9136a3d43?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Queen Hostel Milan",
    location: "Milan, Italy",
    img: "https://images.unsplash.com/photo-1465101178521-c1a9136a3d43?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Canale Hostel",
    location: "Bangkok, Thailand",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Lub D Koh Samui",
    location: "Koh Samui, Thailand",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
  },
];

export default function HostelMosaic() {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      minHeight: 420,
      margin: "64px 0",
      padding: "32px 0"
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        gap: 32,
        justifyContent: "center",
        position: "relative",
      }}>
        <div style={{
          flex: "1 1 380px",
          minWidth: 320,
          maxWidth: 420,
          alignSelf: "center",
        }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 12, lineHeight: 1.1 }}>
            Los mejores hostels del mundo,<br />
            con más de <span style={{ color: "#22c55e" }}>13 millones de reseñas.</span>
          </h2>
          <div style={{ fontSize: "1.1rem", color: "#333", marginBottom: 24 }}>
            Con más de 16.500 hostels en 180 países, ¡siempre hay espacio para una nueva aventura!
          </div>
        </div>
        <div style={{
          flex: "2 1 600px",
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "center",
          alignItems: "flex-start"
        }}>
          {hostels.slice(0,9).map((h, i) => (
            <div
              key={h.name}
              style={{
                width: 140,
                height: 140,
                borderRadius: 20,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 2px 16px #0001",
                transform: `rotate(${(i%2===0?-1:1)*(5 + Math.random()*6)}deg)`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                marginTop: i%3===0 ? 24 : 0,
                marginBottom: i%3===2 ? 24 : 0,
                transition: "transform .2s",
              }}
            >
              <img src={h.img} alt={h.name} style={{
                width: "100%",
                height: "70%",
                objectFit: "cover"
              }}/>
              <div style={{ padding: "8px 10px 8px 10px" }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{h.name}</div>
                <div style={{ color: "#555", fontSize: 13 }}>{h.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
