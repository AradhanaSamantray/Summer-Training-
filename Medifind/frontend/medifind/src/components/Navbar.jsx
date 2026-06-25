import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, LogOut, Pill, LayoutDashboard, Search, History, ShieldAlert, Home as HomeIcon, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from './Logo';
import api from '../api/axios';

const Navbar = () => {
  const { user, logout, updateName } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const hasLoadedNotifsRef = useRef(false);

  const fetchNotifications = async () => {
    if (!user || user.role !== 'USER') return;
    try {
      const response = await api.get('/api/booking/my');
      const myBookings = response.data || [];
      
      // Fetch approved, cancelled, and rejected bookings
      const relevantBookings = myBookings.filter(b => b.status === 'APPROVED' || b.status === 'CANCELLED' || b.status === 'REJECTED');
      const dismissedKeys = JSON.parse(localStorage.getItem('medifind_dismissed_notifications') || '[]');
      const activeNotifs = relevantBookings.filter(b => {
        const key = `${b.id}_${b.status}`;
        return !dismissedKeys.includes(key);
      });
      
      if (hasLoadedNotifsRef.current) {
        const oldKeys = new Set(notifications.map(n => `${n.id}_${n.status}`));
        activeNotifs.forEach(notif => {
          const key = `${notif.id}_${notif.status}`;
          if (!oldKeys.has(key)) {
            const medName = notif.inventory?.medicine?.name || notif.medicineName || notif.medicine?.name || 'Your booked medicine';
            const pharmName = notif.inventory?.pharmacy?.name || notif.pharmacyName || notif.pharmacy?.name || 'the pharmacy';
            
            if (notif.status === 'APPROVED') {
              showToast(`Booking Approved! "${medName}" is ready for pickup at ${pharmName}.`, 'success');
            } else if (notif.status === 'CANCELLED') {
              showToast(`Booking Cancelled! Your reservation for "${medName}" at ${pharmName} has been cancelled.`, 'error');
            } else if (notif.status === 'REJECTED') {
              showToast(`Booking Rejected! Your reservation for "${medName}" at ${pharmName} has been rejected by the pharmacy.`, 'error');
            }
          }
        });
      } else {
        hasLoadedNotifsRef.current = true;
      }
      
      setNotifications(activeNotifs);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleDismissNotification = (id, status) => {
    const dismissedKeys = JSON.parse(localStorage.getItem('medifind_dismissed_notifications') || '[]');
    const key = `${id}_${status}`;
    if (!dismissedKeys.includes(key)) {
      dismissedKeys.push(key);
    }
    localStorage.setItem('medifind_dismissed_notifications', JSON.stringify(dismissedKeys));
    setNotifications(prev => prev.filter(n => !(n.id === id && n.status === status)));
  };

  useEffect(() => {
    if (user && user.role === 'USER') {
      hasLoadedNotifsRef.current = false;
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      hasLoadedNotifsRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      showToast('Name cannot be empty', 'warning');
      return;
    }

    if (profilePassword) {
      if (profilePassword.length < 5) {
        showToast('Password must be at least 5 characters', 'warning');
        return;
      }
      if (profilePassword !== profileConfirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
    }

    setProfileLoading(true);
    try {
      try {
        await api.put('/api/user/profile', { name: profileName, password: profilePassword });
      } catch (err) {
        await api.put('/api/auth/profile', { name: profileName, password: profilePassword });
      }

      updateName(profileName);
      showToast('Profile updated successfully!', 'success');
      setProfilePassword('');
      setProfileConfirmPassword('');
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.response?.status === 404 || error.message?.includes('Network Error')) {
        updateName(profileName);
        showToast('Profile updated locally!', 'success');
        setProfilePassword('');
        setProfileConfirmPassword('');
        setIsProfileOpen(false);
      } else {
        const errorMsg = error.response?.data?.message || 'Failed to update profile';
        showToast(errorMsg, 'error');
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // Initialize theme: Default MUST be light mode unless explicitly 'dark' in localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('medifind_theme');

    if (savedTheme === 'dark') {
      // Only go dark if user explicitly chose dark before
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      // Default is always light — ignore system preference
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('medifind_theme', 'light');
    }
  }, []);

  // Scroll Spy Effect to track the active section when scrolling
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sections = ['home', 'about-us', 'features', 'how-it-works', 'reviews'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      if (isScrollingRef.current) return;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (isScrollingRef.current) return;
      if (window.scrollY < 100) {
        setActiveSection('home');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('medifind_theme', 'dark');
      showToast('Dark mode enabled', 'info');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('medifind_theme', 'light');
      showToast('Light mode enabled', 'info');
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  // Smooth scroll handler for anchor links
  const handleAnchorClick = (e, targetId) => {
    e.preventDefault();
    setIsOpen(false);
    
    // Lock scroll spy updates during smooth scroll
    isScrollingRef.current = true;
    setActiveSection(targetId);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000); // 1000ms covers standard smooth scroll durations

    const scrollToTarget = () => {
      const el = document.getElementById(targetId);
      if (el) {
        if (targetId === 'home') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          const elementRect = el.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.scrollY;
          // Center the section vertically in the viewport
          let targetScrollY = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
          
          // Keep a minimum offset from top (navbar height is 80px) to prevent scrolling too high
          const minScrollY = absoluteElementTop - 80;
          if (targetScrollY < minScrollY) {
            targetScrollY = minScrollY;
          }
          
          window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
          });
        }
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(scrollToTarget, 150);
    } else {
      scrollToTarget();
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40';
      case 'PHARMACY':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40';
      case 'USER':
      default:
        return 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800/40';
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-20 z-40 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 transition-colors duration-300 ">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Professional Logo Section */}
        <Link to={user ? (user.role === 'ADMIN' ? '/admin' : user.role === 'PHARMACY' ? '/pharmacy' : '/dashboard') : '/'}>
          <Logo />
        </Link>

        {/* Center: Center-aligned Navigation Links */}
        <div className="hidden md:flex items-center gap-8 justify-center flex-1 px-4">
          {!user ? (
            <>
              {/* Logged Out Guest sees Home, About Us, Features, How It Works, Reviews */}
              <NavLink
                to="/"
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    isScrollingRef.current = true;
                    setActiveSection('home');
                    if (scrollTimeoutRef.current) {
                      clearTimeout(scrollTimeoutRef.current);
                    }
                    scrollTimeoutRef.current = setTimeout(() => {
                      isScrollingRef.current = false;
                    }, 1000);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    setActiveSection('home');
                  }
                }}
                className={`text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                  activeSection === 'home' && location.pathname === '/'
                    ? 'text-cyan-500 font-bold scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Home
              </NavLink>
              <a
                href="#about-us"
                onClick={(e) => {
                  handleAnchorClick(e, 'about-us');
                  setActiveSection('about-us');
                }}
                className={`text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                  activeSection === 'about-us'
                    ? 'text-cyan-500 font-bold scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                About Us
              </a>
              <a
                href="#features"
                onClick={(e) => {
                  handleAnchorClick(e, 'features');
                  setActiveSection('features');
                }}
                className={`text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                  activeSection === 'features'
                    ? 'text-cyan-500 font-bold scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  handleAnchorClick(e, 'how-it-works');
                  setActiveSection('how-it-works');
                }}
                className={`text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                  activeSection === 'how-it-works'
                    ? 'text-cyan-500 font-bold scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                How It Works
              </a>
              <a
                href="#reviews"
                onClick={(e) => {
                  handleAnchorClick(e, 'reviews');
                  setActiveSection('reviews');
                }}
                className={`text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                  activeSection === 'reviews'
                    ? 'text-cyan-500 font-bold scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Reviews
              </a>
            </>
          ) : (
            <>


              {/* USER specific links */}
              {user.role === 'USER' && (
                <>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'text-cyan-500 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/search"
                    className={({ isActive }) =>
                      `text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'text-cyan-500 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`
                    }
                  >
                    Find Medicines
                  </NavLink>
                  <NavLink
                    to="/my-bookings"
                    className={({ isActive }) =>
                      `text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'text-cyan-500 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`
                    }
                  >
                    My Bookings
                  </NavLink>
                </>
              )}

              {/* PHARMACY specific links */}
              {user.role === 'PHARMACY' && (
                <>
                  <NavLink
                    to="/search"
                    className={({ isActive }) =>
                      `text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'text-cyan-500 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`
                    }
                  >
                    Search Medicines
                  </NavLink>
                  <NavLink
                    to="/pharmacy"
                    className={({ isActive }) =>
                      `text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'text-cyan-500 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                </>
              )}              
            </>
          )}
        </div>

        {/* Right: Actions (Theme switcher, Login, Register or User Profile) */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          {/* Animated Theme Toggle Button (Larger, animated) */}
          <button
            onClick={toggleTheme}
            className="w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-5.5 h-5.5 text-amber-500 animate-spin-slow" />
            ) : (
              <Moon className="w-5.5 h-5.5 text-blue-900" />
            )}
          </button>

          {!user ? (
            <div className="flex items-center gap-4">
              <Link
                 to="/login"
 className="px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-105 hover:shadow-lg hover:shadow-cyan-500/10 active:scale-95 transition-all duration-200 text-center"          >
          Login
          </Link>
              {/* Prominent Action Button: Register (Solid Cyan/Blue Gradient) */}
              <Link
                to="/register"
                className="px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-105 hover:shadow-lg hover:shadow-cyan-500/10 active:scale-95 transition-all duration-200 text-center"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Bell Notifications (USER role only) */}
              {user && user.role === 'USER' && (
                <div className="relative">
                  <button
                    onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black animate-bounce">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {isNotifDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-55 overflow-hidden text-left">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40">
                        <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                          Booking Alerts
                        </span>
                        {notifications.length > 0 && (
                          <span className="text-[9px] font-black text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded">
                            {notifications.some(n => n.status === 'APPROVED') ? 'Action Required' : 'Alerts'}
                          </span>
                        )}
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
                        {notifications.length > 0 ? (
                          notifications.map(n => {
                            const medName = n.inventory?.medicine?.name || n.medicineName || n.medicine?.name || 'Your medicine';
                            const pharmacyName = n.inventory?.pharmacy?.name || n.pharmacyName || n.pharmacy?.name || 'Pharmacy';
                            const isApproved = n.status === 'APPROVED';
                            const isRejected = n.status === 'REJECTED';
                            return (
                              <div key={`${n.id}_${n.status}`} className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-850/25 transition-colors relative group">
                                <button
                                  onClick={() => handleDismissNotification(n.id, n.status)}
                                  className="absolute top-2 right-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 text-[10px] font-black cursor-pointer bg-transparent border-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  Dismiss
                                </button>
                                <p className={`text-xs font-bold leading-snug ${isApproved ? 'text-slate-850 dark:text-white' : 'text-red-500 dark:text-red-400'}`}>
                                  {isApproved ? 'Approved & Ready!' : isRejected ? 'Booking Rejected' : 'Booking Cancelled'}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-455 mt-1 leading-normal text-left">
                                  {isApproved ? (
                                    <>
                                      Your reservation for <strong className="text-cyan-600 dark:text-cyan-400 font-semibold">{medName}</strong> at <strong className="text-slate-750 dark:text-slate-300 font-bold">{pharmacyName}</strong> is approved. Please proceed for pickup.
                                    </>
                                  ) : isRejected ? (
                                    <>
                                      Your reservation for <strong className="text-cyan-600 dark:text-cyan-400 font-semibold">{medName}</strong> at <strong className="text-slate-750 dark:text-slate-300 font-bold">{pharmacyName}</strong> has been rejected by the pharmacy.
                                    </>
                                  ) : (
                                    <>
                                      Your reservation for <strong className="text-cyan-600 dark:text-cyan-400 font-semibold">{medName}</strong> at <strong className="text-slate-750 dark:text-slate-300 font-bold">{pharmacyName}</strong> has been cancelled.
                                    </>
                                  )}
                                </p>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-6 text-center text-slate-500 dark:text-slate-450 text-xs">
                            No pending pickups or alerts.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Badge - Clickable to edit profile */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-500/40 dark:hover:border-cyan-500/30 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all cursor-pointer text-left focus:outline-none"
              >
                <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[110px] truncate">
                    {user.name}
                  </span>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border mt-0.5 tracking-wide ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border border-slate-200 hover:border-red-200 dark:border-slate-800 dark:hover:border-red-950/40 text-slate-700 hover:text-red-500 dark:text-slate-300 dark:hover:text-red-400 hover:bg-red-50/10 dark:hover:bg-red-950/10 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-blue-900" />}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xl py-4 px-4 flex flex-col gap-3 transition-all duration-300 text-left">
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{user.name}</div>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border inline-block mt-1 tracking-wide ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
            </div>
          )}

          {/* Mobile notifications card */}
          {user && user.role === 'USER' && notifications.length > 0 && (
            <div className="p-3 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200/50 dark:border-cyan-900/30 rounded-xl text-left space-y-2 animate-toast-in">
              <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-bold text-[10px] uppercase tracking-wider">
                <Bell className="w-3.5 h-3.5" />
                <span>Booking Alerts ({notifications.length})</span>
              </div>
              <div className="space-y-1.5 divide-y divide-cyan-100/50 dark:divide-cyan-900/10">
                {notifications.map(n => {
                  const medName = n.inventory?.medicine?.name || n.medicineName || n.medicine?.name || 'Your medicine';
                  const pharmacyName = n.inventory?.pharmacy?.name || n.pharmacyName || n.pharmacy?.name || 'Pharmacy';
                  const isApproved = n.status === 'APPROVED';
                  return (
                    <div key={`${n.id}_${n.status}`} className="text-[11px] leading-normal text-slate-650 dark:text-slate-400 pt-1.5 first:pt-0">
                      {isApproved ? (
                        <span>Your {medName} is ready for pickup at {pharmacyName}.</span>
                      ) : (
                        <span>Your booking for {medName} at {pharmacyName} was cancelled.</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            {!user && (
              <Link
                to="/"
                onClick={() => {
                  setIsOpen(false);
                  isScrollingRef.current = true;
                  setActiveSection('home');
                  if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                  }
                  scrollTimeoutRef.current = setTimeout(() => {
                    isScrollingRef.current = false;
                  }, 1000);
                  if (location.pathname === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeSection === 'home' && location.pathname === '/'
                    ? 'text-cyan-500 font-bold bg-cyan-50/50 dark:bg-cyan-950/10'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                }`}
              >
                Home
              </Link>
            )}

            {!user ? (
              <>
                <a
                  href="#about-us"
                  onClick={(e) => {
                    handleAnchorClick(e, 'about-us');
                    setActiveSection('about-us');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeSection === 'about-us'
                      ? 'text-cyan-500 font-bold bg-cyan-50/50 dark:bg-cyan-950/10'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                  }`}
                >
                  About Us
                </a>
                <a
                  href="#features"
                  onClick={(e) => {
                    handleAnchorClick(e, 'features');
                    setActiveSection('features');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeSection === 'features'
                      ? 'text-cyan-500 font-bold bg-cyan-50/50 dark:bg-cyan-950/10'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                  }`}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    handleAnchorClick(e, 'how-it-works');
                    setActiveSection('how-it-works');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeSection === 'how-it-works'
                      ? 'text-cyan-500 font-bold bg-cyan-50/50 dark:bg-cyan-950/10'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                  }`}
                >
                  How It Works
                </a>
                <a
                  href="#reviews"
                  onClick={(e) => {
                    handleAnchorClick(e, 'reviews');
                    setActiveSection('reviews');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeSection === 'reviews'
                      ? 'text-cyan-500 font-bold bg-cyan-50/50 dark:bg-cyan-950/10'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                  }`}
                >
                  Reviews
                </a>
              </>
            ) : (
              <>
                {/* USER specific mobile links */}
                {user.role === 'USER' && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/search"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-900"
                    >
                      Find Medicines
                    </Link>
                    <Link
                      to="/my-bookings"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                    >
                      My Bookings
                    </Link>
                  </>
                )}

                {/* PHARMACY specific mobile links */}
                {user.role === 'PHARMACY' && (
                  <>
                    <Link
                      to="/search"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-900"
                    >
                      Search Medicines
                    </Link>
                    <Link
                      to="/pharmacy"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                    >
                      Dashboard
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-900 my-1 font-medium"></div>

          <div className="flex flex-col gap-2">
            {user && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsProfileOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-700 hover:text-cyan-500 hover:bg-cyan-50/10 dark:text-slate-350 dark:hover:text-cyan-400 cursor-pointer"
              >
                <span>Edit Profile</span>
              </button>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-700 hover:text-red-500 hover:bg-red-50/10 dark:text-slate-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-105 text-center block"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-105 text-center block"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 sm:p-8 relative transition-all duration-300">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsProfileOpen(false);
                setProfilePassword('');
                setProfileConfirmPassword('');
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-450 dark:hover:text-slate-300 cursor-pointer transition-colors border-0"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                <Pill className="w-5 h-5 rotate-45" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black text-slate-800 dark:text-white">
                  Edit Account Profile
                </h3>
                <p className="text-slate-550 dark:text-slate-400 text-xs mt-0.5 font-medium">
                  Update display name or change password.
                </p>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-4 text-left">
              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-800 dark:bg-slate-950/40 dark:focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/10 dark:text-white text-xs transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Email Address (Read-only) */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200/50 bg-slate-50/50 dark:border-slate-850 dark:bg-slate-950/20 text-slate-455 dark:text-slate-500 text-xs focus:outline-none cursor-not-allowed"
                  readOnly
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  New Password (Optional)
                </label>
                <input
                  type="password"
                  value={profilePassword}
                  onChange={(e) => setProfilePassword(e.target.value)}
                  placeholder="Min 5 characters"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-800 dark:bg-slate-950/40 dark:focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/10 dark:text-white text-xs transition-all"
                />
              </div>

              {/* Confirm Password */}
              {profilePassword && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={profileConfirmPassword}
                    onChange={(e) => setProfileConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 dark:border-slate-800 dark:bg-slate-950/40 dark:focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/10 dark:text-white text-xs transition-all"
                    required
                  />
                </div>
              )}

              {/* Save Profile Button */}
              <button
                type="submit"
                disabled={profileLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-105 active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-cyan-500/10 transition-all cursor-pointer text-xs mt-3"
              >
                {profileLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
