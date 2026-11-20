import { useState } from 'react';
import { Mountain } from 'lucide-react';

interface StageArtworkProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
}

export function StageArtwork({ src, alt, fallbackTitle, className = '' }: StageArtworkProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#fff7e4] via-[#f3e4c4] to-[#e6d2a7] text-amber-950 p-6 ${className}`}
      >
        <Mountain className="w-10 h-10 mb-3 text-amber-700" aria-hidden="true" />
        <span className="font-display text-base font-semibold text-center">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
