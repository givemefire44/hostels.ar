import Container from "./components/Container";
import Hero from "./components/Hero";
import TestimonialCarousel from "./components/TestimonialCarousel";
import HostelGrid from "./components/HostelGrid";

export default function HomePage() {
  return (
    <>
      <section style={{
        background: "linear-gradient(135deg, #8816c0 0%, #8f3985 100%)",
        padding: "48px 0"
      }}>
        <Container>
          <Hero />
        </Container>
      </section>

      <section style={{ background: "#f6f6f6", padding: "32px 0" }}>
        <Container>
          <TestimonialCarousel />
        </Container>
      </section>

      <section style={{ padding: "32px 0" }}>
        <Container>
          <HostelGrid />
        </Container>
      </section>
    </>
  );
}
