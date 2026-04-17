import VideoEmbed from './VideoEmbed';
import { VIDEO_STREAMS } from '@/lib/rss';

export default function VideoGrid() {
  return (
    <div className="flex flex-col md:h-full p-3 gap-3">
      <div className="flex items-center gap-2 shrink-0 px-1">
        <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          Live Streams
        </h2>
        <span className="text-[10px] text-gray-600">— Bloomberg · Yahoo Finance · CNBC · Reuters</span>
      </div>

      {/*
        Mobile:  1 column, each video natural 16:9 height, page scrolls
        Desktop: 2×2 grid, fills available height
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:flex-1 md:min-h-0">
        {VIDEO_STREAMS.map((stream) => (
          <VideoEmbed
            key={stream.name}
            name={stream.name}
            embedUrl={stream.embedUrl}
            color={stream.color}
          />
        ))}
      </div>
    </div>
  );
}
