
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DragDropZone from './components/DragDropZone';
import ResultsDashboard from './components/ResultsDashboard';
import LoadingScanner from './components/LoadingScanner';
import NavBar from './components/NavBar';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  // We keep selectedImage state to handle the upload view, even if we switch to mock data for result
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleScanClick = () => {
    // Reset to idle to allow scanning again
    setAppState(AppState.IDLE);
    setSelectedImage(null);
  };

  const handleFileSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);
    setAppState(AppState.SCANNING);

    // DEMO LOGIC: 
    // Instead of calling the real API, we simulate the processing steps 
    // and then load the specific "Santorini" result view requested.
    
    setTimeout(() => setAppState(AppState.ANALYZING), 1500);
    setTimeout(() => setAppState(AppState.FETCHING), 3000);
    setTimeout(() => setAppState(AppState.RESULTS), 4500);
  };

  return (
    <div className="h-[100dvh] w-screen overflow-hidden relative bg-[#020204] text-white font-sans selection:bg-purple-500/30">
      
      {/* MAIN CONTENT AREA */}
      <AnimatePresence mode="wait">
        
        {/* STATE 1: UPLOAD / IDLE */}
        {(appState === AppState.IDLE) && (
          <motion.div 
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full h-full flex flex-col"
          >
            <div className="flex-1 relative">
               <DragDropZone onFileSelect={handleFileSelect} />
            </div>
          </motion.div>
        )}

        {/* STATE 2: LOADING */}
        {(appState === AppState.SCANNING || appState === AppState.ANALYZING || appState === AppState.FETCHING) && (
           <motion.div
             key="loading"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-xl"
           >
             {selectedImage && (
               <img src={selectedImage} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="bg" />
             )}
             <LoadingScanner currentState={appState} />
           </motion.div>
        )}

        {/* STATE 3: RESULTS (The New UI) */}
        {appState === AppState.RESULTS && (
          <motion.div 
            key="results"
            className="w-full h-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "circOut" }}
          >
            <ResultsDashboard />
          </motion.div>
        )}

      </AnimatePresence>

      {/* NAVIGATION DOCK */}
      <NavBar onScanClick={handleScanClick} />
      
    </div>
  );
};

export default App;
