import MainHeroLayout from "./layouts/MainHeroLayout";

export default function HomePage() {
  return (
    <MainHeroLayout>
      <div>
        {/* El resto del contenido de la home va aquí */}
        <p style={{ textAlign: "center", marginTop: 40, color: "#333" }}>
          Bienvenido a la comunidad de viajeros.
        </p>
      </div>
    </MainHeroLayout>
  );
}
