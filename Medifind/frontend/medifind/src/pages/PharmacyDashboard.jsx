import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Calendar, 
  IndianRupee, 
  Package, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Pill, 
  FileEdit, 
  Trash2, 
  Inbox,
  Sparkles,
  Search,
  Bell,
  MapPin,
  RefreshCw
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import MapPickerModal from '../components/MapPickerModal';

const PharmacyDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // Dashboard & list states
  const [profile, setProfile] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingInventory, setLoadingInventory] = useState(true);

  const [activeTab, setActiveTab] = useState('inventory');
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [medicines, setMedicines] = useState([]);

  // Pagination states
  const [inventoryPage, setInventoryPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setInventoryPage(1);
    setBookingsPage(1);
  }, [activeTab]);
  
  // Profile Setup & Edit states
  const [hasProfile, setHasProfile] = useState(true);
  const [registeringProfile, setRegisteringProfile] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

  // Profile registration/edit fields
  const [regName, setRegName] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regContact, setRegContact] = useState('');
  const [regLatitude, setRegLatitude] = useState('');
  const [regLongitude, setRegLongitude] = useState('');
  
  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleMapConfirm = ({ latitude, longitude, address }) => {
    setRegLatitude(latitude.toFixed(6));
    setRegLongitude(longitude.toFixed(6));
    if (address) {
      setRegAddress(address);
    }
    setIsMapOpen(false);
    showToast('Location coordinates and address automatically filled!', 'success');
  };
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form fields (Add / Edit)
  const [medicineId, setMedicineId] = useState('');
  const [medicineName, setMedicineName] = useState(''); // If backend supports custom medicine name
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchInventory();
    fetchBookings();
    fetchMedicines();
  }, []);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const response = await api.get('/api/booking/pharmacy');
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await api.get('/api/medicine');
      setMedicines(response.data || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await api.put(`/api/booking/${bookingId}/status?status=${status}`);
      showToast(`Reservation request ${status.toLowerCase()} successfully!`, 'success');
      fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update booking status', 'error');
    }
  };

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await api.get('/api/pharmacy/profile').catch(() => api.get('/api/pharmacy/me'));
      setProfile(response.data);
      setHasProfile(true);
    } catch (error) {
      console.warn('Could not fetch pharmacy profile, checking status.', error);
      if (error.response?.status === 404) {
        setHasProfile(false);
        setProfile(null);
      } else {
        // Safe fallback
        setProfile({
          id: 1,
          name: user?.name || 'Local Vetted Pharmacy',
          address: '89 Main Medical Boulevard, Suite D',
          contact: '+1 (555) 739-1928',
          status: 'APPROVED',
        });
        setHasProfile(true);
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchInventory = async () => {
    setLoadingInventory(true);
    try {
      const response = await api.get('/api/inventory');
      setInventory(response.data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      showToast('Failed to load inventory stock list', 'error');
    } finally {
      setLoadingInventory(false);
    }
  };

  const handleSelectMedicineChange = (id) => {
    setMedicineId(id);
    if (id) {
      const selected = medicines.find(m => m.id.toString() === id.toString());
      if (selected) {
        setMedicineName(selected.name);
      }
    } else {
      setMedicineName('');
    }
  };

  const handleMedicineNameChange = (name) => {
    setMedicineName(name);
    // Check if the typed name matches an existing medicine (case-insensitive)
    const match = medicines.find(m => m.name.toLowerCase() === name.trim().toLowerCase());
    if (match) {
      setMedicineId(match.id.toString());
    } else {
      setMedicineId('');
    }
  };

  // Add inventory handler
  const handleAddInventory = async (e) => {
    e.preventDefault();
    const isApproved = profile?.approved || (profile?.status || '').toUpperCase() === 'APPROVED';
    if (!isApproved) {
      showToast('Pharmacy not approved, contact Administrator', 'error');
      return;
    }
    if (!medicineName || !quantity || !price || !expiryDate) {
      showToast('All fields are required', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      let finalMedicineId = medicineId;

      // If no medicineId was matched (e.g. they typed a new medicine), register it
      if (!finalMedicineId) {
        try {
          const newMedResponse = await api.post('/api/medicine', {
            name: medicineName.trim(),
            manufacturer: 'General',
            category: 'General',
            description: 'Custom added medicine'
          });
          finalMedicineId = newMedResponse.data.id;
          // Refresh our master medicine list in background
          fetchMedicines();
        } catch (err) {
          console.error('Error creating medicine:', err);
          showToast('Failed to create new medicine in master catalog', 'error');
          setSubmitting(false);
          return;
        }
      }

      const parsedMedId = isNaN(finalMedicineId) ? finalMedicineId : Number(finalMedicineId);
      const payload = {
        pharmacyId: profile?.id,
        medicineId: parsedMedId,
        quantity: Number(quantity),
        price: Number(price),
        expiryDate,
      };

      await api.post('/api/inventory', payload);
      showToast('Inventory item added successfully!', 'success');
      
      setIsAddOpen(false);
      resetForm();
      fetchInventory();
    } catch (error) {
      console.error('Error adding inventory:', error);
      const errorMsg = error.response?.data?.message || 'Failed to add inventory item';
      showToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal & load item data
  const openEditModal = (item) => {
    setEditingItem(item);
    setMedicineId(item.medicine?.id || item.medicineId || item.id || '');
    setMedicineName(item.medicineName || item.medicine?.name || '');
    
    // Make sure we extract stock correctly
    const currentQty = item.quantity !== undefined ? item.quantity : (item.stockQuantity !== undefined ? item.stockQuantity : item.stock || 0);
    setQuantity(currentQty.toString());
    setPrice((item.price || 0).toString());
    
    // Formatting date to yyyy-MM-dd
    if (item.expiryDate || item.expiry) {
      const dateStr = item.expiryDate || item.expiry;
      try {
        const dateObj = new Date(dateStr);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        setExpiryDate(`${yyyy}-${mm}-${dd}`);
      } catch (e) {
        setExpiryDate('');
      }
    } else {
      setExpiryDate('');
    }
    
    setIsEditOpen(true);
  };

  // Update inventory handler
  const handleUpdateInventory = async (e) => {
    e.preventDefault();
    if (!quantity || !price || !expiryDate || !medicineName) {
      showToast('Please fill in all details', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const id = editingItem.id || editingItem.inventoryId;
      const targetMedicineId = editingItem.medicine?.id || editingItem.medicineId || editingItem.id;

      // 1. If medicine name was corrected, update it in the master catalog
      const originalName = editingItem.medicine?.name || editingItem.medicineName || '';
      if (medicineName.trim().toLowerCase() !== originalName.trim().toLowerCase()) {
        const medPayload = {
          id: targetMedicineId,
          name: medicineName.trim(),
          manufacturer: editingItem.medicine?.manufacturer || '',
          category: editingItem.medicine?.category || '',
          description: editingItem.medicine?.description || ''
        };
        await api.put(`/api/medicine/${targetMedicineId}`, medPayload);
      }

      // 2. Update local inventory details
      const payload = {
        pharmacyId: profile?.id,
        medicineId: targetMedicineId,
        quantity: Number(quantity),
        price: Number(price),
        expiryDate,
      };

      // PUT to /api/inventory/{id}
      await api.put(`/api/inventory/${id}`, payload);
      showToast('Medicine listing updated!', 'success');
      
      setIsEditOpen(false);
      resetForm();
      fetchInventory();
    } catch (error) {
      console.error('Error updating inventory:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update listing';
      showToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete inventory handler
  const handleDeleteInventory = async (item) => {
    const id = item.id || item.inventoryId;
    const name = item.medicineName || item.medicine?.name || `Medicine ID: ${item.medicineId || item.id}`;
    
    if (!window.confirm(`Are you sure you want to delete "${name}" from your inventory?`)) {
      return;
    }

    try {
      // DELETE to /api/inventory/{id}
      await api.delete(`/api/inventory/${id}`);
      showToast('Medicine listing deleted', 'success');
      fetchInventory();
    } catch (error) {
      console.error('Error deleting inventory:', error);
      const errorMsg = error.response?.data?.message || 'Failed to delete listing';
      showToast(errorMsg, 'error');
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setMedicineId('');
    setMedicineName('');
    setQuantity('');
    setPrice('');
    setExpiryDate('');
  };



  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!regName || !regAddress || !regContact || !regLatitude || !regLongitude) {
      showToast('Please fill in all details', 'warning');
      return;
    }
    setRegisteringProfile(true);
    try {
      const payload = {
        name: regName,
        address: regAddress,
        contact: regContact,
        latitude: parseFloat(regLatitude),
        longitude: parseFloat(regLongitude)
      };
      const response = await api.post('/api/pharmacy', payload);
      setProfile(response.data);
      setHasProfile(true);
      showToast('Pharmacy profile registered! Awaiting admin approval.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Error registering profile', 'error');
    } finally {
      setRegisteringProfile(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!regName || !regAddress || !regContact || !regLatitude || !regLongitude) {
      showToast('Please fill in all details', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: regName,
        address: regAddress,
        contact: regContact,
        latitude: parseFloat(regLatitude),
        longitude: parseFloat(regLongitude)
      };
      const response = await api.put(`/api/pharmacy/${profile.id}`, payload);
      setProfile(response.data);
      setIsProfileEditOpen(false);
      showToast('Pharmacy profile updated successfully!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Error updating profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Pagination calculations
  const totalInventoryPages = Math.ceil(inventory.length / itemsPerPage);
  const currentInventory = inventory.slice(
    (inventoryPage - 1) * itemsPerPage,
    inventoryPage * itemsPerPage
  );

  const totalBookingsPages = Math.ceil(bookings.length / itemsPerPage);
  const currentBookings = bookings.slice(
    (bookingsPage - 1) * itemsPerPage,
    bookingsPage * itemsPerPage
  );

  // Calculate statistics
  const totalMedicines = inventory.length;
  const availableMedicines = inventory.filter(item => {
    const qty = item.quantity !== undefined ? item.quantity : (item.stockQuantity !== undefined ? item.stockQuantity : item.stock || 0);
    return qty > 0;
  }).length;
  const lowStockMedicines = inventory.filter(item => {
    const qty = item.quantity !== undefined ? item.quantity : (item.stockQuantity !== undefined ? item.stockQuantity : item.stock || 0);
    return qty > 0 && qty < 10;
  }).length;

  const getStockStatus = (qty) => {
    if (qty <= 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/10">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Out of Stock</span>
        </span>
      );
    }
    if (qty < 10) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/10">
          <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
          <span>Low Stock</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/10">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>In Stock</span>
      </span>
    );
  };

  if (!loadingProfile && !hasProfile) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.cyan.500/5%),transparent_55%)] pointer-events-none" />
        
        <div className="w-full max-w-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-2xl rounded-3xl relative z-10 p-8 sm:p-10 text-left">
          
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 mb-4">
              <Building2 className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Setup Pharmacy Profile</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 leading-relaxed max-w-sm">
              Welcome to the MediFind network! Register your shop details and location coordinates so that patients can discover your inventory and locate your shop.
            </p>
          </div>

          <form onSubmit={handleCreateProfile} className="space-y-4">
            
            <div>
              <label htmlFor="regName" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Pharmacy / Shop Name
              </label>
              <input
                id="regName"
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Apollo Pharmacy Connaught Place"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                required
              />
            </div>

            <div>
              <label htmlFor="regAddress" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Physical Shop Address
              </label>
              <input
                id="regAddress"
                type="text"
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
                placeholder="e.g. Connaught Place, New Delhi"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                required
              />
            </div>

            <div>
              <label htmlFor="regContact" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Contact Phone Number
              </label>
              <input
                id="regContact"
                type="text"
                value={regContact}
                onChange={(e) => setRegContact(e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="regLatitude" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Latitude Coordinate
                </label>
                <input
                  id="regLatitude"
                  type="number"
                  step="0.000001"
                  value={regLatitude}
                  onChange={(e) => setRegLatitude(e.target.value)}
                  placeholder="e.g. 28.628"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                  required
                />
              </div>
              <div>
                <label htmlFor="regLongitude" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Longitude Coordinate
                </label>
                <input
                  id="regLongitude"
                  type="number"
                  step="0.000001"
                  value={regLongitude}
                  onChange={(e) => setRegLongitude(e.target.value)}
                  placeholder="e.g. 77.378"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMapOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-cyan-500/30 text-slate-750 dark:border-slate-750 dark:text-slate-350 dark:hover:border-cyan-500 hover:bg-cyan-50/10 dark:hover:bg-cyan-950/10 flex items-center justify-center gap-2 transition-all text-xs font-bold cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-cyan-500" />
              <span>Use GPS Location</span>
            </button>

            <button
              type="submit"
              disabled={registeringProfile}
              className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-emerald-500/20 transition-all cursor-pointer text-xs"
            >
              {registeringProfile ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                <span>Register Pharmacy Store</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-8 max-w-7xl mx-auto transition-colors duration-300 relative text-left">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.cyan.500/3%),transparent_40%)] pointer-events-none" />

      {/* Header Profile Section */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-8 relative z-10">
        {loadingProfile ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        ) : profile ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/15">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
                  {profile.name}
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Address: {profile.address}</span>
                  <span>•</span>
                  <span>Phone: {profile.contact}</span>
                </div>
              </div>
            </div>

            {/* Approval Status Badge */}
            <div className="flex items-center gap-3 self-start md:self-center">
              {profile.approved || (profile.status || '').toUpperCase() === 'APPROVED' ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/30 px-3.5 py-1.5 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Store Approved</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/30 px-3.5 py-1.5 rounded-full">
                  <AlertTriangle className="w-4 h-4 animate-pulse" />
                  <span>Awaiting Approval</span>
                </span>
              )}
              
              <button
                onClick={() => {
                  setRegName(profile?.name || '');
                  setRegAddress(profile?.address || '');
                  setRegContact(profile?.contact || '');
                  setRegLatitude(profile?.latitude?.toString() || '');
                  setRegLongitude(profile?.longitude?.toString() || '');
                  setIsProfileEditOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-xs"
              >
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => {
                  const isApproved = profile?.approved || (profile?.status || '').toUpperCase() === 'APPROVED';
                  if (!isApproved) {
                    showToast('Pharmacy not approved, contact Administrator', 'error');
                  } else {
                    setIsAddOpen(true);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-white font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 active:scale-98 shadow-md shadow-emerald-500/10 transition-all cursor-pointer text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medicine</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
        {/* Total Medicines */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Total Medicines
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-white">
              {loadingInventory ? '...' : totalMedicines}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
            <Pill className="w-5 h-5" />
          </div>
        </div>

        {/* Available Medicines */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Available Stock
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {loadingInventory ? '...' : availableMedicines}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-550 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        {/* Low Stock Medicines */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Low Stock Warnings
            </span>
            <span className="text-2xl font-black text-amber-500">
              {loadingInventory ? '...' : lowStockMedicines}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 relative z-10">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === 'inventory'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/10 border-transparent'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
          }`}
        >
          Manage Stock
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border flex items-center gap-2 ${
            activeTab === 'reservations'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/10 border-transparent'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
          }`}
        >
          <span>Patient Reservations</span>
          {bookings.filter(b => b.status === 'PENDING').length > 0 && (
            <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
              {bookings.filter(b => b.status === 'PENDING').length}
            </span>
          )}
        </button>
      </div>

      {/* Inventory Listings Table */}
      {activeTab === 'inventory' && (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative z-10">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            Active Store Listings ({inventory.length})
          </h3>
          <button 
            onClick={fetchInventory} 
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-cyan-550 dark:text-slate-400 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-sm"
            title="Refresh Inventory"
          >
            <RefreshCw className={`w-4 h-4 ${loadingInventory ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loadingInventory ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-3" />
            <p className="text-xs text-slate-500 dark:text-slate-400">Loading catalog items...</p>
          </div>
        ) : inventory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80">
                  <th className="px-6 py-4">Medicine Item</th>
                  <th className="px-6 py-4">Stock Qty</th>
                  <th className="px-6 py-4">Price per Strip</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Expiry Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/85 text-xs sm:text-sm font-medium">
                {currentInventory.map((item) => {
                  const name = item.medicineName || item.medicine?.name || 'Unidentified Medicine';
                  const price = item.price || 0;
                  const qty = item.quantity !== undefined ? item.quantity : (item.stockQuantity !== undefined ? item.stockQuantity : item.stock || 0);
                  const expDate = item.expiryDate || item.expiry || '';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                            <Pill className="w-4 h-4" />
                          </div>
                          <div className="text-left leading-tight">
                            <span className="block font-bold text-slate-800 dark:text-slate-200">{name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {qty} units
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                        {formatPrice(price)}
                      </td>
                      <td className="px-6 py-4">
                        {getStockStatus(qty)}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">
                        {formatDate(expDate)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 rounded-xl text-slate-500 hover:text-cyan-500 hover:bg-cyan-50 dark:text-slate-400 dark:hover:text-cyan-400 dark:hover:bg-cyan-950/20 transition-all cursor-pointer border border-transparent hover:border-cyan-150"
                            title="Edit Listing"
                          >
                            <FileEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteInventory(item)}
                            className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950/20 transition-all cursor-pointer border border-transparent hover:border-red-150"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-505 mb-4">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No Medicines Listed</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-xs mt-1.5 leading-relaxed">
              Add products using the button above to begin listing medicine availability for patient reservations.
            </p>
          </div>
        )}
      </div>
      )}

      {/* Reservations Table */}
      {activeTab === 'reservations' && (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative z-10 animate-toast-in">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Patient Bookings & Pickup Statuses ({bookings.length})
            </h3>
            <button 
              onClick={fetchBookings} 
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-cyan-550 dark:text-slate-400 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-sm"
              title="Refresh Reservations"
            >
              <RefreshCw className={`w-4 h-4 ${loadingBookings ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingBookings ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-3" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Loading reservation requests...</p>
            </div>
          ) : bookings.length > 0 ? (
            <div className="overflow-x-auto text-left">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80">
                    <th className="px-6 py-4">Patient Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Medicine Item</th>
                    <th className="px-6 py-4">Qty</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Request Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/85 text-xs sm:text-sm font-medium">
                  {currentBookings.map((b) => {
                    const id = b.id;
                    const patientName = b.user?.name || 'Anonymous Patient';
                    const patientEmail = b.user?.email || 'N/A';
                    const medName = b.inventory?.medicine?.name || 'Unknown';
                    const qty = b.quantity || 1;
                    const status = b.status || 'PENDING';
                    const dateStr = formatDate(b.bookingDate);

                    return (
                      <tr key={id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/35 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-850 dark:text-white">{patientName}</td>
                        <td className="px-6 py-4 text-slate-500">{patientEmail}</td>
                        <td className="px-6 py-4 font-semibold text-cyan-600 dark:text-cyan-400">{medName}</td>
                        <td className="px-6 py-4 font-extrabold">{qty} units</td>
                        <td className="px-6 py-4">
                          {status === 'APPROVED' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250/20">
                              Approved
                            </span>
                          ) : status === 'REJECTED' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-250/20">
                              Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/20 border border-amber-250/20 animate-pulse">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-550 text-xs">{dateStr}</td>
                        <td className="px-6 py-4 text-right">
                          {status === 'PENDING' ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleUpdateStatus(id, 'REJECTED')}
                                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-600 dark:bg-slate-800 dark:hover:bg-red-950/20 dark:hover:text-red-400 font-bold text-[10px] uppercase transition-all cursor-pointer"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(id, 'APPROVED')}
                                className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] uppercase shadow-sm shadow-emerald-500/10 transition-all cursor-pointer"
                              >
                                Approve
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-650 text-xs font-bold italic">Resolved</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Pagination Controls */}
              {totalBookingsPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
                  <button
                    onClick={() => setBookingsPage(prev => Math.max(prev - 1, 1))}
                    disabled={bookingsPage === 1}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-805 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-bold text-slate-500">
                    Page {bookingsPage} of {totalBookingsPages}
                  </span>
                  <button
                    onClick={() => setBookingsPage(prev => Math.min(prev + 1, totalBookingsPages))}
                    disabled={bookingsPage === totalBookingsPages}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-805 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center p-8 bg-white/60 dark:bg-slate-900/60">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                <Inbox className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">No Reservations</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm text-xs mt-1.5 leading-relaxed">
                No patients have reserved stock from your pharmacy yet. Active listings will appear here once booked.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ADD INVENTORY MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden transition-all duration-300 animate-toast-in">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white">
                <Pill className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Add Medicine listing</h3>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddInventory} className="p-6 space-y-4">
              
              {/* Medicine Dropdown Selector */}
              <div>
                <label htmlFor="modal-medId" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Select Medicine (From Catalog)
                </label>
                <select
                  id="modal-medId"
                  value={medicineId}
                  onChange={(e) => handleSelectMedicineChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs cursor-pointer"
                >
                  <option value="">Choose a medicine...</option>
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.manufacturer ? `(${m.manufacturer})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Medicine Name */}
              <div>
                <label htmlFor="modal-medName" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Medicine Name
                </label>
                <input
                  id="modal-medName"
                  type="text"
                  value={medicineName}
                  onChange={(e) => handleMedicineNameChange(e.target.value)}
                  placeholder="e.g. Paracetamol 650mg or choose from catalog above"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="modal-qty" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Stock Quantity
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                    <Package className="w-4 h-4" />
                  </div>
                  <input
                    id="modal-qty"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 100"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                    required
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="modal-price" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Price per Unit (INR)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <input
                    id="modal-price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 15.99"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                    required
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label htmlFor="modal-expiry" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Expiry Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-455 dark:text-slate-505">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    id="modal-expiry"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                    required
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-all text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-emerald-500/15 transition-all text-xs font-bold cursor-pointer"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    <span>Add Medicine</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT/UPDATE INVENTORY MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/65 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden transition-all duration-300 animate-toast-in">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white">
                <FileEdit className="w-4 h-4 text-cyan-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Edit Medicine Listing</h3>
              </div>
              <button
                onClick={() => {
                  setIsEditOpen(false);
                  resetForm();
                }}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateInventory} className="p-6 space-y-4">
              
              {/* Medicine Name (Editable) */}
              <div>
                <label htmlFor="edit-medName" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Medicine Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                    <Pill className="w-4 h-4 animate-pulse" />
                  </div>
                  <input
                    id="edit-medName"
                    type="text"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    placeholder="e.g. Paracetamol 500"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs font-bold"
                    required
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="edit-qty" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Stock Quantity
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                    <Package className="w-4 h-4" />
                  </div>
                  <input
                    id="edit-qty"
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Stock units"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                    required
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="edit-price" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Price per Unit (INR)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Unit price"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                    required
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label htmlFor="edit-expiry" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Expiry Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    id="edit-expiry"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                    required
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false);
                    resetForm();
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 transition-all text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-105 active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-cyan-500/15 transition-all text-xs font-bold cursor-pointer"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isProfileEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden transition-all duration-300 animate-toast-in text-left">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white">
                <Building2 className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Edit Pharmacy Profile</h3>
              </div>
              <button
                onClick={() => setIsProfileEditOpen(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              
              {/* Pharmacy Name */}
              <div>
                <label htmlFor="editRegName" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Pharmacy / Shop Name
                </label>
                <input
                  id="editRegName"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Apollo Pharmacy Connaught Place"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="editRegAddress" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Physical Shop Address
                </label>
                <input
                  id="editRegAddress"
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="Connaught Place, New Delhi"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                  required
                />
              </div>

              {/* Contact */}
              <div>
                <label htmlFor="editRegContact" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Contact Phone Number
                </label>
                <input
                  id="editRegContact"
                  type="text"
                  value={regContact}
                  onChange={(e) => setRegContact(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                  required
                />
              </div>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="editRegLatitude" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Latitude
                  </label>
                  <input
                    id="editRegLatitude"
                    type="number"
                    step="0.000001"
                    value={regLatitude}
                    onChange={(e) => setRegLatitude(e.target.value)}
                    placeholder="28.628"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editRegLongitude" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Longitude
                  </label>
                  <input
                    id="editRegLongitude"
                    type="number"
                    step="0.000001"
                    value={regLongitude}
                    onChange={(e) => setRegLongitude(e.target.value)}
                    placeholder="77.378"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                    required
                  />
                </div>
              </div>

              {/* GPS Autofill Helper */}
              <button
                type="button"
                onClick={() => setIsMapOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-cyan-500/30 text-slate-750 dark:border-slate-750 dark:text-slate-350 dark:hover:border-cyan-500 hover:bg-cyan-50/10 dark:hover:bg-cyan-950/10 flex items-center justify-center gap-2 transition-all text-xs font-bold cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-cyan-500" />
                <span>Use GPS Location</span>
              </button>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProfileEditOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-750 hover:bg-slate-50 dark:border-slate-750 dark:text-slate-400 dark:hover:bg-slate-800 transition-all text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-emerald-500/15 transition-all text-xs font-bold cursor-pointer"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      <MapPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onConfirm={handleMapConfirm}
        initialLat={regLatitude}
        initialLng={regLongitude}
      />

    </div>
  );
};

export default PharmacyDashboard;
