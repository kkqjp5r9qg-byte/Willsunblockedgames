import React from 'react';
import { Shield, EyeOff, FileCode2, PlusCircle, Gamepad2 } from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenJsonModal,
  onOpenCloakModal,
  onTriggerPanic,
  panicKeyName,
  activeCloak
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('all')}
          className="flex items-center gap-2.5 text-left text-slate-100 font-bold text-lg tracking-tight hover:text-white transition-colors cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <span className="font-semibold tracking-normal text-slate-100">Nova Arcade Hub</span>
        </button>

        {/* Zone 2: 4-6 text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('all')}
            className={`transition-colors cursor-pointer hover:text-slate-100 ${
              activeTab === 'all' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`transition-colors cursor-pointer hover:text-slate-100 ${
              activeTab === 'featured' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            Featured
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`transition-colors cursor-pointer hover:text-slate-100 ${
              activeTab === 'favorites' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            Favorites
          </button>
          <button
            onClick={onOpenJsonModal}
            className="flex items-center gap-1.5 transition-colors cursor-pointer hover:text-slate-100"
            title="Inspect games.json data file"
          >
            <FileCode2 className="w-4 h-4 text-slate-500" />
            <span>JSON Library</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 transition-colors cursor-pointer hover:text-slate-100 text-indigo-400"
            title="Add a custom game via iframe"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Game</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCloakModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/70 rounded-lg transition-colors cursor-pointer"
            title="Disguise browser tab"
          >
            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">
              {activeCloak === 'default' ? 'Tab Cloaker' : 'Cloaked'}
            </span>
          </button>

          <button
            onClick={onTriggerPanic}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-200 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/80 rounded-lg transition-colors cursor-pointer shadow-sm"
            title={`Panic stealth switch (Hot-key: ${panicKeyName})`}
          >
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            <span>Panic</span>
            <kbd className="hidden sm:inline ml-1 px-1.5 py-0.2 text-[10px] font-mono bg-rose-900/90 text-rose-200 rounded border border-rose-700">
              {panicKeyName}
            </kbd>
          </button>
        </div>

      </div>
    </header>
  );
};
