import React from 'react';
import { Award, Zap, Flame, ShieldAlert, Cpu } from 'lucide-react';

export default function ScoreVisualizer({ score, rank }) {
  // SVG Config
  const radius = 60;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getRankConfig = (tier) => {
    switch (tier) {
      case '10x Mythic Developer':
        return {
          color: 'text-amber-400',
          bgColor: 'bg-amber-400/10 border-amber-400/20',
          glow: 'shadow-amber-500/20',
          description: 'A legendary pioneer in the open-source community with immense community impact.',
          icon: <Flame className="w-5 h-5 text-amber-400" />
        };
      case 'Elite Architect':
        return {
          color: 'text-purple-400',
          bgColor: 'bg-purple-400/10 border-purple-400/20',
          glow: 'shadow-purple-500/20',
          description: 'Outstanding technical architecture and stellar community metrics.',
          icon: <Award className="w-5 h-5 text-purple-400" />
        };
      case 'Rising Tech Lead':
        return {
          color: 'text-sky-400',
          bgColor: 'bg-sky-400/10 border-sky-400/20',
          glow: 'shadow-sky-500/20',
          description: 'Solid profile foundation with diverse coding patterns and rising popularity.',
          icon: <Zap className="w-5 h-5 text-sky-400" />
        };
      case 'Scrappy Builder':
        return {
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-400/10 border-emerald-400/20',
          glow: 'shadow-emerald-500/20',
          description: 'Active repository builder creating useful codebases and working on active projects.',
          icon: <Cpu className="w-5 h-5 text-emerald-400" />
        };
      default:
        return {
          color: 'text-gray-400',
          bgColor: 'bg-gray-400/10 border-gray-400/20',
          glow: 'shadow-gray-500/10',
          description: 'Getting started on their GitHub journey. Ready to scale and write awesome code.',
          icon: <ShieldAlert className="w-5 h-5 text-gray-400" />
        };
    }
  };

  const config = getRankConfig(rank);

  return (
    <div className="rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-md p-6 flex flex-col items-center text-center shadow-lg h-full justify-between">
      <div className="w-full text-left mb-4">
        <h3 className="text-lg font-bold text-white">Developer Intelligence</h3>
        <p className="text-xs text-gray-500">Logarithmic developer score rating</p>
      </div>

      {/* SVG Circular Ring Gauge */}
      <div className="relative flex items-center justify-center mb-6">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90 drop-shadow-[0_0_10px_rgba(99,102,241,0.15)]"
        >
          {/* Background circle track */}
          <circle
            stroke="rgba(255, 255, 255, 0.03)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Active progress circle */}
          <circle
            stroke="url(#indigoPurpleGradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <defs>
            <linearGradient id="indigoPurpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Core numbers in center */}
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-extrabold text-white leading-none tracking-tighter">
            {score}
          </span>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">
            SCORE
          </span>
        </div>
      </div>

      {/* Glow Rank Tier Badge */}
      <div className="w-full">
        <div className={`mx-auto max-w-[220px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm shadow-lg ${config.bgColor} ${config.color} ${config.glow} mb-3`}>
          {config.icon}
          <span>{rank}</span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed max-w-xs px-2">
          {config.description}
        </p>
      </div>
    </div>
  );
}
