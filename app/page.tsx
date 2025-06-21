import MainHeroLayout from "./layouts/MainHeroLayout";
import TestimonialCarousel from "./components/TestimonialCarousel";
import HostelGrid from "./components/HostelMosaic";

export default function HomePage() {
  return (
    <>
      <MainHeroLayout />
      <TestimonialCarousel />
      <HostelGrid />
    </>
  );
}
