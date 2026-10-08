import React, { useState } from 'react';
import { Play, Star, Bookmark, Gamepad } from 'lucide-react';

export const GameCard = ({
  game,
  onSelect,
  isFavorite,
  onToggleFavorite
}) => {
  const [imgError, setImgError] = useState(false);

  const formatPlays = (num) => {
    if (!num) return '1.2k';
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return `${num}`;
  };

  return (
    <div
      onClick={() => onSelect(game)}
      className="group relative flex flex-col bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/30"
    >
      {/* Thumbnail or Resilient Fallback Container */}
      <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
        {game.thumbnail && !imgError ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 mb-2 group-hover:scale-110 group-hover:bg-indigo-900/50 transition-all">
              <Gamepad className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-300 tracking-wide line-clamp-1">
              {game.title}
            </span>
          </div>
        )}

        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity duration-200 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 ml-0.5 fill-current" />
          </div>
        </div>

        {/* Favorite Bookmark Button */}
        <button
          onClick={(e) => onToggleFavorite(game.id, e)}
          className={`absolute top-2.5 right-2.5 p-2 rounded-lg backdrop-blur-md transition-all cursor-pointer ${
            isFavorite
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-700/50'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Custom badge indicator */}
        {game.custom && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-mono tracking-wider text-indigo-300 bg-indigo-950/80 border border-indigo-700/60 rounded">
            CUSTOM
          </div>
        )}
      </div>

      {/* Card Content & Zero-Pill Typography */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-slate-100 tracking-tight group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1.5">
          {game.title}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3 flex-1">
          {game.description}
        </p>

        {/* Unboxed Metadata Line with typographic separators */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-300">{game.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-amber-400/90 font-mono tabular-nums">
              <Star className="w-3 h-3 fill-current" />
              {game.rating?.toFixed(1) || '4.8'}
            </span>
          </div>

          <span className="font-mono tabular-nums text-slate-400 text-[11px]">
            {formatPlays(game.plays)} plays
          </span>
        </div>
      </div>
    </div>
  );
};
