import React from 'react';

interface CardButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  selected?: boolean;
  compact?: boolean;
  onClick: () => void;
}

export function CardButton({ icon, title, subtitle, selected, compact, onClick }: CardButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 w-full text-center group
        ${compact ? 'p-4' : 'p-6 md:p-8'}
        ${selected 
          ? 'bg-white/10 border-brand-orange shadow-[0_0_20px_rgba(249,115,22,0.2)] scale-[1.02]' 
          : 'glass-card hover:bg-white/5 border-white/5 hover:border-white/10'
        }
      `}
    >
      <div className={`transition-transform duration-300 group-hover:scale-110 ${compact ? 'text-2xl mb-2' : 'text-4xl mb-4'}`}>
        {icon}
      </div>
      <span className={`font-bold text-white mb-1 ${compact ? 'text-sm' : 'text-lg md:text-xl'}`}>{title}</span>
      {!compact && <span className="text-xs md:text-sm text-gray-500 font-medium">{subtitle}</span>}
      {compact && <span className="text-[10px] text-gray-600 font-medium uppercase tracking-tighter line-clamp-1">{subtitle}</span>}
      
      {selected && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-brand-orange rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
      )}
    </button>
  );
}
