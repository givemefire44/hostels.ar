import Container from "./components/Container";
import MainHeroLayout from "./layout/MainHeroLayout";
import TestimonialCarousel from "./components/TestimonialCarousel";
import HostelGrid from "./components/HostelMosaic";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <>
      <Container>
        <MainHeroLayout />
      </Container>
      <Container>
        <TestimonialCarousel />
      </Container>
      <Container>
        <HostelGrid />
      </Container>
      <Container>
        <Footer />
      </Container>
    </>
  );
}
