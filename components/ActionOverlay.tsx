import React from 'react';
import { Download, Loader2 } from 'lucide-react';

interface ActionOverlayProps {
  isDownloading: boolean;
  onDownload: (e: React.MouseEvent) => void;
  onClose: (e: React.MouseEvent) => void;
}

export const ActionOverlay: React.FC<ActionOverlayProps> = ({ isDownloading, onDownload, onClose }) => {
  return (
    <div 
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-2xl animate-in fade-in duration-200"
      onClick={onClose} 
    >
      <div 
        className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col gap-4 items-center w-4/5 max-w-xs transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the card itself
      >
        <h3 className="text-slate-800 font-bold text-lg">Nice Pick!</h3>
        <p className="text-slate-500 text-sm text-center">Would you like to keep this image?</p>
        
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Image</span>
            </>
          )}
        </button>
        
        <button 
          onClick={onClose}
          className="mt-2 text-slate-400 hover:text-slate-600 text-sm font-medium py-2 px-4 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
