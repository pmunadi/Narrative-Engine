
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
      const supportedFormats = ['.mp3', '.wav', '.m4a', '.mp4', '.mov', '.avi', '.webm', '.mkv'];
      const fileExtension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
      const isSupportedType = file.type.startsWith('audio/') || file.type.startsWith('video/');
      
      if (supportedFormats.includes(`.${fileExtension}`) || isSupportedType) {
        onFileSelect(file);
      }
    }
  };

  const triggerUpload = (type: 'video' | 'audio') => {
    if (loading) return;
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'video' ? 'video/*' : 'audio/*';
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative space-y-6 w-full max-w-2xl mx-auto bg-slate-800/50 p-6 rounded-3xl border-2 transition-all duration-300 shadow-xl backdrop-blur-sm ${
        isDragging 
          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02] ring-4 ring-indigo-500/20' 
          : 'border-slate-700'
      }`}
    >
      {/* Drag overlay hint */}
      {isDragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl pointer-events-none">
          <div className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 animate-bounce">
            <i className="fa-solid fa-cloud-arrow-up"></i>
            Lepaskan untuk Unggah
          </div>
        </div>
      )}

      <div className="space-y-4">
        {!selectedFileName ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => triggerUpload('video')}
              disabled={loading}
              className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all text-center"
            >
              <div className="w-14 h-14 rounded-full bg-slate-700 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 flex items-center justify-center transition-all">
                <i className="fa-solid fa-video text-xl"></i>
              </div>
              <div>
                <p className="text-slate-200 font-bold text-sm uppercase tracking-wider">Unggah Video</p>
                <p className="text-slate-500 text-xs mt-1">Seret video ke sini atau klik</p>
              </div>
            </button>

            <button
              onClick={() => triggerUpload('audio')}
              disabled={loading}
              className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-cyan-500 hover:bg-cyan-500/5 transition-all text-center"
            >
              <div className="w-14 h-14 rounded-full bg-slate-700 text-slate-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 flex items-center justify-center transition-all">
                <i className="fa-solid fa-microphone-lines text-xl"></i>
              </div>
              <div>
                <p className="text-slate-200 font-bold text-sm uppercase tracking-wider">Unggah Audio</p>
                <p className="text-slate-500 text-xs mt-1">Seret audio ke sini atau klik</p>
              </div>
            </button>
          </div>
        ) : (
          <div 
            className={`border-2 border-dashed rounded-2xl p-10 transition-all border-indigo-500/50 bg-indigo-500/5 text-center`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <i className={`fa-solid ${selectedFileName.toLowerCase().match(/\.(mp4|mov|avi|webm|mkv)$/) ? 'fa-video' : 'fa-check'} text-2xl`}></i>
              </div>
              <div>
                <p className="text-slate-200 font-medium break-all px-4">{selectedFileName}</p>
                <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest font-bold">File Terpilih</p>
              </div>
            </div>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          disabled={loading}
        />
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
              <i className="fa-solid fa-trash-can"></i> Ganti File
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
              <><i className="fa-solid fa-circle-notch animate-spin"></i> Memproses...</>
            ) : (
              <><i className="fa-solid fa-wand-magic-sparkles"></i> Generate Narasi</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputSection;
