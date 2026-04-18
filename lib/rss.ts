import Parser from 'rss-parser';
import type { FeedItem, FeedSource, HLSVideoStream, VideoStream } from '@/types';

export const FEEDS: FeedSource[] = [
  {
    name: 'Bloomberg',
    url: 'https://feeds.bloomberg.com/markets/news.rss',
    color: 'bg-orange-500',
  },
  {
    name: 'CNBC',
    url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114',
    color: 'bg-blue-500',
  },
  {
    name: 'Investing',
    url: 'https://www.investing.com/rss/news_25.rss',
    color: 'bg-emerald-500',
  },
  {
    name: 'Eco Indicators',
    url: 'https://www.investing.com/rss/news_285.rss',
    color: 'bg-teal-500',
  },
  {
    name: 'Markets',
    url: 'https://www.investing.com/rss/news_14.rss',
    color: 'bg-lime-500',
  },
  {
    name: 'BloombergHT',
    url: 'https://www.bloomberght.com/rss',
    color: 'bg-orange-400',
  },
];

export const VIDEO_STREAMS: VideoStream[] = [
  {
    name: 'Bloomberg',
    embedUrl:
      'https://www.youtube.com/embed/live_stream?channel=UCIALMKvObZNtJ6AmdCLP7Lg&autoplay=1&mute=1',
    color: 'bg-orange-500',
  },
  {
    name: 'Yahoo Finance',
    embedUrl:
      'https://www.youtube.com/embed/KQp-e_XQnDE?autoplay=1&mute=1',
    color: 'bg-violet-500',
  },
  {
    name: 'CNBC',
    embedUrl:
      'https://www.youtube.com/embed/live_stream?channel=UCvJJ_dzjViJCoLf5uKUTwoA&autoplay=1&mute=1',
    color: 'bg-blue-500',
  },
];

export const HLS_STREAMS: HLSVideoStream[] = [
  {
    name: 'BloombergHT',
    hlsUrl: 'https://ciner.daioncdn.net/bloomberght/bloomberght_720p.m3u8',
    color: 'bg-orange-400',
  },
];

type CustomItem = {
  'media:thumbnail'?: { $: { url: string } };
  'media:content'?: { $: { url: string } };
};

const parser = new Parser<Record<string, unknown>, CustomItem>({
  customFields: {
    item: [
      ['media:thumbnail', 'media:thumbnail'],
      ['media:content', 'media:content'],
    ],
  },
  timeout: 10000,
});

export async function fetchFeed(source: FeedSource): Promise<FeedItem[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return feed.items.slice(0, 30).map((item, index) => {
      const mediaThumb = (item as CustomItem)['media:thumbnail']?.$?.url;
      const mediaContent = (item as CustomItem)['media:content']?.$?.url;
      const enclosure = (item as { enclosure?: { url?: string } }).enclosure?.url;

      return {
        id: item.guid || item.link || `${source.name}-${index}`,
        title: (item.title || 'Untitled').trim(),
        link: item.link || '#',
        source: source.name,
        sourceColor: source.color,
        publishedAt: item.pubDate
          ? new Date(item.pubDate).toISOString()
          : new Date().toISOString(),
        thumbnail: mediaThumb || mediaContent || enclosure,
        description: item.contentSnippet?.slice(0, 200),
      };
    });
  } catch (error) {
    console.error(`[rss] Failed to fetch ${source.name}:`, error);
    return [];
  }
}
