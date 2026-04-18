'use client';

import useSWR from 'swr';
import type { FeedItem } from '@/types';
import NewsItem from './NewsItem';

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('fetch error');
    return r.json();
  });

function SkeletonRow() {
  return (
    <div className="px-4 py-3 border-b border-gray-800/70">
      <div className="flex gap-2 mb-2">
        <div className="h-3.5 w-16 bg-gray-800 rounded animate-pulse" />
        <div className="h-3.5 w-10 bg-gray-800 rounded animate-pulse" />
      </div>
      <div className="h-3.5 w-full bg-gray-800 rounded animate-pulse mb-1.5" />
      <div className="h-3.5 w-3/4 bg-gray-800 rounded animate-pulse" />
    </div>
  );
}

export default function NewsFeed() {
  const { data, error, isLoading, isValidating } = useSWR<FeedItem[]>(
    '/api/feeds',
    fetcher,
    {
      refreshInterval: 30_000,
      revalidateOnFocus: false,
    }
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Live Feed
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isValidating && !isLoading && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
          )}
          <span className="text-[10px] text-gray-600 tabular-nums">↻ 30s</span>
        </div>
      </div>

      {/* Item count badge */}
      {data && (
        <div className="px-4 py-1.5 border-b border-gray-800/50 shrink-0">
          <span className="text-[10px] text-gray-600">
            {data.length} stories — Bloomberg · CNBC · Investing Economy · Eco Indicators · Markets · BloombergHT
          </span>
        </div>
      )}

      {/* Feed list */}
      <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent' }}>
        {isLoading && Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)}

        {error && (
          <div className="flex flex-col items-center gap-2 p-8 text-center">
            <span className="text-red-400 text-sm">Failed to load feeds</span>
            <span className="text-gray-600 text-xs">Retrying automatically…</span>
          </div>
        )}

        {data?.map((item) => (
          <NewsItem key={item.id} item={item} />
        ))}
      </div>

      {/* Attribution */}
      <div className="shrink-0 px-4 py-2.5 border-t border-gray-800/50 flex flex-col gap-1">
        <span className="text-[10px] text-gray-600">
          For requests &amp; inquiries, feel free to reach out:
        </span>
        <div className="flex items-center justify-between">
          <a
            href="https://github.com/AydinTuna"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-gray-700 hover:text-gray-400 transition-colors"
          >
            github.com/AydinTuna
          </a>
          <a
            href="mailto:aydinbahadirtuna@gmail.com"
            className="text-[10px] text-gray-700 hover:text-gray-400 transition-colors"
          >
            aydinbahadirtuna@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
