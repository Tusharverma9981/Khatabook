import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import UnlockHisaab from "./UnlockHisaab";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function ViewHisaab({hisaab}) {
//   const [hisaab, setHisaab] = useState(hisaab);
//  const [loading, setLoading] = useState(true);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     api
//       .get(`/hisaabs/${id}`)
//       .then((res) => {
//         setHisaab(res.data);
//         setLoading(false);
//       })
//       .catch(() => {
//         alert("Failed to load hisaab");
//         navigate("/");
//       });
//   }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this Hisaab?")) {
      return;
    }

    try {
      await api.delete(`/hisaabs/${id}`);
      alert("Hisaab deleted successfully!");
      navigate("/");
    } catch (err) {
      alert("Failed to delete hisaab");
    }
  };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         <div className="text-center">
//           <i className="fas fa-spinner fa-spin text-4xl text-indigo-500 mb-4"></i>
//           <p className="text-zinc-400">Loading hisaab...</p>
//         </div>
//       </div>
//     );
//   }

  if (!hisaab) {
    return null;
  }

  const total = hisaab.content.reduce((sum, item) => sum + parseFloat(item.value || 0), 0);

  // Chart data
  const chartData = {
    labels: hisaab.content.map(item => item.key),
    datasets: [{
      data: hisaab.content.map(item => parseFloat(item.value)),
      backgroundColor: [
        '#6366f1',
        '#818cf8',
        '#4f46e5',
        '#a5b4fc',
        '#c7d2fe',
        '#312e81',
        '#4338ca'
      ],
      borderColor: '#1f2937',
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#d1d5db',
          font: {
            size: 14
          },
          padding: 15
        }
      },
      title: {
        display: true,
        text: 'Expense Breakdown',
        color: '#ffffff',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        bodyColor: '#d1d5db',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(2) + '%';
            return label + '₹ ' + value + ' (' + percentage + ')';
          }
        }
      }
    }
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
          <div className="flex items-center gap-4">
            <a className="text-zinc-400 hover:text-white font-medium transition" href="/">
              <i className="fas fa-home mr-2"></i>Home
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="px-6 py-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">{hisaab.title}</h2>
            {hisaab.encrypted && (
              <i className="fas fa-lock text-yellow-500 text-2xl"></i>
            )}
          </div>
          <div className="flex items-center justify-center gap-4 text-zinc-400">
            <p className="flex items-center gap-2">
              <i className="fas fa-calendar-alt"></i>
              {new Date(hisaab.date).toDateString()}
            </p>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 bg-opacity-10 border border-indigo-600 border-opacity-30 text-indigo-400 text-sm font-semibold rounded-lg">
              <i className="fas fa-tag text-xs"></i>
              {hisaab.label}
            </span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side: Expense Details */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Expense Details</h3>
              <div className="flex gap-3">
               
              </div>
            </div>

            <div className="space-y-4">
              {hisaab.content.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-zinc-800 py-4">
                  <span className="text-white font-medium text-lg">{item.key}</span>
                  <span className="text-zinc-400 font-semibold">₹ {item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-white">Total Amount:</span>
                <span className="text-2xl font-bold text-indigo-400">₹ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Side: Analytics Chart */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Expense Analytics</h3>
            <p className="text-zinc-400 mb-6">Distribution of expenses by item</p>
            <div className="flex items-center justify-center">
              <Pie data={chartData} options={chartOptions} />
            </div>
          </div>
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