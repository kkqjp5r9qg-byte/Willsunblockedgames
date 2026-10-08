import React, { useRef, useState, useEffect } from 'react';
import {
  Maximize2,
  Minimize2,
  RotateCw,
  ExternalLink,
  Bookmark,
  Share2,
  X,
  Keyboard,
  Info,
  Sliders,
  Check,
  Eye,
  Tv
} from 'lucide-react';

export const GamePlayer = ({
  game,
  onClose,
  isFavorite,
  onToggleFavorite,
  allGames,
  onSelectGame
}) => {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fullscreen listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error("Exit fullscreen error:", err);
      });
    }
  };

  const reloadIframe = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = 'about:blank';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 50);
    }
  };

  // Iconic unblocked game feature: Open in about:blank cloaked window
  const openAboutBlank = () => {
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert('Popup blocker prevented opening the cloaked window. Please allow popups.');
      return;
    }
    const doc = win.document;
    doc.title = 'Classes'; // Cloaked tab title
    const link = doc.createElement('link');
    link.rel = 'icon';
    link.href = 'https://ssl.gstatic.com/classroom/favicon.png';
    doc.head.appendChild(link);

    const style = doc.createElement('style');
    style.textContent = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body, html { width: 100%; height: 100%; overflow: hidden; background: #000; }
      iframe { width: 100%; height: 100%; border: none; display: block; }
    `;
    doc.head.appendChild(style);

    const ifr = doc.createElement('iframe');
    ifr.src = game.iframeUrl.startsWith('/')
      ? window.location.origin + game.iframeUrl
      : game.iframeUrl;
    ifr.allow = 'fullscreen; autoplay; gamepad; focus-without-user-activation *';
    doc.body.appendChild(ifr);
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}/?game=${game.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Up next games (exclude current)
  const upNextGames = allGames
    .filter(g => g.id !== game.id)
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-y-auto flex flex-col p-2 sm:p-4 md:p-6 animate-fade-in">
      <div
        className={`mx-auto w-full transition-all duration-300 flex flex-col gap-4 ${
          isTheater ? 'max-w-[96vw]' : 'max-w-5xl'
        }`}
      >
        {/* Top Control Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Close game player"
            >
              <X className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>{game.title}</span>
                <span className="text-xs text-slate-400 font-normal hidden sm:inline">
                  · {game.category}
                </span>
              </h2>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={reloadIframe}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Restart / Reload game"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsTheater(!isTheater)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isTheater
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700'
              }`}
              title="Toggle Theater Mode"
            >
              <Tv className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={openAboutBlank}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Open in about:blank disguise tab"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cloaked Window</span>
            </button>

            <button
              onClick={(e) => onToggleFavorite(game.id, e)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700'
              }`}
              title="Save to favorites"
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={copyShareLink}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Share link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Iframe Stage */}
        <div
          ref={containerRef}
          className="relative w-full aspect-[16/10] min-h-[460px] md:min-h-[560px] bg-black border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center"
        >
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-3 z-10">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Loading Game Frame...
              </span>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={game.iframeUrl}
            title={game.title}
            sandbox={game.iframeSandbox || "allow-scripts allow-same-origin allow-forms"}
            allow="fullscreen; autoplay; gamepad; focus-without-user-activation *"
            onLoad={() => setIsLoading(false)}
            className="w-full h-full border-none block"
          />
        </div>

        {/* Game Info & Controls Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Controls Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold uppercase tracking-wider">
              <Keyboard className="w-4 h-4 text-indigo-400" />
              <span>How To Play / Controls</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              {game.controls || "Use Keyboard arrows and mouse clicks to interact."}
            </p>
          </div>

          {/* Description Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold uppercase tracking-wider">
              <Info className="w-4 h-4 text-sky-400" />
              <span>About {game.title}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {game.description}
            </p>
            {game.author && (
              <div className="text-[11px] text-slate-400 pt-1 mt-auto">
                Author / Engine: <span className="text-slate-300">{game.author}</span>
              </div>
            )}
          </div>

          {/* Iframe Specs Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Iframe Security Sandbox</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 space-y-1">
              <div>Source: <span className="text-slate-300 break-all">{game.iframeUrl}</span></div>
              <div>Sandbox: <span className="text-slate-300">{game.iframeSandbox || 'allow-scripts allow-same-origin'}</span></div>
            </div>
            <a
              href={game.iframeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-auto flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors pt-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Raw Source in New Tab</span>
            </a>
          </div>
        </div>

        {/* Up Next / Recommended */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Up Next In Arcade
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {upNextGames.map(nextGame => (
              <button
                key={nextGame.id}
                onClick={() => onSelectGame(nextGame)}
                className="flex flex-col text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
              >
                <div className="font-semibold text-xs text-slate-200 group-hover:text-indigo-400 line-clamp-1">
                  {nextGame.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {nextGame.category}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
