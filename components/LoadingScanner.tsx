import React from 'react';
import { motion } from 'framer-motion';
import { AppState } from '../types';

interface LoadingScannerProps {
  currentState: AppState;
}

const LoadingScanner: React.FC<LoadingScannerProps> = ({ currentState }) => {
  const messages = {
    [AppState.SCANNING]: "Dreaming up location...",
    [AppState.ANALYZING]: "Reading energy aura...",
    [AppState.FETCHING]: "Manifesting reality...",
    [AppState.IDLE]: "",
    [AppState.RESULTS]: ""
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      
      {/* Dream Orb */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Core */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-white"
          animate={{ scale: [0.8, 1, 0.8], opacity: [0.8, 0.4, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: 'blur(20px)' }}
        />
        
        {/* Ring 1 */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-purple-500/30"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Ring 2 */}
        <motion.div 
          className="absolute inset-4 rounded-full border border-blue-400/30"
          animate={{ rotate: -360, scale: [1, 0.9, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="text-center space-y-2">
        <h3 className="font-display font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          {messages[currentState] || "Processing"}
        </h3>
        <p className="text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
           Please Wait
        </p>
      </div>
    </div>
  );
};

export default LoadingScanner;