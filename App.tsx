import React, { useState, useCallback } from 'react';
import { ImageViewer } from './components/ImageViewer';
import { RefreshCw } from 'lucide-react';
import { useThrottle } from './hooks/useThrottle';

const App = () => {
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const throttledRefresh = useThrottle(() => {
    setRefreshKey(prev => prev + 1);
  }, 1000); // 1-second throttle

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-900 relative overflow-hidden font-sans">
      
      {/* Header / Brand */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 pointer-events-none">
        <h1 className="text-2xl font-bold tracking-tighter text-slate-800 pointer-events-auto">
          ZenPic
        </h1>
        <button 
          onClick={throttledRefresh}
          className="pointer-events-auto p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:rotate-180 active:scale-95 group border border-slate-200"
          aria-label="Refresh Image"
        >
          <RefreshCw className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl flex items-center justify-center p-4 sm:p-8">
        <ImageViewer refreshKey={refreshKey} />
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 text-slate-400 text-xs font-medium tracking-wide pointer-events-none">
        Powered by Picsum Photos
      </footer>
    </div>
  );
};

export default App;