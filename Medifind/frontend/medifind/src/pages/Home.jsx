import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  ArrowRight, 
  PlusCircle, 
  Activity, 
  CheckCircle2, 
  Users, 
  Pill, 
  HeartHandshake,
  Star,
  ShoppingBag,
  Calendar,
  ClipboardList,
  CalendarCheck,
  Siren
} from 'lucide-react';
import Logo from '../components/Logo';

const Home = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      let targetScrollY = absoluteTop - (window.innerHeight / 2) + (rect.height / 2);
      const minScrollY = absoluteTop - 80;
      if (targetScrollY < minScrollY) {
        targetScrollY = minScrollY;
      }
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      });
    }
  };

  const features = [
    {
      icon: <Search className="w-6 h-6 text-cyan-500" />,
      title: "Find Medicines Instantly",
      desc: "Search and locate medicines available in nearby pharmacies."
    },
    {
      icon: <CalendarCheck className="w-6 h-6 text-blue-500" />,
      title: "Instant Pickup Reservations",
      desc: "Book medicines directly from search results to secure your stock, avoiding last-minute out-of-stock disappointments."
    },
    {
      icon: <ClipboardList className="w-6 h-6 text-indigo-500" />,
      title: "Booking & Pickup Tracking",
      desc: "Track medicine reservations from booking to pickup."
    },
    {
      icon: <Siren className="w-6 h-6 text-rose-500" />,
      title: "Emergency Access",
      desc: "Locate medicines quickly during urgent situations."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: "Trusted & Verified Pharmacies",
      desc: "Only approved and verified pharmacies are shown."
    },
    {
      icon: <MapPin className="w-6 h-6 text-teal-500" />,
      title: "Nearby Pharmacy Discovery",
      desc: "View pharmacies closest to your location."
    }
  ];

  const stats = [
    { 
      number: "450+", 
      label: "Pharmacies Registered", 
      icon: <Building2 className="w-5 h-5 text-violet-650 dark:text-violet-400" />,
      color: "from-violet-500 to-indigo-600",
      borderColor: "hover:border-violet-500/30",
      glowColor: "shadow-violet-500/5",
      iconBg: "bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400"
    },
    { 
      number: "80,000+", 
      label: "Medicines Available", 
      icon: <Pill className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      color: "from-cyan-500 to-blue-600",
      borderColor: "hover:border-cyan-500/30",
      glowColor: "shadow-cyan-500/5",
      iconBg: "bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400"
    },
    { 
      number: "1.2M+", 
      label: "Searches Performed", 
      icon: <Search className="w-5 h-5 text-purple-650 dark:text-purple-400" />,
      color: "from-purple-500 to-pink-600",
      borderColor: "hover:border-purple-500/30",
      glowColor: "shadow-purple-500/5",
      iconBg: "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400"
    },
    { 
      number: "24+", 
      label: "Cities Covered", 
      icon: <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      color: "from-emerald-500 to-teal-600",
      borderColor: "hover:border-emerald-500/30",
      glowColor: "shadow-emerald-500/5",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
    }
  ];

  const steps = [
    { 
      number: "01", 
      title: "Search Medicine", 
      desc: "Type your medication name in the bar to find availability.",
      icon: <Search className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />,
      color: "from-cyan-500/20 to-blue-500/20",
      textColor: "text-cyan-600 dark:text-cyan-400"
    },
    { 
      number: "02", 
      title: "Find Nearby Pharmacy", 
      desc: "Compare pricing and locations among local listed shops.",
      icon: <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      color: "from-emerald-500/20 to-teal-500/20",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    { 
      number: "03", 
      title: "Check Availability", 
      desc: "View real-time quantity reserves and active price lists.",
      icon: <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      color: "from-purple-500/20 to-pink-500/20",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    { 
      number: "04", 
      title: "Visit Pharmacy", 
      desc: "Pick up your reserved order securely directly from the counter.",
      icon: <ShoppingBag className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      color: "from-amber-500/20 to-orange-500/20",
      textColor: "text-amber-600 dark:text-amber-400"
    }
  ];

  const testimonials = [
    {
      name: "Neha Sharma",
      role: "Patient (Mumbai)",
      avatar: "NS",
      quote: "MediFind saved me so much time! I was looking for a specific medication that was out of stock everywhere. I found it in seconds at a pharmacy just 2 km away and reserved it instantly."
    },
    {
      name: "Dr. Amit Verma",
      role: "Owner, CareFirst Pharmacy (Delhi)",
      avatar: "AV",
      quote: "As a pharmacy owner, managing inventory and reaching new patients was a challenge. MediFind's dashboard makes it easy to list our stock, update prices, and receive bookings."
    },
    {
      name: "Aditya Joshi",
      role: "Caregiver & Patient (Bangalore)",
      avatar: "AJ",
      quote: "The real-time tracking is incredibly accurate. I love the clean interface and the seamless transition between light and dark mode. Highly recommend to anyone looking for genuine medicines."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section id="home" className="relative overflow-hidden min-h-[calc(100vh-80px)] flex items-center pt-0 pb-8 lg:pt-0 lg:pb-12 scroll-mt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,theme(colors.cyan.500/10%),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,theme(colors.cyan.900/10%),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-100 dark:border-cyan-900/30 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                <span>Next-Gen Pharmacy Network</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.15]">
                Find Medicines <br />
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  Near You Instantly
                </span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
                Search medicine availability across nearby pharmacies in real time. Avoid calling around or visiting multiple stores.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/search"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-105 active:scale-98 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer text-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Medicines</span>
                </Link>
                <Link
                  to="/register?role=PHARMACY"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-300 transition-all cursor-pointer text-sm bg-white dark:bg-slate-900"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Register Pharmacy</span>
                </Link>
              </div>

              {/* Badges of trust */}
              <div className="flex items-center gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>100% Vetted Pharmacies</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Real-time Stock Tracking</span>
                </div>
              </div>
            </div>

            {/* Right Illustration: Pure SVG & CSS Startup Dashboard Representation */}
            <div className="lg:col-span-6 relative flex justify-center lg:-translate-y-6">
              <div className="relative w-full max-w-[480px] aspect-square rounded-3xl bg-gradient-to-tr from-cyan-500/10 to-blue-600/10 dark:from-cyan-950/20 dark:to-blue-950/20 p-8 flex items-center justify-center border border-cyan-100/30 dark:border-cyan-900/20">
                
                {/* SVG Illustration Container */}
                <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl">
                  {/* Background grid representation */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(10)">
                      <line x1="0" y1="0" x2="40" y2="0" stroke="rgba(6, 182, 212, 0.04)" strokeWidth="1" />
                      <line x1="0" y1="0" x2="0" y2="40" stroke="rgba(6, 182, 212, 0.04)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" rx="24" />

                  {/* Pharmacy location marker mockup card */}
                  <g transform="translate(40, 60)">
                    <rect x="0" y="0" width="180" height="90" rx="16" fill="white" stroke="#e2e8f0" strokeWidth="1" className="fill-white dark:fill-slate-800 dark:stroke-slate-700" />
                    <circle cx="28" cy="28" r="14" fill="#06b6d4" fillOpacity="0.1" />
                    <path d="M28 20 C24 20, 22 23, 22 26 C22 30, 28 36, 28 36 C28 36, 34 30, 34 26 C34 23, 32 20, 28 20 Z" fill="#06b6d4" />
                    <circle cx="28" cy="26" r="3" fill="white" />
                    <text x="52" y="32" fontFamily="system-ui" fontSize="11" fontWeight="bold" fill="#1e293b" className="fill-slate-800 dark:fill-slate-100">Apollo Pharmacy</text>
                    <text x="52" y="46" fontFamily="system-ui" fontSize="9" fill="#64748b" className="fill-slate-400">Open now • 0.8 km</text>
                    <rect x="52" y="58" width="65" height="16" rx="8" fill="#10b981" fillOpacity="0.1" />
                    <text x="62" y="69" fontFamily="system-ui" fontSize="8" fontWeight="bold" fill="#10b981">APPROVED</text>
                  </g>

                  {/* Medicine boxes representation card */}
                  <g transform="translate(190, 230)">
                    <rect x="0" y="0" width="170" height="110" rx="16" fill="white" stroke="#e2e8f0" strokeWidth="1" className="fill-white dark:fill-slate-800 dark:stroke-slate-700" />
                    <rect x="15" y="15" width="28" height="28" rx="8" fill="#3b82f6" fillOpacity="0.1" />
                    {/* Medicine Pill Icon representation */}
                    <path d="M24 22 L34 32" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="24" cy="22" r="3" fill="#3b82f6" />
                    <circle cx="34" cy="32" r="3" fill="#3b82f6" />
                    
                    <text x="52" y="27" fontFamily="system-ui" fontSize="12" fontWeight="bold" fill="#1e293b" className="fill-slate-800 dark:fill-slate-100">Amoxicillin 500mg</text>
                    <text x="52" y="41" fontFamily="system-ui" fontSize="9" fill="#64748b" className="fill-slate-400">Antibiotic • 10 tablets</text>
                    
                    <line x1="15" y1="58" x2="155" y2="58" stroke="#f1f5f9" strokeWidth="1" className="stroke-slate-200 dark:stroke-slate-700" />
                    
                    <text x="15" y="78" fontFamily="system-ui" fontSize="10" fill="#64748b" className="fill-slate-400">Stock Qty</text>
                    <text x="15" y="93" fontFamily="system-ui" fontSize="12" fontWeight="bold" fill="#10b981">120 Available</text>

                    <text x="105" y="78" fontFamily="system-ui" fontSize="10" fill="#64748b" className="fill-slate-400">Price</text>
                    <text x="105" y="93" fontFamily="system-ui" fontSize="12" fontWeight="bold" fill="#0f172a" className="fill-slate-900 dark:fill-slate-100">₹185.00</text>
                  </g>

                  {/* Location tracking ring visual effect */}
                  <circle cx="220" cy="140" r="16" fill="#06b6d4" fillOpacity="0.1" />
                  <circle cx="220" cy="140" r="8" fill="#06b6d4" />
                  <circle cx="220" cy="140" r="32" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" className="animate-spin-slow" />
                  <circle cx="220" cy="140" r="54" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeOpacity="0.2" />
                </svg>

                {/* Overlaid stat bubble */}
                <div className="absolute bottom-6 left-6 bg-gradient-to-tr from-cyan-500 to-blue-600 text-white rounded-2xl p-4 shadow-xl border border-cyan-400/20 text-left max-w-[150px]">
                  <span className="text-2xl font-black block">99.8%</span>
                  <span className="text-[10px] uppercase font-bold text-cyan-100 leading-tight block">Stock Match Accuracy</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ABOUT US SECTION */}
      <section id="about-us" className="scroll-mt-20 bg-slate-50 dark:bg-slate-900/60 py-24 lg:py-32 border-t border-b border-slate-100 dark:border-slate-800/80 transition-colors min-h-[calc(100vh-80px)] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: About Us info */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-100 dark:border-cyan-900/30 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold">
                <span>About Us</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-tight sm:text-4xl">
                Bridging the Gap Between Patients and Pharmacies
              </h2>
              
              {/* Bullet list of core benefits */}
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-805/30 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-900/80 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">100% Vetted Partners</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                      Only authorized, licensed local pharmacy networks are listed for your safety.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-805/30 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-900/80 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">Real-Time Data</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                      Accurate, verified inventory stock quantities updated dynamically.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-805/30 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-900/80 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 border border-violet-500/20">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">Patient-First Design</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                      Built to ensure you never run out of critical prescription or OTC medication.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Statistics Grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center text-center p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 dark:border-slate-800/85 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl relative overflow-hidden group"
                  >
                    {/* Hover Top border stripe */}
                    <div className={`absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    
                    {/* Icon container */}
                    <div className={`w-14 h-14 rounded-2xl ${stat.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-slate-100 dark:border-slate-850/20 shadow-sm`}>
                      {stat.icon}
                    </div>
                    
                    <span className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white block tracking-tight">
                      {stat.number}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wider max-w-[150px]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="scroll-mt-20 py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)] flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Designed for Modern Healthcare Operations
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-2">
            MediFind provides a high-performance framework connecting patients with physical healthcare vendors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-cyan-500/30 dark:hover:border-cyan-500/25 transition-all duration-300 flex flex-col items-start text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="scroll-mt-20 bg-slate-50 dark:bg-slate-900/60 py-24 lg:py-32 border-t border-b border-slate-100 dark:border-slate-800/80 transition-colors min-h-[calc(100vh-80px)] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-100 dark:border-cyan-900/30 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-3">
              <span>Patient Flow</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white sm:text-4xl">
              Simple 4-Step Patient Flow
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-4 max-w-xl mx-auto leading-relaxed">
              Fast-track your prescription collections. Get your medicine in hand in minutes.
            </p>
          </div>

          <div className="relative">
            {/* Step Connector Line (Desktop only, connects the icons) */}
            <div className="hidden lg:block absolute top-[64px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-cyan-400/40 via-purple-400/40 to-amber-400/40 z-0 pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden"
                >
                  {/* Subtle top color bar */}
                  <div className={`absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r ${step.color} opacity-90`} />
                  
                  {/* Icon container */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10 border border-slate-100/50 dark:border-slate-850/30 shadow-inner`}>
                    {step.icon}
                  </div>

                  {/* Step Number Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 ${step.textColor} uppercase shadow-inner`}>
                      Step {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="space-y-2.5">
                    <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white group-hover:text-cyan-500 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-[210px] mx-auto font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. REVIEWS SECTION */}
      <section id="reviews" className="scroll-mt-20 py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)] flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-100 dark:border-cyan-900/30 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-3">
            <span>Reviews</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Loved by Patients & Pharmacies
          </h2>
          <p className="text-slate-555 dark:text-slate-400 text-xs sm:text-sm mt-3">
            Read real feedback from our community members who rely on MediFind to find and manage their daily medicines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((review, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-cyan-500/30 dark:hover:border-cyan-500/25 transition-all duration-300 flex flex-col justify-between text-left"
            >
              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-slate-600 dark:text-slate-350 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "{review.quote}"
                </p>
              </div>
              
              {/* User profile */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-xs shadow-sm shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                    {review.name}
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {review.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-100 dark:border-slate-800">
          
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4 text-left">
            <Link to="/">
              <Logo showTagline={true} />
            </Link>
            <p className="text-xs sm:text-sm max-w-sm leading-relaxed">
              MediFind connects local health vendors with active patient databases to enable smooth medicine lookup, reservation booking, and verification administration.
            </p>
            <div className="flex gap-4">
              <HeartHandshake className="w-5 h-5 text-cyan-500" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Partners with local health councils</span>
            </div>
          </div>

          {/* Links */}
          <div className="text-left space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
                  className="hover:text-cyan-500 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#about-us" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('about-us'); }}
                  className="hover:text-cyan-500 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#features" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
                  className="hover:text-cyan-500 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}
                  className="hover:text-cyan-500 transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a 
                  href="#reviews" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('reviews'); }}
                  className="hover:text-cyan-500 transition-colors"
                >
                  Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="text-left space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Contact & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="block">Support:aradhanasamantray7@gmail.com</span></li>
              <li><a href="#" className="hover:text-cyan-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-cyan-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-cyan-500 transition-colors">Cookie settings</a></li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 text-slate-400">
          <span>&copy; {new Date().getFullYear()} Created By Aradhana Samantray.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-cyan-500">Terms</a>
            <a href="#" className="hover:text-cyan-500">Privacy</a>
            <a href="#" className="hover:text-cyan-500">Cookies</a>
          </div>
        </div>

      </footer>

    </div>
  );
};

// Simple icon animation helper
const Sparkles = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z"/>
    <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"/>
  </svg>
);

export default Home;
