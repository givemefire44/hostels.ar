import Container from "./components/Container";
import HeroHostel from "./components/HeroHostel";
import TestimonialCarousel from "./components/TestimonialCarousel";
import HostelGrid from "./components/HostelMosaic";
import Footer from "./components/Footer";
import ImpactBanner from "./components/ImpactBanner";
import LugaresPopularesArg from "./components/LugaresPopularesArg";


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
      <Container>
     <ImpactBanner />
      </Container>
      <Container>
  <LugaresPopularesArg />
      </Container>
      <Container>
      <Footer />
      </Container>
    </>
  );
}
