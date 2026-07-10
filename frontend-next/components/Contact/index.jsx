// src/pages/Contact/index.jsx
import ContactHero from "./ContactHero";
import ContactLocations from "./ContactLocations";
import ContactMap from "./ContactMap";
import Newsletter from "./Newsletter";

const Contact = () => {
  return (
    <>
      <div className="w-full bg-white min-h-screen">
        <ContactHero />
        <ContactLocations />
        <ContactMap />
        <Newsletter />
      </div>
    </>
  );
};

export default Contact;
