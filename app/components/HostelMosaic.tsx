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

function getCardClass(i: number) {
  let classes = "hostel-mosaic-card";
  if (i % 3 === 0) classes += " mt-24";
  if (i % 3 === 2) classes += " mb-24";
  if (i % 2 === 0) classes += " rotate-neg";
  else classes += " rotate-pos";
  return classes;
}

function getCardStyle(i: number) {
  // Reemplazamos el rotate dinámico por uno fijo para evitar hydration errors.
  // Si quieres que sea random pero sin hydration, hazlo solo en el cliente con useEffect.
  return {
    transform: i % 2 === 0 ? "rotate(-8deg)" : "rotate(8deg)"
  };
}

export default function HostelMosaic() {
  return (
    <div className="hostel-mosaic-section">
      <div className="hostel-mosaic-container">
        <div className="hostel-mosaic-info">
          <h2>
            Los mejores hostels del mundo,<br />
            con más de <span className="highlight">13 millones de reseñas.</span>
          </h2>
          <div className="hostel-mosaic-info-description">
            Con más de 16.500 hostels en 180 países, ¡siempre hay espacio para una nueva aventura!
          </div>
        </div>
        <div className="hostel-mosaic-list">
          {hostels.slice(0,9).map((h, i) => (
            <div
              key={h.name}
              className={getCardClass(i)}
              style={getCardStyle(i)}
            >
              <img src={h.img} alt={h.name} />
              <div className="hostel-mosaic-card-content">
                <div className="hostel-mosaic-card-title">{h.name}</div>
                <div className="hostel-mosaic-card-location">{h.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
