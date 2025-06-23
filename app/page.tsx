import Container from "./components/Container";
import HeroHostel from "./components/HeroHostel";
import TestimonialCarousel from "./components/TestimonialCarousel";
import HostelGrid from "./components/HostelMosaic";
import Footer from "./components/Footer";
import ImpactBanner from "./components/ImpactBanner";


export default function HomePage() {
  return (
    <>
     
      <Container>
        <HeroHostel />
      </Container>
      <Container>
        <TestimonialCarousel />
      </Container>
      <Container>
        <HostelGrid />
      </Container>
     <ImpactBanner />
      <Container>
      <Footer />
      </Container>
    </>
  );
}
