import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, Pill, MapPin, Building2, Calendar, ShoppingCart, Loader2, Phone, X, Package } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Search = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  
  // Booking Modal States
  const [bookingItem, setBookingItem] = useState(null);
  const [bookingQty, setBookingQty] = useState(1);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  
  // New States for Nearby Pharmacies Discovery
  const [searchMode, setSearchMode] = useState('medicine'); // 'medicine' | 'pharmacy'
  const [pharmacies, setPharmacies] = useState([]);
  const [loadingPharmacies, setLoadingPharmacies] = useState(false);

  // Pagination states
  const [medicinePage, setMedicinePage] = useState(1);
  const [pharmacyPage, setPharmacyPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setMedicinePage(1);
    setPharmacyPage(1);
  }, [searchMode, searchTerm]);

  // Capture user coordinates on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation access denied or unavailable:', error);
        }
      );
    }
  }, []);

  // Fetch approved pharmacies
  const fetchApprovedPharmacies = async () => {
    setLoadingPharmacies(true);
    try {
      const response = await api.get('/api/pharmacy/approved');
      setPharmacies(response.data || []);
    } catch (error) {
      console.error('Error fetching approved pharmacies:', error);
      showToast('Error loading pharmacy directory', 'error');
    } finally {
      setLoadingPharmacies(false);
    }
  };

  useEffect(() => {
    if (searchMode === 'pharmacy') {
      fetchApprovedPharmacies();
    }
  }, [searchMode]);

  // Debouncing search term by 300ms for medicine search
  useEffect(() => {
    if (searchMode !== 'medicine') return;
    if (!searchTerm.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchMedicines(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchMode]);

  const fetchMedicines = async (query) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await api.get(`/api/search?medicineName=${encodeURIComponent(query)}`);
      setResults(response.data || []);
    } catch (error) {
      console.error('Search error:', error);
      showToast('Error searching medicines', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (lat1 === undefined || lat1 === null || lon1 === undefined || lon1 === null || 
        lat2 === undefined || lat2 === null || lon2 === undefined || lon2 === null) {
      return null;
    }
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  // Compute distance-sorted results reactively for medicine search
  const processedResults = useMemo(() => {
    if (!results || results.length === 0) return [];
    
    let list = results.map(item => {
      const dist = calculateDistance(
        userCoords?.latitude,
        userCoords?.longitude,
        item.latitude,
        item.longitude
      );
      return { ...item, distance: dist };
    });

    if (userCoords) {
      list.sort((a, b) => {
        if (a.distance === null || a.distance === undefined) return 1;
        if (b.distance === null || b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    }

    return list;
  }, [results, userCoords]);

  // Compute distance-sorted list reactively for nearby pharmacies
  const processedPharmacies = useMemo(() => {
    if (!pharmacies || pharmacies.length === 0) return [];

    let list = pharmacies.map(p => {
      const dist = calculateDistance(
        userCoords?.latitude,
        userCoords?.longitude,
        p.latitude,
        p.longitude
      );
      return { ...p, distance: dist };
    });

    if (userCoords) {
      list.sort((a, b) => {
        if (a.distance === null || a.distance === undefined) return 1;
        if (b.distance === null || b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    }

    // Apply local search filtering for pharmacy directory
    if (searchTerm.trim()) {
      list = list.filter(p => 
        (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.address || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return list;
  }, [pharmacies, userCoords, searchTerm]);

  // Sliced lists for pagination
  const totalMedicinePages = Math.ceil(processedResults.length / itemsPerPage);
  const currentMedicineList = processedResults.slice(
    (medicinePage - 1) * itemsPerPage,
    medicinePage * itemsPerPage
  );

  const totalPharmacyPages = Math.ceil(processedPharmacies.length / itemsPerPage);
  const currentPharmacyList = processedPharmacies.slice(
    (pharmacyPage - 1) * itemsPerPage,
    pharmacyPage * itemsPerPage
  );

  const handleBookNow = (item) => {
    const stock = item.quantity !== undefined ? item.quantity : (item.stockQuantity !== undefined ? item.stockQuantity : item.stock || 0);

    if (stock <= 0) {
      showToast('Medicine is out of stock', 'error');
      return;
    }

    setBookingItem(item);
    setBookingQty(1);
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!bookingItem) return;

    const inventoryId = bookingItem.inventoryId || bookingItem.id;
    const stock = bookingItem.quantity !== undefined ? bookingItem.quantity : (bookingItem.stockQuantity !== undefined ? bookingItem.stockQuantity : bookingItem.stock || 0);

    if (bookingQty <= 0) {
      showToast('Please enter a valid quantity', 'warning');
      return;
    }

    if (bookingQty > stock) {
      showToast(`Only ${stock} strips available in stock`, 'warning');
      return;
    }

    setSubmittingBooking(true);
    try {
      await api.post('/api/booking', { inventoryId, quantity: Number(bookingQty) });
      showToast('Medicine booked successfully!', 'success');
      setIsBookingOpen(false);
      setBookingItem(null);
      
      // Refresh search results
      if (searchTerm) {
        fetchMedicines(searchTerm);
      }
    } catch (error) {
      console.error('Booking error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to book medicine. Stock might be insufficient.';
      showToast(errorMsg, 'error');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-12 max-w-7xl mx-auto transition-colors duration-300 relative text-left">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,theme(colors.cyan.500/3%),transparent_45%)] pointer-events-none" />

      {/* Prominent Search Header */}
      <div className="flex flex-col items-center justify-center text-center mb-12 max-w-2xl mx-auto relative z-10">
        
        {/* Tab Switcher */}
        <div className="flex bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 mb-8 gap-1 w-full max-w-xs shadow-sm">
          <button
            onClick={() => { setSearchMode('medicine'); setSearchTerm(''); }}
            className={`flex-grow py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center ${
              searchMode === 'medicine'
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200/10 dark:border-slate-700/50'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Find Medicines
          </button>
          <button
            onClick={() => { setSearchMode('pharmacy'); setSearchTerm(''); }}
            className={`flex-grow py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center ${
              searchMode === 'pharmacy'
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200/10 dark:border-slate-700/50'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Nearby Pharmacies
          </button>
        </div>

        {searchMode === 'medicine' ? (
          <>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white mb-3">
              Find Your <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Medicines</span> Near You
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6 max-w-lg leading-relaxed">
              Type the name of your prescribed medicine below. We will scan all verified pharmacies in real time.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white mb-3">
              Vetted <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Pharmacies</span> Near You
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6 max-w-lg leading-relaxed">
              Explore approved stores in our network. Sorted automatically by distance from your current location.
            </p>
          </>
        )}

        {/* Large Centered Search Input */}
        <div className="relative w-full shadow-md rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
            <SearchIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              searchMode === 'medicine' 
                ? "Type medicine name (e.g. Paracetamol, Insulin...)" 
                : "Search pharmacies by name or city..."
            }
            className="w-full pl-12 pr-12 py-3.5 bg-transparent focus:outline-none dark:text-white text-sm"
          />
          {(loading || loadingPharmacies) && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-cyan-500">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-8 relative z-10">
        
        {/* MEDICINE SEARCH MODE */}
        {searchMode === 'medicine' && (
          <>
            {loading && processedResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-slate-200/40 dark:border-slate-800/40">
                <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-3" />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Scanning pharmacy databases...</p>
              </div>
            ) : processedResults.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Matching Stock Listings ({processedResults.length})
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentMedicineList.map((item, index) => {
                    const pharmacyName = item.pharmacyName || item.pharmacy?.name || 'Verified Pharmacy';
                    const medicineName = item.medicineName || item.medicine?.name || item.name || 'Unknown Medicine';
                    const price = item.price || 0;
                    const quantity = item.quantity !== undefined ? item.quantity : (item.stockQuantity !== undefined ? item.stockQuantity : item.stock || 0);
                    const address = item.address || item.pharmacyAddress || item.pharmacy?.address || 'Address Not Listed';
                    const contact = item.contactNumber || item.pharmacyContact || item.contact || item.pharmacy?.contact || 'Contact details offline';
                    const id = item.inventoryId || item.id || `search-item-${index}`;
                    const isAvailable = quantity > 0;

                    return (
                      <div
                        key={id}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:scale-[1.01]"
                      >
                        <div className="p-6 text-left">
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="space-y-1">
                              <h3 className="text-base font-black text-slate-800 dark:text-white group-hover:text-cyan-500 transition-colors">
                                {medicineName}
                              </h3>
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                Medicine Item
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-black text-slate-800 dark:text-white block">
                                {formatPrice(price)} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/ strip</span>
                              </span>
                            </div>
                          </div>

                          <div className="border-t border-b border-slate-100 dark:border-slate-800/60 py-4 my-4 space-y-2.5">
                            <div className="flex items-center justify-between gap-2 text-xs text-slate-700 dark:text-slate-200 font-bold">
                              <div className="flex items-center gap-2 truncate">
                                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                                <span className="truncate">{pharmacyName}</span>
                              </div>
                              {item.distance !== undefined && item.distance !== null && (
                                <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 shrink-0 bg-cyan-50/80 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-850/30 px-2 py-0.5 rounded shadow-sm">
                                  {item.distance.toFixed(1)} km
                                </span>
                              )}
                            </div>
                            <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                              <span>{contact}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-xs pt-1">
                            <div className="flex flex-col items-start gap-0.5">
                              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Quantity Available
                              </span>
                              <span className="font-extrabold text-slate-700 dark:text-slate-300">
                                {quantity} units
                              </span>
                            </div>
                            
                            <div>
                              {isAvailable ? (
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full border border-emerald-100/50 dark:border-emerald-900/10">
                                  Available
                                </span>
                              ) : (
                                <span className="font-bold text-red-500 bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded-full border border-red-100/50 dark:border-red-900/10">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {user?.role === 'USER' && (
                          <div className="px-6 pb-6 pt-0 text-left flex gap-2">
                            <button
                              onClick={() => handleBookNow(item)}
                              disabled={!isAvailable}
                              className="flex-grow flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-105 active:scale-98 disabled:from-slate-100 disabled:to-slate-200 dark:disabled:from-slate-800 dark:disabled:to-slate-800 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:shadow-none disabled:pointer-events-none shadow-md shadow-cyan-500/10 transition-all cursor-pointer text-xs"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>Reserve Pickup</span>
                            </button>
                            {item.latitude && item.longitude && (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-650 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800 flex items-center justify-center transition-all shadow-sm"
                                title="Get Directions"
                              >
                                <MapPin className="w-4 h-4 text-cyan-500" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Pagination Controls */}
                {totalMedicinePages > 1 && (
                  <div className="mt-8 flex items-center justify-between bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 shadow-sm">
                    <button
                      onClick={() => setMedicinePage(prev => Math.max(prev - 1, 1))}
                      disabled={medicinePage === 1}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-bold text-slate-500">
                      Page {medicinePage} of {totalMedicinePages}
                    </span>
                    <button
                      onClick={() => setMedicinePage(prev => Math.min(prev + 1, totalMedicinePages))}
                      disabled={medicinePage === totalMedicinePages}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : hasSearched ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8">
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 mb-4">
                  <Pill className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">No Stock Found</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm text-xs mt-1.5 leading-relaxed">
                  We couldn't locate active quantity listings for "{searchTerm}" among vetted pharmacies. Double check spelling or search another medicine.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-slate-800 flex items-center justify-center text-cyan-500 mb-4 animate-pulse">
                  <SearchIcon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Search Medicine Database</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs text-xs mt-1.5 leading-relaxed">
                  Type the name of any medication above. Results will update instantly with store availability and prices.
                </p>
              </div>
            )}
          </>
        )}

        {/* NEARBY PHARMACIES EXPLORER MODE */}
        {searchMode === 'pharmacy' && (
          <>
            {loadingPharmacies ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-slate-200/40 dark:border-slate-800/40">
                <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-3" />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Locating nearby stores...</p>
              </div>
            ) : processedPharmacies.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Closest Stores Vetted ({processedPharmacies.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentPharmacyList.map((pharmacy) => {
                    const id = pharmacy.id;
                    const name = pharmacy.name || 'Unnamed Pharmacy';
                    const address = pharmacy.address || 'Address Not Listed';
                    const contact = pharmacy.contact || 'Contact details offline';
                    const distance = pharmacy.distance;

                    return (
                      <div
                        key={id}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:scale-[1.01]"
                      >
                        <div className="p-6 text-left">
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="space-y-1">
                              <h3 className="text-base font-black text-slate-800 dark:text-white group-hover:text-emerald-500 transition-colors">
                                {name}
                              </h3>
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                Approved Pharmacy
                              </span>
                            </div>
                            {distance !== undefined && distance !== null ? (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-850/30 px-2 py-0.5 rounded shadow-sm">
                                {distance.toFixed(1)} km away
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 px-2 py-0.5 rounded">
                                Distance N/A
                              </span>
                            )}
                          </div>

                          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-4 space-y-2.5">
                            <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                              <span>{contact}</span>
                            </div>
                          </div>
                        </div>

                        <div className="px-6 pb-6 pt-0 text-left flex gap-2">
                          {pharmacy.latitude && pharmacy.longitude ? (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.latitude},${pharmacy.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 active:scale-98 shadow-md shadow-emerald-500/10 transition-all cursor-pointer text-xs"
                            >
                              <MapPin className="w-4 h-4 animate-bounce" />
                              <span>Get Directions on Google Maps</span>
                            </a>
                          ) : (
                            <button
                              disabled
                              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500 text-xs"
                            >
                              <span>No Coordinates Registered</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Pagination Controls */}
                {totalPharmacyPages > 1 && (
                  <div className="mt-8 flex items-center justify-between bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 shadow-sm">
                    <button
                      onClick={() => setPharmacyPage(prev => Math.max(prev - 1, 1))}
                      disabled={pharmacyPage === 1}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-305 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-bold text-slate-500">
                      Page {pharmacyPage} of {totalPharmacyPages}
                    </span>
                    <button
                      onClick={() => setPharmacyPage(prev => Math.min(prev + 1, totalPharmacyPages))}
                      disabled={pharmacyPage === totalPharmacyPages}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-305 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-455 mb-4">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">No Pharmacies Located</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs text-xs mt-1.5 leading-relaxed">
                  No approved pharmacies were found matching the filter "{searchTerm}". Try typing a different name or address.
                </p>
              </div>
            )}
          </>
        )}

      </div>

      {/* BOOKING QUANTITY MODAL */}
      {isBookingOpen && bookingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/65 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden transition-all duration-300 animate-toast-in text-left">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white">
                <ShoppingCart className="w-4 h-4 text-cyan-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Book Medicine</h3>
              </div>
              <button
                onClick={() => {
                  setIsBookingOpen(false);
                  setBookingItem(null);
                }}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmBooking} className="p-6 space-y-4">
              
              {/* Medicine details summary */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="leading-tight">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Medicine</span>
                  <span className="text-base font-black text-slate-800 dark:text-white mt-0.5 block">
                    {bookingItem.medicineName || bookingItem.medicine?.name || bookingItem.name || 'Unknown Medicine'}
                  </span>
                </div>
                <div className="leading-tight">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Pharmacy</span>
                  <span className="text-xs font-bold text-slate-650 dark:text-slate-300 mt-0.5 block">
                    {bookingItem.pharmacyName || bookingItem.pharmacy?.name || 'Verified Pharmacy'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="text-xs font-bold text-slate-500">Price / Strip:</span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-white">
                    {formatPrice(bookingItem.price || 0)}
                  </span>
                </div>
              </div>

              {/* Quantity to Book */}
              <div>
                <label htmlFor="booking-qty" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Strips to Book
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                    <Package className="w-4 h-4" />
                  </div>
                  <input
                    id="booking-qty"
                    type="number"
                    min="1"
                    max={bookingItem.quantity !== undefined ? bookingItem.quantity : (bookingItem.stockQuantity !== undefined ? bookingItem.stockQuantity : bookingItem.stock || 0)}
                    value={bookingQty}
                    onChange={(e) => setBookingQty(Math.max(1, Number(e.target.value)))}
                    placeholder="Number of strips"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs font-bold"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Available stock: {bookingItem.quantity !== undefined ? bookingItem.quantity : (bookingItem.stockQuantity !== undefined ? bookingItem.stockQuantity : bookingItem.stock || 0)} strips
                </span>
              </div>

              {/* Real-time Price Calculation */}
              <div className="flex justify-between items-center py-3 border-t border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-xs font-bold text-slate-650 dark:text-slate-350">Estimated Total Cost:</span>
                <span className="text-lg font-black text-cyan-600 dark:text-cyan-400">
                  {formatPrice(bookingQty * (bookingItem.price || 0))}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsBookingOpen(false);
                    setBookingItem(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 transition-all text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="flex-grow flex-1 py-2.5 rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-105 active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-cyan-500/15 transition-all text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {submittingBooking ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Confirm Reservation</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
