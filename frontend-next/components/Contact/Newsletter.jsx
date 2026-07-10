"use client";

import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setEmail("");
      setTimeout(() => setSuccess(false), 4000);
    }, 1200);
  };

  return (
    <section className="w-full py-12 px-6" style={{ background: "#dc2626" }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* LEFT: Text */}
        <div className="flex-1">
          <h2 className="text-2xl font-black text-white mb-2">
            Subscribe to our Newsletter
          </h2>
          <p className="text-red-100 text-sm leading-relaxed max-w-md">
            Subscribe for Updates: Stay informed about the latest investor
            updates, financial results, and announcements by subscribing to our
            newsletter.
          </p>
        </div>

        {/* RIGHT: Input + Button */}
        <div className="flex-1 flex items-center gap-0 max-w-md w-full">
          {success ? (
            <div className="flex items-center gap-2 bg-white text-green-600 font-bold px-6 py-3.5 rounded-full w-full justify-center">
              ✅ Subscribed Successfully!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 text-sm rounded-l-full focus:outline-none text-white border border-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-gray-900 font-bold px-7 py-3.5 rounded-r-full hover:bg-gray-200 active:scale-95 transition-all duration-200 disabled:opacity-70 whitespace-nowrap"
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
