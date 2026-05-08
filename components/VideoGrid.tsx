'use client';

import HLSStream from './HLSStream';
import VideoEmbed from './VideoEmbed';
import { HLS_STREAMS, VIDEO_STREAMS } from '@/lib/rss';

type EmbedStream = (typeof VIDEO_STREAMS)[number] & { type: 'embed' };
type HlsStream = (typeof HLS_STREAMS)[number] & { type: 'hls' };
type StreamItem = EmbedStream | HlsStream;

export type VideoGridVariant = 'inlineCompact' | 'popoutBody';

export interface VideoGridProps {
  activeId: string;
  onActiveIdChange: (name: string) => void;
  mainMuted: boolean;
  onMainMutedChange: (muted: boolean) => void;
  /** When true, main player is only shown in the popout (inline placeholder here). */
  mainDetached?: boolean;
  variant: VideoGridVariant;
  /** Inline toolbar: title + pop-out controls */
  showToolbar?: boolean;
  popoutOpen?: boolean;
  onPopOut?: () => void;
  onClosePopout?: () => void;
}

const ALL_STREAMS: StreamItem[] = [
  ...VIDEO_STREAMS.map((s) => ({ ...s, type: 'embed' as const })),
  ...HLS_STREAMS.map((s) => ({ ...s, type: 'hls' as const })),
];

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

function MainPlaceholder({ streamName }: { streamName: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 bg-gray-900/60 p-6 text-center min-h-[160px]">
      <p className="text-[12px] text-gray-400 leading-snug">
        <span className="text-gray-300 font-medium">{streamName}</span> yalnızca taşınabilir pencerede
        oynatılıyor.
      </p>
      <p className="text-[11px] text-gray-600 mt-2">Pencereyi kapatınca yayın burada devam eder.</p>
    </div>
  );
}

export default function VideoGrid({
  activeId,
  onActiveIdChange,
  mainMuted,
  onMainMutedChange,
  mainDetached = false,
  variant,
  showToolbar = true,
  popoutOpen = false,
  onPopOut,
  onClosePopout,
}: VideoGridProps) {
  const mainStream = ALL_STREAMS.find((s) => s.name === activeId) ?? ALL_STREAMS[0];
  const sidebarStreams = ALL_STREAMS.filter((s) => s.name !== activeId);

  function handleSelect(name: string) {
    onActiveIdChange(name);
    onMainMutedChange(false);
  }

  if (variant === 'popoutBody') {
    return (
      <div className="flex flex-col h-full min-h-0 gap-2">
        <div className="flex-1 min-h-0 min-w-0">
          {renderStream(mainStream, true, mainMuted, {
            onToggleMute: () => onMainMutedChange(!mainMuted),
          })}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
          {sidebarStreams.map((stream) => (
            <div key={stream.name} className="w-[132px] h-[88px] shrink-0">
              {renderStream(stream, false, true, {
                onClick: () => handleSelect(stream.name),
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── inlineCompact ───
  return (
    <div className="flex flex-col lg:h-full p-3 gap-3 min-h-0">
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-2 shrink-0 px-1">
          <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Live Streams
          </h2>
          <span className="text-[10px] text-gray-600">— {mainStream.name} odakta</span>
          <span className="lg:ml-auto flex items-center gap-2">
            {popoutOpen ? (
              <button
                type="button"
                onClick={onClosePopout}
                className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Pencereyi kapat
              </button>
            ) : (
              <button
                type="button"
                onClick={onPopOut}
                className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded border border-blue-700/60 text-blue-400 hover:bg-gray-800 transition-colors"
              >
                Taşınabilir pencere
              </button>
            )}
          </span>
        </div>
      )}

      {/* Large screens */}
      <div className="hidden lg:flex gap-3 flex-1 min-h-0">
        <div className="flex flex-col gap-2 w-[128px] shrink-0 overflow-y-auto pr-0.5">
          {sidebarStreams.map((stream) => (
            <div key={stream.name} className="h-[90px] shrink-0">
              {renderStream(stream, false, true, {
                onClick: () => handleSelect(stream.name),
              })}
            </div>
          ))}
        </div>

        <div className="flex-1 min-w-0 min-h-0 flex items-start justify-center">
          {mainDetached ? (
            <div className="w-full max-w-xl max-h-[280px]">
              <MainPlaceholder streamName={mainStream.name} />
            </div>
          ) : (
            <div className="w-full max-w-xl max-h-[280px] h-full min-h-[180px]">
              {renderStream(mainStream, true, mainMuted, {
                onToggleMute: () => onMainMutedChange(!mainMuted),
              })}
            </div>
          )}
        </div>
      </div>

      {/* Small & medium */}
      <div className="flex flex-col gap-3 lg:hidden">
        {mainDetached ? (
          <MainPlaceholder streamName={mainStream.name} />
        ) : (
          <div className="aspect-video max-h-[220px] w-full max-w-xl mx-auto">
            {renderStream(mainStream, true, mainMuted, {
              onToggleMute: () => onMainMutedChange(!mainMuted),
            })}
          </div>
        )}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sidebarStreams.map((stream) => (
            <div key={stream.name} className="w-[140px] h-[92px] shrink-0">
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
