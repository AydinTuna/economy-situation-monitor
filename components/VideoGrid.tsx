import VideoEmbed from './VideoEmbed';
import { VIDEO_STREAMS } from '@/lib/rss';

export default function VideoGrid() {
  const last = VIDEO_STREAMS.length % 2 !== 0 ? VIDEO_STREAMS[VIDEO_STREAMS.length - 1] : null;
  const pairs = last ? VIDEO_STREAMS.slice(0, -1) : VIDEO_STREAMS;

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
        Desktop: 2-column grid, fills available height;
                 odd last item spans full width
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:flex-1 md:min-h-0">
        {pairs.map((stream) => (
          <VideoEmbed
            key={stream.name}
            name={stream.name}
            embedUrl={stream.embedUrl}
            color={stream.color}
          />
        ))}

        {last && (
          <div className="md:col-span-2">
            <VideoEmbed
              name={last.name}
              embedUrl={last.embedUrl}
              color={last.color}
            />
          </div>
        )}
      </div>
    </div>
  );
}
