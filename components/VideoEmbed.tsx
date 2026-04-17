'use client';

import { useEffect, useRef, useState } from 'react';
import type { VideoStream } from '@/types';

export default function VideoEmbed({ name, embedUrl, color }: VideoStream) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col bg-gray-900 rounded-lg overflow-hidden border border-gray-800 min-h-0"
    >
      {/* Stream header bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-800 shrink-0">
        <span className={`h-2 w-2 rounded-full shrink-0 ${color}`} />
        <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
          {name}
        </span>
        <span className="ml-auto flex items-center gap-1">
          <span className="animate-pulse h-1.5 w-1.5 rounded-full bg-red-500" />
          <span className="text-[10px] text-gray-500 font-medium uppercase">Live</span>
        </span>
      </div>

      {/* Video area — aspect-ratio on mobile, flex-fill on desktop */}
      <div className="relative aspect-video md:aspect-auto md:flex-1 bg-black">
        {isVisible ? (
          <iframe
            src={embedUrl}
            title={`${name} Live Stream`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
            <div className="flex flex-col items-center gap-3 text-gray-600">
              <div className="w-6 h-6 border-2 border-gray-700 rounded-full border-t-gray-400 animate-spin" />
              <span className="text-[11px]">Loading stream…</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
