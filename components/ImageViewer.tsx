import React, { useState, useCallback } from 'react';
import { Maximize2, Loader2 } from 'lucide-react';
import { useImage } from '../hooks/useImage';
import { ActionOverlay } from './ActionOverlay';
import { fetchImageBlob } from '../services/imageService';

interface ImageViewerProps {
  refreshKey: number;
}

export const ImageViewer = ({ refreshKey }: ImageViewerProps) => {
  const { loading, imageUrl } = useImage(refreshKey);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleImageClick = useCallback(() => {
    if (!loading) {
      setShowOverlay(true);
    }
  }, [loading]);

  const handleCloseOverlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOverlay(false);
  }, []);

  const handleDownload = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!imageUrl || isDownloading) return;

    setIsDownloading(true);
    try {
      const blob = await fetchImageBlob(imageUrl);
      const objectUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = objectUrl;
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `zenpic-${timestamp}.jpg`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);

    } catch (error) {
      console.error("Failed to download image", error);
      alert("Failed to download image. Please try again.");
    } finally {
      setIsDownloading(false);
      setShowOverlay(false);
    }
  }, [imageUrl, isDownloading]);

  return (
    <div className="relative group w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-[70vh] sm:h-[80vh] flex items-center justify-center">
      
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm z-20">
          <Loader2 className="w-10 h-10 text-slate-400 animate-spin mb-4" />
          <p className="text-slate-500 font-medium text-sm tracking-widest uppercase">Loading Visual</p>
        </div>
      )}

      {!loading && imageUrl && (
        <div 
          className={`
            relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer 
            transition-all duration-500 ease-out transform
            ${showOverlay ? 'scale-[1.02] ring-4 ring-slate-200/50' : 'hover:scale-[1.01] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]'}
          `}
          onClick={handleImageClick}
        >
          <img 
            src={imageUrl} 
            alt="Random from Picsum" 
            className="w-full h-full object-cover pointer-events-none select-none"
          />

          <div className={`
            absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium 
            flex items-center gap-2 transition-opacity duration-300 pointer-events-none
            ${showOverlay ? 'opacity-0' : 'opacity-0 md:group-hover:opacity-100'}
          `}>
            <Maximize2 className="w-3 h-3" />
            <span>Click to interact</span>
          </div>
        </div>
      )}

      {showOverlay && (
        <ActionOverlay 
          isDownloading={isDownloading}
          onDownload={handleDownload}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  );
};
