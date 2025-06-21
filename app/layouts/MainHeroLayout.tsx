import BubbleComments from "../components/BubbleComments";
import CitySearch from "../components/CitySearch";

export default function MainHeroLayout({ children }) {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #8816c0 0%, #8f3985 100%)",
        padding: "48px 0 32px 0",
        marginTop: 10,
        borderRadius: 28, // Hero radius para esquinas redondeadas
        boxShadow: "0 8px 32px rgba(80,0,80,0.10)"
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <h1 style={{
          color: "#fff700", // Amarillo intenso
          fontSize: "3rem",
          marginBottom: 8,
          fontWeight: 700,
          letterSpacing: 1,
          transform: "translateY(30px)", // desplazamiento vertical
          textShadow: "0 2px 10px rgba(0,0,0,0.10)"
        }}>
          Conoce gente.
        </h1>
        <h2 style={{
          color: "#fff",
          fontSize: "1.5rem",
          fontWeight: 500,
          marginBottom: 32,
          transform: "translateY(30px)"
        }}>
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
            color: "#181818", // Letras en negro
            fontWeight: 700,
            marginTop: 24,
            background: "#ffe600", // Amarillo intenso
            padding: "10px 28px",
            borderRadius: 12,
            display: "block",
            textAlign: "center",
            fontSize: 18,
            maxWidth: 420,
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          Cancelación gratuita y reservación flexible disponibles
        </div>
      </div>
      <main>{children}</main>
    </section>
  );
}
