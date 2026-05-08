'use client';

import { useState } from 'react';
import VideoGrid from './VideoGrid';
import LiveStreamPopout from './LiveStreamPopout';
import { DEFAULT_STREAM_ID } from '@/lib/rss';

export default function DashboardShell() {
  const [activeId, setActiveId] = useState(DEFAULT_STREAM_ID);
  const [mainMuted, setMainMuted] = useState(false);
  const [popoutOpen, setPopoutOpen] = useState(false);

  return (
    <>
      <main className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden bg-gray-950">
        <VideoGrid
          variant="inlineCompact"
          activeId={activeId}
          onActiveIdChange={setActiveId}
          mainMuted={mainMuted}
          onMainMutedChange={setMainMuted}
          mainDetached={popoutOpen}
          popoutOpen={popoutOpen}
          onPopOut={() => setPopoutOpen(true)}
          onClosePopout={() => setPopoutOpen(false)}
        />
      </main>
      {popoutOpen && (
        <LiveStreamPopout
          onClose={() => setPopoutOpen(false)}
          activeId={activeId}
          onActiveIdChange={setActiveId}
          mainMuted={mainMuted}
          onMainMutedChange={setMainMuted}
        />
      )}
    </>
  );
}
