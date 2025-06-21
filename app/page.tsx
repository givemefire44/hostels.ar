import Hero from "./components/HeroHostel";
import TestimonialCarousel from "./components/TestimonialCarousel";
import HostelGrid from "./components/HostelMosaic";

export default function HomePage() {
  return (
    <>
      {/* HERO: SIN Container */}
      <section
        style={{
          background: "linear-gradient(135deg, #8816c0 0%, #8f3985 100%)",
          padding: "48px 0"
        }}
      >
        <Hero />
      </section>

      <section style={{ background: "#f6f6f6", padding: "32px 0" }}>
        <TestimonialCarousel />
      </section>

      <section style={{ padding: "32px 0" }}>
        <HostelGrid />
      </section>
    </>
  );
}
