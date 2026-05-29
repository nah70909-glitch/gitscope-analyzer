import React, { useState, useMemo } from 'react';
import { ExternalLink, Star, GitFork, Search, ArrowUpDown, ShieldAlert, Archive } from 'lucide-react';
import { formatNumber, formatSize } from '../utils/formatters';

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572a5',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Go: '#00add8',
  Rust: '#dea584',
  None: '#4b5563'
};

export default function ReposTable({ repositories }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'original', 'forks'
  const [sortBy, setSortBy] = useState('stars'); // 'stars', 'forks', 'size', 'name'
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc', 'asc'
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // Filter and sort logic
  const filteredAndSortedRepos = useMemo(() => {
    if (!repositories) return [];

    let result = [...repositories];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(repo => 
        (repo.name && repo.name.toLowerCase().includes(q)) || 
        (repo.description && repo.description.toLowerCase().includes(q)) ||
        (repo.language && repo.language.toLowerCase().includes(q))
      );
    }

    // 2. Type Filter
    if (filterType === 'original') {
      result = result.filter(repo => !repo.isFork);
    } else if (filterType === 'forks') {
      result = result.filter(repo => repo.isFork);
    }

    // 3. Sorting
    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Handle strings comparison vs numeric
      if (sortBy === 'name') {
        valA = valA ? valA.toLowerCase() : '';
        valB = valB ? valB.toLowerCase() : '';
        return sortOrder === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
      }

      // Default numeric sort
      return sortOrder === 'desc' ? (valB || 0) - (valA || 0) : (valA || 0) - (valB || 0);
    });

    return result;
  }, [repositories, searchQuery, filterType, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedRepos.length / itemsPerPage);
  const paginatedRepos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedRepos.slice(start, start + itemsPerPage);
  }, [filteredAndSortedRepos, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-md p-6 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Repository Intel</h3>
          <p className="text-xs text-gray-500 font-medium">Detailed developer codebase directory ({repositories?.length || 0})</p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Inner Search */}
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search repos..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-slate-950/50 border border-white/5 text-gray-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
            />
          </div>

          {/* Type Filter Select */}
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 text-sm rounded-lg bg-slate-950/50 border border-white/5 text-gray-300 focus:outline-none focus:border-indigo-500/50"
          >
            <option value="all">All Repositories</option>
            <option value="original">Original</option>
            <option value="forks">Forks</option>
          </select>
        </div>
      </div>

      {filteredAndSortedRepos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-slate-950/20 border border-white/5">
          <Archive className="w-10 h-10 text-gray-600 mb-3" />
          <p className="text-sm text-gray-400 font-semibold">No repositories match this query</p>
          <p className="text-xs text-gray-600 mt-1">Try resetting the filters or typing a different query</p>
        </div>
      ) : (
        <>
          {/* Responsive Table Container */}
          <div className="overflow-x-auto -mx-6">
            <table className="w-full border-collapse text-left text-sm text-gray-300">
              <thead>
                <tr className="border-y border-white/5 bg-slate-950/15">
                  <th 
                    onClick={() => handleSort('name')}
                    className="p-4 font-semibold text-gray-400 cursor-pointer hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      Name
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="p-4 font-semibold text-gray-400">Language</th>
                  <th 
                    onClick={() => handleSort('stars')}
                    className="p-4 font-semibold text-gray-400 cursor-pointer hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      Stars
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('forks')}
                    className="p-4 font-semibold text-gray-400 cursor-pointer hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      Forks
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('size')}
                    className="p-4 font-semibold text-gray-400 cursor-pointer hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      Size
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="p-4 font-semibold text-gray-400 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedRepos.map((repo) => (
                  <tr key={repo.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 font-medium text-white max-w-xs">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="truncate group-hover:text-indigo-400 transition-colors">
                            {repo.name}
                          </span>
                          {repo.isFork && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500 font-bold uppercase tracking-wider">
                              Fork
                            </span>
                          )}
                        </div>
                        {repo.description && (
                          <span className="text-xs text-gray-500 line-clamp-1 mt-0.5 max-w-sm">
                            {repo.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#9ca3af' }}
                        />
                        <span className="text-xs font-semibold">{repo.language || 'None'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-bold text-gray-300">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500/80" />
                        {formatNumber(repo.stars)}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-bold text-gray-300">
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5 text-indigo-400/80" />
                        {formatNumber(repo.forks)}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-bold text-gray-400">
                      {formatSize(repo.size)}
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={repo.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-1.5 rounded-lg border border-white/5 bg-slate-950/20 text-gray-400 hover:text-white hover:border-indigo-500/30 transition-all active:scale-95"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
              <span className="text-xs text-gray-500 font-semibold">
                Page {currentPage} of {totalPages} ({filteredAndSortedRepos.length} results)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs rounded-lg border border-white/5 bg-slate-950/20 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs rounded-lg border border-white/5 bg-slate-950/20 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
