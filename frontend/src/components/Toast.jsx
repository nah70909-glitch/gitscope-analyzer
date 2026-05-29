import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <ShieldAlert className="w-5 h-5 text-rose-400" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-sky-400" />
  };

  const bgColors = {
    success: 'border-emerald-500/20 bg-[#122220]/95 shadow-emerald-950/20',
    error: 'border-rose-500/20 bg-[#25181E]/95 shadow-rose-950/20',
    warning: 'border-amber-500/20 bg-[#252018]/95 shadow-amber-950/20',
    info: 'border-sky-500/20 bg-[#14202B]/95 shadow-sky-950/20'
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300 ${bgColors[type]}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1 text-sm font-medium text-gray-200">{message}</div>
      <button 
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-200 p-0.5 rounded-lg hover:bg-white/5 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
