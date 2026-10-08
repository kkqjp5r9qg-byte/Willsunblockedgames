import React, { useState } from 'react';
import { Eye, FileText, Undo, Redo, Printer, Bold, Italic, Underline } from 'lucide-react';

export const FakeDisguiseScreen = ({
  onDismiss,
  panicKeyName
}) => {
  const [docContent, setDocContent] = useState(`Chapter 7: The Industrial Revolution & Urbanization (1750–1900)

1. Key Technological Transformations
- The steam engine (James Watt, 1776) revolutionized textile manufacturing and railway transport.
- Transition from agrarian feudal economies to mechanized manufacturing clusters in Great Britain, Ruhr Valley, and the American Rust Belt.
- Expansion of Bessemer steel converter drastically lowered transportation infrastructure overhead.

2. Social and Demographic Impacts
- Rapid population migration from rural villages to dense industrial metropolitan centers (Manchester, Birmingham, Chicago).
- Emergence of distinct social strata: Industrial Bourgeoisie versus working-class Proletariat.
- Early labor organizations, Factory Acts of 1833 regulating juvenile labor hours.

3. Homework Checklist for Thursday:
[x] Read pages 142–158 in textbook
[x] Answer Chapter Review Questions #1 through #8
[ ] Complete DBQ rough draft on child labor primary sources
[ ] Prepare for Friday map quiz on European trade corridors`);

  return (
    <div className="fixed inset-0 z-50 bg-[#f8f9fa] text-[#202124] flex flex-col font-sans select-text">
      {/* Google Docs Style Header */}
      <div className="bg-white border-b border-[#dadce0] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#4285f4] flex items-center justify-center text-white font-bold text-xl shadow-sm">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#202124]">
                World History Study Guide & Notes - Unit 4
              </span>
              <span className="text-[11px] text-[#5f6368] font-normal">
                Saved to Drive
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#5f6368] mt-0.5">
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Insert</span>
              <span>Format</span>
              <span>Tools</span>
              <span>Extensions</span>
              <span>Help</span>
            </div>
          </div>
        </div>

        {/* Secret exit stealth button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onDismiss}
            className="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            title={`Exit stealth disguise (Or press ${panicKeyName})`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Return to Games ({panicKeyName})</span>
          </button>
        </div>
      </div>

      {/* Docs Toolbar */}
      <div className="bg-[#edf2fc] border-b border-[#dadce0] px-4 py-1.5 flex items-center gap-3 text-[#444746] text-xs">
        <Undo className="w-3.5 h-3.5 cursor-pointer" />
        <Redo className="w-3.5 h-3.5 cursor-pointer" />
        <Printer className="w-3.5 h-3.5 cursor-pointer" />
        <div className="h-4 w-[1px] bg-[#dadce0]"></div>
        <span className="px-2 py-0.5 bg-white border border-[#dadce0] rounded">100%</span>
        <div className="h-4 w-[1px] bg-[#dadce0]"></div>
        <span className="px-2 py-0.5 bg-white border border-[#dadce0] rounded font-serif">Times New Roman</span>
        <span className="px-2 py-0.5 bg-white border border-[#dadce0] rounded">12</span>
        <div className="h-4 w-[1px] bg-[#dadce0]"></div>
        <Bold className="w-3.5 h-3.5 cursor-pointer font-bold" />
        <Italic className="w-3.5 h-3.5 cursor-pointer" />
        <Underline className="w-3.5 h-3.5 cursor-pointer" />
      </div>

      {/* Document Page Area */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#f0f4f9]">
        <div className="w-full max-w-[850px] min-h-[900px] bg-white shadow-md p-14 rounded-sm border border-[#dadce0]">
          <textarea
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            className="w-full h-full min-h-[750px] outline-none resize-none font-serif text-[15px] leading-relaxed text-[#202124] bg-transparent border-none"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};
