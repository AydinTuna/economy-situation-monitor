import { tradingViewSymbolOverviewSrc } from '@/lib/tradingview-symbols';

export default function TradingViewPanel() {
  const src = tradingViewSymbolOverviewSrc();

  return (
    <div className="flex flex-col h-full min-h-0" style={{ backgroundColor: 'var(--app-surface)' }}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-800 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          TradingView
        </h2>
        <span className="text-[10px] text-gray-600">Symbol overview</span>
      </div>
      <div className="flex-1 min-h-0 min-w-0 relative" style={{ backgroundColor: 'var(--app-surface)' }}>
        <iframe
          title="TradingView symbol overview"
          src={src}
          className="absolute inset-0 w-full h-full border-0"
          style={{ backgroundColor: 'var(--app-surface)' }}
          allow="clipboard-write"
        />
      </div>
    </div>
  );
}
