import React from 'react';

export const BackgroundGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Subtle cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Atmospheric ambient glows */}
      <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-[#00E5FF]/5 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-[#8B5CF6]/5 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 -left-40 w-[550px] h-[550px] bg-[#00E5FF]/4 rounded-full blur-[150px]" />
      <div className="absolute -bottom-20 right-1/4 w-[600px] h-[600px] bg-[#8B5CF6]/4 rounded-full blur-[140px]" />

      {/* Subtle vignette border gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#08090D]/80" />
    </div>
  );
};
