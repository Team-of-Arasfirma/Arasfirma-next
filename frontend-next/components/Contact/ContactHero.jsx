"use client";

import { useState } from "react";

import api from "@/lib/api/axios";

const ContactHero = () => {
  const [form, setForm] = useState({
    name: "",

    phone: "",

    email: "",

    message: "",
  });

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      alert("Please fill all required fields.");

      return;
    }

    setLoading(true);

    try {
      await api.post("/inquiries", {
        name: form.name,

        phone: form.phone,

        email: form.email,

        subject: "Website Contact Form",

        message: form.message || "No message provided",
      });

      setLoading(false);

      setSuccess(true);

      setForm({ name: "", phone: "", email: "", message: "" });

      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setLoading(false);

      alert(
        err.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    }
  };

  return (
    <section
      className="w-full relative overflow-hidden pt-36 pb-20 px-6"

      style={{
        background:
          "linear-gradient(135deg, #fff7f7 0%, #ffe4e6 50%, #ffffff 100%)",
      }}
    >
      {/* Soft Red Blobs */}

      <div
        className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-30"

        style={{
          background: "radial-gradient(circle, #f87171, transparent 70%)",

          filter: "blur(60px)",
        }}
      />

      <div
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-20"

        style={{
          background: "radial-gradient(circle, #ef4444, transparent 70%)",

          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        {/* LEFT */}

        <div className="flex-1">
          <span className="text-red-600 text-xs uppercase tracking-widest font-semibold">
            Get In Touch
          </span>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 mb-4 leading-tight">
            Get in touch <br />
            with us. We're <br />
            <span className="text-red-600">here to assist</span> you.
          </h1>

          <p className="text-gray-600 mb-8 max-w-lg">
            Whether you have questions or need a quote, we're just a message
            away. Our team is ready to help you with professional solutions.
          </p>

          {/* Contact Info */}

          <div className="flex flex-col gap-4">
            {[
              {
                icon: "📞",

                label: "Call Us",

                value: "+91 99440 15565",

                href: "tel:+919944015565",
              },

              {
                icon: "✉️",

                label: "Email Us",

                value: "info@arasfirma.com",

                href: "mailto:info@arasfirma.com",
              },

              {
                icon: "📍",

                label: "Visit Us",

                value: "Avinashi, Tamil Nadu, India",

                href: "#",
              },

              {
                icon: "🕘",

                label: "Working Hours",

                value: "Mon – Sat, 9:00 AM – 6:00 PM",

                href: null,
              },
            ].map((item, i) => (
              <div
                key={i}

                className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <div className="text-xl">{item.icon}</div>

                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">
                    {item.label}
                  </p>

                  {item.href ? (
                    <a
                      href={item.href}

                      target="_blank"

                      rel="noopener noreferrer"

                      className="text-gray-900 font-bold hover:text-red-600"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-gray-900 font-bold">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT FORM */}

        <div className="flex-1">
          <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-lg">
            <h2 className="text-xl text-gray-900 font-bold mb-6">Contact Us</h2>

            {success && (
              <div className="mb-4 text-green-600 font-semibold">
                ✅ Message Sent Successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"

                name="name"

                value={form.name}

                onChange={handleChange}

                placeholder="Full Name *"

                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />

              <input
                type="tel"

                name="phone"

                value={form.phone}

                onChange={handleChange}

                placeholder="Mobile No. *"

                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />

              <input
                type="email"

                name="email"

                value={form.email}

                onChange={handleChange}

                placeholder="Email Address *"

                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />

              <textarea
                name="message"

                value={form.message}

                onChange={handleChange}

                placeholder="Your Message"

                rows={4}

                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
              />

              <button
                type="submit"

                disabled={loading}

                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
