import { NextResponse } from 'next/server';
import { FEEDS, fetchFeed } from '@/lib/rss';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const results = await Promise.allSettled(FEEDS.map(fetchFeed));

    const allItems = results
      .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return NextResponse.json(allItems, {
      headers: {
        'Cache-Control': 's-maxage=25, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('[api/feeds] Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to fetch feeds' }, { status: 500 });
  }
}
