'use client';

import type { FeedItem } from '@/types';

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NewsItem({ item }: { item: FeedItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-1.5 px-4 py-3 border-b border-gray-800/70 hover:bg-gray-800/40 transition-colors group cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <span
          className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest text-white ${item.sourceColor}`}
        >
          {item.source}
        </span>
        <time
          dateTime={item.publishedAt}
          className="text-[11px] text-gray-500 tabular-nums"
        >
          {timeAgo(item.publishedAt)}
        </time>
      </div>
      <p className="text-[13px] leading-snug text-gray-200 group-hover:text-white line-clamp-3 transition-colors">
        {item.title}
      </p>
    </a>
  );
}
