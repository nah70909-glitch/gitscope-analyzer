import React from 'react';

export default function MetricCard({ title, value, icon, description, gradient }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-md p-6 group transition-all duration-300 hover:border-indigo-500/20 hover:bg-slate-900/60 shadow-lg">
      {/* Decorative Gradient Glow behind card */}
      <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full opacity-5 blur-2xl bg-gradient-to-br ${gradient || 'from-indigo-500 to-purple-500'} group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-400 tracking-wide uppercase">{title}</span>
        <div className={`p-2.5 rounded-lg bg-white/5 border border-white/5 text-indigo-400 group-hover:text-indigo-300 transition-colors`}>
          {icon}
        </div>
      </div>
      
      <div>
        <h3 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-1">
          {value}
        </h3>
        {description && (
          <p className="text-xs text-gray-500 font-medium group-hover:text-gray-400 transition-colors">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
