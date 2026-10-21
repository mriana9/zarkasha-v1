"use client";

import { X, Search } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  dict: {
    eyebrow: string;
    placeholder: string;
    notice: string;
  };
}

export function SearchOverlay({ isOpen, onClose, dict }: SearchOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ivory/98 backdrop-blur-md flex flex-col items-center justify-center p-6 font-tajawal animate-in fade-in duration-200">
      <button
        onClick={onClose}
        className="absolute top-8 start-8 w-10 h-10 flex items-center justify-center rounded-full hover:bg-beige/40 transition-colors"
      >
        <X className="w-6 h-6 text-burgundy" />
      </button>

      <div className="w-full max-w-2xl flex flex-col gap-3">
        <span className="text-olive text-xs font-bold tracking-wider">
          {dict.eyebrow}
        </span>

        <div className="flex items-center gap-4 border-b-2 border-burgundy pb-3">
          <Search className="w-8 h-8 text-burgundy shrink-0" />
          <input
            type="text"
            placeholder={dict.placeholder}
            className="w-full bg-transparent font-amiri text-3xl md:text-5xl text-burgundy placeholder:text-burgundy/35 focus:outline-none"
            autoFocus
          />
        </div>

        <p className="text-xs text-[#8a7c77] mt-2">{dict.notice}</p>
      </div>
    </div>
  );
}
