"use client";

import { X, ShoppingBag } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dict: {
    title: string;
    empty: string;
  };
}

export function CartDrawer({ isOpen, onClose, dict }: CartDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md h-full bg-ivory p-6 flex flex-col shadow-2xl font-tajawal animate-in slide-in-from-end duration-300">
        <div className="flex items-center justify-between pb-6 border-b border-burgundy/15">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-burgundy" />
            <span className="font-bold text-lg text-[#231916]">
              {dict?.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-beige/40 transition-colors"
          >
            <X className="w-5 h-5 text-[#231916]" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
          <ShoppingBag className="w-12 h-12 text-burgundy/30" />
          <p className="text-[#231916]/60 text-sm">{dict?.empty}</p>
        </div>
      </div>
    </div>
  );
}
