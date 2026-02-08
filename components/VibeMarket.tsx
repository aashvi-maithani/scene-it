
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MapPin, CalendarClock, TrendingDown } from 'lucide-react';
import { ArbitrageOption } from '../types';

interface VibeMarketProps {
  options: ArbitrageOption[];
}

const VibeMarket: React.FC<VibeMarketProps> = ({ options }) => {
  const [prices, setPrices] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  // Fetch real-time prices on mount
  useEffect(() => {
    options.forEach(async (option, index) => {
      const query = option.location || option.title;
      if (!query) return;
      
      // Initialize loading state for this index
      setLoading(prev => ({ ...prev, [index]: true }));

      try {
        const res = await fetch('http://localhost:3001/api/flight-price', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destination: query })
        });
        
        if (res.ok) {
           const data = await res.json();
           setPrices(prev => ({ ...prev, [index]: data.price }));
        } else {
           // Fallback to static price from props if API fails
           setPrices(prev => ({ ...prev, [index]: option.price }));
        }
      } catch (e) {
        // Fallback to static price from props
        setPrices(prev => ({ ...prev, [index]: option.price }));
      } finally {
        setLoading(prev => ({ ...prev, [index]: false }));
      }
    });
  }, [options]);
  
  const handleBooking = (option: ArbitrageOption) => {
    // Construct a search query for Google Flights/Travel
    const query = option.location ? `flights to ${option.location}` : `travel to ${option.title}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full h-[60%] flex flex-col pt-4 pb-24 relative z-0 bg-[#020204]">
      {/* Section Header */}
      <div className="px-6 mb-3 flex justify-between items-end shrink-0 z-10">
        <div>
          <h2 className="font-display font-bold text-xl text-white tracking-tight drop-shadow-md">Vibe Market</h2>
          <p className="text-[10px] text-white/50 font-medium tracking-wide">Arbitrage & Time Travel Deals</p>
        </div>
        <div className="text-right">
             <span className="text-[9px] font-bold tracking-widest uppercase text-white/30">Swipe to Save</span>
        </div>
      </div>

      {/* Carousel Container */}
      {/* Fixed: flex-row, overflow-x-auto, touch-pan-x for proper scrolling */}
      <div className="flex-1 w-full flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-4 scrollbar-hide touch-pan-x overscroll-x-contain" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {options.map((option, index) => (
          <motion.div 
            key={index}
            className="snap-center shrink-0 w-[85vw] md:w-[320px] h-full relative rounded-[1.5rem] overflow-hidden glass-panel border border-white/10 group shadow-lg"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            {/* 1. Background Layer */}
            <div className="absolute inset-0 bg-black z-0">
               {option.imageUrl && (
                 <img 
                   src={option.imageUrl} 
                   className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-700" 
                   alt={option.title} 
                 />
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
               {option.type === 'time-travel' && (
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-black/40 mix-blend-overlay" />
               )}
            </div>

            {/* 2. Top Left Badge */}
            <div className={`absolute top-4 left-4 z-20 px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md border border-white/10 shadow-lg
              ${option.type === 'original' ? 'bg-black/60 text-white' : 
                option.type === 'dupe' ? 'bg-purple-600/90 text-white' : 
                option.type === 'time-travel' ? 'bg-emerald-600/90 text-white' :
                'bg-blue-600/90 text-white'}
            `}>
              {option.type === 'dupe' && <Sparkles size={8} />}
              {option.type === 'time-travel' && <CalendarClock size={8} />}
              <span className="text-[9px] font-bold uppercase tracking-wider">{option.badge}</span>
            </div>

            {/* 3. Main Content (Flex Column) */}
            <div className="absolute inset-0 z-20 p-5 flex flex-col justify-between">
              
              {/* Spacer / Top Content (Savings) */}
              <div className="flex flex-col gap-2 mt-10">
                {option.savings && (
                  <div className="self-start">
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md backdrop-blur-md border shadow-sm ${
                      option.type === 'time-travel' 
                        ? 'bg-emerald-500/20 border-emerald-500/30' 
                        : 'bg-green-500/20 border-green-500/30'
                    }`}>
                        {option.type === 'time-travel' ? <TrendingDown size={10} className="text-emerald-300" /> : <Sparkles size={10} className="text-green-300" />}
                        <span className={`text-[9px] font-bold uppercase tracking-wide ${option.type === 'time-travel' ? 'text-emerald-300' : 'text-green-300'}`}>
                          Save {option.savings}
                        </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Content: Title, Location, Price, Button */}
              <div className="flex flex-col gap-3">
                 <div>
                    {/* Adjusted text size for longer titles */}
                    <h3 className={`font-display font-bold text-white leading-tight drop-shadow-lg mb-1 ${option.title.length > 20 ? 'text-lg' : 'text-xl'}`}>
                      {option.title}
                    </h3>
                    
                    {option.location && (
                      <div className="flex items-center gap-1 text-white/70">
                        <MapPin size={10} />
                        <span className="text-[9px] font-semibold uppercase tracking-wide">{option.location}</span>
                      </div>
                    )}
                 </div>

                 <div className="w-full h-px bg-white/10" />

                 <div className="flex items-center justify-between">
                    <div>
                        <div className="text-[8px] uppercase tracking-widest text-white/50 mb-0.5">Est. Cost</div>
                        
                        {/* Dynamic Price or Skeleton */}
                        {loading[index] ? (
                          <div className="h-8 w-24 bg-white/10 animate-pulse rounded-md mt-1" />
                        ) : (
                          <div className="font-display font-black text-2xl text-white tracking-tight leading-none drop-shadow-md">
                            {prices[index] || option.price}
                          </div>
                        )}
                    </div>
                    
                    <button 
                      onClick={() => handleBooking(option)}
                      className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer"
                    >
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </button>
                 </div>
              </div>

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VibeMarket;
