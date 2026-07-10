import Link from "next/link";

const Footer = () => {
  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Project", path: "/projects" },
    { name: "Blog", path: "/blog" },
    { name: "Career", path: "/career" },
    { name: "Contact", path: "/contact" },
  ];

  const socials = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/p/Arasfirma-61559776858632/",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/arasfirma/?hl=en",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-4 h-4"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle
            cx="17.5"
            cy="6.5"
            r="1.5"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      ),
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@arasfirmapufpanels?si=A59QrdUOMY3WBP9d",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58a2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/search/results/all/?keywords=Arasfirma&origin=RICH_QUERY_SUGGESTION&heroEntityKey=urn%3Ali%3Aorganization%3A99317471&position=0",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/919944015565",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full bg-gray-900 text-white py-10 md:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        <div>
          <h3 className="text-lg font-black uppercase mb-4 text-red-500">
            About Us
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Arasfirma is India&apos;s leading PUF Panel Manufacturer delivering
            high-performance insulation solutions for industrial, commercial,
            and cold storage applications.
          </p>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-red-600 transition"
                aria-label={s.name}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-black uppercase mb-4 text-red-500">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2 text-xs text-gray-400">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.path}
                  className="hover:text-red-400 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-black uppercase mb-4 text-red-500">
            Contact Details
          </h3>
          <ul className="flex flex-col gap-3 text-xs text-gray-400">
            <li>
              📍 No.5/113/1, Kaikattipudhur,
              <br /> Palangarai, Avinashilingampalayam,
              <br /> Avinashi, Tamil Nadu 641654.
            </li>

            <li>
              📞{" "}
              <a href="tel:+919944015565" className="hover:text-red-400">
                +91 99440 15565
              </a>
            </li>

            <li>
              ✉️{" "}
              <a
                href="mailto:sales@arasfirma.com"
                className="hover:text-red-400"
              >
                sales@arasfirma.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-black uppercase mb-4 text-red-500">
            Location
          </h3>

          <div className="rounded-xl overflow-hidden border border-gray-700">
            <iframe
              title="Arasfirma Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245.93!2d77.2831636!3d11.1850815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba903e4b92f15f9%3A0xfaad0d2ca1ae88d7!2sARASFIRMA%20-%20HEAD%20OFFICE!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="180"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <a
            href="https://maps.app.goo.gl/tQKu1nUAxvR46ohV9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs text-red-400 hover:underline"
          >
            View on Google Maps →
          </a>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-xs text-gray-500">
        © 2026 Arasfirma. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
