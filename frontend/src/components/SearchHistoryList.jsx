import React from 'react';
import { History, ArrowRight, UserCheck, Flame } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function SearchHistoryList({ history, onSelectUser, activeUser }) {
  if (!history || history.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center h-full min-h-[220px]">
        <History className="w-8 h-8 text-gray-700 mb-3" />
        <p className="text-sm text-gray-500 font-semibold">No recent searches</p>
        <p className="text-xs text-gray-600 mt-1">Queries will appear here once executed</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-md p-6 flex flex-col h-full shadow-lg min-h-[220px]">
      <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
        <History className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Search Streams</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 max-h-[300px] pr-1">
        {history.map((item) => {
          const isActive = activeUser && activeUser.username.toLowerCase() === item.username.toLowerCase();
          
          return (
            <button
              key={item.id || item.username}
              onClick={() => onSelectUser(item.username)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all duration-200 active:scale-[0.98] ${
                isActive
                  ? 'bg-indigo-600/10 border-indigo-500/30 text-white'
                  : 'bg-slate-950/20 border-white/5 text-gray-400 hover:text-white hover:border-white/10 hover:bg-slate-950/40'
              }`}
            >
              <div className="min-w-0 flex-1 pr-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm truncate">
                    {item.name || item.username}
                  </span>
                  {isActive && <UserCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-gray-500 font-medium">@{item.username}</span>
                  <span className="text-[10px] text-gray-600">•</span>
                  <span className="text-[10px] text-gray-600">{formatDate(item.lastAnalyzedAt || item.updatedAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Score</span>
                  <span className="text-xs font-bold text-gray-300">{item.developerScore || '—'}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
