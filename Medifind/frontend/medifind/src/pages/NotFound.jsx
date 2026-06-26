import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 text-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-md w-full">
        {/* Animated Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 mb-8 animate-pulse">
          <HelpCircle className="w-10 h-10" />
        </div>

        {/* Large 404 Text */}
        <h1 className="text-8xl font-black tracking-widest bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-4">
          404
        </h1>

        {/* Status Message */}
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Page Not Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-xs mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-105 active:scale-98 shadow-md shadow-cyan-500/20 transition-all cursor-pointer text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
