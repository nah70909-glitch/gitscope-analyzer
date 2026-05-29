import React from 'react';
import { Star, Users, Trash2, ShieldAlert, Trophy, Eye } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

const RANK_BADGE_STYLE = {
  '10x Mythic Developer': 'bg-amber-400/10 border-amber-400/20 text-amber-400',
  'Elite Architect': 'bg-purple-400/10 border-purple-400/20 text-purple-400',
  'Rising Tech Lead': 'bg-sky-400/10 border-sky-400/20 text-sky-400',
  'Scrappy Builder': 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400',
  'Code Novice': 'bg-gray-400/10 border-gray-400/20 text-gray-400'
};

export default function Leaderboard({ developers, onLoadProfile, onDeleteProfile, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-white/5 bg-slate-900/20 h-64 p-6 flex flex-col justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/5 rounded w-2/3" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-white/5 rounded w-full" />
              <div className="h-4 bg-white/5 rounded w-3/4" />
            </div>
            <div className="h-10 bg-white/5 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!developers || developers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center rounded-xl bg-slate-900/20 border border-white/5 max-w-xl mx-auto">
        <Trophy className="w-12 h-12 text-gray-600 mb-4" />
        <h3 className="text-lg font-bold text-white mb-1">Leaderboard is empty</h3>
        <p className="text-sm text-gray-500 max-w-sm">
          No developers have been analyzed yet. Head over to the Dashboard, type in a GitHub username, and execute an analysis!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {developers.map((dev, index) => (
        <div 
          key={dev.id}
          className="relative overflow-hidden rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-md p-6 flex flex-col justify-between group transition-all duration-300 hover:border-indigo-500/20 hover:bg-slate-900/60 shadow-lg"
        >
          {/* Rank Ribbon */}
          <div className="absolute top-0 right-0 flex items-center justify-center w-8 h-8 rounded-bl-xl bg-slate-950/80 border-l border-b border-white/5 text-xs font-bold text-gray-400 group-hover:text-indigo-400 group-hover:bg-slate-950 transition-colors">
            #{index + 1}
          </div>

          <div>
            {/* Core Info */}
            <div className="flex items-center gap-4 mb-4 pr-6">
              <img 
                src={dev.avatarUrl} 
                alt={dev.username} 
                className="w-12 h-12 rounded-full border border-white/10"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-extrabold text-white truncate text-base leading-tight">
                  {dev.name || dev.username}
                </h4>
                <p className="text-xs font-semibold text-indigo-400 truncate">
                  @{dev.username}
                </p>
              </div>
            </div>

            {/* Rank and Score */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border uppercase tracking-wider ${RANK_BADGE_STYLE[dev.developerRank] || 'bg-white/5 border-white/10 text-gray-400'}`}>
                {dev.developerRank}
              </span>
              <div className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-2.5 py-1 text-indigo-400">
                <span className="text-xs font-bold uppercase tracking-wider">Score</span>
                <span className="text-sm font-extrabold">{dev.developerScore}</span>
              </div>
            </div>

            {/* Micro Bio */}
            {dev.bio && (
              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4 min-h-[32px]">
                {dev.bio}
              </p>
            )}
            
            {/* Highlights Statistics Grid */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 mb-4 text-center">
              <div>
                <span className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Stars</span>
                <span className="text-sm font-bold text-white flex items-center justify-center gap-0.5 mt-0.5">
                  <Star className="w-3.5 h-3.5 text-amber-500/80" />
                  {formatNumber(dev.totalStars)}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Followers</span>
                <span className="text-sm font-bold text-white flex items-center justify-center gap-0.5 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400/80" />
                  {formatNumber(dev.followers)}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Language</span>
                <span className="text-xs font-bold text-gray-300 block truncate mt-1">
                  {dev.topLanguage}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => onLoadProfile(dev)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors shadow-lg active:scale-95"
            >
              <Eye className="w-4 h-4" />
              View Dashboard
            </button>
            <button
              onClick={() => onDeleteProfile(dev.id)}
              className="p-2.5 rounded-lg border border-white/5 bg-slate-950/20 text-gray-500 hover:text-rose-400 hover:border-rose-500/20 transition-all active:scale-95"
              title="Delete analysis record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
