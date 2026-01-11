import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [hisaabs, setHisaabs] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileFab, setShowMobileFab] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/hisaabs")
      .then((res) => setHisaabs(res.data?.hisaabs || res.data))
      .catch(() => navigate("/login"));
  }, []);

  const handleLogout = () => {
    // Add your logout logic here
    navigate("/login");
  };

  const filteredAndSortedHisaabs = () => {
    let filtered = [...hisaabs];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(h => 
        h.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(h => {
        const hisaabDate = new Date(h.date).toISOString().split('T')[0];
        return hisaabDate === dateFilter;
      });
    }

    
    // Sort
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'date_desc':
          return new Date(b.date) - new Date(a.date);
        case 'date_asc':
          return new Date(a.date) - new Date(b.date);
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <i className="fas fa-wallet text-white text-lg"></i>
            </div>
            <h1 className="text-2xl font-bold text-white">KhaataPro</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <a href="/dashboard" className="text-zinc-400 hover:text-white font-medium transition flex items-center gap-2">
              <i className="fas fa-chart-line"></i> Dashboard
            </a>
            <a href="/about" className="text-zinc-400 hover:text-white font-medium transition flex items-center gap-2">
              <i className="fa-solid fa-address-card"></i> Info Center
            </a>
            
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition font-medium flex items-center gap-2"
              >
                <i className="fa-solid fa-bars"></i> Menu
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border border-zinc-200 z-50">
                  <a href="/scanner" className="flex items-center gap-2 px-4 py-2 text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                    <i className="fa-solid fa-qrcode"></i> Scan
                  </a>
                  <a href="/payment" className="flex items-center gap-2 px-4 py-2 text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                    <i className="fa-solid fa-wallet"></i> Add Payment App
                  </a>
                  <a href="/rooms" className="flex items-center gap-2 px-4 py-2 text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                    <i className="fa-solid fa-users"></i> My Rooms
                  </a>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleLogout}
              className="text-zinc-400 hover:text-red-400 font-medium transition flex items-center gap-2"
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
          
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-white text-2xl"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
        
        {showMobileMenu && (
          <div className="md:hidden border-t border-zinc-800">
            <div className="px-6 py-4 space-y-3">
              <a href="/dashboard" className="block text-zinc-400 hover:text-white font-medium transition">
                <i className="fas fa-chart-line mr-2"></i> Dashboard
              </a>
              <a href="/about" className="block text-zinc-400 hover:text-white font-medium transition">
                <i className="fa-solid fa-address-card mr-2"></i> Info Center
              </a>
              <a href="/room" className="block text-zinc-400 hover:text-white font-medium transition">
                <i className="fa-solid fa-users mr-2"></i> My Rooms
              </a>
              <a href="/payment" className="block text-zinc-400 hover:text-white font-medium transition">
                <i className="fa-solid fa-wallet mr-2"></i> Add Payment App
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center border-b border-zinc-800">
        <div className="mb-10">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">Track Every Penny</h2>
          <p className="text-zinc-400 text-xl md:text-2xl max-w-2xl mx-auto">Master your money with simple, powerful expense tracking</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="/create" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold transition duration-200 shadow-lg hover:shadow-xl">
            <i className="fas fa-plus-circle"></i> Add New Hisaab
          </a>
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-8 py-4 rounded-lg font-semibold transition duration-200"
          >
            <i className="fas fa-filter"></i> Filter & Sort
          </button>
        </div>
      </header>

      {/* Filter Form */}
      {showFilter && (
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <i className="fas fa-sliders-h text-indigo-600"></i> Filters
            </h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-zinc-500"></i>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search by title" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 text-white placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-calendar text-indigo-500"></i>
                  </div>
                  <input 
                    type="date" 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-indigo-50 border border-zinc-800 text-black rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-zinc-400 font-medium mb-2 flex items-center gap-2">
                  <i className="fas fa-sort text-indigo-600"></i> Sort By
                </label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                >
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="title_asc">Title A-Z</option>
                  <option value="title_desc">Title Z-A</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense Cards */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredAndSortedHisaabs().length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 max-w-md mx-auto">
              <i className="fas fa-inbox text-6xl text-zinc-700 mb-4"></i>
              <h3 className="text-2xl font-bold text-white mb-2">No Hisaabs Yet</h3>
              <p className="text-zinc-400 mb-6">Start tracking your expenses by creating your first hisaab</p>
              <a href="/create" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                <i className="fas fa-plus"></i> Create First Hisaab
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedHisaabs().map((hisaab) => (
              <a 
                key={hisaab._id} 
                href={`/hisaab/${hisaab._id}`}
                className="group block transform hover:-translate-y-1 transition duration-300"
              >
                <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 h-full transition duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition">
                        {hisaab.title}
                      </h3>
                      <p className="text-sm text-zinc-500 flex items-center gap-2">
                        <i className="fas fa-calendar-alt"></i>
                        {new Date(hisaab.date).toDateString()}
                      </p>
                    </div>
                    {hisaab.encrypted && (
                      <div className="text-yellow-500 text-lg">
                        <i className="fas fa-lock">🔒</i>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 bg-opacity-10 border border-indigo-600 border-opacity-30 text-indigo-400 text-sm font-semibold rounded-lg">
                      <i className="fas fa-tag text-xs"></i>
                      {hisaab.label}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <p className="text-zinc-500 text-sm flex items-center gap-2 group-hover:text-indigo-400 transition">
                      <span>View Details</span>
                      <i className="fas fa-arrow-right"></i>
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
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

      {/* Floating Action Button (Mobile) */}
      <div className="md:hidden fixed bottom-6 right-6 z-20">
        <button 
          onClick={() => setShowMobileFab(!showMobileFab)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl transition duration-200"
        >
          <i className="fas fa-ellipsis-v text-xl"></i>
        </button>
        {showMobileFab && (
          <div className="absolute bottom-16 right-0 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
            <a href="/scanner" className="block px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800 transition font-medium border-b border-zinc-800">
              <i className="fa-solid fa-qrcode mr-2"></i> Scan
            </a>
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-zinc-800 transition font-medium"
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}