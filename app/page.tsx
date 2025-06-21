import Hero from "./components/HeroHostel";
import Container from "./components/Container";
import TestimonialCarousel from "./components/TestimonialCarousel";
import HostelGrid from "./components/HostelMosaic";

export default function HomePage() {
  return (
    <>
      {/* HERO: SIN Container, solo la sección y Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #8816c0 0%, #8f3985 100%)",
          padding: "48px 0"
        }}
      >
        <Hero />
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: "#f6f6f6", padding: "32px 0" }}>
        <Container>
          <TestimonialCarousel />
        </Container>
      </section>

      {/* HOSTELS GRID */}
      <section style={{ padding: "32px 0" }}>
        <Container>
          <HostelGrid />
        </Container>
      </section>
    </>
  );
}
