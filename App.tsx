
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultBox from './components/ResultBox';
import NarrativeTable from './components/NarrativeTable';
// Fix: Corrected imported function name from generateNarrationClips to generateNarrativeClips
import { analyzeAudioContent, generateNarrativeClips, NarrativeClip } from './services/geminiService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_DURATION_SECONDS = 3600; // 60 minutes

const App: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [clips, setClips] = useState<NarrativeClip[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const checkDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(file);
      audio.src = objectUrl;
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(audio.duration);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(0);
      };
    });
  };

  const handleClear = () => {
    setAudioFile(null);
    setAnalysis('');
    setClips([]);
    setError(null);
  };

  const handleProcess = async () => {
    if (!audioFile) return;

    setError(null);
    setAnalysis('');
    setClips([]);
    setIsProcessing(true);

    try {
      const duration = await checkDuration(audioFile);
      if (duration > MAX_DURATION_SECONDS) {
        setError(`Audio duration (${Math.round(duration / 60)} minutes) exceeds the 60-minute limit.`);
        setIsProcessing(false);
        return;
      }

      if (audioFile.size > MAX_FILE_SIZE) {
        setError("File size is too large. Maximum 100MB.");
        setIsProcessing(false);
        return;
      }

      const base64 = await fileToBase64(audioFile);

      // Step 1: Analyze
      const analysisResult = await analyzeAudioContent(base64, audioFile.type);
      setAnalysis(analysisResult);

      // Step 2: Generate Clips (Table Data)
      // Fix: Corrected function call from generateNarrationClips to generateNarrativeClips
      const clipsResult = await generateNarrativeClips(analysisResult);
      setClips(clipsResult);

      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 300);

    } catch (err: any) {
      console.error(err);
      setError("An error occurred during processing. Please try again with a valid audio file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const exportPDF = useCallback(() => {
    if (!clips.length) return;

    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    // Title & Header
    doc.setFontSize(20);
    doc.setTextColor(63, 81, 181); // Indigo
    doc.text("Narrative Engine Plan", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${timestamp}`, 14, 28);
    doc.text(`Source: ${audioFile?.name || 'Uploaded Audio'}`, 14, 33);

    // Prepare table data
    const tableData = clips.map(clip => [
      clip.id,
      clip.narration,
      clip.highlights.join('\n\n')
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['#', 'New Narration', 'Highlights']],
      body: tableData,
      headStyles: { fillColor: [63, 81, 181], textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 110 },
        2: { cellWidth: 60 }
      },
      styles: { fontSize: 9, cellPadding: 5, overflow: 'linebreak' },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    });

    doc.save(`narrative_engine_plan_${Date.now()}.pdf`);
  }, [clips, audioFile]);

  return (
    <div className="min-h-screen bg-slate-950 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto pt-8">
        <Header />

        <InputSection 
          onFileSelect={(file) => setAudioFile(file)}
          selectedFileName={audioFile?.name || null}
          onAnalyze={handleProcess}
          onClear={handleClear}
          loading={isProcessing}
        />

        {error && (
          <div className="mt-6 max-w-2xl mx-auto bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Semantic Analysis Box */}
        <ResultBox 
          title="Content Analysis" 
          icon="fa-list-check" 
          content={analysis} 
          loading={isProcessing && !analysis}
        />

        {/* Narrative Table Result */}
        {(clips.length > 0 || (isProcessing && analysis !== '')) && (
          <div className="mt-12 space-y-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <i className="fa-solid fa-table-columns"></i>
                </div>
                <h3 className="font-semibold text-slate-200 uppercase tracking-wider text-sm">Narrative Strategy Table</h3>
              </div>
              {clips.length > 0 && (
                <button 
                  onClick={exportPDF}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                >
                  <i className="fa-solid fa-file-pdf"></i>
                  Download PDF
                </button>
              )}
            </div>
            
            <NarrativeTable clips={clips} loading={isProcessing && clips.length === 0} />
          </div>
        )}

        <footer className="mt-16 text-center text-slate-600 text-[10px] uppercase tracking-widest font-bold">
          <p>&copy; {new Date().getFullYear()} Narrative Engine • AI Powered Content Strategy</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
