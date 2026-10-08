import React from 'react';
import { X, EyeOff, Shield, Check } from 'lucide-react';

export const PRESETS = [
  {
    id: 'default',
    name: 'Normal (Nova Arcade)',
    title: 'Nova Unblocked Games Hub',
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'><path d='M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'/></svg>",
    desc: 'Default gaming portal branding and tab title'
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png',
    desc: 'Disguises tab as Google Classroom assignments view'
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
    desc: 'Disguises tab as your Google Drive cloud storage folder'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
    desc: 'Disguises tab as an open Google Docs essay document'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard - Canvas',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
    desc: 'Disguises tab as school Canvas student dashboard'
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'World War II - Wikipedia',
    favicon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
    desc: 'Disguises tab as an educational research article'
  }
];

export const CloakModal = ({
  isOpen,
  onClose,
  activeCloak,
  onSelectCloak,
  panicKey,
  onChangePanicKey,
  panicAction,
  onChangePanicAction,
  panicUrl,
  onChangePanicUrl
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <EyeOff className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Tab Cloaking & Panic Stealth
              </h3>
              <p className="text-xs text-slate-400">
                Disguise tab title and icon from teacher and parent screens
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Tab Cloaker Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Select Tab Disguise Preset
            </label>
            <div className="space-y-2">
              {PRESETS.map((p) => {
                const isSelected = activeCloak === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectCloak(p.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 text-slate-100'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-2">
                        <span>{p.name}</span>
                        {isSelected && (
                          <span className="text-[10px] text-indigo-400 font-mono">ACTIVE</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        "{p.title}"
                      </div>
                    </div>
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panic Key Settings */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <Shield className="w-4 h-4 text-rose-400" />
              <span>Panic Button Configuration</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Trigger Hotkey
                </label>
                <select
                  value={panicKey}
                  onChange={(e) => onChangePanicKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
                >
                  <option value="Escape">Escape (Esc)</option>
                  <option value="Backquote">Tilde ( ~ / ` )</option>
                  <option value="KeyQ">Letter Q</option>
                  <option value="KeyP">Letter P</option>
                  <option value="Digit1">Number 1</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Panic Action
                </label>
                <select
                  value={panicAction}
                  onChange={(e) => onChangePanicAction(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
                >
                  <option value="disguise">Fake Study Notes (In-App)</option>
                  <option value="redirect">Redirect to External Site</option>
                </select>
              </div>
            </div>

            {panicAction === 'redirect' && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Panic Redirect URL
                </label>
                <input
                  type="url"
                  value={panicUrl}
                  onChange={(e) => onChangePanicUrl(e.target.value)}
                  placeholder="https://classroom.google.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
