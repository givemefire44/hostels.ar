import MainHeroLayout from "../layouts/MainHeroLayout";
import TestimonialCarousel from "../components/TestimonialCarousel";
import HostelMosaic from "../components/HostelMosaic";

export default function HomePage() {
  return (
    <MainHeroLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <TestimonialCarousel />
        <HostelMosaic />
        {/* Aquí puedes agregar más secciones, banners, etc. */}
      </div>
    </MainHeroLayout>
  );
}
