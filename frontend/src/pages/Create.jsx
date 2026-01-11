import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CreateHisaab() {
  const [formData, setFormData] = useState({
    title: "",
    label: "",
    encrypted: false,
    password: ""
  });
  const [content, setContent] = useState([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleContentChange = (index, field, value) => {
    const newContent = [...content];
    newContent[index][field] = value;
    setContent(newContent);
  };

  const addContentItem = () => {
    setContent([...content, { key: "", value: "" }]);
  };

  const removeContentItem = (index) => {
    if (content.length > 1) {
      setContent(content.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.label) {
      alert("Title and Label are required");
      return;
    }

    if (formData.encrypted && !formData.password) {
      alert("Password is required for encrypted hisaab");
      return;
    }

    const validContent = content.filter(item => item.key && item.value);
    if (validContent.length === 0) {
      alert("Please add at least one expense item");
      return;
    }

    try {
      setLoading(true);
      await api.post("/hisaabs", {
        title: formData.title,
        label: formData.label,
        content: validContent,
        encrypted: formData.encrypted,
        password: formData.encrypted ? formData.password : undefined
      });

      alert("Hisaab created successfully! ✅");
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create hisaab");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = content.reduce((sum, item) => {
    const value = parseFloat(item.value) || 0;
    return sum + value;
  }, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <i className="fas fa-wallet text-white text-lg"></i>
            </div>
            <h1 className="text-2xl font-bold text-white">KhaataPro</h1>
          </div>
          <div className="flex items-center gap-4">
            <a className="text-zinc-400 hover:text-white font-medium transition" href="/">
              <i className="fas fa-home mr-2"></i>
              <span className="hidden sm:inline">Home</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 bg-opacity-20 rounded-2xl mb-4">
            <i className="fas fa-plus-circle text-indigo-500 text-3xl"></i>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Create New Hisaab
          </h2>
          <p className="text-zinc-400 text-lg">
            Track your expenses with detailed records
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <i className="fas fa-info-circle text-indigo-500"></i>
                Basic Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-200 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Grocery Shopping"
                    required
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-200 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  >
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Bills">Bills</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Encryption Option */}
              <div className="bg-black border border-zinc-800 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="encrypted"
                    checked={formData.encrypted}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600 bg-zinc-900 border-zinc-700 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <span className="text-white font-medium flex items-center gap-2">
                      <i className="fas fa-lock text-yellow-500"></i>
                      Enable Password Protection
                    </span>
                    <p className="text-xs text-zinc-400 mt-1">
                      Keep this hisaab private and secure with a password
                    </p>
                  </div>
                </label>

                {formData.encrypted && (
                  <div className="mt-4">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required={formData.encrypted}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Expense Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <i className="fas fa-receipt text-indigo-500"></i>
                  Expense Items
                </h3>
                <button
                  type="button"
                  onClick={addContentItem}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                >
                  <i className="fas fa-plus"></i>
                  Add Item
                </button>
              </div>

              <div className="space-y-3">
                {content.map((item, index) => (
                  <div key={index} className="bg-black border border-zinc-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 grid md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Item name"
                          value={item.key}
                          onChange={(e) => handleContentChange(index, "key", e.target.value)}
                          className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">₹</span>
                          <input
                            type="number"
                            placeholder="0.00"
                            value={item.value}
                            onChange={(e) => handleContentChange(index, "value", e.target.value)}
                            step="0.01"
                            min="0"
                            className="w-full pl-8 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          />
                        </div>
                      </div>
                      {content.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeContentItem(index)}
                          className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount */}
              <div className="bg-indigo-600 bg-opacity-10 border border-indigo-600 border-opacity-30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300 font-medium">Total Amount:</span>
                  <span className="text-2xl font-bold text-indigo-400">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    Create Hisaab
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-black py-10 mt-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-zinc-400">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-wallet text-indigo-500"></i> KhaataPro
            </h2>
            <p className="mt-3 text-zinc-500">
              Smart, simple, and powerful expense tracking for everyone.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/dashboard" className="hover:text-indigo-500 transition">Dashboard</a></li>
              <li><a href="/create" className="hover:text-indigo-500 transition">Add New Hisaab</a></li>
              <li><a href="/scanner" className="hover:text-indigo-500 transition">Scan</a></li>
              <li><a href="/rooms" className="hover:text-indigo-500 transition">My Rooms</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Connect</h3>
            <div className="flex gap-4 text-xl">
              <a href="#" className="hover:text-indigo-500 transition"><i className="fab fa-instagram"></i></a>
              <a href="#" className="hover:text-indigo-500 transition"><i className="fab fa-twitter"></i></a>
              <a href="#" className="hover:text-indigo-500 transition"><i className="fab fa-github"></i></a>
            </div>
            <p className="text-zinc-500 mt-3 text-sm">support@khaatapro.com</p>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-4 text-center text-zinc-500 text-sm">
          © {new Date().getFullYear()} KhaataPro — All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}