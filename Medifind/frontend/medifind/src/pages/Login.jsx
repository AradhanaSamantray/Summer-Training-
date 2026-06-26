import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Pill, ArrowRight, Sparkles } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import RoleSelect from '../components/RoleSelect';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !role) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password, role });
      const { token } = response.data;

      // Check if we have registered name in sessionStorage
      const registeredName = sessionStorage.getItem('medifind_temp_name');

      // login function returns decoded role and name
      const { role: userRole } = login(token, registeredName);
      
      // Clean up temporary name
      sessionStorage.removeItem('medifind_temp_name');

      showToast(`Welcome back! Logged in successfully.`, 'success');

      // Redirect based on role
      if (userRole === 'ADMIN') {
        navigate('/admin');
      } else if (userRole === 'PHARMACY') {
        navigate('/pharmacy');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Invalid email or password';
      showToast(errorMsg, 'error');
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
          
          {/* Logo / Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 mb-4 hover:rotate-12 transition-transform duration-300">
              <Pill className="w-7 h-7 rotate-45" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Log in to access account</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-left" autoComplete="off">
            {/* Email Field */}
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
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
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
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/80 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Custom Select */}
            <RoleSelect value={role} onChange={setRole} label="Role" />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-105 active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-cyan-500/20 transition-all cursor-pointer text-xs"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800/80 pt-6">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-500 hover:text-cyan-600 font-bold transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
