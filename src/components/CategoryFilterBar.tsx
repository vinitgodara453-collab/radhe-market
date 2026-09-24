import React from 'react';
import {
  Send,
  Instagram,
  Youtube,
  Twitter,
  Music2,
  MessageSquare,
  Gamepad2,
  Flame,
  Share2,
  Layers,
} from 'lucide-react';
import { Platform } from '../types';
import { PLATFORMS_META } from '../data/mockData';

interface CategoryFilterBarProps {
  currentPlatform: Platform;
  onSelectPlatform: (platform: Platform) => void;
  listingCounts: Record<string, number>;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  currentPlatform,
  onSelectPlatform,
  listingCounts,
}) => {
  const getIcon = (name: string, color: string) => {
    const props = { className: 'w-4 h-4', style: { color } };
    switch (name) {
      case 'Send':
        return <Send {...props} />;
      case 'Instagram':
        return <Instagram {...props} />;
      case 'Youtube':
        return <Youtube {...props} />;
      case 'Twitter':
        return <Twitter {...props} />;
      case 'Music2':
        return <Music2 {...props} />;
      case 'MessageSquare':
        return <MessageSquare {...props} />;
      case 'Gamepad2':
        return <Gamepad2 {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      case 'Share2':
        return <Share2 {...props} />;
      default:
        return <Layers {...props} />;
    }
  };

  return (
    <div className="bg-[#0e131f] border-b border-white/[0.07] px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {PLATFORMS_META.map((cat) => {
          const isActive = currentPlatform === cat.id;
          const count = listingCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectPlatform(cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 border ${
                isActive
                  ? 'bg-emerald-500/20 text-white border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-900/60 text-slate-300 border-white/[0.06] hover:bg-slate-800/80 hover:border-white/15'
              }`}
            >
              <span className="flex items-center justify-center">
                {getIcon(cat.iconName, isActive ? '#10b981' : cat.color)}
              </span>
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-emerald-500/30 text-emerald-200'
                    : 'bg-white/5 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
