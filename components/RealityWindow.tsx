
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, AlertTriangle, Scan, Globe2, CheckCircle, Scale } from 'lucide-react';
import { MockScenario } from '../types';

interface RealityWindowProps {
  scenario: MockScenario;
}

// Mock AI Analysis Helper (Simulating SerpApi + Computer Vision)
const getVibeAnalysis = (scenarioId: string) => {
  // Demo Logic for specific locations to match the user's script
  if (scenarioId.includes('santorini')) {
    return { target: 32, label: 'High Catfish Risk' };
  }
  if (scenarioId.includes('tokyo')) {
    return { target: 88, label: 'Verified Vibe' };
  }
  if (scenarioId.includes('bali')) {
    return { target: 50, label: 'Moderate Risk' };
  }
  // Default fallback
  return { target: 42, label: 'Moderate Risk' };
};

const RealityWindow: React.FC<RealityWindowProps> = ({ scenario }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  
  const { target, label } = getVibeAnalysis(scenario.id);

  // Score Animation Effect: Counts up when revealed
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRevealed) {
      setDisplayScore(0);
      interval = setInterval(() => {
        setDisplayScore(prev => {
          if (prev >= target) {
            clearInterval(interval);
            return target;
          }
          // Count up speed
          return prev + Math.ceil(target / 20); 
        });
      }, 20);
    } else {
      setDisplayScore(0);
    }
    return () => clearInterval(interval);
  }, [isRevealed, target]);

  // Handle "Hold to Reveal" Interaction
  const handlePressStart = () => setIsRevealed(true);
  const handlePressEnd = () => setIsRevealed(false);

  // Traffic Light Logic
  const getStatusStyles = (score: number) => {
    if (score < 35) return { bg: 'bg-red-600/90 border-red-400', icon: AlertTriangle, text: 'text-red-100' };
    if (score < 75) return { bg: 'bg-yellow-500/90 border-yellow-300', icon: Scale, text: 'text-white' };
    return { bg: 'bg-green-600/90 border-green-400', icon: CheckCircle, text: 'text-white' };
  };

  const status = getStatusStyles(target);
  const StatusIcon = status.icon;

  return (
    <div className="relative w-full h-[40%] rounded-b-[2rem] overflow-hidden shadow-2xl z-20 group bg-black select-none">
      
      {/* --- HEADER OVERLAY --- */}
      <div className="absolute top-5 left-5 z-30 flex items-center gap-2 pointer-events-none mix-blend-difference">
        <Scan className="text-white/90" size={20} strokeWidth={2} />
        <div className="flex items-baseline drop-shadow-md">
           <span className="font-display font-black text-lg tracking-wider text-white">SCENE</span>
           <span className="font-display font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 ml-1">IT.</span>
        </div>
      </div>

      {/* --- STATUS BADGE (Top Right) --- */}
      <div className="absolute top-5 right-5 z-30">
        <div className="glass-panel px-2.5 py-1 rounded-full flex items-center gap-1.5 border-white/10 bg-black/40 backdrop-blur-md shadow-lg">
           <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isRevealed ? 'bg-red-500' : 'bg-green-400'}`} />
           <span className="text-[9px] font-bold uppercase tracking-wider text-white">
             {isRevealed ? 'Reality' : 'Dream'}
           </span>
        </div>
      </div>

      {/* --- MAIN IMAGES --- */}
      <div className="absolute inset-0">
        {/* Dream Image */}
        <motion.img 
          src={scenario.dreamImage} 
          alt="Dream"
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ opacity: isRevealed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Reality Image (Fetched via "SerpApi" mock) */}
        <motion.img 
          src={scenario.realityImage} 
          alt="Reality"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: isRevealed ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Protection Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
      </div>

      {/* --- DYNAMIC CATFISH PILL (Bottom Center) --- */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 w-full flex flex-col items-center gap-2 pointer-events-auto">
        <motion.button
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          whileTap={{ scale: 0.95 }}
          className={`
            relative px-5 py-3 rounded-full flex items-center gap-2.5 backdrop-blur-xl border shadow-xl transition-all duration-300
            ${isRevealed 
              ? `${status.bg} text-white min-w-[200px] justify-center` 
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20 min-w-[160px] justify-center'
            }
          `}
        >
          <AnimatePresence mode="wait">
            {isRevealed ? (
              <motion.div 
                key="alert"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <StatusIcon size={18} className="text-white/90" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                     Vibe Similarity
                  </span>
                  <span className="text-sm font-black tracking-wide">
                    {displayScore}% • {label}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="action"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Fingerprint size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">
                   Hold to Reveal
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        
        <span className="text-[9px] font-medium text-white/50 uppercase tracking-[0.2em] animate-pulse">
            {isRevealed ? 'Analyzing Real-Time Data...' : 'AI Reality Check'}
        </span>
      </div>

      {/* --- TECH SPECS --- */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:block opacity-50">
         <div className="flex items-center gap-1 text-[8px] font-mono text-white">
            <Globe2 size={8} /> <span>36.46N, 25.37E // OIA_V2</span>
         </div>
      </div>

    </div>
  );
};

export default RealityWindow;
