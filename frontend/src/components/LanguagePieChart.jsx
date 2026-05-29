import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572a5',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#178600',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Go: '#00add8',
  Rust: '#dea584',
  Shell: '#89e051',
  PHP: '#4f5d95',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  None: '#4b5563'
};

export default function LanguagePieChart({ repositories }) {
  const chartData = useMemo(() => {
    if (!repositories || repositories.length === 0) return [];

    const counts = {};
    repositories.forEach(repo => {
      // Ignore forks for core language distributions to be accurate
      if (repo.isFork) return;
      const lang = repo.language || 'None';
      counts[lang] = (counts[lang] || 0) + 1;
    });

    const data = Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: LANGUAGE_COLORS[name] || '#9ca3af' // Fallback gray
    }));

    // Sort languages by count descending
    return data.sort((a, b) => b.value - a.value).slice(0, 5); // Take top 5
  }, [repositories]);

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
        <p className="text-sm text-gray-500 font-medium">No language metrics available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-slate-950/90 border border-white/10 rounded-xl backdrop-blur-md shadow-2xl">
          <p className="text-sm font-bold text-white">{payload[0].name}</p>
          <p className="text-xs font-semibold text-indigo-400 mt-0.5">
            {payload[0].value} {payload[0].value === 1 ? 'Repository' : 'Repositories'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-md p-6 flex flex-col h-full shadow-lg min-h-[300px] justify-between">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">Language Distribution</h3>
        <p className="text-xs text-gray-500 font-medium">Top languages in original repositories</p>
      </div>

      <div className="flex-1 w-full h-[220px] relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(11, 15, 25, 0.8)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Sleek Legend List */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs font-medium text-gray-300">
            <span 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate">{entry.name}</span>
            <span className="text-gray-500 ml-auto font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
