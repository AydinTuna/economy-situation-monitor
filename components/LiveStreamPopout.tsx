'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import VideoGrid from './VideoGrid';

export interface LiveStreamPopoutProps {
  onClose: () => void;
  activeId: string;
  onActiveIdChange: (name: string) => void;
  mainMuted: boolean;
  onMainMutedChange: (muted: boolean) => void;
}

const DEFAULT_W = 700;
const DEFAULT_H = 480;

export default function LiveStreamPopout({
  onClose,
  activeId,
  onActiveIdChange,
  mainMuted,
  onMainMutedChange,
}: LiveStreamPopoutProps) {
  const [pos, setPos] = useState({ x: 40, y: 72 });
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const clamp = useCallback((x: number, y: number) => {
    const w = Math.min(window.innerWidth * 0.94, DEFAULT_W);
    const h = Math.min(window.innerHeight * 0.88, DEFAULT_H);
    const margin = 8;
    return {
      x: Math.min(Math.max(margin, x), Math.max(margin, window.innerWidth - w - margin)),
      y: Math.min(Math.max(margin, y), Math.max(margin, window.innerHeight - h - margin)),
    };
  }, []);

  useEffect(() => {
    setPos((p) => clamp(p.x, p.y));
  }, [clamp]);

  function onHandleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };

    function onMove(ev: MouseEvent) {
      const d = dragRef.current;
      if (!d) return;
      const nx = d.origX + (ev.clientX - d.startX);
      const ny = d.origY + (ev.clientY - d.startY);
      setPos(clamp(nx, ny));
    }

    function onUp() {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  return (
    <div
      className="fixed z-[100] flex flex-col rounded-xl border border-gray-600 bg-gray-950 shadow-2xl overflow-hidden ring-1 ring-black/40"
      style={{
        left: pos.x,
        top: pos.y,
        width: 'min(94vw, 700px)',
        height: 'min(88vh, 480px)',
      }}
      role="dialog"
      aria-label="Canlı yayın penceresi"
    >
      <div className="flex items-stretch border-b border-gray-800 bg-gray-900 shrink-0 select-none">
        <div
          className="flex flex-1 min-w-0 items-center gap-2 px-3 py-2 cursor-grab active:cursor-grabbing"
          onMouseDown={onHandleMouseDown}
        >
          <span className="text-gray-600 text-sm leading-none shrink-0">⋮⋮</span>
          <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-widest shrink-0">
            Canlı yayın
          </span>
          <span className="text-[10px] text-gray-600 truncate hidden sm:inline">
            — başlıktan sürükleyin
          </span>
        </div>
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onClose}
          className="text-gray-500 hover:text-white text-lg leading-none px-3 hover:bg-gray-800 cursor-pointer"
          aria-label="Pencereyi kapat"
        >
          ×
        </button>
      </div>

      <div className="flex-1 min-h-0 p-2">
        <VideoGrid
          variant="popoutBody"
          activeId={activeId}
          onActiveIdChange={onActiveIdChange}
          mainMuted={mainMuted}
          onMainMutedChange={onMainMutedChange}
          showToolbar={false}
        />
      </div>
    </div>
  );
}
