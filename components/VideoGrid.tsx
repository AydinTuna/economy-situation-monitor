import HLSStream from './HLSStream';
import VideoEmbed from './VideoEmbed';
import { HLS_STREAMS, VIDEO_STREAMS } from '@/lib/rss';

export default function VideoGrid() {
  const allStreams = [
    ...VIDEO_STREAMS.map((s) => ({ ...s, type: 'embed' as const })),
    ...HLS_STREAMS.map((s) => ({ ...s, type: 'hls' as const })),
  ];
  const last = allStreams.length % 2 !== 0 ? allStreams[allStreams.length - 1] : null;
  const pairs = last ? allStreams.slice(0, -1) : allStreams;
  // Number of grid rows: pairs fill 2-col rows, last occupies 1 more row
  const rowCount = Math.ceil(allStreams.length / 2);

  return (
    <div className="flex flex-col md:h-full p-3 gap-3">
      <div className="flex items-center gap-2 shrink-0 px-1">
        <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          Live Streams
        </h2>
        <span className="text-[10px] text-gray-600">
          — Bloomberg · Yahoo Finance · CNBC · Reuters · BloombergHT
        </span>
      </div>

      {/*
        Mobile:  1 column, each video natural 16:9 height, page scrolls
        Desktop: 2-column grid, fills available height with equal-height rows.
                 grid-template-rows: repeat(N, 1fr) distributes space evenly so
                 flex-1 inside each card can actually expand.
      */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-3 md:flex-1 md:min-h-0"
        style={{ gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))` }}
      >
        {pairs.map((stream) =>
          stream.type === 'hls' ? (
            <HLSStream
              key={stream.name}
              name={stream.name}
              hlsUrl={(stream as typeof HLS_STREAMS[number]).hlsUrl}
              color={stream.color}
            />
          ) : (
            <VideoEmbed
              key={stream.name}
              name={stream.name}
              embedUrl={(stream as typeof VIDEO_STREAMS[number]).embedUrl}
              color={stream.color}
            />
          )
        )}

        {last && (
          <div className="md:col-span-2 h-full">
            {last.type === 'hls' ? (
              <HLSStream
                name={last.name}
                hlsUrl={(last as typeof HLS_STREAMS[number]).hlsUrl}
                color={last.color}
              />
            ) : (
              <VideoEmbed
                name={last.name}
                embedUrl={(last as typeof VIDEO_STREAMS[number]).embedUrl}
                color={last.color}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
