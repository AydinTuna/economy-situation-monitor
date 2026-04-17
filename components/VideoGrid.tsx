'use client';

import { useState } from 'react';
import HLSStream from './HLSStream';
import VideoEmbed from './VideoEmbed';
import { HLS_STREAMS, VIDEO_STREAMS } from '@/lib/rss';

const DEFAULT_MAIN = 'Bloomberg';

type EmbedStream = (typeof VIDEO_STREAMS)[number] & { type: 'embed' };
type HlsStream = (typeof HLS_STREAMS)[number] & { type: 'hls' };
type StreamItem = EmbedStream | HlsStream;

export default function VideoGrid() {
  const allStreams: StreamItem[] = [
    ...VIDEO_STREAMS.map((s) => ({ ...s, type: 'embed' as const })),
    ...HLS_STREAMS.map((s) => ({ ...s, type: 'hls' as const })),
  ];

  const [activeId, setActiveId] = useState(DEFAULT_MAIN);
  const [mainMuted, setMainMuted] = useState(false); // Bloomberg starts unmuted

  const mainStream = allStreams.find((s) => s.name === activeId) ?? allStreams[0];
  const sidebarStreams = allStreams.filter((s) => s.name !== activeId);

  function handleSelect(name: string) {
    setActiveId(name);
    setMainMuted(false);
  }

  function renderStream(
    stream: StreamItem,
    isMain: boolean,
    isMuted: boolean,
    handlers: { onToggleMute?: () => void; onClick?: () => void }
  ) {
    if (stream.type === 'hls') {
      return (
        <HLSStream
          key={stream.name}
          name={stream.name}
          hlsUrl={stream.hlsUrl}
          color={stream.color}
          isMuted={isMuted}
          isMain={isMain}
          {...handlers}
        />
      );
    }
    return (
      <VideoEmbed
        key={stream.name}
        name={stream.name}
        embedUrl={stream.embedUrl}
        color={stream.color}
        isMuted={isMuted}
        isMain={isMain}
        {...handlers}
      />
    );
  }

  return (
    <div className="flex flex-col lg:h-full p-3 gap-3">
      {/* Header */}
      <div className="flex items-center gap-2 shrink-0 px-1">
        <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          Live Streams
        </h2>
        <span className="text-[10px] text-gray-600">
          — {mainStream.name} odakta
        </span>
      </div>

      {/* Large screens: sidebar + spotlight */}
      <div className="hidden lg:flex gap-3 flex-1 min-h-0">
        {/* Left sidebar — muted thumbnails */}
        <div className="flex flex-col gap-2 w-[168px] shrink-0 overflow-y-auto pr-0.5">
          {sidebarStreams.map((stream) => (
            <div key={stream.name} className="h-[112px] shrink-0">
              {renderStream(stream, false, true, {
                onClick: () => handleSelect(stream.name),
              })}
            </div>
          ))}
        </div>

        {/* Main spotlight stream */}
        <div className="flex-1 min-w-0 min-h-0">
          {renderStream(mainStream, true, mainMuted, {
            onToggleMute: () => setMainMuted((prev) => !prev),
          })}
        </div>
      </div>

      {/* Small & medium screens: main stream on top, horizontal thumbnail strip below */}
      <div className="flex flex-col gap-3 lg:hidden">
        <div className="aspect-video">
          {renderStream(mainStream, true, mainMuted, {
            onToggleMute: () => setMainMuted((prev) => !prev),
          })}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sidebarStreams.map((stream) => (
            <div key={stream.name} className="w-[160px] h-[100px] shrink-0">
              {renderStream(stream, false, true, {
                onClick: () => handleSelect(stream.name),
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
