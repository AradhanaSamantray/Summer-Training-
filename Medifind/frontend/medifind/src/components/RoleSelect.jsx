import React, { useState, useEffect, useRef } from 'react';
import { User, Pill, Shield, ChevronDown, Check } from 'lucide-react';

const ROLES = [
  {
    value: 'USER',
    label: 'User / Patient',
    icon: User,
    color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20'
  },
  {
    value: 'PHARMACY',
    label: 'Pharmacy Store',
    icon: Pill,
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
  },
  {
    value: 'ADMIN',
    label: 'Administrator',
    icon: Shield,
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20'
  }
];

const RoleSelect = ({ value, onChange, label = "Role", excludeAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const availableRoles = excludeAdmin 
    ? ROLES.filter(r => r.value !== 'ADMIN') 
    : ROLES;

  const selectedRole = availableRoles.find(r => r.value === value) || availableRoles[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (roleVal) => {
    onChange(roleVal);
    setIsOpen(false);
  };

  const IconComponent = selectedRole.icon;

  return (
    <div className="relative text-left w-full" ref={containerRef}>
      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      
      {/* Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between pl-3.5 pr-4 py-2.5 rounded-xl border border-slate-200/80 focus:border-cyan-500 dark:border-slate-700/80 dark:bg-slate-900/60 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 dark:text-white transition-all text-xs bg-white/50 dark:bg-slate-900/40 cursor-pointer font-semibold shadow-sm hover:border-slate-300 dark:hover:border-slate-655"
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-xl ${selectedRole.color} transition-colors duration-200`}>
            <IconComponent className="w-4 h-4 shrink-0" />
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs font-bold text-slate-800 dark:text-white">{selectedRole.label}</span>
            <span className="text-[9px] text-slate-400 font-medium truncate max-w-[200px] mt-0.5">{selectedRole.description}</span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-cyan-500' : ''}`} />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-2xl rounded-2xl overflow-hidden py-2 px-1 animate-in fade-in-50 slide-in-from-top-2 duration-200">
          <div className="px-3 py-1 text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
            Select Account Role
          </div>
          <div className="space-y-1">
            {availableRoles.map((roleItem) => {
              const ItemIcon = roleItem.icon;
              const isSelected = roleItem.value === value;
              return (
                <button
                  key={roleItem.value}
                  type="button"
                  onClick={() => handleSelect(roleItem.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-205 text-left ${
                    isSelected 
                      ? 'bg-cyan-500/10 dark:bg-cyan-500/5 border border-cyan-500/20 dark:border-cyan-500/10' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${roleItem.color}`}>
                      <ItemIcon className="w-4 h-4 shrink-0" />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{roleItem.label}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">{roleItem.description}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-cyan-500/15 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-cyan-500 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelect;
