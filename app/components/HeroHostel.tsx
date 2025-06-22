import BubbleComments from "../components/BubbleComments";
import CitySearch from "../components/CitySearch";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <h1 className="hero-title">Conoce gente.</h1>
        <h2 className="hero-subtitle">
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
        <div className="city-search-container">
          <CitySearch />
        </div>
        <div className="cancellation-text">
          Cancelación gratuita y reservación flexible disponibles
        </div>
      </div>
    </section>
  );
}
