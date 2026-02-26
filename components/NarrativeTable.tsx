
import React from 'react';
import { NarrativeClip } from '../services/geminiService';

interface NarrativeTableProps {
  clips: NarrativeClip[];
  loading?: boolean;
}

const NarrativeTable: React.FC<NarrativeTableProps> = ({ clips, loading }) => {
  if (!clips.length && !loading) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-slate-800/40 p-1 rounded-3xl border border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-900/50">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-indigo-400 border-b border-slate-700">#</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-indigo-400 border-b border-slate-700">New Narration</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-indigo-400 border-b border-slate-700">Description</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-indigo-400 border-b border-slate-700">Highlights</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-8"><div className="h-4 w-4 bg-slate-700 rounded"></div></td>
                  <td className="px-6 py-8"><div className="space-y-2"><div className="h-4 w-full bg-slate-700 rounded"></div><div className="h-4 w-5/6 bg-slate-700 rounded"></div></div></td>
                  <td className="px-6 py-8"><div className="space-y-2"><div className="h-4 w-full bg-slate-700 rounded"></div><div className="h-4 w-5/6 bg-slate-700 rounded"></div></div></td>
                  <td className="px-6 py-8"><div className="space-y-2"><div className="h-3 w-1/2 bg-slate-700 rounded"></div><div className="h-3 w-1/3 bg-slate-700 rounded"></div></div></td>
                </tr>
              ))
            ) : (
              clips.map((clip) => (
                <tr key={clip.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-6 align-top text-slate-500 font-mono font-bold text-sm">
                    {String(clip.id).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-6 align-top">
                    <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                       {clip.narration}
                    </div>
                  </td>
                  <td className="px-6 py-6 align-top">
                    <div className="text-slate-400 text-xs italic leading-relaxed">
                      {clip.description}
                    </div>
                  </td>
                  <td className="px-6 py-6 align-top">
                    <ul className="space-y-2">
                      {clip.highlights.map((h, idx) => (
                        <li key={idx} className="text-cyan-400/90 text-xs font-medium border-l-2 border-indigo-500/30 pl-3">
                          {h}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NarrativeTable;
