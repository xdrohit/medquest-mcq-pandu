"use client";

import React from "react";
import { motion } from "framer-motion";

export const AIOrb = () => {
  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Outer Halo */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
          rotate: [0, 90, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute inset-0 bg-primary-400 rounded-full blur-[60px]"
      />
      
      {/* Mid Layer Ring */}
      <motion.div
        animate={{ 
          rotate: [0, -180, -360],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute inset-4 rounded-full border border-primary-300/30 border-dashed opacity-50"
      />

      {/* Core Orb */}
      <motion.div
        animate={{ 
          scale: [0.95, 1.05, 0.95],
          boxShadow: [
            "0 0 20px rgba(14,165,233,0.4), inset 0 0 20px rgba(14,165,233,0.8)",
            "0 0 40px rgba(14,165,233,0.8), inset 0 0 40px rgba(255,255,255,0.8)",
            "0 0 20px rgba(14,165,233,0.4), inset 0 0 20px rgba(14,165,233,0.8)"
          ]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative w-32 h-32 rounded-full bg-gradient-to-br from-white via-primary-200 to-primary-600 backdrop-blur-md border border-white/40 flex items-center justify-center overflow-hidden"
      >
        {/* Inner energy pulse */}
        <motion.div 
           animate={{
             y: [-10, 10, -10],
             x: [-5, 5, -5],
             opacity: [0.5, 0.8, 0.5]
           }}
           transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
           className="absolute w-20 h-20 bg-white/40 rounded-full blur-xl"
        />
        <svg className="w-10 h-10 text-primary-900/60 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </motion.div>
    </div>
  );
};
