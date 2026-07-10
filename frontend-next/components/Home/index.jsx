import HeroCarousel from "./HeroCarousel";
import InfoBanner from "./InfoBanner";
import AboutSection from "./AboutSection";
import ManufacturingExcellence from "./ManufacturingExcellence";
import ProductRange from "./ProductRange";
import WhyChooseUs from "./WhyChooseUs";
import ApplicationsSection from "./ApplicationsSection";
import Testimonials from "./Testimonials";
import CTABanner from "./CTABanner";
import BlogSection from "./BlogSection";

const Home = () => {
  return (
    <div>
      <HeroCarousel />
      <InfoBanner />
      <AboutSection />
      <ManufacturingExcellence />
      <ProductRange />
      <WhyChooseUs />
      <ApplicationsSection />
      <Testimonials />
      <CTABanner />
      <BlogSection />
    </div>
  );
};

export default Home;
