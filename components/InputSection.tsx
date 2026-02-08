
import React, { useRef, useState } from 'react';

interface InputSectionProps {
  onFileSelect: (file: File) => void;
  selectedFileName: string | null;
  onAnalyze: () => void;
  onClear: () => void;
  loading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ 
  onFileSelect, selectedFileName, onAnalyze, onClear, loading 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!loading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (loading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const supportedFormats = ['.mp3', '.wav', '.m4a'];
      const fileExtension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
      
      if (supportedFormats.includes(`.${fileExtension}`) || file.type.startsWith('audio/')) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto bg-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-xl backdrop-blur-sm">
      <div className="space-y-4 text-center">
        <div 
          onClick={() => !loading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`group cursor-pointer border-2 border-dashed rounded-2xl p-10 transition-all ${
            isDragging 
              ? 'border-indigo-400 bg-indigo-500/10 scale-[1.02]' 
              : selectedFileName 
                ? 'border-indigo-500/50 bg-indigo-500/5' 
                : 'border-slate-700 hover:border-slate-500 hover:bg-slate-700/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".mp3,.wav,.m4a"
            onChange={handleFileChange}
            disabled={loading}
          />
          <div className="flex flex-col items-center gap-3 pointer-events-none">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isDragging 
                ? 'bg-indigo-400 text-slate-900' 
                : selectedFileName 
                  ? 'bg-indigo-500/20 text-indigo-400' 
                  : 'bg-slate-700 text-slate-400 group-hover:scale-110'
            }`}>
              <i className={`fa-solid ${isDragging ? 'fa-arrow-down' : selectedFileName ? 'fa-check' : 'fa-upload'} text-2xl`}></i>
            </div>
            <div>
              <p className="text-slate-200 font-medium">
                {isDragging ? 'Release to Upload' : (selectedFileName || 'Upload Audio or Drag & Drop')}
              </p>
              <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">
                MP3, WAV, M4A
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
          <span className="flex items-center gap-1"><i className="fa-solid fa-clock"></i> Max 60 Minutes</span>
          <span className="flex items-center gap-1"><i className="fa-solid fa-hard-drive"></i> Max 100MB</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          {selectedFileName && !loading && (
            <button
              onClick={onClear}
              className="px-6 py-4 rounded-xl font-bold bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-trash-can"></i> Clear Project
            </button>
          )}
          
          <button
            onClick={onAnalyze}
            disabled={!selectedFileName || loading}
            className={`flex-1 sm:max-w-xs px-10 py-4 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
              (!selectedFileName || loading)
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
            }`}
          >
            {loading ? (
              <><i className="fa-solid fa-circle-notch animate-spin"></i> Generating...</>
            ) : (
              <><i className="fa-solid fa-wand-magic-sparkles"></i> Generate</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputSection;
