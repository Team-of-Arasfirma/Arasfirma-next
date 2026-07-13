export const PRODUCTS = {
  // ── ROOF PANEL ──────────────────────────────────────────────────────────────

  roofPanel: {
    id: "roofPanel",

    name: "Roof Panel",

    tagline: "Premium Insulated Roofing Solution",

    badge: "Best Seller",

    color: "#dc2626",

    lightColor: "#fef2f2",

    image: "/assets/products/Roof-panel.png",

    colorOptions: [
      {
        hex: "#dc2626",
        name: "Brick Red",
        image: "/assets/products copy/roof-panel/roof-red.png",
      },

      {
        hex: "#0ea5e9",
        name: "Sky Blue",
        image: "/assets/products copy/roof-panel/roof-blue.png",
      },

      {
        hex: "#1d4ed8",
        name: "Royal Blue",
        image: "/assets/products copy/roof-panel/roof-darkblue.png",
      },

      {
        hex: "#d1d5db",
        name: "Off White",
        image: "/assets/products copy/roof-panel/roof-silver.jpg",
      },

      {
        hex: "#04790a",
        name: "Caulified Green",
        image: "/assets/products copy/roof-panel/roof-green.png",
      },

      {
        hex: "#374151",
        name: "Bare",
        image: "/assets/products copy/roof-panel/roof-grey.png",
      },
    ],

    description: `Arasfirma Roof PUF Panels are high-performance insulated sandwich panels designed for industrial, commercial, and cold storage roofing applications.Engineered with a rigid polyurethane foam core between two profiled steel sheets, they deliver exceptional thermal insulation, structural strength,and weather resistance. Ideal for factories, warehouses, cold storage units,
and commercial buildings across India.`,

    specifications: [
      { label: "Panel Width", value: "1000 mm" },

      { label: "Panel Length", value: "Custom " },

      { label: "Thickness", value: "20mm to 150mm" },

      { label: "Steel thickness", value: "0.30mm to 0.60mm" },

      { label: "Core Density", value: "42 kg/m³(± 2 kg)" },

      { label: "Thermal Value", value: "0.020 W/mK " },

      { label: "Coating mass", value: "AZ70 Gsm, AZ150 Gsm" },

      { label: "Paint type", value: "RMP, SDP, SMP*, PVDF*" },

      {
        label: "Fire Rating",
        value: "B3 as per DIN 4102 (B2 & PIR upon request)",
      },
    ],

    // ✅ icon = path to YOUR image file in /public/icons/

    keyPerformance: [
      {
        icon: "/assets/icon/thermal.svg",
        title: "Thermal Insulation",
        desc: "Exceptional U-value as low as 0.2 W/m²K — reduces cooling and heating costs significantly.",
      },

      {
        icon: "/assets/icon/fireIcon.svg",
        title: "Fire Retardant",
        desc: "B1 & B2 fire-rated panels with flame retardant PUF core for maximum safety.",
      },

      {
        icon: "/assets/icon/water.svg",
        title: "Water Resistant",
        desc: "Sealed joints and coated steel prevent water ingress and corrosion.",
      },

      {
        icon: "/assets/icon/energy.svg",
        title: "Energy Efficient",
        desc: "Reduces HVAC load by up to 40% — significant energy and cost savings.",
      },

      {
        icon: "/assets/icon/strength.svg",
        title: "Roof Slope Compatibility",
        desc: " Designed to perform efficiently across varying roof slopes.",
      },

      {
        icon: "/assets/icon/installation.svg",
        title: "Easy Installation",
        desc: "Interlocking joint system for fast and precise site installation.",
      },
    ],

    joints: [
      {
        name: "Single Tongue & Groove Wall Panel",
        image: "/assets/joints/joint2.png",
        desc: "Watertight concealed fix system",
      },

      {
        name: "Double Tongue & Groove Wall Panel",
        image: "/assets/joints/joint1.png",
        desc: "Low profile aesthetic finish",
      },

      {
        name: "Triple Tongue & Groove Wall Panel",
        image: "/assets/joints/joint3.png",
        desc: "High strength structural joint",
      },
    ],

    accessories: [
      { name: "Profile Ridge", image: "/assets/accessories/ProfileRidge.png" },

      { name: "C-Flashing", image: "/assets/accessories/CFlashing.png" },

      {
        name: "Z-AngleFlashing",
        image: "/assets/accessories/ZAngleFlashing.png",
      },

      { name: "Gutter", image: "/assets/accessories/Gutter.png" },

      { name: "L-Flashing", image: "/assets/accessories/LFlashing.png" },

      { name: "Plain Ridge", image: "/assets/accessories/PlainRidge.png" },

      { name: "Metal closer", image: "/assets/accessories/Metalcloser.png" },

      {
        name: "Screw & Screw Caps",
        image: "/assets/accessories/Screw&ScrewCaps.png",
      },
    ],

    faqs: [
      {
        q: "What thickness of roof panel should I use?",
        a: "For most industrial applications, 60mm–80mm thickness provides optimal insulation. For cold storage, we recommend 100mm–150mm.",
      },

      {
        q: "How long do PUF roof panels last?",
        a: "With proper installation and maintenance, Arasfirma PUF roof panels last 25–30 years.",
      },

      {
        q: "Are the panels suitable for extreme weather?",
        a: "Yes. Our panels are tested for wind loads up to 200 km/h and temperature ranges from -40°C to +80°C.",
      },

      {
        q: "Can roof panels be customized in length?",
        a: "Yes. We manufacture panels in custom lengths up to 12 meters to minimize joints and reduce installation time.",
      },

      {
        q: "What is the fire rating of your roof panels?",
        a: "Our panels carry B1 (self-extinguishing) and B2 (flame retardant) fire ratings as per Indian standards.",
      },
    ],

    related: ["monoWall", "concealed"],
  },

  // ── MONO WALL ───────────────────────────────────────────────────────────────

  monoWall: {
    id: "monoWall",

    name: "Mono Wall",

    tagline: "Superior Wall Insulation Panel",

    badge: "Popular",

    color: "#0f766e",

    lightColor: "#f0fdfa",

    image: "/assets/products/mono-wall.png",

    colorOptions: [
      {
        hex: "#dc2626",
        name: "Brick Red",
        image: "/assets/products copy/mono-wall/monowall-red.png",
      },

      {
        hex: "#0ea5e9",
        name: "Sky Blue",
        image: "/assets/products copy/mono-wall/monowall-blue.png",
      },

      {
        hex: "#1d4ed8",
        name: "Royal Blue",
        image: "/assets/products copy/mono-wall/monowall-darkblue.png",
      },

      {
        hex: "#e7e7e7",
        name: "Off White",
        image: "/assets/products copy/mono-wall/monowall-white.png",
      },

      {
        hex: "#02ac1e",
        name: "Caulified Green",
        image: "/assets/products copy/mono-wall/monowall-green.png",
      },

      {
        hex: "#374151",
        name: "Grey",
        image: "/assets/products copy/mono-wall/monowall-grey.png",
      },
    ],

    description: `Arasfirma Mono Wall PUF Panels are versatile insulated wall panels designed for industrial sheds, warehouses, clean rooms, and commercial buildings. With a high-density PUF core sandwiched between two steel
    sheets, these panels provide superior thermal insulation, structural integrity, and a clean aesthetic finish. Available in multiple profiles and colors to suit any architectural requirement.`,

    specifications: [
      { label: "Panel Width", value: "1020 mm" },

      { label: "Panel Length", value: "Custom " },

      { label: "Thickness", value: "30mm – 150mm" },

      { label: "Steel thickness", value: "0.30mm to 0.60mm" },

      { label: "Core Density", value: "42 kg/m³(± 2 kg)" },

      { label: "Thermal Value", value: "0.020 W/mK " },

      {
        label: "Coating mass",
        value:
          "AZ70 Gsm, AZ150 Gsm or as per client requirements*(* - it requires MOQ)",
      },

      {
        label: "Paint type",
        value: "RMP, SDP, SMP*, PVDF* (* - it requires MOQ)",
      },

      {
        label: "Fire Rating",
        value: "B3 as per DIN 4102 (B2 & PIR upon request)",
      },
    ],

    // ✅ icon = path to YOUR image file in /public/icons/

    keyPerformance: [
      {
        icon: "/assets/icon/thermal.svg",
        title: "Thermal Insulation",
        desc: "High-performance insulation reduces heat transfer and maintains consistent indoor temperatures.",
      },

      {
        icon: "/assets/icon/sound.svg",
        title: "Sound Insulation",
        desc: "PUF core significantly reduces external noise — ideal for factories and commercial spaces.",
      },

      {
        icon: "/assets/icon/aesthetic.svg",
        title: "Aesthetic Finish",
        desc: "Clean, smooth wall finish available in multiple RAL colors for modern architecture.",
      },

      {
        icon: "/assets/icon/energy.svg",
        title: "Energy Efficient",
        desc: "Reduces HVAC energy consumption by maintaining stable internal temperatures.",
      },

      {
        icon: "/assets/icon/ShieldCheck.svg",
        title: "Secure & Durable",
        desc: "Rigid panel system with strong interlocking joints for long-term structural security.",
      },

      {
        icon: "/assets/icon/installation.svg",
        title: "Fast Installation",
        desc: "Lightweight panels with simple tongue & groove joints for quick site assembly.",
      },
    ],

    joints: [
      {
        name: "Single Tongue & Groove Wall Panel",
        image: "/assets/joints/joint1.png",
        desc: "Watertight concealed fix system",
      },

      {
        name: "Double Tongue & Groove Wall Panel",
        image: "/assets/joints/joint2.png",
        desc: "Low profile aesthetic finish",
      },

      {
        name: "Triple Tongue & Groove Wall Panel",
        image: "/assets/joints/joint3.png",
        desc: "High strength structural joint",
      },
    ],

    accessories: [
      { name: "Profile Ridge", image: "/assets/accessories/ProfileRidge.png" },

      { name: "C-Flashing", image: "/assets/accessories/CFlashing.png" },

      {
        name: "Z-AngleFlashing",
        image: "/assets/accessories/ZAngleFlashing.png",
      },

      { name: "Gutter", image: "/assets/accessories/Gutter.png" },

      { name: "L-Flashing", image: "/assets/accessories/LFlashing.png" },

      { name: "Plain Ridge", image: "/assets/accessories/PlainRidge.png" },

      { name: "Metal closer", image: "/assets/accessories/Metalcloser.png" },

      {
        name: "Screw & Screw Caps",
        image: "/assets/accessories/Screw&ScrewCaps.png",
      },
    ],

    faqs: [
      {
        q: "What is a Mono Wall panel?",
        a: "A Mono Wall panel is a single-skin insulated sandwich panel used for wall cladding in industrial and commercial buildings.",
      },

      {
        q: "Can Mono Wall panels be used for cold storage?",
        a: "Yes. With appropriate thickness (100mm+), Mono Wall panels provide excellent insulation for cold storage applications.",
      },

      {
        q: "What colors are available?",
        a: "We offer a wide range of RAL colors. Standard colors include White, Ivory, Sky Blue, and Light Grey.",
      },

      {
        q: "Are the panels fire rated?",
        a: "Yes. Our Mono Wall panels carry B1 and B2 fire ratings as per Indian and international standards.",
      },

      {
        q: "What is the minimum order quantity?",
        a: "We accept orders from 100 sqm onwards. Contact us for bulk pricing and project quotations.",
      },
    ],

    related: ["roofPanel", "concealed"],
  },

  // ── CONCEALED ───────────────────────────────────────────────────────────────

  concealed: {
    id: "concealed",

    name: "Concealed Panel",

    tagline: "Premium Hidden Fix Wall System",

    badge: "New",

    color: "#1d4ed8",

    lightColor: "#eff6ff",

    image: "/assets/products/concealed.png",

    colorOptions: [
      {
        hex: "#dc2626",
        name: "Brick Red",
        image: "/assets/products copy/concealed/concealed-red.png",
      },

      {
        hex: "#0ea5e9",
        name: "Sky Blue",
        image: "/assets/products copy/concealed/concealed-blue.png",
      },

      {
        hex: "#1d4ed8",
        name: "Royal Blue",
        image: "/assets/products copy/concealed/concealed-darkblue.png",
      },

      {
        hex: "#d1d5db",
        name: "Off White",
        image: "/assets/products copy/concealed/concealed-silver.png",
      },

      {
        hex: "#02ac1e",
        name: "Caulified Green",
        image: "/assets/products copy/concealed/concealed-green.png",
      },

      {
        hex: "#374151",
        name: "Grey",
        image: "/assets/products copy/concealed/concealed-grey.png",
      },
    ],

    description: `Arasfirma Concealed Fix PUF Panels offer a premium architectural
    wall cladding solution with completely hidden fasteners for a clean, uninterrupted surface finish. Ideal for high-end commercial buildings,clean rooms, pharmaceutical facilities, and food processing plants where
    hygiene and aesthetics are paramount. The concealed fixing system eliminates exposed fasteners, preventing water ingress and ensuring a sleek, modern appearance.`,

    specifications: [
      { label: "Panel Width", value: "1000 mm" },
      { label: "Panel Length", value: "Custom " },
      { label: "Thickness", value: "40mm – 150mm" },
      { label: "Steel thickness", value: "0.30mm to 0.60mm" },
      { label: "Core Density", value: "42 kg/m³(± 2 kg)" },
      { label: "Thermal Value", value: "0.020 W/mK " },

      {
        label: "Coating mass",
        value:
          "AZ70 Gsm, AZ150 Gsm or as per client requirements*(* - it requires MOQ)",
      },

      {
        label: "Paint type",
        value: "RMP, SDP, SMP*, PVDF* (* - it requires MOQ)",
      },

      {
        label: "Fire Rating",
        value: "B3 as per DIN 4102 (B2 & PIR upon request)",
      },
    ],

    // ✅ icon = path to YOUR image file in /public/icons/

    keyPerformance: [
      {
        icon: "/assets/icon/aestheticc.svg",
        title: "Premium Aesthetics",
        desc: "Completely concealed fasteners give a clean, uninterrupted wall surface for high-end finishes.",
      },

      {
        icon: "/assets/icon/hygiene.svg",
        title: "Hygienic Surface",
        desc: "No exposed fasteners means easy cleaning — ideal for food, pharma, and clean room environments.",
      },

      {
        icon: "/assets/icon/puf.svg",
        title: "Superior Insulation",
        desc: "Higher density PUF core provides exceptional thermal performance for controlled environments.",
      },

      {
        icon: "/assets/icon/Watertight.svg",
        title: "Watertight System",
        desc: "Concealed joints prevent moisture ingress, eliminating corrosion and leakage risks.",
      },

      {
        icon: "/assets/icon/sound.svg",
        title: "Acoustic Control",
        desc: "Enhanced sound attenuation for noise-sensitive pharmaceutical and laboratory facilities.",
      },

      {
        icon: "/assets/icon/quality.svg",
        title: "Premium Quality",
        desc: "Higher grade steel and PUF density for demanding commercial and industrial applications.",
      },
    ],

    joints: [
      {
        name: "Single Tongue & Groove Wall Panel",
        image: "/assets/joints/joint1.png",
        desc: "Watertight concealed fix system",
      },

      {
        name: "Double Tongue & Groove Wall Panel",
        image: "/assets/joints/joint2.png",
        desc: "Low profile aesthetic finish",
      },

      {
        name: "Triple Tongue & Groove Wall Panel",
        image: "/assets/joints/joint3.png",
        desc: "High strength structural joint",
      },
    ],

    accessories: [
      { name: "Profile Ridge", image: "/assets/accessories/ProfileRidge.png" },

      { name: "C-Flashing", image: "/assets/accessories/CFlashing.png" },

      {
        name: "Z-AngleFlashing",
        image: "/assets/accessories/ZAngleFlashing.png",
      },

      { name: "Gutter", image: "/assets/accessories/Gutter.png" },

      { name: "L-Flashing", image: "/assets/accessories/LFlashing.png" },

      { name: "Plain Ridge", image: "/assets/accessories/PlainRidge.png" },

      { name: "Metal closer", image: "/assets/accessories/Metalcloser.png" },

      {
        name: "Screw & Screw Caps",
        image: "/assets/accessories/Screw&ScrewCaps.png",
      },
    ],

    faqs: [
      {
        q: "What makes concealed panels different?",
        a: "Concealed panels use a hidden clip fixing system — no exposed screws or fasteners on the surface, giving a premium clean finish.",
      },

      {
        q: "Are they suitable for clean rooms?",
        a: "Yes. The smooth, hygienic surface with no exposed fasteners makes them ideal for pharmaceutical, food processing, and clean room environments.",
      },

      {
        q: "How are concealed panels installed?",
        a: "Panels are fixed using concealed clips that attach to the building structure. Each panel snaps onto the clips for a completely hidden fixing.",
      },

      {
        q: "Are concealed panels more expensive?",
        a: "They carry a slight premium over standard panels due to the higher-spec fixing system, but offer significant aesthetic and hygiene benefits.",
      },

      {
        q: "What thickness is recommended for cold rooms?",
        a: "For cold room wall applications, we recommend 100mm–150mm thickness for optimal thermal performance.",
      },
    ],

    related: ["roofPanel", "monoWall"],
  },
};
