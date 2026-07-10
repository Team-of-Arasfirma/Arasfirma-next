import AboutHero from "./Headsection";
import WhoWeAre from "./whoWeAre";
import MissionVision from "./MissionVision";
import OurJourney from "./OurJourney";
import CoreValues from "./CoreValues";
import OurClients from "./OurClients";
import CTABanner from "@/components/Home/CTABanner";

const AboutPage = () => {
  return (
    <div>
      <AboutHero />
      <WhoWeAre />
      <MissionVision />
      <OurJourney />
      <CoreValues />
      <OurClients />
      <CTABanner />
    </div>
  );
};

export default AboutPage;
