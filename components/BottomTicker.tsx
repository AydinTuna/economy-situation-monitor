'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ─────────────────────────────────────────
   Market definitions
───────────────────────────────────────── */
interface Session {
  open: { h: number; m: number };
  close: { h: number; m: number };
}

interface Market {
  key: string;
  label: string;
  tz: string;
  /** 0=Sun … 6=Sat */
  tradingDays: number[];
  sessions: Session[];
}

const MARKETS: Market[] = [
  {
    key: 'nyse',
    label: 'New York',
    tz: 'America/New_York',
    tradingDays: [1, 2, 3, 4, 5],
    sessions: [{ open: { h: 9, m: 30 }, close: { h: 16, m: 0 } }],
  },
  {
    key: 'lse',
    label: 'London',
    tz: 'Europe/London',
    tradingDays: [1, 2, 3, 4, 5],
    sessions: [{ open: { h: 8, m: 0 }, close: { h: 16, m: 30 } }],
  },
  {
    key: 'tse',
    label: 'Tokyo',
    tz: 'Asia/Tokyo',
    tradingDays: [1, 2, 3, 4, 5],
    sessions: [
      { open: { h: 9, m: 0 }, close: { h: 11, m: 30 } },
      { open: { h: 12, m: 30 }, close: { h: 15, m: 30 } },
    ],
  },
  {
    key: 'dfm',
    label: 'Dubai',
    tz: 'Asia/Dubai',
    tradingDays: [1, 2, 3, 4, 5], // Mon–Fri
    sessions: [{ open: { h: 10, m: 0 }, close: { h: 14, m: 45 } }],
  },
  {
    key: 'bist',
    label: 'Istanbul',
    tz: 'Europe/Istanbul',
    tradingDays: [1, 2, 3, 4, 5],
    sessions: [{ open: { h: 10, m: 0 }, close: { h: 18, m: 0 } }],
  },
];

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function getLocalParts(tz: string, now: Date) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    weekday: 'short',
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
  return {
    dayIndex: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday),
    h: parseInt(parts.hour, 10),
    m: parseInt(parts.minute, 10),
    s: parseInt(parts.second, 10),
  };
}

function toMinutes(h: number, m: number) {
  return h * 60 + m;
}

type MarketStatus =
  | { isOpen: true; secsToClose: number }
  | { isOpen: false; secsToNextOpen: number };

function getMarketStatus(market: Market, now: Date): MarketStatus {
  const { dayIndex, h, m, s } = getLocalParts(market.tz, now);
  const nowMins = toMinutes(h, m);
  const isTradingDay = market.tradingDays.includes(dayIndex);

  if (isTradingDay) {
    for (const session of market.sessions) {
      const openMins = toMinutes(session.open.h, session.open.m);
      const closeMins = toMinutes(session.close.h, session.close.m);
      if (nowMins >= openMins && nowMins < closeMins) {
        const secsToClose = (closeMins - nowMins) * 60 - s;
        return { isOpen: true, secsToClose };
      }
    }
  }

  // Find next open moment (scan up to 7 days ahead)
  for (let daysAhead = 0; daysAhead <= 7; daysAhead++) {
    const targetDay = (dayIndex + daysAhead) % 7;
    if (!market.tradingDays.includes(targetDay)) continue;

    for (const session of market.sessions) {
      const openMins = toMinutes(session.open.h, session.open.m);
      if (daysAhead === 0 && openMins <= nowMins) continue; // already passed today
      const minsUntilOpen =
        daysAhead === 0
          ? openMins - nowMins
          : daysAhead * 24 * 60 - nowMins + openMins;
      const secsToNextOpen = minsUntilOpen * 60 - s;
      return { isOpen: false, secsToNextOpen };
    }
  }

  return { isOpen: false, secsToNextOpen: 0 };
}

function formatHMS(totalSecs: number): string {
  const s = Math.max(0, totalSecs);
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return [hh, mm, ss].map((n) => String(n).padStart(2, '0')).join(':');
}

/* Format a UTC timestamp in user-selected offset */
function formatInOffset(now: Date, offsetHours: number): string {
  const ms = now.getTime() + offsetHours * 3600_000;
  const d = new Date(ms);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const ss = String(d.getUTCSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

/* Synthesise a short bell tone via Web Audio API */
function playBell() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.2);
    osc.onended = () => ctx.close();
  } catch {
    // Web Audio not available (SSR or restricted context)
  }
}

/* ─────────────────────────────────────────
   UTC offset options
───────────────────────────────────────── */
const TZ_OPTIONS: { label: string; value: number }[] = Array.from(
  { length: 55 },
  (_, i) => {
    const raw = -12 + i * 0.5;
    const sign = raw >= 0 ? '+' : '-';
    const abs = Math.abs(raw);
    const h = Math.floor(abs);
    const m = (abs % 1) * 60;
    return {
      label: `UTC${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
      value: raw,
    };
  }
);

const LS_KEY = 'preferred-tz';
const DEFAULT_OFFSET = 3;

/* ─────────────────────────────────────────
   Toast
───────────────────────────────────────── */
interface Toast {
  id: number;
  message: string;
  isOpen: boolean;
}

/* ─────────────────────────────────────────
   MarketCard
───────────────────────────────────────── */
interface MarketCardProps {
  market: Market;
  now: Date;
}

function MarketCard({ market, now }: MarketCardProps) {
  const status = getMarketStatus(market, now);

  return (
    <div className="flex items-center gap-2 px-3 border-r border-gray-800/60 shrink-0">
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-500 leading-none">
          {market.label}
        </span>
        {status.isOpen ? (
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[10px] font-mono text-emerald-400 tabular-nums leading-none">
              {formatHMS(status.secsToClose)}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 shrink-0" />
            <span className="text-[10px] font-mono text-gray-500 tabular-nums leading-none">
              {formatHMS(status.secsToNextOpen)}
            </span>
          </div>
        )}
        <span
          className={`text-[8px] font-bold uppercase tracking-widest leading-none ${
            status.isOpen ? 'text-emerald-600' : 'text-gray-700'
          }`}
        >
          {status.isOpen ? 'OPEN' : 'CLOSED'}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export default function BottomTicker() {
  const [now, setNow] = useState<Date>(() => new Date());
  const [tzOffset, setTzOffset] = useState<number>(DEFAULT_OFFSET);
  const [showTzMenu, setShowTzMenu] = useState(false);
  const [menuPos, setMenuPos] = useState<{ bottom: number; right: number } | null>(null);
  const tzBtnRef = useRef<HTMLButtonElement>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  // Previous open states for change detection
  const prevStates = useRef<Record<string, boolean>>({});

  // Inner list ref for overflow detection
  const innerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  // Load timezone from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored !== null) setTzOffset(parseFloat(stored));
    } catch {
      // localStorage unavailable
    }
  }, []);

  // Tick every second
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Detect open/close transitions and fire bell + toast
  const addToast = useCallback((message: string, isOpen: boolean) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, message, isOpen }]);
    playBell();
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    for (const market of MARKETS) {
      const status = getMarketStatus(market, now);
      const prev = prevStates.current[market.key];
      if (prev !== undefined && prev !== status.isOpen) {
        addToast(
          status.isOpen
            ? `${market.label} opened`
            : `${market.label} closed`,
          status.isOpen
        );
      }
      prevStates.current[market.key] = status.isOpen;
    }
  }, [now, addToast]);

  // Overflow detection
  useEffect(() => {
    const inner = innerRef.current;
    const container = containerRef.current;
    if (!inner || !container) return;
    const obs = new ResizeObserver(() => {
      setShouldScroll(inner.scrollWidth > container.clientWidth);
    });
    obs.observe(inner);
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  function toggleTzMenu() {
    if (showTzMenu) {
      setShowTzMenu(false);
      return;
    }
    if (tzBtnRef.current) {
      const rect = tzBtnRef.current.getBoundingClientRect();
      setMenuPos({
        bottom: window.innerHeight - rect.top + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setShowTzMenu(true);
  }

  function handleTzChange(value: number) {
    setTzOffset(value);
    setShowTzMenu(false);
    try {
      localStorage.setItem(LS_KEY, String(value));
    } catch {
      // localStorage unavailable
    }
  }

  // Close menu on outside click
  useEffect(() => {
    if (!showTzMenu) return;
    function handleClick(e: MouseEvent) {
      if (tzBtnRef.current && !tzBtnRef.current.contains(e.target as Node)) {
        setShowTzMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showTzMenu]);

  const tzLabel =
    TZ_OPTIONS.find((o) => o.value === tzOffset)?.label ??
    `UTC+${tzOffset}`;

  return (
    <>
      {/* Toast notifications */}
      <div className="fixed bottom-12 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-3 py-2 rounded text-xs font-semibold shadow-lg animate-fade-in border ${
              t.isOpen
                ? 'bg-emerald-900/90 border-emerald-700 text-emerald-300'
                : 'bg-gray-800/90 border-gray-700 text-gray-300'
            }`}
          >
            {t.isOpen ? '🔔 ' : '🔕 '}
            {t.message}
          </div>
        ))}
      </div>

      {/* TZ dropdown — fixed so it clears iframes and overflow-hidden parents */}
      {showTzMenu && menuPos && (
        <div
          className="fixed w-36 max-h-52 overflow-y-auto bg-gray-900 border border-gray-700 rounded shadow-xl scrollbar-thin"
          style={{ bottom: menuPos.bottom, right: menuPos.right, zIndex: 9999 }}
        >
          <div className="px-2 py-1 text-[9px] uppercase tracking-wider text-gray-600 border-b border-gray-800 sticky top-0 bg-gray-900">
            Timezone
          </div>
          {TZ_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleTzChange(opt.value)}
              className={`w-full text-left px-2 py-1 text-[11px] hover:bg-gray-800 transition-colors ${
                opt.value === tzOffset
                  ? 'text-blue-400 font-semibold'
                  : 'text-gray-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Bottom ticker band */}
      <div className="relative w-full shrink-0 h-10 bg-gray-900 border-t border-gray-800 overflow-hidden flex items-center z-20">
        {/* Label */}
        <div className="absolute left-0 top-0 h-full flex items-center px-2 bg-gray-900 z-20 border-r border-gray-800 shrink-0">
          <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400 whitespace-nowrap">
            MARKETS
          </span>
        </div>

        {/* Left fade */}
        <div className="absolute left-[60px] top-0 h-full w-4 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />

        {/* Scrollable market cards */}
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden pl-[68px] pr-[120px]"
        >
          <div
            ref={innerRef}
            className={`flex items-center h-full ${shouldScroll ? 'animate-ticker-slow' : ''}`}
          >
            {shouldScroll
              ? [...MARKETS, ...MARKETS].map((market, idx) => (
                  <MarketCard key={`${market.key}-${idx}`} market={market} now={now} />
                ))
              : MARKETS.map((market) => (
                  <MarketCard key={market.key} market={market} now={now} />
                ))}
          </div>
        </div>

        {/* Right fade */}
        <div className="absolute right-[110px] top-0 h-full w-4 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />

        {/* Clock + TZ selector */}
        <div className="absolute right-0 top-0 h-full flex items-center gap-1.5 px-2 bg-gray-900 border-l border-gray-800 z-20">
          <span className="text-[10px] font-mono tabular-nums text-gray-400">
            {formatInOffset(now, tzOffset)}
          </span>

          <div className="relative">
            <button
              ref={tzBtnRef}
              onClick={toggleTzMenu}
              title="Change timezone"
              className="flex items-center justify-center w-5 h-5 rounded hover:bg-gray-800 transition-colors text-gray-600 hover:text-gray-300"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
              </svg>
            </button>
          </div>

          <span className="text-[9px] text-gray-700 font-mono">
            {tzLabel}
          </span>
        </div>
      </div>
    </>
  );
}
