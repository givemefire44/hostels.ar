"use client";

import React, { useEffect, useState } from "react";

type Ciudad = {
  id: number;
  Nombre: string;
  slug: string;
  Pais: string;
  // Agregá más campos si los necesitás
};

export default function HomePage() {
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCiudades() {
      try {
        // Cambiá la URL si tu Strapi está en otro puerto/dominio
        const res = await fetch("http://localhost:1337/api/ciudades");
        const data = await res.json();
        const parsed = data.data.map((item: any) => ({
          id: item.id,
          Nombre: item.attributes?.Nombre || item.Nombre,
          slug: item.attributes?.slug || item.slug,
          Pais: item.attributes?.Pais || item.Pais,
        }));
        setCiudades(parsed);
      } catch (error) {
        console.error("Error al traer ciudades", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCiudades();
  }, []);

  const ciudadesFiltradas = ciudades.filter(c =>
    c.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.Pais.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 32 }}>
      <h1 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: 32 }}>
        🏨 Hostels.ar
      </h1>
      <input
        type="text"
        placeholder="Buscar ciudad o país..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ddd",
          fontSize: 18,
          marginBottom: 32,
        }}
      />

      {loading ? (
        <p>Cargando ciudades...</p>
      ) : (
        <>
          {ciudadesFiltradas.length === 0 ? (
            <p>No se encontraron ciudades.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {ciudadesFiltradas.map(ciudad => (
                <li
                  key={ciudad.id}
                  style={{
                    marginBottom: 24,
                    border: "1px solid #eee",
                    borderRadius: 8,
                    padding: 18,
                    boxShadow: "0 2px 10px #0001",
                  }}
                >
                  <a
                    href={`/ciudades/${ciudad.slug}`}
                    style={{
                      textDecoration: "none",
                      color: "#0070f3",
                      fontWeight: "bold",
                      fontSize: "1.4rem",
                    }}
                  >
                    {ciudad.Nombre}
                  </a>
                  <div style={{ color: "#666", fontSize: 16 }}>
                    {ciudad.Pais}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
