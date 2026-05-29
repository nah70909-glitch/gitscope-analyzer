import React, { useState } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && !isLoading) {
      onSearch(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        {/* Glow ambient background effect */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-lg group-hover:opacity-30 transition duration-500"></div>
        
        <div className="relative flex items-center">
          <div className="absolute left-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>
          
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Search GitHub username (e.g., torvalds, gaearon)..."
            disabled={isLoading}
            className="w-full py-4 pl-12 pr-32 rounded-xl text-gray-100 placeholder-gray-500 glass-input text-base font-medium"
          />
          
          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="absolute right-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-lg shadow-indigo-950/50 hover:shadow-indigo-500/20 active:scale-95"
          >
            {isLoading ? (
              <>Analyzing...</>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
