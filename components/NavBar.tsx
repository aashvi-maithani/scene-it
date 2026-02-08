
import React from 'react';
import { Compass, Map, ScanLine, Bookmark, User } from 'lucide-react';

interface NavBarProps {
  onScanClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onScanClick }) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className="glass-panel rounded-[2rem] px-6 py-4 flex justify-between items-center shadow-2xl backdrop-blur-2xl bg-black/40 border border-white/10">
        <button className="text-white/40 hover:text-white transition-colors">
          <Compass size={24} strokeWidth={1.5} />
        </button>
        <button className="text-white/40 hover:text-white transition-colors">
          <Map size={24} strokeWidth={1.5} />
        </button>
        
        {/* Floating Scan Button */}
        <button 
          onClick={onScanClick}
          className="relative -top-8 bg-gradient-to-br from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)] border-4 border-[#020204] hover:scale-105 transition-transform"
        >
          <ScanLine size={28} className="text-white" />
        </button>

        <button className="text-white/40 hover:text-white transition-colors">
          <Bookmark size={24} strokeWidth={1.5} />
        </button>
        <button className="text-white/40 hover:text-white transition-colors">
          <User size={24} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default NavBar;
