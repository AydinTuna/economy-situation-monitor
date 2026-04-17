import NewsFeed from '@/components/NewsFeed';
import VideoGrid from '@/components/VideoGrid';

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Gradient top bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-emerald-500 to-blue-500 z-10" />

      {/* News Feed — top strip on mobile, left panel on desktop */}
      <aside className="h-[38vh] md:h-auto md:w-[380px] shrink-0 flex flex-col overflow-hidden border-b md:border-b-0 md:border-r border-gray-800 bg-gray-950 pt-[2px]">
        <NewsFeed />
      </aside>

      {/* Live Streams — scrollable on mobile, fixed grid on desktop */}
      <main className="flex-1 overflow-y-auto md:overflow-hidden bg-gray-950 pt-[2px]">
        <VideoGrid />
      </main>
    </div>
  );
}
