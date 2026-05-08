import NewsFeed from '@/components/NewsFeed';
import DashboardShell from '@/components/DashboardShell';
import TradingViewPanel from '@/components/TradingViewPanel';
import BottomTicker from '@/components/BottomTicker';

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-emerald-500 to-blue-500 z-10" />

      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden pt-[2px]">
        <aside className="flex flex-col min-h-0 h-[42vh] lg:h-auto lg:w-[460px] shrink-0 overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-800 bg-gray-950">
          <TradingViewPanel />
        </aside>

        <DashboardShell />

        <aside className="h-[38vh] lg:h-auto lg:w-[380px] shrink-0 flex flex-col overflow-hidden border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-950">
          <NewsFeed />
        </aside>
      </div>

      <BottomTicker />
    </div>
  );
}
