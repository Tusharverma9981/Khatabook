import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function PaymentApp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    appName: "Google Pay",
    upiId: "",
    nickname: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.upiId.trim()) {
      alert("UPI ID is required");
      return;
    }

    try {
      // ✅ Backend API should be: POST /api/payment-app/add
      await api.post("/payment-app/add", form);

      alert("Payment app added ✅");
      navigate("/"); // or navigate("/dashboard")
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add payment app");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-poppins">
      {/* Navbar */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">💼</span>
            </div>
            <h1 className="text-2xl font-bold text-white">KhaataPro</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              className="text-gray-400 hover:text-white font-medium transition"
              to="/"
            >
              🏠 Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-xl mx-auto px-6 py-16">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Add Payment App</h1>
          <p className="text-gray-400">
            Connect your UPI app for faster transactions.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select App */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Select UPI App
              </label>
              <div className="relative">
                <span className="text-gray-500 absolute left-3 top-3">👛</span>

                <select
                  value={form.appName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, appName: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-3 bg-black border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                >
                  <option value="Google Pay">Google Pay</option>
                  <option value="PhonePe">PhonePe</option>
                  <option value="Paytm">Paytm</option>
                  <option value="BHIM">BHIM UPI</option>
                  <option value="Amazon Pay">Amazon Pay</option>
                </select>
              </div>
            </div>

            {/* UPI ID */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                UPI ID
              </label>
              <div className="relative">
                <span className="text-gray-500 absolute left-3 top-3">🪪</span>

                <input
                  type="text"
                  placeholder="yourname@upi"
                  required
                  value={form.upiId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, upiId: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Nickname */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Nickname (optional)
              </label>
              <input
                type="text"
                placeholder="E.g. My GPay"
                value={form.nickname}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nickname: e.target.value }))
                }
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-semibold transition duration-200 shadow-lg hover:shadow-indigo-700/20"
            >
              ➕ Add Payment App
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-10 mt-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-gray-400">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-500">💼</span> KhaataPro
            </h2>
            <p className="mt-3 text-gray-500">
              Smart, simple, and powerful expense tracking for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="hover:text-indigo-500 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-indigo-500 transition">
                  Add New Hisaab
                </Link>
              </li>
              <li>
                <Link to="/scanner" className="hover:text-indigo-500 transition">
                  Scan
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="hover:text-indigo-500 transition">
                  My Rooms
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-3">Connect</h3>
            <div className="flex gap-4 text-xl">
              <a href="#" className="hover:text-indigo-500 transition">
                📸
              </a>
              <a href="#" className="hover:text-indigo-500 transition">
                🐦
              </a>
              <a href="#" className="hover:text-indigo-500 transition">
                💻
              </a>
            </div>
            <p className="text-gray-500 mt-3 text-sm">support@khaatapro.com</p>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} KhaataPro — All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
