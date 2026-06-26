import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Pill, ChevronDown, Sparkles, MapPin, Phone } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import RoleSelect from '../components/RoleSelect';
import MapPickerModal from '../components/MapPickerModal';

const Register = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-select role if passed in query param (e.g. /register?role=PHARMACY or /register?role=ADMIN)
  const getInitialRole = () => {
    const roleParam = searchParams.get('role')?.toUpperCase();
    if (roleParam === 'PHARMACY' || roleParam === 'ADMIN' || roleParam === 'USER') {
      return roleParam;
    }
    return 'USER';
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(getInitialRole());
  
  // Pharmacy extra fields
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMapConfirm = ({ latitude, longitude, address }) => {
    setLatitude(latitude.toFixed(6));
    setLongitude(longitude.toFixed(6));
    if (address) {
      setAddress(address);
    }
    setIsMapOpen(false);
    showToast('Location coordinates and address automatically filled!', 'success');
  };



  // Sync state if query parameters change
  useEffect(() => {
    const roleParam = searchParams.get('role')?.toUpperCase();
    if (roleParam === 'PHARMACY' || roleParam === 'USER' || roleParam === 'ADMIN') {
      setRole(roleParam);
    }
  }, [searchParams]);

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: 'Empty', score: 0, color: 'bg-slate-200 dark:bg-slate-700' };
    let score = 0;
    if (pwd.length >= 5) score += 1; // min 5 chars requirement
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) {
      return { label: 'Weak', score, color: 'bg-red-500' };
    } else if (score <= 3) {
      return { label: 'Medium', score, color: 'bg-amber-500' };
    } else {
      return { label: 'Strong', score, color: 'bg-emerald-500' };
    }
  };

  const strength = getPasswordStrength(password);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword || !role) {
      showToast('All fields are required', 'warning');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }

    if (password.length < 5) {
      showToast('Password must be at least 5 characters long', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (role === 'PHARMACY') {
      if (!address || !contact || !latitude || !longitude) {
        showToast('All pharmacy details (address, contact, latitude, longitude) are required', 'warning');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        password,
        role,
        ...(role === 'PHARMACY' && {
          address,
          contact,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        }),
      };
      await api.post('/api/auth/register', payload);
      
      // Store the name temporarily in sessionStorage so we can display it if they login
      sessionStorage.setItem('medifind_temp_name', name);

      showToast('Account created! Please login', 'success');
      navigate('/login');
    } catch (error) {
      console.error(error);
      const serverMsg = error.response?.data?.message || error.response?.data?.error || '';
      const status = error.response?.status;
      const fullErrorContext = (serverMsg + ' ' + JSON.stringify(error.response?.data || '')).toLowerCase();
      
      let friendlyMsg = '';
      
      if (
        status === 409 || 
        status === 400 || 
        status === 500 ||
        fullErrorContext.includes('duplicate') || 
        fullErrorContext.includes('already') || 
        fullErrorContext.includes('exists') || 
        fullErrorContext.includes('present') ||
        fullErrorContext.includes('integrity') ||
        fullErrorContext.includes('constraint') ||
        fullErrorContext.includes('sql')
      ) {
        if (fullErrorContext.includes('email')) {
          friendlyMsg = 'This email is already present';
        } else if (fullErrorContext.includes('name') || fullErrorContext.includes('username')) {
          friendlyMsg = 'This name is already present';
        } else {
          friendlyMsg = serverMsg || 'This field is already present';
        }
      } else {
        friendlyMsg = serverMsg || 'Error creating account. Please try again.';
      }
      
      showToast(friendlyMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.cyan.500/5%),transparent_55%)] pointer-events-none" />
      
      {/* Centered Glass Card */}
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-2xl rounded-3xl transition-all duration-300 relative z-10">
        <div className="p-8 sm:p-10">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 mb-4 hover:rotate-12 transition-transform duration-300">
              <Pill className="w-7 h-7 rotate-45" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Create Account</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Join the smart health network</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                  required
                />
              </div>
            </div>

            {/* Role Custom Select */}
            <RoleSelect value={role} onChange={setRole} label="Role" excludeAdmin={true} />

            {/* Pharmacy Extra Fields */}
            {role === 'PHARMACY' && (
              <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/80 pt-4 animate-in fade-in-50 duration-200">
                <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Pharmacy Details
                </div>
                
                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Physical Shop Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Connaught Place, New Delhi"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number / Contact */}
                <div>
                  <label htmlFor="contact" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="contact"
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                      required
                    />
                  </div>
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="latitude" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Latitude
                    </label>
                    <input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="e.g. 28.628"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="longitude" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Longitude
                    </label>
                    <input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="e.g. 77.378"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
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

                <MapPickerModal
                  isOpen={isMapOpen}
                  onClose={() => setIsMapOpen(false)}
                  onConfirm={handleMapConfirm}
                  initialLat={latitude}
                  initialLng={longitude}
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 5 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/80 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2.5 space-y-1">
                  <div className="flex justify-between items-center text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>Password Strength</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black text-white ${strength.color}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-full flex-grow transition-all duration-300 ${
                          level <= strength.score ? strength.color : 'bg-transparent'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/80 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-105 active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-cyan-500/20 transition-all cursor-pointer text-xs mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Register</span>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800/80 pt-6">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-500 hover:text-cyan-600 font-bold transition-colors">
                Login here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
