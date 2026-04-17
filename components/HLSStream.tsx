'use client';

import { useEffect, useRef, useState } from 'react';
import type { HLSVideoStream } from '@/types';

function MuteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M9.547 3.062A.75.75 0 0 1 10 3.75v12.5a.75.75 0 0 1-1.264.546L4.703 13H3.167a.75.75 0 0 1-.7-.48A6.985 6.985 0 0 1 2 10c0-.884.165-1.73.468-2.52a.75.75 0 0 1 .699-.48h1.536l4.033-3.796a.75.75 0 0 1 .811-.142ZM13.78 7.22a.75.75 0 1 0-1.06 1.06L14.44 10l-1.72 1.72a.75.75 0 0 0 1.06 1.06L15.5 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L16.56 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L15.5 8.94l-1.72-1.72Z" />
    </svg>
  );
}

function UnmuteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M10 3.75a.75.75 0 0 0-1.264-.546L4.703 7H3.167a.75.75 0 0 0-.7.48A6.985 6.985 0 0 0 2 10c0 .884.165 1.73.468 2.52.111.29.39.48.699.48h1.536l4.033 3.796A.75.75 0 0 0 10 16.25V3.75ZM15.91 6.576a.75.75 0 0 1 1.032.252 10.476 10.476 0 0 1 0 6.344.75.75 0 1 1-1.284-.784 8.977 8.977 0 0 0 0-4.776.75.75 0 0 1 .252-1.036ZM13.05 9.159a.75.75 0 0 1 1.029.258 5.473 5.473 0 0 1 0 1.165.75.75 0 0 1-1.287-.772 3.976 3.976 0 0 0 0-.393.75.75 0 0 1 .258-1.258Z" />
    </svg>
  );
}

export default function HLSStream({ name, hlsUrl, color }: HLSVideoStream) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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

  useEffect(() => {
    if (!isVisible) return;

    const video = videoRef.current;
    if (!video) return;

    let hlsInstance: import('hls.js').default | null = null;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      video.play().catch(() => {});
    } else {
      import('hls.js').then(({ default: Hls }) => {
        if (!Hls.isSupported()) return;

        hlsInstance = new Hls({
          lowLatencyMode: true,
          liveSyncDurationCount: 3,
        });
        hlsInstance.loadSource(hlsUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
      });
    }

    return () => {
      hlsInstance?.destroy();
    };
  }, [isVisible, hlsUrl]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-800 min-h-0"
    >
      {/* Stream header bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-800 shrink-0">
        <span className={`h-2 w-2 rounded-full shrink-0 ${color}`} />
        <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
          {name}
        </span>
        <span className="ml-auto flex items-center gap-2">
          <button
            onClick={toggleMute}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase transition-colors ${
              isMuted
                ? 'text-gray-500 hover:text-gray-300'
                : 'text-green-400 hover:text-green-300'
            }`}
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isMuted ? <MuteIcon /> : <UnmuteIcon />}
          </button>
          <span className="flex items-center gap-1">
            <span className="animate-pulse h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="text-[10px] text-gray-500 font-medium uppercase">Live</span>
          </span>
        </span>
      </div>

      {/* Video area */}
      <div className="relative aspect-video md:aspect-auto md:flex-1 bg-black">
        {isVisible ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-contain"
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
