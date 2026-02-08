
import React from 'react';

interface ResultBoxProps {
  title: string;
  content: string;
  icon: string;
  onAction?: () => void;
  actionLabel?: string;
  actionIcon?: string;
  onDownload?: () => void;
  loading?: boolean;
}

const ResultBox: React.FC<ResultBoxProps> = ({ 
  title, content, icon, onAction, actionLabel, actionIcon, onDownload, loading 
}) => {
  if (!content && !loading) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-slate-800/40 p-6 rounded-3xl border border-slate-700 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <i className={`fa-solid ${icon}`}></i>
          </div>
          <h3 className="font-semibold text-slate-200 uppercase tracking-wider text-sm">{title}</h3>
        </div>
        {onDownload && content && (
          <button 
            onClick={onDownload}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
            title="Download Narration"
          >
            <i className="fa-solid fa-download"></i>
          </button>
        )}
      </div>

      <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
        {loading ? (
          <div className="flex flex-col gap-2">
            <div className="h-3 w-3/4 bg-slate-700 animate-pulse rounded"></div>
            <div className="h-3 w-full bg-slate-700 animate-pulse rounded"></div>
            <div className="h-3 w-5/6 bg-slate-700 animate-pulse rounded"></div>
          </div>
        ) : (
          content || "No results yet."
        )}
      </div>

      {onAction && content && !loading && (
        <button
          onClick={onAction}
          className="mt-2 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all transform active:scale-95"
        >
          {actionIcon && <i className={`fa-solid ${actionIcon}`}></i>}
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default ResultBox;
