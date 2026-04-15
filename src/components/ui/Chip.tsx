import React from 'react';

interface ChipProps {
  icon?: React.ReactNode;
  label: string;
  selected?: boolean;
  onClick: () => void;
}

export function Chip({ icon, label, selected, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all duration-200
        ${selected
          ? 'bg-cardHover border-brand-orange text-white'
          : 'glass-card border-border hover:border-gray-500 text-gray-300'
        }
      `}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
