import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ bookingsCount: 0 });

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/booking/my');
      if (response.data) {
        setStats({ bookingsCount: response.data.length });
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-8 sm:py-12 max-w-5xl mx-auto transition-colors duration-300 relative text-left">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,theme(colors.cyan.500/3%),transparent_45%)] pointer-events-none" />

      {/* Header Greeting */}
      <div className="relative z-10 mb-8 sm:mb-12 bg-gradient-to-r from-slate-900 to-slate-950 dark:from-slate-900 dark:to-black rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/25 bg-cyan-500/5 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>User Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{user?.name || 'Patient'}</span>!
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Access your medical database lookups or track active medicine bookings below.
            </p>
          </div>

          {/* Quick Stat Bubble */}
          <div className="shrink-0 bg-white/5 dark:bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 sm:self-center self-start">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Bookings</span>
              <span className="text-xl font-extrabold text-white mt-1 block">{stats.bookingsCount} reservation(s)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Centered Actions List */}
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <div>
          <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Card 1: Find Medicines */}
            <Link
              to="/search"
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-cyan-500/40 dark:hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between group hover:scale-[1.01] text-left"
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 flex items-center justify-center text-cyan-500">
                  <Search className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-cyan-500 transition-colors">
                    Find Medicines
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    Search medicine inventories in nearby verified pharmacies. Find exact stock quantities and real-time prices.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-500 pt-6">
                <span>Start Searching</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: My Bookings */}
            <Link
              to="/my-bookings"
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-cyan-500/40 dark:hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between group hover:scale-[1.01] text-left"
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-emerald-500 transition-colors">
                    My Bookings
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    Track your reserved medicine pickups. Compare status updates, time of booking, and store addresses.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 pt-6">
                <span>View Bookings</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
        
        {/* Trust Banner */}
        <div className="bg-slate-50 dark:bg-slate-900/30 rounded-2xl p-5 border border-slate-100 dark:border-slate-900/60 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">Secure Healthcare Network</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              All booking transactions and listed stores are verified by the health committee. MediFind does not charge commission on patient bookings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
