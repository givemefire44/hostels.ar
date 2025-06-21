import Header from "../components/Header";
import BubbleComments from "../components/BubbleComments";
import CitySearch from "../components/CitySearch";

export default function MainHeroLayout({ children }) {
  return (
    <div>
      <Header />
      <section
        style={{
          background: "linear-gradient(135deg, #8816c0 0%, #8f3985 100%)",
          padding: "48px 0 32px 0",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <h1 style={{ color: "#fff", fontSize: "3rem", marginBottom: 8, fontWeight: 700 }}>
            Conoce gente.
          </h1>
          <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 500, marginBottom: 32 }}>
            ¡Elige dónde quedarte y te mostraremos con quién!
          </h2>
          <BubbleComments
            comments={[
              { text: "Hostel bar, 9pm?", flag: "🇫🇷" },
              { text: "Anyone else here solo travelling?", flag: "🇨🇳" },
              { text: "Who's up for the walking tour?", flag: "🇧🇷" },
            ]}
          />
          <div style={{ marginTop: 32 }}>
            <CitySearch />
          </div>
          <div
            style={{
              color: "#fff",
              fontWeight: 600,
              marginTop: 16,
              background: "rgba(255,255,255,0.08)",
              padding: 8,
              borderRadius: 8,
              display: "inline-block",
            }}
          >
            Cancelación gratuita y reservación flexible disponibles
          </div>
        </div>
      </section>
      <main>{children}</main>
    </div>
  );
}
