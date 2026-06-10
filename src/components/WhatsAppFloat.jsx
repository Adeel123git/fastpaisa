import React from 'react';

export default function WhatsAppFloat({ number = '03232210687' }) {
  const href = `https://wa.me/${number.replace(/[^0-9]/g, '')}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Contact admin on WhatsApp"
      className="fixed right-4 bottom-32 z-50"
    >
      <div className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-lg flex items-center justify-center text-white text-xl">
        <span>📱</span>
      </div>
    </a>
  );
}
