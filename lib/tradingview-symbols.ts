/** Matches `gray-950` / `globals.css` `--app-surface` */
export const APP_SURFACE_HEX = '#030712';

/** Symbol Overview rows: [label, symbol|interval] */
export const TV_SYMBOL_OVERVIEW_ROWS: [string, string][] = [
  ['BTC / USD', 'BINANCE:BTCUSDT|1D'],
  ['ETH / USD', 'BINANCE:ETHUSDT|1D'],
  ['BIST 100', 'BIST:XU100|1D'],
  ['S&P 500', 'SP:SPX|1D'],
  ['SPY', 'AMEX:SPY|1D'],
  ['Gold', 'TVC:GOLD|1D'],
  ['EUR / USD', 'FX_IDC:EURUSD|1D'],
  ['USD / TRY', 'FX_IDC:USDTRY|1D'],
];

/** Ticker tape: proName + short title */
export const TV_TICKER_ITEMS: { proName: string; title: string }[] = [
  { proName: 'BINANCE:BTCUSDT', title: 'BTC' },
  { proName: 'BINANCE:ETHUSDT', title: 'ETH' },
  { proName: 'BIST:XU100', title: 'BIST 100' },
  { proName: 'AMEX:SPY', title: 'SPY' },
  { proName: 'TVC:GOLD', title: 'Gold' },
  { proName: 'FX_IDC:USDTRY', title: 'USD/TRY' },
  { proName: 'FX_IDC:EURUSD', title: 'EUR/USD' },
  { proName: 'FX_IDC:EURTRY', title: 'EUR/TRY' },
  { proName: 'SP:SPX', title: 'S&P 500' },
  { proName: 'NASDAQ:NDX', title: 'Nasdaq 100' },
];

export function tradingViewSymbolOverviewSrc(): string {
  const config = {
    symbols: TV_SYMBOL_OVERVIEW_ROWS,
    chartOnly: false,
    dateRange: '12M' as const,
    showVolume: false,
    colorTheme: 'dark' as const,
    isTransparent: false,
    backgroundColor: APP_SURFACE_HEX,
    locale: 'en',
    autosize: true,
  };
  return `https://www.tradingview-widget.com/embed-widget/symbol-overview/?locale=en#${encodeURIComponent(JSON.stringify(config))}`;
}

export function tradingViewTickerTapeSrc(): string {
  const config = {
    symbols: TV_TICKER_ITEMS,
    colorTheme: 'dark' as const,
    isTransparent: false,
    backgroundColor: APP_SURFACE_HEX,
    showSymbolLogo: true,
    displayMode: 'regular' as const,
    locale: 'en',
    width: '100%',
    height: 46,
  };
  return `https://www.tradingview-widget.com/embed-widget/ticker-tape/?locale=en#${encodeURIComponent(JSON.stringify(config))}`;
}
