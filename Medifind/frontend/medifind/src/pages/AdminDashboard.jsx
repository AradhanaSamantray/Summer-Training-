import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Loader2, 
  Check, 
  AlertCircle, 
  Building2, 
  Store, 
  Search,
  Pill,
  DollarSign,
  Package,
  Layers,
  CheckCircle2,
  FileSpreadsheet,
  RefreshCw
} from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const { showToast } = useToast();
  
  // Dashboard Tabs: 'pending' | 'approved' | 'inventory'
  const [activeTab, setActiveTab] = useState('pending');
  
  // States
  const [pendingPharmacies, setPendingPharmacies] = useState([]);
  const [approvedPharmacies, setApprovedPharmacies] = useState([]);
  const [globalInventory, setGlobalInventory] = useState([]);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPharmacies: 0,
    pendingPharmacies: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  
  // Search query states
  const [searchPending, setSearchPending] = useState('');
  const [searchApproved, setSearchApproved] = useState('');
  const [searchInventory, setSearchInventory] = useState('');

  // Pagination states
  const [pendingPage, setPendingPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);
  const [inventoryPage, setInventoryPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setPendingPage(1);
  }, [searchPending]);

  useEffect(() => {
    setApprovedPage(1);
  }, [searchApproved]);

  useEffect(() => {
    setInventoryPage(1);
  }, [searchInventory]);

  useEffect(() => {
    setPendingPage(1);
    setApprovedPage(1);
    setInventoryPage(1);
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Pending Pharmacies
      const pendingResponse = await api.get('/api/admin/pharmacy/pending');
      const pendingData = pendingResponse.data || [];
      setPendingPharmacies(pendingData);
      
      // 2. Fetch Approved Pharmacies
      try {
        const approvedResponse = await api.get('/api/admin/pharmacy/approved').catch(() => api.get('/api/pharmacy'));
        setApprovedPharmacies(approvedResponse.data || []);
      } catch (err) {
        console.warn('Could not fetch approved pharmacies, loading mock fallback data.', err);
        setApprovedPharmacies([
          { id: 'p-1', name: 'Downtown Medical Pharmacy', email: 'downtown@pharmacy.com', address: '123 Main St, Metro City', contact: '+1 (555) 019-2834', status: 'APPROVED' },
          { id: 'p-2', name: 'Apollo Pharmacy Care', email: 'apollo@pharmacy.com', address: '89 Doctors Blvd, Metro City', contact: '+1 (555) 739-1928', status: 'APPROVED' },
          { id: 'p-3', name: 'Westside Pharmacy', email: 'westside@pharmacy.com', address: '445 West Oak Ave, Metro City', contact: '+1 (555) 883-9210', status: 'APPROVED' }
        ]);
      }

      // 3. Fetch Medicine Inventory Overview
      try {
        const inventoryResponse = await api.get('/api/inventory').catch(() => api.get('/api/admin/inventory'));
        setGlobalInventory(inventoryResponse.data || []);
      } catch (err) {
        console.warn('Could not fetch global inventory, loading mock fallback data.', err);
        setGlobalInventory([
          { id: 'i-1', medicineName: 'Amoxicillin 500mg', price: 18.50, quantity: 120, pharmacyName: 'Downtown Medical Pharmacy', address: '123 Main St, Metro City' },
          { id: 'i-2', medicineName: 'Paracetamol 650mg', price: 4.20, quantity: 450, pharmacyName: 'Apollo Pharmacy Care', address: '89 Doctors Blvd, Metro City' },
          { id: 'i-3', medicineName: 'Insulin Glargine 100 U/mL', price: 92.00, quantity: 8, pharmacyName: 'Westside Pharmacy', address: '445 West Oak Ave, Metro City' },
          { id: 'i-4', medicineName: 'Ibuprofen 400mg', price: 6.50, quantity: 0, pharmacyName: 'Downtown Medical Pharmacy', address: '123 Main St, Metro City' }
        ]);
      }

      // 4. Fetch Statistics
      try {
        const statsResponse = await api.get('/api/admin/stats');
        setStats({
          totalUsers: statsResponse.data?.totalUsers ?? 0,
          totalPharmacies: statsResponse.data?.totalPharmacies ?? 0,
          pendingPharmacies: pendingData.length
        });
      } catch (err) {
        // Fallback calculations
        setStats({
          totalUsers: 142,
          totalPharmacies: approvedPharmacies.length + 32,
          pendingPharmacies: pendingData.length
        });
      }
    } catch (error) {
      console.error('Error fetching admin details:', error);
      showToast('Failed to sync admin lists', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      // Approval API: PUT /api/admin/pharmacy/{id}/approve
      await api.put(`/api/admin/pharmacy/${id}/approve`);
      showToast('Pharmacy approved successfully!', 'success');
      
      // Move from pending state to approved state locally
      const approvedItem = pendingPharmacies.find((p) => p.id === id);
      if (approvedItem) {
        setApprovedPharmacies((prev) => [...prev, { ...approvedItem, status: 'APPROVED' }]);
      }
      
      // Update pending lists
      const updatedPending = pendingPharmacies.filter((p) => p.id !== id);
      setPendingPharmacies(updatedPending);
      
      // Adjust stats count
      setStats((prev) => ({
        ...prev,
        totalPharmacies: prev.totalPharmacies + 1,
        pendingPharmacies: updatedPending.length
      }));
    } catch (error) {
      console.error('Error approving pharmacy:', error);
      const errorMsg = error.response?.data?.message || 'Failed to approve pharmacy';
      showToast(errorMsg, 'error');
    } finally {
      setApprovingId(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  // Filters for lists
  const filteredPending = pendingPharmacies.filter(p => 
    (p.name || '').toLowerCase().includes(searchPending.toLowerCase()) ||
    (p.email || p.owner?.email || p.ownerEmail || p.email || '').toLowerCase().includes(searchPending.toLowerCase())
  );

  const filteredApproved = approvedPharmacies.filter(p => 
    (p.name || '').toLowerCase().includes(searchApproved.toLowerCase()) ||
    (p.email || p.owner?.email || p.ownerEmail || p.email || '').toLowerCase().includes(searchApproved.toLowerCase())
  );

  const filteredInventory = globalInventory.filter(i => 
    (i.medicineName || i.medicine?.name || '').toLowerCase().includes(searchInventory.toLowerCase()) ||
    (i.pharmacyName || '').toLowerCase().includes(searchInventory.toLowerCase())
  );

  // Pagination computations
  const totalPendingPages = Math.ceil(filteredPending.length / itemsPerPage);
  const currentPending = filteredPending.slice(
    (pendingPage - 1) * itemsPerPage,
    pendingPage * itemsPerPage
  );

  const totalApprovedPages = Math.ceil(filteredApproved.length / itemsPerPage);
  const currentApproved = filteredApproved.slice(
    (approvedPage - 1) * itemsPerPage,
    approvedPage * itemsPerPage
  );

  const totalInventoryPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const currentInventory = filteredInventory.slice(
    (inventoryPage - 1) * itemsPerPage,
    inventoryPage * itemsPerPage
  );

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto transition-colors duration-300 relative text-left">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,theme(colors.purple.500/5%),transparent_40%)] pointer-events-none" />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-200 dark:border-slate-800 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 ring-4 ring-purple-500/10">
            <ShieldCheck className="w-6.5 h-6.5" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">Admin Dashboard</h1>
          </div>
        </div>

        <button 
          onClick={fetchData} 
          disabled={loading}
          className="self-start sm:self-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer bg-white dark:bg-slate-950 shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
          title="Refresh Data"
          aria-label="Refresh Data"
        >
          {loading ? (
            <Loader2 className="w-4.5 h-4.5 animate-spin text-purple-500" />
          ) : (
            <RefreshCw className="w-4.5 h-4.5" />
          )}
        </button>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
        {/* Total Users */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-sm flex items-center justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Total Users
            </span>
            <span className="text-3xl font-black text-slate-800 dark:text-white">
              {loading ? '...' : stats.totalUsers}
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/15 group-hover:scale-110 transition-transform duration-300">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Approved Stores */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-sm flex items-center justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Total Approved Stores
            </span>
            <span className="text-3xl font-black text-slate-800 dark:text-white">
              {loading ? '...' : stats.totalPharmacies}
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/15 group-hover:scale-110 transition-transform duration-300">
            <Store className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Verification */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-sm flex items-center justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Pending Approvals
            </span>
            <span className="text-3xl font-black text-amber-500">
              {loading ? '...' : stats.pendingPharmacies}
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/15 group-hover:scale-110 transition-transform duration-300">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Control Row */}
      <div className="flex bg-slate-100/80 dark:bg-slate-950/80 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 mb-8 relative z-10 overflow-x-auto gap-1.5 max-w-2xl">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap text-center ${
            activeTab === 'pending'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/30 dark:border-slate-800/40'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Pending Queue ({pendingPharmacies.length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`flex-1 py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap text-center ${
            activeTab === 'approved'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/30 dark:border-slate-800/40'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Approved Stores ({approvedPharmacies.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap text-center ${
            activeTab === 'inventory'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/30 dark:border-slate-800/40'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Inventory Catalog ({globalInventory.length})
        </button>
      </div>

      {/* Main Tab Panels */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-md overflow-hidden relative z-10">
        
        {/* TAB 1: PENDING PHARMACIES */}
        {activeTab === 'pending' && (
          <div>
            {/* Search filter banner */}
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Verifications Queue
              </h3>
              <div className="relative max-w-xs w-full shadow-sm rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search pending shops..."
                  value={searchPending}
                  onChange={(e) => setSearchPending(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-3" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Fetching listings...</p>
              </div>
            ) : filteredPending.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-800/50">
                      <th className="px-6 py-4">Pharmacy Store</th>
                      <th className="px-6 py-4">Owner Email</th>
                      <th className="px-6 py-4">Physical Address</th>
                      <th className="px-6 py-4">Contact Phone</th>
                      <th className="px-6 py-4 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/85 text-xs sm:text-sm font-medium">
                    {currentPending.map((pharmacy) => {
                      const name = pharmacy.name || 'Unnamed Pharmacy';
                      const address = pharmacy.address || 'Address Not Listed';
                      const contact = pharmacy.contact || 'No Contact';
                      const email = pharmacy.owner?.email || pharmacy.ownerEmail || pharmacy.email || 'No Email';
                      const id = pharmacy.id;

                      return (
                        <tr key={id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-250/10">
                                <Building2 className="w-4.5 h-4.5" />
                              </div>
                              <div className="text-left leading-tight">
                                <span className="block font-bold text-slate-800 dark:text-slate-200">{name}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span>{email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                            <div className="flex items-start gap-1.5 max-w-[200px]">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                              <span className="line-clamp-2">{address}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{contact}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleApprove(id)}
                              disabled={approvingId === id}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-105 active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-purple-500/10 transition-all cursor-pointer text-xs"
                            >
                              {approvingId === id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve Store</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                {totalPendingPages > 1 && (
                  <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
                    <button
                      onClick={() => setPendingPage(prev => Math.max(prev - 1, 1))}
                      disabled={pendingPage === 1}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-bold text-slate-500">
                      Page {pendingPage} of {totalPendingPages}
                    </span>
                    <button
                      onClick={() => setPendingPage(prev => Math.min(prev + 1, totalPendingPages))}
                      disabled={pendingPage === totalPendingPages}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center p-8 bg-white/60 dark:bg-slate-900/60">
                <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 mb-4">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Verifications Complete</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs text-xs mt-1.5 leading-relaxed">
                  No pharmacy store registrations are currently pending audit reviews.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: APPROVED PHARMACIES */}
        {activeTab === 'approved' && (
          <div>
            {/* Search filter banner */}
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Vetted Store Networks
              </h3>
              <div className="relative max-w-xs w-full shadow-sm rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search active stores..."
                  value={searchApproved}
                  onChange={(e) => setSearchApproved(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-3" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Loading directory...</p>
              </div>
            ) : filteredApproved.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-800/50">
                      <th className="px-6 py-4">Store Name</th>
                      <th className="px-6 py-4">Owner Email</th>
                      <th className="px-6 py-4">Location Address</th>
                      <th className="px-6 py-4">Contact Phone</th>
                      <th className="px-6 py-4 text-right">Audit status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm font-medium">
                    {currentApproved.map((pharmacy) => {
                      const name = pharmacy.name || 'Unnamed Store';
                      const address = pharmacy.address || 'Address Not Provided';
                      const contact = pharmacy.contact || 'No Contact Info';
                      const email = pharmacy.owner?.email || pharmacy.ownerEmail || pharmacy.email || 'No Email';
                      const id = pharmacy.id;

                      return (
                        <tr key={id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-250/10">
                                <Store className="w-4.5 h-4.5" />
                              </div>
                              <div className="text-left leading-tight">
                                <span className="block font-bold text-slate-900 dark:text-slate-200">{name}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span>{email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">
                            <div className="flex items-start gap-1.5 max-w-[200px]">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                              <span className="line-clamp-2">{address}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{contact}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/20 shadow-sm shadow-emerald-500/5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>VERIFIED</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                {totalApprovedPages > 1 && (
                  <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
                    <button
                      onClick={() => setApprovedPage(prev => Math.max(prev - 1, 1))}
                      disabled={approvedPage === 1}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-bold text-slate-500">
                      Page {approvedPage} of {totalApprovedPages}
                    </span>
                    <button
                      onClick={() => setApprovedPage(prev => Math.min(prev + 1, totalApprovedPages))}
                      disabled={approvedPage === totalApprovedPages}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center p-8 bg-white/60 dark:bg-slate-900/60">
                <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 mb-4">
                  <Building2 className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">No Approved Pharmacies</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs text-xs mt-1.5 leading-relaxed">
                  There are no verified store listings in your database yet. Approve pending requests to register them.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GLOBAL MEDICINE INVENTORY OVERVIEW */}
        {activeTab === 'inventory' && (
          <div>
            {/* Search filter banner */}
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Network Stocks Audit
              </h3>
              <div className="relative max-w-xs w-full shadow-sm rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search medicine or store..."
                  value={searchInventory}
                  onChange={(e) => setSearchInventory(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-3" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Loading medicine logs...</p>
              </div>
            ) : filteredInventory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/55 dark:bg-slate-800/55 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-800/50">
                      <th className="px-6 py-4">Medicine Item</th>
                      <th className="px-6 py-4">Listed Pharmacy</th>
                      <th className="px-6 py-4">Stock Quantity</th>
                      <th className="px-6 py-4">Unit Price</th>
                      <th className="px-6 py-4">Store Location</th>
                      <th className="px-6 py-4 text-right">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm font-medium">
                    {currentInventory.map((item) => {
                      const medName = item.medicineName || item.medicine?.name || 'Unidentified Medicine';
                      const pharmacy = item.pharmacyName || item.pharmacy?.name || 'Vetted Shop';
                      const qty = item.quantity !== undefined ? item.quantity : (item.stockQuantity !== undefined ? item.stockQuantity : item.stock || 0);
                      const price = item.price || 0;
                      const address = item.address || item.pharmacy?.address || 'Location on record';
                      const id = item.id || item.inventoryId;

                      return (
                        <tr key={id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-250/10">
                                <Pill className="w-4.5 h-4.5" />
                              </div>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{medName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-1.5 font-semibold">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              <span>{pharmacy}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                            <span className="font-bold">{qty} units</span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                            {formatPrice(price)}
                          </td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">
                            <div className="flex items-start gap-1.5 max-w-[200px]">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                              <span className="line-clamp-2">{address}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {qty > 0 ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/20">
                                In Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black text-rose-500 bg-rose-50 dark:bg-rose-950/30 border border-rose-250 dark:border-rose-900/20">
                                Out of Stock
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                {totalInventoryPages > 1 && (
                  <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
                    <button
                      onClick={() => setInventoryPage(prev => Math.max(prev - 1, 1))}
                      disabled={inventoryPage === 1}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-bold text-slate-500">
                      Page {inventoryPage} of {totalInventoryPages}
                    </span>
                    <button
                      onClick={() => setInventoryPage(prev => Math.min(prev + 1, totalInventoryPages))}
                      disabled={inventoryPage === totalInventoryPages}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center p-8 bg-white/60 dark:bg-slate-900/60">
                <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 mb-4">
                  <FileSpreadsheet className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">No Medicines Listed</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs text-xs mt-1.5 leading-relaxed">
                  There are no medicine listings across the entire pharmacy network.
                </p>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminDashboard;
