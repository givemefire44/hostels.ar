import cities from '../data/cities.json';

interface City {
  name: string;
  slug: string;
  properties: number;
  booking_url: string;
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = (cities as City[]).find(
    (c) => c.slug === slug
  );

  if (!city) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Ciudad no encontrada</h1>
        <p>¡Ups! No tenemos información sobre este destino.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Hostels en {city.name}</h1>
      <p>
        Encontrá más de <strong>{city.properties}</strong> opciones de alojamiento en {city.name}.
      </p>
      <a
        href={city.booking_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: "#ff6f61",
          color: "#fff",
          padding: "1rem 2.5rem",
          borderRadius: 10,
          fontSize: 22,
          textDecoration: "none",
          fontWeight: "bold",
          boxShadow: "0 2px 8px #ff6f6140",
          display: "inline-block",
          marginTop: 30,
        }}
      >
        Buscar en Booking
      </a>
      {/* Acá podés agregar galería de imágenes, tips, testimonios, etc. */}
    </main>
  );
}
