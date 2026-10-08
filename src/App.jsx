import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Gamepad2,
  Shuffle,
  FileCode2,
  SlidersHorizontal,
  Clock
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { JsonManagerModal } from './components/JsonManagerModal';
import { AddGameModal } from './components/AddGameModal';
import { CloakModal, PRESETS } from './components/CloakModal';
import { FakeDisguiseScreen } from './components/FakeDisguiseScreen';

const STORAGE_GAMES_KEY = 'nova_games_catalog';
const STORAGE_FAVORITES_KEY = 'nova_favorites';
const STORAGE_RECENT_KEY = 'nova_recent';
const STORAGE_CLOAK_KEY = 'nova_cloak';
const STORAGE_PANIC_KEY = 'nova_panic_hotkey';
const STORAGE_PANIC_ACTION = 'nova_panic_action';
const STORAGE_PANIC_URL = 'nova_panic_url';

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [activeGame, setActiveGame] = useState(null);

  // Favorites & History
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_RECENT_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Cloaking & Panic settings
  const [activeCloak, setActiveCloak] = useState(() => {
    return localStorage.getItem(STORAGE_CLOAK_KEY) || 'default';
  });

  const [panicKey, setPanicKey] = useState(() => {
    return localStorage.getItem(STORAGE_PANIC_KEY) || 'Escape';
  });

  const [panicAction, setPanicAction] = useState(() => {
    return localStorage.getItem(STORAGE_PANIC_ACTION) || 'disguise';
  });

  const [panicUrl, setPanicUrl] = useState(() => {
    return localStorage.getItem(STORAGE_PANIC_URL) || 'https://classroom.google.com';
  });

  const [isDisguiseActive, setIsDisguiseActive] = useState(false);

  // Modals
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);

  // Load games from public/games.json or localStorage
  useEffect(() => {
    const loadGames = async () => {
      try {
        const cached = localStorage.getItem(STORAGE_GAMES_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setGames(parsed);
            setLoading(false);
            return;
          }
        }

        const res = await fetch('/games.json');
        if (res.ok) {
          const data = await res.json();
          setGames(data);
          localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(data));
        }
      } catch (err) {
        console.error('Failed to load games.json:', err);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  // Check URL query parameters for direct game link
  useEffect(() => {
    if (games.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('game');
    if (gameId) {
      const found = games.find((g) => g.id === gameId);
      if (found) {
        handleSelectGame(found);
      }
    }
  }, [games]);

  // Apply tab cloak title & favicon dynamically
  useEffect(() => {
    const preset = PRESETS.find((p) => p.id === activeCloak) || PRESETS[0];
    document.title = preset.title;

    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = preset.favicon;
    localStorage.setItem(STORAGE_CLOAK_KEY, activeCloak);
  }, [activeCloak]);

  // Panic hotkey listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === panicKey) {
        e.preventDefault();
        triggerPanic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panicKey, panicAction, panicUrl, isDisguiseActive]);

  const triggerPanic = () => {
    if (panicAction === 'redirect') {
      window.location.href = panicUrl;
    } else {
      setIsDisguiseActive((prev) => !prev);
    }
  };

  const handleSelectGame = (game) => {
    setActiveGame(game);
    // increment local plays counter
    setGames((prev) => {
      const updated = prev.map((g) =>
        g.id === game.id ? { ...g, plays: (g.plays || 0) + 1 } : g
      );
      localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(updated));
      return updated;
    });

    // update recent history
    setRecentlyPlayed((prev) => {
      const next = [game.id, ...prev.filter((id) => id !== game.id)].slice(0, 8);
      localStorage.setItem(STORAGE_RECENT_KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleAddGame = (newGame) => {
    setGames((prev) => {
      const updated = [newGame, ...prev];
      localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(updated));
      return updated;
    });
    handleSelectGame(newGame);
  };

  const handleImportGames = (imported) => {
    setGames(imported);
    localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(imported));
  };

  const handleResetDefault = async () => {
    try {
      const res = await fetch('/games.json');
      if (res.ok) {
        const data = await res.json();
        setGames(data);
        localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(data));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSurpriseMe = () => {
    if (games.length === 0) return;
    const randomGame = games[Math.floor(Math.random() * games.length)];
    handleSelectGame(randomGame);
  };

  // Derive categories
  const categories = useMemo(() => {
    const set = new Set();
    games.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return ['All', ...Array.from(set)];
  }, [games]);

  // Filtered games
  const filteredGames = useMemo(() => {
    return games
      .filter((g) => {
        // Tab filter
        if (activeTab === 'featured' && !g.featured) return false;
        if (activeTab === 'favorites' && !favorites.includes(g.id)) return false;

        // Category filter
        if (selectedCategory !== 'All' && g.category !== selectedCategory) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = g.title.toLowerCase().includes(q);
          const matchDesc = g.description.toLowerCase().includes(q);
          const matchCat = g.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.plays || 0) - (a.plays || 0);
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [games, activeTab, selectedCategory, searchQuery, sortBy, favorites]);

  // Recently played game objects
  const recentGameItems = useMemo(() => {
    return recentlyPlayed
      .map((id) => games.find((g) => g.id === id))
      .filter((g) => Boolean(g));
  }, [games, recentlyPlayed]);

  const panicKeyDisplay =
    panicKey === 'Escape'
      ? 'Esc'
      : panicKey === 'Backquote'
      ? '~'
      : panicKey.replace('Key', '');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Fake Disguise Stealth Screen when panic triggered */}
      {isDisguiseActive && (
        <FakeDisguiseScreen
          onDismiss={() => setIsDisguiseActive(false)}
          panicKeyName={panicKeyDisplay}
        />
      )}

      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedCategory('All');
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onTriggerPanic={triggerPanic}
        panicKeyName={panicKeyDisplay}
        activeCloak={activeCloak}
      />

      {/* Active Game Player Modal / Stage */}
      {activeGame && (
        <GamePlayer
          game={activeGame}
          onClose={() => setActiveGame(null)}
          isFavorite={favorites.includes(activeGame.id)}
          onToggleFavorite={toggleFavorite}
          allGames={games}
          onSelectGame={handleSelectGame}
        />
      )}

      {/* Main Content Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        
        {/* Hero Section */}
        {activeTab === 'all' && !searchQuery && (
          <section className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="absolute inset-0">
              <img
                src="/src/assets/images/hero_arcade_hub_1791463710981.jpg"
                alt="Arcade Lounge"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-25 filter brightness-75 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
            </div>

            <div className="relative p-6 sm:p-10 md:p-12 max-w-2xl flex flex-col">
              <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                Fast · Lightweight · JSON-Driven
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
                Unblocked Arcade & Retro Games Hub
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                Instant-loading HTML5 games running inside sandboxed iframes configured via <code className="text-indigo-300 font-mono text-xs bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700">games.json</code>. Includes stealth tab cloaking, custom iframe embedding, and panic hotkey protection.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleSurpriseMe}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all cursor-pointer shadow-lg shadow-indigo-950/50 hover:shadow-indigo-600/20"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Surprise Me / Random Game</span>
                </button>

                <button
                  onClick={() => setIsJsonModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
                >
                  <FileCode2 className="w-4 h-4 text-slate-400" />
                  <span>Inspect games.json</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Recently Played Bar (if any) */}
        {recentGameItems.length > 0 && activeTab === 'all' && !searchQuery && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recently Played</span>
            </div>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {recentGameItems.map((game) => (
                <button
                  key={`recent-${game.id}`}
                  onClick={() => handleSelectGame(game)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-all shrink-0 cursor-pointer group"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span>{game.title}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Search & Filter Toolbar */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games, arcade tags, or categories..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </section>

        {/* Game Catalog Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">
                {activeTab === 'featured'
                  ? 'Featured Arcade Titles'
                  : activeTab === 'favorites'
                  ? 'Your Bookmarked Favorites'
                  : selectedCategory === 'All'
                  ? 'All Games Library'
                  : `${selectedCategory} Games`}
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                ({filteredGames.length} games)
              </span>
            </div>

            {activeTab === 'favorites' && favorites.length > 0 && (
              <button
                onClick={() => {
                  setFavorites([]);
                  localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify([]));
                }}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Clear all favorites
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-500 text-xs font-mono uppercase tracking-widest">
              Loading Games Library...
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-200">No Games Found</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeTab === 'favorites'
                  ? "You haven't bookmarked any games yet. Click the bookmark icon on any game card to save it here!"
                  : `No games match the current query "${searchQuery}". Try a different keyword or category.`}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  Reset Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onSelect={handleSelectGame}
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Clean Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-400">Nova Unblocked Games Hub</span>
            <span aria-hidden="true">·</span>
            <span>All games stored in <code className="text-slate-400 font-mono">public/games.json</code></span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              View JSON Schema
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsCloakModalOpen(true)}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Tab Cloaker
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Add Custom Iframe
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <JsonManagerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onImportGames={handleImportGames}
        onResetDefault={handleResetDefault}
      />

      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <CloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
        activeCloak={activeCloak}
        onSelectCloak={(preset) => {
          setActiveCloak(preset);
          setIsCloakModalOpen(false);
        }}
        panicKey={panicKey}
        onChangePanicKey={(k) => {
          setPanicKey(k);
          localStorage.setItem(STORAGE_PANIC_KEY, k);
        }}
        panicAction={panicAction}
        onChangePanicAction={(act) => {
          setPanicAction(act);
          localStorage.setItem(STORAGE_PANIC_ACTION, act);
        }}
        panicUrl={panicUrl}
        onChangePanicUrl={(url) => {
          setPanicUrl(url);
          localStorage.setItem(STORAGE_PANIC_URL, url);
        }}
      />
    </div>
  );
}
