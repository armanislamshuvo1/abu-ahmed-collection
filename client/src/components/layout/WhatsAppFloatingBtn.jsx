import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const WhatsAppFloatingBtn = () => {
  const { settings } = useAuth();
  const phone = settings?.whatsappNumber || '8801700000000';
  const text = encodeURIComponent('Assalamu Alaikum Abu Ahmed Collection! I want to inquire about your saree collections.');

  return (
    <a
      href={`https://wa.me/${phone}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/20"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold rounded-full" />
      </div>
      <span className="hidden sm:inline-block font-semibold text-xs tracking-wide pr-1">
        Order via WhatsApp
      </span>
    </a>
  );
};
