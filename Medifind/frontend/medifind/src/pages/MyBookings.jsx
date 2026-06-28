import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ShoppingBag, Loader2, ClipboardList, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const MyBookings = () => {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/booking/my');
      setBookings(response.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    try {
      await api.put(`/api/booking/${bookingId}/status?status=CANCELLED`);
      
      // Auto-dismiss local status notifications so the user doesn't get toast alerts for their own manual cancellation
      const dismissedKeys = JSON.parse(localStorage.getItem('medifind_dismissed_notifications') || '[]');
      const keysToDismiss = [`${bookingId}_CANCELLED`, `${bookingId}_APPROVED`];
      keysToDismiss.forEach(k => {
        if (!dismissedKeys.includes(k)) dismissedKeys.push(k);
      });
      localStorage.setItem('medifind_dismissed_notifications', JSON.stringify(dismissedKeys));

      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
      );
      showToast('Booking cancelled successfully', 'success');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showToast('Failed to cancel booking', 'error');
    }
  };

  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const currentBookings = bookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'CONFIRMED':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/30 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmed</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/30 px-2.5 py-1 rounded-full">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/30 px-2.5 py-1 rounded-full">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/30 px-2.5 py-1 rounded-full">
            <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-8 max-w-5xl mx-auto transition-colors duration-300">
      
      {/* Header with badge */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Bookings</h1>
          {!loading && bookings.length > 0 && (
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-sm">
              {bookings.filter(b => b.status?.toUpperCase() !== 'CANCELLED' && b.status?.toUpperCase() !== 'REJECTED').length}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading bookings...</p>
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {currentBookings.map((booking) => {
            const medName = booking.inventory?.medicine?.name || booking.medicineName || booking.medicine?.name || 'Unknown Medicine';
            const pharmName = booking.inventory?.pharmacy?.name || booking.pharmacyName || booking.pharmacy?.name || 'Local Pharmacy';
            const qty = booking.quantity || 1;
            const date = booking.bookingDate || booking.createdAt || booking.date;
            const pricePerStrip = booking.inventory?.price || 0;
            const totalPrice = qty * pricePerStrip;
            
            return (
              <div
                key={booking.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-slate-700 flex items-center justify-center text-cyan-500 shrink-0">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">
                      {medName}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Pharmacy: {pharmName}
                    </p>
                    
                    {/* Booking metadata */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-400 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Booked on {formatDate(date)}</span>
                      </div>
                      <span className="hidden md:inline text-slate-300">•</span>
                      <div>
                        <span>Qty: <strong className="text-slate-700 dark:text-slate-300">{qty} strips</strong></span>
                      </div>
                      {pricePerStrip > 0 && (
                        <>
                          <span className="hidden md:inline text-slate-300">•</span>
                          <div>
                            <span>Price: <strong className="text-slate-700 dark:text-slate-300">{formatPrice(pricePerStrip)}</strong> <span className="text-[10px] text-slate-400">/ strip</span></span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price & Status Badge */}
                <div className="flex flex-col items-end md:self-center self-start pl-16 md:pl-0 gap-2 shrink-0">
                  {pricePerStrip > 0 && (
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Cost</span>
                      <span className="text-base font-black text-slate-800 dark:text-white">{formatPrice(totalPrice)}</span>
                    </div>
                  )}
                  {getStatusBadge(booking.status)}
                  {(booking.status?.toUpperCase() === 'PENDING' || booking.status?.toUpperCase() === 'CONFIRMED') && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="mt-1 text-xs font-bold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:underline transition-all cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 p-4 mt-6 rounded-2xl">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs"
              >
                Previous
              </button>
              <span className="text-xs font-bold text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 mb-4">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No bookings yet</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-6">
            Search for medicines to make your first booking. You will be able to track and pick up bookings at your selected pharmacy.
          </p>
          <Link
            to="/search"
            className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-105 active:scale-98 shadow-md shadow-cyan-500/10 transition-all text-sm"
          >
            Search Medicines
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
