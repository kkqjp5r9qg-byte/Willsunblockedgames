import React, { useState } from 'react';
import { X, Copy, Check, Download, Upload, RotateCcw, FileJson } from 'lucide-react';

export const JsonManagerModal = ({
  isOpen,
  onClose,
  games,
  onImportGames,
  onResetDefault
}) => {
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [activeTab, setActiveTab] = useState('view');

  if (!isOpen) return null;

  const jsonString = JSON.stringify(games, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleApplyImport = () => {
    setImportError('');
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        throw new Error('Root JSON element must be an array of game objects [ ... ]');
      }
      for (const item of parsed) {
        if (!item.id || !item.title || !item.iframeUrl) {
          throw new Error('Each game object requires "id", "title", and "iframeUrl".');
        }
      }
      onImportGames(parsed);
      onClose();
    } catch (err) {
      setImportError(err.message || 'Invalid JSON syntax');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result;
      setImportText(content);
      setActiveTab('import');
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileJson className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                JSON Game Library (games.json)
              </h3>
              <p className="text-xs text-slate-400">
                {games.length} total iframe games indexed in JSON configuration
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

        {/* Tab switcher */}
        <div className="px-6 pt-3 flex gap-4 border-b border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('view')}
            className={`pb-2.5 transition-colors cursor-pointer ${
              activeTab === 'view'
                ? 'text-indigo-400 border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Inspect JSON ({games.length})
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`pb-2.5 transition-colors cursor-pointer ${
              activeTab === 'import'
                ? 'text-indigo-400 border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Import / Replace JSON
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto font-mono text-xs">
          {activeTab === 'view' ? (
            <div className="relative">
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 overflow-x-auto leading-relaxed max-h-[50vh]">
                {jsonString}
              </pre>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-slate-400 font-sans">
                Paste JSON array of games below, or select a file from your computer:
              </p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='[&#10;  {&#10;    "id": "my-game",&#10;    "title": "My Game",&#10;    "category": "Arcade",&#10;    "description": "...",&#10;    "iframeUrl": "https://..."&#10;  }&#10;]'
                className="w-full h-64 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-slate-200 outline-none font-mono text-xs resize-none"
              />
              {importError && (
                <div className="text-xs text-rose-400 font-sans bg-rose-950/40 border border-rose-800/50 p-2.5 rounded-lg">
                  {importError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onResetDefault}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Reset all games to initial games.json state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>Upload File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'view' ? (
              <>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download games.json</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleApplyImport}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
              >
                <span>Save & Apply JSON</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
