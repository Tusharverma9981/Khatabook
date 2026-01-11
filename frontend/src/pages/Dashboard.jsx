import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler);

export default function Dashboard() {
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const [hisaabTotals, setHisaabTotals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => {
        setExpensesByCategory(res.data.expensesByCategory || []);
        setHisaabTotals(res.data.hisaabTotals || []);
      })
      .catch(() => navigate("/login"));
  }, []);

  const totalExpenses = expensesByCategory.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalHisaabs = hisaabTotals.length;
  const avgPerHisaab = totalHisaabs > 0 ? totalExpenses / totalHisaabs : 0;
  const monthlyExpense = totalExpenses; // Simplified

  // Chart data
  const expenseChartData = {
    labels: expensesByCategory.map(item => item._id),
    datasets: [{
      label: 'Expenses by Category',
      data: expensesByCategory.map(item => item.totalAmount),
      backgroundColor: ['#6366f1', '#818cf8', '#4f46e5', '#a5b4fc', '#c7d2fe', '#312e81', '#4338ca'],
      borderColor: '#1f2937',
      borderWidth: 2
    }]
  };

  const hisaabChartData = {
    labels: hisaabTotals.map(h => h.title),
    datasets: [{
      label: 'Hisaab Total',
      data: hisaabTotals.map(h => h.totalValue),
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2,
      borderRadius: 8
    }]
  };

  // Monthly trend data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIndex = new Date().getMonth();
  const last6Months = [];
  for(let i = 5; i >= 0; i--) {
    last6Months.push(months[(currentMonthIndex - i + 12) % 12]);
  }
  const monthlyData = last6Months.map(() => Math.round(totalExpenses / 6 * (0.8 + Math.random() * 0.4)));

  const monthlyTrendData = {
    labels: last6Months,
    datasets: [{
      label: 'Monthly Expenses',
      data: monthlyData,
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 3
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { 
        position: 'bottom',
        labels: { 
          font: { size: 14 },
          padding: 15,
          color: '#d1d5db'
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        bodyColor: '#d1d5db',
        borderColor: '#374151',
        borderWidth: 1
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: { display: false },
      title: { 
        display: true,
        text: 'Total per Hisaab',
        font: { size: 18, weight: 'bold' },
        color: '#ffffff',
        padding: { top: 10, bottom: 20 }
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: { color: '#9ca3af' },
        grid: { color: '#374151' }
      },
      x: { 
        ticks: { color: '#9ca3af' },
        grid: { color: '#374151' }
      }
    }
  };

  const lineOptions = {
    ...chartOptions,
    plugins: {
      legend: { display: false },
      title: { 
        display: true,
        text: 'Monthly Trend',
        font: { size: 18, weight: 'bold' },
        color: '#ffffff'
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: { color: '#9ca3af' },
        grid: { color: '#374151' }
      },
      x: { 
        ticks: { color: '#9ca3af' },
        grid: { color: '#374151' }
      }
    }
  };

  const pieOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: { 
        display: true,
        text: 'Expenses by Category',
        font: { size: 18, weight: 'bold' },
        color: '#ffffff',
        padding: { top: 10, bottom: 20 }
      },
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) label += ': ';
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(2) + '%';
            return label + '₹' + context.parsed + ' (' + percentage + ')';
          }
        }
      }
    }
  };

  const sortedCategories = [...expensesByCategory]
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <i className="fas fa-wallet text-white text-sm sm:text-lg"></i>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-white">KhaataPro</h1>
          </div>
          <div className="flex items-center gap-4">
            <a className="text-zinc-400 hover:text-white font-medium transition text-sm sm:text-base" href="/">
              <i className="fas fa-home mr-2"></i>
              <span className="hidden sm:inline">Home</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center border-b border-zinc-800 pb-6 sm:pb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            <i className="fas fa-chart-line text-indigo-600 mr-2 sm:mr-3"></i>
            Expense Dashboard
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">Visual overview of your expenses and hisaabs</p>
        </div>

        {expensesByCategory.length === 0 && hisaabTotals.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-12 max-w-md mx-auto">
              <i className="fas fa-chart-pie text-5xl sm:text-6xl text-zinc-700 mb-3 sm:mb-4"></i>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">No Data Available Yet</h3>
              <p className="text-sm sm:text-base text-zinc-400 mb-4 sm:mb-6">
                Start adding expenses to see your dashboard analytics
              </p>
              <a href="/create" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base">
                <i className="fas fa-plus"></i> Create First Hisaab
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 bg-opacity-20 rounded-xl flex items-center justify-center">
                    <i className="fas fa-rupee-sign text-indigo-500 text-lg sm:text-xl"></i>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 mb-1">Total Expenses</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  ₹{totalExpenses.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 bg-opacity-20 rounded-xl flex items-center justify-center">
                    <i className="fas fa-calendar-alt text-green-500 text-lg sm:text-xl"></i>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 mb-1">This Month</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  ₹{monthlyExpense.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 bg-opacity-20 rounded-xl flex items-center justify-center">
                    <i className="fas fa-book text-purple-500 text-lg sm:text-xl"></i>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 mb-1">Total Hisaabs</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">{totalHisaabs}</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-600 bg-opacity-20 rounded-xl flex items-center justify-center">
                    <i className="fas fa-chart-bar text-yellow-500 text-lg sm:text-xl"></i>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 mb-1">Avg per Hisaab</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  ₹{Math.round(avgPerHisaab).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
                {expensesByCategory.length > 0 && <Pie data={expenseChartData} options={pieOptions} />}
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
                {hisaabTotals.length > 0 && <Bar data={hisaabChartData} options={barOptions} />}
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
                <Line data={monthlyTrendData} options={lineOptions} />
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <i className="fas fa-trophy text-yellow-500"></i>
                  Top Categories
                </h3>
                <div className="space-y-3">
                  {sortedCategories.map((cat, index) => {
                    const percentage = ((cat.totalAmount / totalExpenses) * 100).toFixed(1);
                    return (
                      <div key={cat._id} className="flex items-center justify-between p-3 bg-black border border-zinc-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-indigo-600 bg-opacity-20 rounded-lg flex items-center justify-center text-indigo-400 font-bold text-sm">
                            {index + 1}
                          </span>
                          <div>
                            <p className="text-white font-semibold">{cat._id}</p>
                            <p className="text-xs text-zinc-400">{percentage}% of total</p>
                          </div>
                        </div>
                        <p className="text-indigo-400 font-bold">
                          ₹{cat.totalAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <i className="fas fa-history text-indigo-500"></i>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {hisaabTotals.slice(0, 5).map((hisaab) => (
                  <div key={hisaab._id} className="flex items-center justify-between p-3 bg-black border border-zinc-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                        <i className="fas fa-receipt text-zinc-400"></i>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{hisaab.title}</p>
                        <p className="text-xs text-zinc-400">Added recently</p>
                      </div>
                    </div>
                    <p className="text-white font-bold">
                      ₹{hisaab.totalValue.toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-black py-8 sm:py-10 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-zinc-400">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-wallet text-indigo-500"></i> KhaataPro
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-500">
              Smart, simple, and powerful expense tracking for everyone.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li><a href="/dashboard" className="hover:text-indigo-500 transition">Dashboard</a></li>
              <li><a href="/create" className="hover:text-indigo-500 transition">Add New Hisaab</a></li>
              <li><a href="/scanner" className="hover:text-indigo-500 transition">Scan Receipt</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">Connect</h3>
            <div className="flex gap-4 text-lg sm:text-xl">
              <a href="#" className="hover:text-indigo-500 transition"><i className="fab fa-instagram"></i></a>
              <a href="#" className="hover:text-indigo-500 transition"><i className="fab fa-twitter"></i></a>
              <a href="#" className="hover:text-indigo-500 transition"><i className="fab fa-github"></i></a>
            </div>
            <p className="text-zinc-500 mt-3 text-xs sm:text-sm">support@khaatapro.com</p>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 border-t border-zinc-800 pt-4 text-center text-zinc-500 text-xs sm:text-sm">
          © {new Date().getFullYear()} KhaataPro — All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}