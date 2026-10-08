import React, { useState } from 'react';
import { X, Plus, Gamepad } from 'lucide-react';

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [rawInput, setRawInput] = useState('');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Game title is required.');
      return;
    }

    if (!rawInput.trim()) {
      setError('Iframe URL or embed code is required.');
      return;
    }

    // Extract src from raw input if user pasted an entire iframe tag
    let finalUrl = rawInput.trim();
    if (finalUrl.includes('<iframe') && finalUrl.includes('src=')) {
      const match = finalUrl.match(/src=["'](.*?)["']/);
      if (match && match[1]) {
        finalUrl = match[1];
      }
    }

    const newGame = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category: category.trim() || 'Custom',
      description: description.trim() || 'Custom user-added game in iframe.',
      iframeUrl: finalUrl,
      iframeSandbox: 'allow-scripts allow-same-origin allow-forms',
      controls: controls.trim() || 'Mouse and keyboard controls',
      plays: 1,
      rating: 5.0,
      featured: false,
      author: author.trim() || 'Community Addition',
      custom: true
    };

    onAddGame(newGame);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Gamepad className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Add Custom Game (Iframe)
              </h3>
              <p className="text-xs text-slate-400">
                Embed any web game or HTML5 URL into your hub
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="text-xs text-rose-400 bg-rose-950/50 border border-rose-800/60 p-2.5 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Game Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Slope 3D or Slope Racing"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-slate-200 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Iframe Embed URL or Tag *
            </label>
            <textarea
              required
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder='https://example.com/game or &lt;iframe src="https://..."&gt;&lt;/iframe&gt;'
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-200 outline-none transition-colors resize-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Tip: Supports direct HTML5 URLs, Scratch game embeds, or web game mirrors.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
              >
                <option value="Arcade">Arcade</option>
                <option value="Action">Action</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Classic">Classic</option>
                <option value="Casual">Casual</option>
                <option value="Sports">Sports</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Author / Studio
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Developer name"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Controls / How to Play
            </label>
            <input
              type="text"
              value={controls}
              onChange={(e) => setControls(e.target.value)}
              placeholder="e.g. Arrow keys to steer, Space to brake"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-xs text-slate-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Quick 1-2 sentence description..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-xs text-slate-200 outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Games List</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
