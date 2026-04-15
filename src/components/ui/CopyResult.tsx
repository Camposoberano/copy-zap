import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyResultProps {
  title: string;
  content: string;
}

export function CopyResult({ title, content }: CopyResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-border w-full relative group transition-all hover:bg-cardHover">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-brand-orange uppercase text-sm tracking-wider flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></div>
          {title}
        </h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-white/5 transition-colors text-gray-300"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}
