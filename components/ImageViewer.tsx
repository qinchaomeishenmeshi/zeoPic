import React, { useState, useEffect, useCallback } from 'react';
import { Download, X, Loader2, Maximize2 } from 'lucide-react';
import { fetchImageBlob, generatePicsumUrl } from '../services/imageService';

export const ImageViewer: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  
  // Dimensions for the requested image - logical resolution
  // We request a square-ish aspect ratio that looks good on both mobile and desktop
  // or a slightly portrait one since mobile is primary.
  const TARGET_WIDTH = 1200;
  const TARGET_HEIGHT = 1600;

  useEffect(() => {
    let isMounted = true;
    
    const loadNewImage = () => {
      setLoading(true);
      setShowOverlay(false);
      // Generate a new URL with a random seed to prevent caching
      const url = generatePicsumUrl(TARGET_WIDTH, TARGET_HEIGHT);
      
      // Preload image to avoid showing it while rendering chunks
      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (isMounted) {
          setImageUrl(url);
          setLoading(false);
        }
      };
    };

    loadNewImage();

    return () => {
      isMounted = false;
    };
  }, []);

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
      await fetchImageBlob(imageUrl);
    } catch (error) {
      console.error("Failed to download image", error);
      alert("Failed to download image. Please try again.");
    } finally {
      setIsDownloading(false);
      setShowOverlay(false); // Optional: close overlay after download starts
    }
  }, [imageUrl, isDownloading]);

  return (
    <div className="relative group w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-[70vh] sm:h-[80vh] flex items-center justify-center">
      
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm z-20">
          <Loader2 className="w-10 h-10 text-slate-400 animate-spin mb-4" />
          <p className="text-slate-500 font-medium text-sm tracking-widest uppercase">Loading Visual</p>
        </div>
      )}

      {/* Image Container */}
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

          {/* Prompt Hint (Only visible when not overlayed and on desktop hover) */}
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

      {/* Action Overlay / Modal */}
      {showOverlay && (
        <div 
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-2xl animate-in fade-in duration-200"
          onClick={handleCloseOverlay} 
        >
          <div 
            className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col gap-4 items-center w-4/5 max-w-xs transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the card itself
          >
            <h3 className="text-slate-800 font-bold text-lg">Nice Pick!</h3>
            <p className="text-slate-500 text-sm text-center">Would you like to keep this image?</p>
            
            <button
              onClick={handleDownload}
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
              onClick={handleCloseOverlay}
              className="mt-2 text-slate-400 hover:text-slate-600 text-sm font-medium py-2 px-4 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};