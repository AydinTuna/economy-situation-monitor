export interface FeedItem {
  id: string;
  title: string;
  link: string;
  source: string;
  sourceColor: string;
  publishedAt: string; // ISO string for JSON serialization
  thumbnail?: string;
  description?: string;
}

export interface FeedSource {
  name: string;
  url: string;
  color: string;
}

export interface VideoStream {
  name: string;
  embedUrl: string;
  color: string;
}

export interface HLSVideoStream {
  name: string;
  hlsUrl: string;
  color: string;
}
