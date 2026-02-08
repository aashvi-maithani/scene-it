
import React from 'react';
import { motion } from 'framer-motion';
import RealityWindow from './RealityWindow';
import VibeMarket from './VibeMarket';
import { SANTORINI_SCENARIO } from '../data/mockScenarios';

const ResultsDashboard: React.FC = () => {
  // In a real app, we would pass data via props. 
  // For this demo, we use the specific SANTORINI_SCENARIO.
  
  return (
    <motion.div 
      className="w-full h-full flex flex-col bg-[#020204]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* ZONE A: The Reality Window (Top 55-60%) */}
      <RealityWindow scenario={SANTORINI_SCENARIO} />

      {/* ZONE B: The Vibe Arbitrage Market (Bottom 40-45%) */}
      <VibeMarket options={SANTORINI_SCENARIO.options} />
      
    </motion.div>
  );
};

export default ResultsDashboard;
