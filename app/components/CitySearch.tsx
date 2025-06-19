import { useState } from "react";
import cities from "../data/cities.json";

export default function CitySearch() {
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);

  // Filtrado predictivo
  const filteredCities = query.length === 0
    ? []
    : cities.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (city) => {
    setSelectedCity(city);
    setQuery(city.name);
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <label htmlFor="city-search" style={{ fontWeight: "bold", fontSize: 20 }}>
        ¿A dónde querés viajar?
      </label>
      <input
        id="city-search"
        type="text"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setSelectedCity(null);
        }}
        placeholder="Ej: Buenos Aires, Mendoza..."
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: 8,
          border: "1px solid #ddd",
          marginTop: 10,
          fontSize: 18
        }}
        autoComplete="off"
      />
      {/* Lista de sugerencias */}
      {filteredCities.length > 0 && !selectedCity && (
        <ul style={{
          listStyle: "none",
          padding: 0,
          margin: "10px 0 0 0",
          border: "1px solid #eee",
          borderRadius: 8,
          background: "#fff",
          position: "absolute",
          width: "100%",
          zIndex: 10
        }}>
          {filteredCities.map(city => (
            <li
              key={city.slug}
              onClick={() => handleSelect(city)}
              style={{
                padding: "0.75rem",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0"
              }}
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}

      {/* Botón de afiliado */}
      {selectedCity && (
        <div style={{ marginTop: 30, textAlign: "center" }}>
          <a
            href={selectedCity.booking_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#ff6f61",
              color: "#fff",
              padding: "0.8rem 2rem",
              borderRadius: 10,
              fontSize: 20,
              textDecoration: "none",
              fontWeight: "bold",
              boxShadow: "0 2px 8px #ff6f6140"
            }}
          >
            Buscar hostels en {selectedCity.name}
          </a>
        </div>
      )}
    </div>
  );
}
