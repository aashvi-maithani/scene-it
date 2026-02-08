import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Sparkles } from 'lucide-react';

interface DragDropZoneProps {
  onFileSelect: (file: File) => void;
}

const DragDropZone: React.FC<DragDropZoneProps> = ({ onFileSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative group p-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      />

      {/* Ambient Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-blue-500/5 opacity-50 transition-opacity duration-1000 group-hover:opacity-100" />

      {/* The Glass Container */}
      <motion.div 
        className={`
          relative w-64 h-64 md:w-96 md:h-96 
          rounded-full md:rounded-[3rem] 
          glass-panel
          flex flex-col items-center justify-center
          transition-all duration-500 ease-out
          ${isHovered || isDragging ? 'scale-105 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)]' : 'scale-100'}
        `}
      >
        {/* Animated Icon */}
        <div className="relative mb-6 md:mb-8">
           <div className="absolute inset-0 bg-white/20 blur-xl rounded-full animate-pulse" />
           <UploadCloud 
             size={48} 
             className={`relative z-10 text-white/80 transition-transform duration-500 ${isHovered ? '-translate-y-2' : ''}`} 
             strokeWidth={1}
           />
        </div>

        {/* Text */}
        <div className="text-center space-y-2 px-6">
          <h3 className="font-display font-bold text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60 tracking-tight">
            Upload Aesthetic
          </h3>
          <p className="text-xs text-white/40 tracking-widest uppercase font-medium">
            Drag & Drop or Click
          </p>
        </div>
        
        {/* Decorative Sparkles */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-4 -right-4 text-yellow-100/50"
        >
          <Sparkles size={24} />
        </motion.div>
      </motion.div>
      
      {/* Bottom Label */}
      <div className="absolute bottom-8 md:bottom-12 text-center w-full">
         <p className="text-[10px] text-white/20 tracking-[0.3em] font-light">SCENE-IT V3.0 // DREAM CORE</p>
      </div>
    </div>
  );
};

export default DragDropZone;