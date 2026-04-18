import NewsFeed from '@/components/NewsFeed';
import VideoGrid from '@/components/VideoGrid';
import BottomTicker from '@/components/BottomTicker';

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-emerald-500 to-blue-500 z-10" />

      {/* Main content area */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden pt-[2px]">
        {/* News Feed — top strip on small/medium, left panel on large */}
        <aside className="h-[38vh] lg:h-auto lg:w-[380px] shrink-0 flex flex-col overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-800 bg-gray-950">
          <NewsFeed />
        </aside>

        {/* Live Streams — scrollable on small/medium, fixed grid on large */}
        <main className="flex-1 overflow-y-auto lg:overflow-hidden bg-gray-950">
          <VideoGrid />
        </main>
      </div>

      {/* Exchange hours ticker — bottom */}
      <BottomTicker />
    </div>
  );
}
