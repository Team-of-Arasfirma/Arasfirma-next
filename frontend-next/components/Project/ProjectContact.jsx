"use client";

import { useState } from "react";

import api from "@/lib/api/axios";

// ✅ icon is in public/icon/ folder

const workerSvgPath = "/assets/icon/Group 13.svg";

const products = ["Roof Panel", "Mono Wall Panel", "Concealed Panel"];

const ProjectContact = () => {
  const [form, setForm] = useState({
    name: "",

    email: "",

    phone: "",

    product: "",

    message: "",
  });

  const [showTooltip, setShowTooltip] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.message) {
      alert("Please fill all required fields.");

      return;
    }

    try {
      setLoading(true);

      await api.post("/inquiries", {
        name: form.name,

        email: form.email,

        phone: form.phone,

        subject: form.product || "Project Inquiry",

        message: form.message,
      });

      setShowTooltip(true);

      setForm({
        name: "",

        email: "",

        phone: "",

        product: "",

        message: "",
      });

      setTimeout(() => {
        setShowTooltip(false);
      }, 4000);
    } catch (error) {
      console.error("Inquiry Submit Error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to submit inquiry. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-16 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}

        <div data-animate="up" className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
            Contact Us
          </p>

          <h2 className="text-2xl md:text-3xl font-black uppercase text-red-600">
            Ready To Build Your Project?
          </h2>

          <div className="w-16 h-1 bg-red-600 rounded mt-3" />
        </div>

        {/* Card */}

        <div
          data-animate="up"

          data-delay="100"

          className="flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-xl"
        >
          {/* LEFT PANEL */}

          <div
            className="relative flex flex-col justify-center px-10 py-12 md:w-[280px] shrink-0 overflow-hidden"

            style={{ background: "#F35F5F" }}
          >
            <img
              src={workerSvgPath}

              alt=""

              className="absolute bottom-0 right-0 h-[85%] w-auto opacity-60 pointer-events-none"

              style={{ filter: "brightness(0) invert(1)" }}

              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <h3
              className="relative z-10 text-3xl font-black text-white leading-tight"

              style={{ fontFamily: "Georgia, serif" }}
            >
              Build Your
              <br />
              Project
            </h3>

            <p className="relative z-10 text-red-100 text-sm mt-3 leading-relaxed">
              Get a free consultation and quote from our experts today.
            </p>

            <div className="relative z-10 mt-8 flex flex-col gap-3">
              {["200+ Projects Done", "Free Consultation", "Fast Delivery"].map(
                (t) => (
                  <div key={t} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center shrink-0">
                      <span className="text-white text-[9px] font-black">
                        ✓
                      </span>
                    </div>

                    <span className="text-white text-xs font-semibold">
                      {t}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}

          <div className="flex-1 bg-white px-8 py-10 relative">
            {showTooltip && (
              <div
                className="absolute top-4 right-4 flex items-center gap-3 bg-green-500 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-xl z-50"

                style={{ animation: "fadeInDown 0.3s ease" }}
              >
                <span className="text-lg">✅</span>
                Message Sent Successfully!
                <button
                  onClick={() => setShowTooltip(false)}

                  className="ml-2 text-white/70 hover:text-white text-xl leading-none"
                >
                  ×
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    Name *
                  </label>

                  <input
                    type="text"

                    name="name"

                    value={form.name}

                    onChange={handleChange}

                    placeholder="Your full name"

                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    Email ID *
                  </label>

                  <input
                    type="email"

                    name="email"

                    value={form.email}

                    onChange={handleChange}

                    placeholder="your@email.com"

                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    Phone *
                  </label>

                  <input
                    type="tel"

                    name="phone"

                    value={form.phone}

                    onChange={handleChange}

                    placeholder="+91 99874 65240"

                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    Select Product
                  </label>

                  <select
                    name="product"

                    value={form.product}

                    onChange={handleChange}

                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 transition-colors text-gray-500"
                  >
                    <option value="">Select Product</option>

                    {products.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  Message *
                </label>

                <textarea
                  name="message"

                  value={form.message}

                  onChange={handleChange}

                  rows={4}

                  placeholder="Tell us about your project..."

                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"

                  disabled={loading}

                  className="flex items-center gap-3 bg-gray-900 text-white font-bold px-8 py-3 rounded-full hover:bg-red-600 active:scale-95 transition-all duration-300 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"

                        style={{
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Submit
                      <span className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-xs">
                        →
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`

        @keyframes fadeInDown {

          from {

            opacity: 0;

            transform: translateY(-10px);

          }

          to {

            opacity: 1;

            transform: translateY(0);

          }

        }



        @keyframes spin {

          to {

            transform: rotate(360deg);

          }

        }

      `}</style>
    </section>
  );
};

export default ProjectContact;
