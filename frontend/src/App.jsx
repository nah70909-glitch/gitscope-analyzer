import React, { useState, useEffect } from 'react';
import { 
  Github, Trophy, BarChart3, Users, Star, GitFork, BookOpen, 
  MapPin, Link as LinkIcon, Building2, Twitter, Activity, Info, Loader2
} from 'lucide-react';

// Core Custom Components
import SearchBar from './components/SearchBar';
import MetricCard from './components/MetricCard';
import ScoreVisualizer from './components/ScoreVisualizer';
import LanguagePieChart from './components/LanguagePieChart';
import ReposTable from './components/ReposTable';
import Leaderboard from './components/Leaderboard';
import SearchHistoryList from './components/SearchHistoryList';
import PlatformStats from './components/PlatformStats';
import Toast from './components/Toast';

// Axios Instance
import api from './services/api';
import { formatNumber, formatDate } from './utils/formatters';

// Add robust URL parsing helper to extract username automatically from pasted links or validate raw queries
function extractGithubUsername(input) {
  let cleaned = input.trim();
  
  if (!cleaned) {
    return { username: null, isValid: false };
  }

  // Check if the input looks like a URL
  if (cleaned.includes('/') || cleaned.includes('http://') || cleaned.includes('https://')) {
    try {
      let urlString = cleaned;
      if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
        urlString = 'https://' + urlString;
      }
      
      const url = new URL(urlString);
      
      if (url.hostname.includes('github.com')) {
        const parts = url.pathname.split('/').filter(p => p.trim() !== '');
        if (parts.length > 0) {
          // The first slug of the pathname is the GitHub username
          return { username: parts[0], isValid: true };
        }
      }
      return { username: null, isValid: false };
    } catch (e) {
      return { username: null, isValid: false };
    }
  }
  
  // Regular username validation: alphanumeric and hyphens, max 39 characters
  const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  const isValid = githubUsernameRegex.test(cleaned);
  return { username: isValid ? cleaned : null, isValid };
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'leaderboard', 'stats'
  
  // Data States
  const [activeUser, setActiveUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [history, setHistory] = useState([]);
  const [platformStats, setPlatformStats] = useState(null);
  
  // Loading and Notification States
  const [isSearching, setIsSearching] = useState(false);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  // 1. Trigger Toast Notifications
  const triggerToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // 2. Fetch platform aggregates and histories on mount
  useEffect(() => {
    fetchTrendingHistory();
    fetchLeaderboard();
    fetchPlatformStats();
  }, []);

  const fetchTrendingHistory = async () => {
    try {
      const response = await api.get('/trending');
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching trending history:', err);
    }
  };

  const fetchLeaderboard = async () => {
    setIsLeaderboardLoading(true);
    try {
      const response = await api.get('/top-developers');
      if (response.data.success) {
        setLeaderboard(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setIsLeaderboardLoading(false);
    }
  };

  const fetchPlatformStats = async () => {
    setIsStatsLoading(true);
    try {
      const response = await api.get('/stats/platform');
      if (response.data.success) {
        setPlatformStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching platform statistics:', err);
    } finally {
      setIsStatsLoading(false);
    }
  };

  // 3. Main Query Action: Run GitHub Analysis API
  const handleAnalyzeUser = async (rawInput) => {
    const { username, isValid } = extractGithubUsername(rawInput);

    if (!isValid) {
      triggerToast("Please enter a valid GitHub username or profile URL (e.g. github.com/torvalds).", "error");
      return;
    }

    setIsSearching(true);
    setActiveTab('dashboard');
    try {
      const response = await api.get(`/analyze/${username}`);
      if (response.data.success) {
        setActiveUser(response.data.data);
        triggerToast(`Analysis complete for @${username}!`, 'success');
        
        // Refresh histories
        fetchTrendingHistory();
        fetchLeaderboard();
        fetchPlatformStats();
      }
    } catch (err) {
      const msg = err.response?.data?.message || `Failed to analyze @${username}. Profile may not exist.`;
      triggerToast(msg, 'error');
    } finally {
      setIsSearching(false);
    }
  };

  // 4. Quick Load profile from Leaderboard/Sidebar (Uses database, skips heavy GitHub fetch)
  const handleLoadCachedProfile = async (profile) => {
    setIsSearching(true);
    setActiveTab('dashboard');
    try {
      // Query complete profile details (with repositories nested)
      const response = await api.get(`/users/${profile.id}`);
      if (response.data.success) {
        setActiveUser(response.data.data);
        triggerToast(`Loaded @${profile.username} from records.`, 'success');
      }
    } catch (err) {
      triggerToast('Failed to load cached profile details.', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  // 5. Delete Profile (As required by API specs)
  const handleDeleteProfile = async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      if (response.data.success) {
        triggerToast('Profile records deleted successfully.', 'success');
        
        // Clear active profile if deleted
        if (activeUser && activeUser.id === id) {
          setActiveUser(null);
        }
        
        // Refresh tables
        fetchLeaderboard();
        fetchTrendingHistory();
        fetchPlatformStats();
      }
    } catch (err) {
      triggerToast('Failed to remove developer records.', 'error');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      {/* Background Decorative Neon Grids */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full ambient-glow-purple -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full ambient-glow-blue -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      {/* Sleek Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="p-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white leading-none tracking-tight">
                GitScope <span className="text-indigo-400 font-bold">Analyzer</span>
              </h1>
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mt-0.5">Developer Intelligence</p>
            </div>
          </div>

          <nav className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-indigo-600/15 border border-indigo-500/20 text-white' 
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => { setActiveTab('leaderboard'); fetchLeaderboard(); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'leaderboard' 
                  ? 'bg-indigo-600/15 border border-indigo-500/20 text-white' 
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              Leaderboard
            </button>
            <button
              onClick={() => { setActiveTab('stats'); fetchPlatformStats(); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'stats' 
                  ? 'bg-indigo-600/15 border border-indigo-500/20 text-white' 
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Platform Stats
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        
        {/* Search Engine Header (Always visible on top of views except platform stats) */}
        {activeTab !== 'stats' && (
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Assess Developer Intelligence
            </h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
              Retrieve GitHub accounts instantly. Run logarithmic multi-variable analysis to determine ranks, score metrics, and aggregate codebase stats.
            </p>
            <SearchBar onSearch={handleAnalyzeUser} isLoading={isSearching} />
          </div>
        )}

        {/* View Switcher Routing */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Dashboard Content: Takes 3 cols */}
            <div className="lg:col-span-3 space-y-8">
              {isSearching ? (
                /* Beautiful Skeleton Loading Block */
                <div className="space-y-8 animate-pulse">
                  <div className="rounded-xl border border-white/5 bg-slate-900/20 p-6 h-48 flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-white/5" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-white/5 rounded w-1/3" />
                      <div className="h-4 bg-white/5 rounded w-2/3" />
                      <div className="h-4 bg-white/5 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="h-32 bg-slate-900/20 border border-white/5 rounded-xl" />
                    <div className="h-32 bg-slate-900/20 border border-white/5 rounded-xl" />
                    <div className="h-32 bg-slate-900/20 border border-white/5 rounded-xl" />
                  </div>
                  <div className="h-96 bg-slate-900/20 border border-white/5 rounded-xl" />
                </div>
              ) : activeUser ? (
                /* Render Complete Dashboard components */
                <>
                  {/* Section A: Profile Overview Card */}
                  <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#111827]/30 backdrop-blur-md p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 group shadow-xl">
                    <div className="absolute -left-16 -top-16 w-32 h-32 rounded-full opacity-5 blur-2xl bg-indigo-500 pointer-events-none"></div>
                    <img 
                      src={activeUser.avatarUrl} 
                      alt={activeUser.username}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-white/10 shadow-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-2xl font-extrabold text-white tracking-tight">{activeUser.name || activeUser.username}</h3>
                          <p className="text-sm font-semibold text-indigo-400 mt-0.5">@{activeUser.username}</p>
                        </div>
                        <a 
                          href={`https://github.com/${activeUser.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/5 bg-slate-950/20 text-xs font-bold text-gray-300 hover:text-white hover:border-indigo-500/30 transition-all active:scale-95 shadow-md"
                        >
                          <Github className="w-3.5 h-3.5" />
                          GitHub Link
                        </a>
                      </div>

                      {activeUser.bio && (
                        <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-2xl">{activeUser.bio}</p>
                      )}

                      {/* Info Metadata Badges */}
                      <div className="flex flex-wrap justify-center sm:justify-start items-center gap-y-2 gap-x-4 text-xs font-semibold text-gray-500">
                        {activeUser.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-600" />
                            {activeUser.location}
                          </span>
                        )}
                        {activeUser.company && (
                          <span className="flex items-center gap-1.5 font-medium truncate max-w-[200px]">
                            <Building2 className="w-3.5 h-3.5 text-gray-600" />
                            {activeUser.company}
                          </span>
                        )}
                        {activeUser.blog && (
                          <a 
                            href={activeUser.blog.startsWith('http') ? activeUser.blog : `https://${activeUser.blog}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-indigo-400/80 hover:text-indigo-400 truncate max-w-[200px]"
                          >
                            <LinkIcon className="w-3.5 h-3.5 text-indigo-500/60" />
                            {activeUser.blog}
                          </a>
                        )}
                        {activeUser.twitterUsername && (
                          <a 
                            href={`https://twitter.com/${activeUser.twitterUsername}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sky-400/80 hover:text-sky-400"
                          >
                            <Twitter className="w-3.5 h-3.5 text-sky-500/60" />
                            @{activeUser.twitterUsername}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section B: Key Metric Grid + Score Gauge */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Dynamic Gauge takes 1 col */}
                    <div className="md:col-span-1">
                      <ScoreVisualizer score={activeUser.developerScore} rank={activeUser.developerRank} />
                    </div>

                    {/* Quick aggregations grid takes 2 cols */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <MetricCard 
                        title="Followers count"
                        value={formatNumber(activeUser.followers)}
                        icon={<Users className="w-4 h-4" />}
                        description={`${formatNumber(activeUser.following)} following accounts`}
                        gradient="from-indigo-500 to-cyan-500"
                      />
                      <MetricCard 
                        title="Aggregated Stars"
                        value={formatNumber(activeUser.totalStars)}
                        icon={<Star className="w-4 h-4" />}
                        description={`Top repository: ${activeUser.mostStarredRepo || 'N/A'}`}
                        gradient="from-amber-500 to-orange-500"
                      />
                      <MetricCard 
                        title="Aggregated Forks"
                        value={formatNumber(activeUser.totalForks)}
                        icon={<GitFork className="w-4 h-4" />}
                        description="Cumulative codebase forks count"
                        gradient="from-emerald-500 to-teal-500"
                      />
                      <MetricCard 
                        title="Longevity age"
                        value={`${activeUser.accountAgeYears} Yrs`}
                        icon={<BookOpen className="w-4 h-4" />}
                        description={`Created on ${formatDate(activeUser.githubCreatedAt)}`}
                        gradient="from-pink-500 to-purple-500"
                      />
                    </div>

                  </div>

                  {/* Section C: Languages chart + repos table breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    
                    {/* Languages Distribution Card takes 1 col */}
                    <div className="md:col-span-1 h-full">
                      <LanguagePieChart repositories={activeUser.repositories} />
                    </div>

                    {/* Repository table search directory takes 2 cols */}
                    <div className="md:col-span-2">
                      <ReposTable repositories={activeUser.repositories} />
                    </div>

                  </div>

                </>
              ) : (
                /* Zero State: Display clean intro */
                <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-white/5 bg-[#111827]/10 backdrop-blur-md text-center max-w-xl mx-auto shadow-2xl">
                  <div className="w-16 h-16 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                    <Github className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No active developer loaded</h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-6">
                    Search a developer username in the analyzer engine above to inspect repository matrices and intelligence insights.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <Info className="w-4 h-4 text-indigo-500/80" />
                    <span>Calculations use standard weighted GitHub metrics.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Recently Analyzed Streams sidebar: Takes 1 col */}
            <div className="lg:col-span-1 space-y-6">
              <SearchHistoryList 
                history={history} 
                onSelectUser={handleAnalyzeUser}
                activeUser={activeUser}
              />
              
              {/* Feature Insight Tip */}
              <div className="rounded-xl border border-white/5 bg-indigo-500/[0.02] p-5 shadow-lg">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Formula Details</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Calculations utilize a logarithmic evaluation model capping at <strong>100 points</strong>: stars (35 pts), followers (25 pts), forks (15 pts), public repositories count (15 pts), and account age (10 pts).
                </p>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Developer Leaderboard</h2>
                <p className="text-xs text-gray-500 font-medium">Rankings of analyzed developer profiles by their score</p>
              </div>
              <Trophy className="w-8 h-8 text-amber-500" />
            </div>
            
            <Leaderboard 
              developers={leaderboard} 
              onLoadProfile={handleLoadCachedProfile} 
              onDeleteProfile={handleDeleteProfile}
              isLoading={isLeaderboardLoading}
            />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Platform Insights</h2>
                <p className="text-xs text-gray-500 font-medium">Aggregated global metrics of all developer databases</p>
              </div>
              <BarChart3 className="w-8 h-8 text-indigo-400" />
            </div>

            <PlatformStats stats={platformStats} isLoading={isStatsLoading} />
          </div>
        )}

      </main>

      {/* Beautiful SaaS Footer */}
      <footer className="border-t border-white/5 bg-[#0B0F19]/50 py-8 text-center text-xs text-gray-500 font-medium z-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Github className="w-4 h-4 text-gray-600" />
            <span>GitScope Analyzer — Powered by public GitHub APIs.</span>
          </div>
          <div>
            <span>Node.js Internship Evaluation Project — Built for high scaling.</span>
          </div>
        </div>
      </footer>

      {/* Global Toast Alert Rendering */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in fade-in duration-300">
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        </div>
      )}
    </div>
  );
}
