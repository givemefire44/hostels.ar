import BubbleComments from "../components/BubbleComments";
import CitySearch from "../components/CitySearch";

export default function MainHeroLayout({ children }) {
  return (
    <section
      style={{
        background: "#fff", // Fondo blanco
        padding: "48px 0 32px 0",
        borderRadius: 28,
        boxShadow: "0 8px 32px rgba(80,0,80,0.10)"
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative" }}>
        <h1
          style={{
            color: "#fff700",
            fontSize: "3rem",
            marginBottom: 8,
            fontWeight: 700,
            letterSpacing: 1,
            marginLeft: 30,
            marginTop: 0,
            transform: "translateY(-15px)",
            textShadow: "0 2px 10px rgba(0,0,0,0.10)"
          }}
        >
          Conoce gente.
        </h1>
        <h2
          style={{
            color: "#fff700",
            fontSize: "1.5rem",
            fontWeight: 500,
            marginBottom: 32,
            marginLeft: 30,
            marginTop: 0,
            transform: "translateY(-15px)"
          }}
        >
          ¡Elige dónde quedarte y te mostraremos con quién!
        </h2>
        <BubbleComments
          comments={[
            { text: "¿Quién sale a recorrer?" },
            { text: "¿Hay mate?" },
            { text: "¡Vamos al bar del hostel!" },
            { text: "¿Quién va al walking tour?" }
          ]}
        />
        <div style={{ marginTop: 32 }}>
          <CitySearch />
        </div>
        <div
          style={{
            color: "#fff700",
            fontWeight: 700,
            marginTop: 24,
            padding: "10px 0 0 0",
            display: "block",
            textAlign: "center",
            fontSize: 18,
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
            background: "none",
            borderRadius: 0
          }}
        >
          Cancelación gratuita y reservación flexible disponibles
        </div>
      </div>
      <main>{children}</main>
    </section>
  );
}
