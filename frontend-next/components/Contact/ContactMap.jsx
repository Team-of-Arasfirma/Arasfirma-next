const ContactMap = () => {
  return (
    <section className="w-full px-6 pb-20 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Our Location</h2>
          <p className="text-gray-600 text-sm">
            Visit our office or find us on the map
          </p>
        </div>

        {/* Map Container */}
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md h-[320px] md:h-[400px]">
          <iframe
            title="Arasfirma Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245.93!2d77.2831636!3d11.1850815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba903e4b92f15f9%3A0xfaad0d2ca1ae88d7!2sARASFIRMA%20-%20HEAD%20OFFICE!5e0!3m2!1sen!2sin!4v1234567890"
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
