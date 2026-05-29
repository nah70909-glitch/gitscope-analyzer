import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Code, Star, GitFork, Users, Calendar } from 'lucide-react';
import MetricCard from './MetricCard';
import { formatNumber } from '../utils/formatters';

const RANK_COLORS = {
  '10x Mythic Developer': '#F59E0B', // Gold
  'Elite Architect': '#C084FC',      // Purple
  'Rising Tech Lead': '#60A5FA',     // Blue
  'Scrappy Builder': '#34D399',      // Green
  'Code Novice': '#9CA3AF'           // Gray
};

export default function PlatformStats({ stats, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Metric Cards Loader */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-900/20 border border-white/5 rounded-xl" />
          ))}
        </div>
        
        {/* Chart Loaders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[350px] bg-slate-900/20 border border-white/5 rounded-xl" />
          <div className="h-[350px] bg-slate-900/20 border border-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const { totals, averages, distributions } = stats;

  return (
    <div className="space-y-8">
      {/* Platform Totals Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Tracked Developers"
          value={formatNumber(totals.developers)}
          icon={<Users className="w-5 h-5" />}
          description="Total developer profiles analyzed"
          gradient="from-indigo-500 to-cyan-500"
        />
        <MetricCard
          title="Tracked Repositories"
          value={formatNumber(totals.repositories)}
          icon={<Code className="w-5 h-5" />}
          description="Total repositories aggregated"
          gradient="from-purple-500 to-indigo-500"
        />
        <MetricCard
          title="Cumulative Stars"
          value={formatNumber(totals.stars)}
          icon={<Star className="w-5 h-5" />}
          description="Total stargazers recorded"
          gradient="from-amber-500 to-orange-500"
        />
        <MetricCard
          title="Cumulative Forks"
          value={formatNumber(totals.forks)}
          icon={<GitFork className="w-5 h-5" />}
          description="Total code forks monitored"
          gradient="from-emerald-500 to-teal-500"
        />
      </div>

      {/* Analytical Charts and Tiers Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart A: Global Language Shares */}
        <div className="rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-md p-6 shadow-lg flex flex-col h-[380px]">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Global Tech Stacks</h3>
            <p className="text-xs text-gray-500 font-medium">Top programming languages represented across the platform</p>
          </div>
          
          <div className="flex-1 w-full h-[220px]">
            {distributions.languages.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                No language data tracked yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributions.languages}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                  <XAxis dataKey="language" stroke="#6b7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(8, 11, 17, 0.95)', 
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px'
                    }} 
                  />
                  <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart B: Ranks Distribution Breakdown */}
        <div className="rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-md p-6 shadow-lg flex flex-col h-[380px] justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Rank Distribution</h3>
            <p className="text-xs text-gray-500 font-medium">Breakdown of analyzed developers across intelligence tiers</p>
          </div>

          <div className="space-y-4 my-auto pr-2">
            {distributions.ranks.map(({ rank, count }) => {
              const totalDevs = totals.developers || 1;
              const percentage = Math.round((count / totalDevs) * 100);
              const color = RANK_COLORS[rank] || '#9ca3af';

              return (
                <div key={rank} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-300">{rank}</span>
                    <span className="text-gray-400">
                      {count} {count === 1 ? 'dev' : 'devs'} ({percentage}%)
                    </span>
                  </div>
                  
                  {/* Custom Colored Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-950/40 border border-white/5 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 8px ${color}40`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Average Intelligence Score: <strong>{averages.score} / 100</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Average GitHub Longevity: <strong>{averages.ageYears} Years</strong></span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
