import { FOTrendStock } from '../types/index.ts';

export const FO_NIFTY50_TRENDS: FOTrendStock[] = [
  {
    id: 'fo-zomato',
    symbol: 'ZOMATO',
    name: 'Zomato Ltd (Eternal)',
    sector: 'Consumer Tech',
    nifty50Category: 'Inclusion Contender',
    spotPrice: 284.60,
    futurePrice: 286.20,
    basis: 1.60,
    changePercent: 2.15,
    oiChangePercent: 16.8, // Heavy OI surge
    oiContracts: 48200,
    oiTrend: 'Long Buildup',
    pcrRatio: 1.42, // Bullish PCR
    maxPainStrike: 280.0,
    atmIV: 34.2,
    rsi14: 68.4,
    vwap: 281.80,
    isAboveVwap: true,
    timing: {
      status: 'BUY_NOW',
      headline: 'RIGHT TIME TO BUY NOW - Optimal Breakout Entry Active',
      actionPrompt: 'High conviction buying window currently open. Current spot ₹284.60 is sustaining above VWAP (₹281.80) with 285 CE call short-covering underway. Enter long position with strict stop-loss at ₹272.',
      validityWindow: 'Active right now (Next 15–20 minutes optimal before next leg)',
      checklist: {
        candleSignal: '15-Minute Bullish Candle close above prior resistance',
        vwapStatus: 'Trading +₹2.80 above intraday VWAP with rising slope',
        volumeConfirmation: '2.4x average 30-day volume surge on breakout',
        derivativesOrderFlow: 'Aggressive 280 PE put writing (+42,000 contracts added)'
      }
    },
    recommendation: {
      action: 'STRONG_BUY',
      confidencePercent: 94,
      entryRange: '₹282 - ₹285',
      targetPrice: 310.0,
      stopLoss: 272.0,
      riskRewardRatio: '1:2.8',
      timeHorizon: 'Positional (1-2 Weeks)',
      rationale: 'Massive long buildup with +16.8% OI expansion while holding firmly above VWAP. Heavy call unwinding at 285 CE and aggressive put writing at 280 PE confirming institutional front-running ahead of Nifty 50 inclusion.',
      rebalanceImpact: 'Expected ₹3,850 Cr passive ETF buying on effective listing day; derivative desk positioning reflects pre-inclusion accumulation.'
    }
  },
  {
    id: 'fo-trent',
    symbol: 'TRENT',
    name: 'Trent Ltd',
    sector: 'Retail & Fashion',
    nifty50Category: 'Inclusion Contender',
    spotPrice: 7420.00,
    futurePrice: 7455.00,
    basis: 35.00,
    changePercent: 1.84,
    oiChangePercent: 12.4,
    oiContracts: 21500,
    oiTrend: 'Long Buildup',
    pcrRatio: 1.35,
    maxPainStrike: 7300.0,
    atmIV: 29.8,
    rsi14: 71.2,
    vwap: 7380.00,
    isAboveVwap: true,
    timing: {
      status: 'WAIT_FOR_DIP',
      headline: 'DO NOT CHASE NOW - Wait for Pullback to ₹7,380-₹7,400',
      actionPrompt: 'Intraday 14-period RSI is extended at 71.2 near daily upper Bollinger Band. Avoid chasing at ₹7,420. The optimal right time to buy will trigger on a retest of VWAP support around ₹7,380.',
      validityWindow: 'Trigger pending: Wait for retracement into entry range',
      checklist: {
        candleSignal: 'Consolidating near day highs; awaiting 5M candle pullback',
        vwapStatus: 'Overextended +₹40 above VWAP; mean reversion dip expected',
        volumeConfirmation: 'Steady institutional flow, but short-term profit taking visible',
        derivativesOrderFlow: '7400 CE seeing slight writing; wait for dip absorption'
      }
    },
    recommendation: {
      action: 'BUY_ON_DIPS',
      confidencePercent: 91,
      entryRange: '₹7,360 - ₹7,410',
      targetPrice: 7850.0,
      stopLoss: 7190.0,
      riskRewardRatio: '1:2.4',
      timeHorizon: 'Positional (1-2 Weeks)',
      rationale: 'Consistent long rollover with positive basis (+₹35). Retail and institutional call open interest shifted up from 7200 to 7600 strikes. Strong momentum indicator with RSI at 71 in strong trend mode.',
      rebalanceImpact: 'Projected ₹3,510 Cr passive index inflow; highest annualized alpha (+44.8%) in the eligible universe.'
    }
  },
  {
    id: 'fo-jiofin',
    symbol: 'JIOFIN',
    name: 'Jio Financial Services Ltd',
    sector: 'Financial Services',
    nifty50Category: 'Inclusion Contender',
    spotPrice: 348.50,
    futurePrice: 349.80,
    basis: 1.30,
    changePercent: 0.72,
    oiChangePercent: 8.6,
    oiContracts: 38400,
    oiTrend: 'Long Buildup',
    pcrRatio: 1.18,
    maxPainStrike: 345.0,
    atmIV: 31.5,
    rsi14: 61.5,
    vwap: 346.20,
    isAboveVwap: true,
    timing: {
      status: 'BUY_NOW',
      headline: 'RIGHT TIME TO BUY NOW - Coiling at ₹348 Resistance Barrier',
      actionPrompt: 'Right time to initiate long position. Price is respecting ₹346.20 VWAP cushion with steady put addition at 345 strike. A breakout above ₹350 could cause rapid short squeeze.',
      validityWindow: 'Active session timing (Pre-breakout positioning)',
      checklist: {
        candleSignal: 'Higher lows forming on 30-min chart',
        vwapStatus: 'Safely holding above VWAP with tight standard deviation bands',
        volumeConfirmation: 'Gradual volume buildup ahead of afternoon session',
        derivativesOrderFlow: 'Puts added at 345 & 340 strikes creating firm support base'
      }
    },
    recommendation: {
      action: 'STRONG_BUY',
      confidencePercent: 86,
      entryRange: '₹345 - ₹348',
      targetPrice: 380.0,
      stopLoss: 332.0,
      riskRewardRatio: '1:2.1',
      timeHorizon: 'Intraday / BTST',
      rationale: 'Sustained basis premium and put addition at 340 strike forming solid psychological floor. Breakout above 350 barrier could trigger fast gamma squeeze towards 370-380 zone.',
      rebalanceImpact: 'Expected ₹2,390 Cr passive inflow upon formal inclusion confirmation.'
    }
  },
  {
    id: 'fo-indusind',
    symbol: 'INDUSINDBK',
    name: 'IndusInd Bank Ltd',
    sector: 'Banking',
    nifty50Category: 'Endangered Constituent',
    spotPrice: 980.50,
    futurePrice: 976.20,
    basis: -4.30, // Future discount
    changePercent: -1.45,
    oiChangePercent: 19.4, // Massive short buildup
    oiContracts: 54100,
    oiTrend: 'Short Buildup',
    pcrRatio: 0.58, // Heavy call writing / Bearish
    maxPainStrike: 1000.0,
    atmIV: 36.8,
    rsi14: 31.2,
    vwap: 988.40,
    isAboveVwap: false,
    timing: {
      status: 'SELL_SHORT_NOW',
      headline: 'RIGHT TIME TO SELL / SHORT NOW - Fresh Breakdown Underway',
      actionPrompt: 'Optimal shorting window active right now. Stock breached crucial ₹985 support on high volume with future trading at steep -₹4.30 discount. Place stop-loss at ₹1,010 for immediate target ₹920.',
      validityWindow: 'Immediate execution window active',
      checklist: {
        candleSignal: 'Clear breakdown candle below 50-DMA and morning swing low',
        vwapStatus: 'Rejected hard -₹7.90 below VWAP; bears in full command',
        volumeConfirmation: '3.1x surge in sell volume on futures contract',
        derivativesOrderFlow: 'Massive call writing at 1000 CE (+65,000 contracts added)'
      }
    },
    recommendation: {
      action: 'SELL_SHORT',
      confidencePercent: 93,
      entryRange: '₹982 - ₹990',
      targetPrice: 920.0,
      stopLoss: 1010.0,
      riskRewardRatio: '1:2.9',
      timeHorizon: 'Positional (1-2 Weeks)',
      rationale: 'Deep future discount (basis -₹4.30) with +19.4% surge in open interest signifies aggressive institutional short additions. Put unwinding at 1000 PE and heavy call writing at 1000 CE & 1020 CE create relentless supply overhead.',
      rebalanceImpact: 'Imminent 15-day exclusion threat triggers ₹1,870 Cr passive mutual fund dump. High probability of ongoing liquidation pressure.'
    }
  },
  {
    id: 'fo-bpcl',
    symbol: 'BPCL',
    name: 'Bharat Petroleum Corp Ltd',
    sector: 'Oil & Gas',
    nifty50Category: 'Endangered Constituent',
    spotPrice: 312.40,
    futurePrice: 311.10,
    basis: -1.30,
    changePercent: -0.80,
    oiChangePercent: 11.2,
    oiContracts: 32600,
    oiTrend: 'Short Buildup',
    pcrRatio: 0.64,
    maxPainStrike: 320.0,
    atmIV: 28.5,
    rsi14: 38.6,
    vwap: 314.50,
    isAboveVwap: false,
    timing: {
      status: 'SELL_SHORT_NOW',
      headline: 'RIGHT TIME TO SELL / SHORT NOW - Rejection at ₹314.50 VWAP',
      actionPrompt: 'Right time to short or exit long hedges. Multiple intraday attempts to reclaim VWAP have failed. Put buyers dominating order book with expectation of further slide toward ₹292.',
      validityWindow: 'Short timing active on intraday bounces to ₹313-₹314',
      checklist: {
        candleSignal: 'Bearish rejection wick at session VWAP line',
        vwapStatus: 'Pinned below VWAP continuously for 6 consecutive 15M candles',
        volumeConfirmation: 'Weak buying volume on bounces; sell volume accelerating',
        derivativesOrderFlow: 'Call open interest shifting downward to 315 strike'
      }
    },
    recommendation: {
      action: 'SELL_SHORT',
      confidencePercent: 88,
      entryRange: '₹314 - ₹318',
      targetPrice: 292.0,
      stopLoss: 324.0,
      riskRewardRatio: '1:2.3',
      timeHorizon: 'Expiry Swing',
      rationale: 'Trading below all key short-term exponential moving averages and VWAP. Negative basis and sub-0.70 PCR indicate option sellers are hedging against imminent rebalance exclusion.',
      rebalanceImpact: 'Facing ₹1,760 Cr outflow across CPSE and Nifty 50 passive index trackers.'
    }
  },
  {
    id: 'fo-hdfcbank',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    sector: 'Banking',
    nifty50Category: 'Existing Constituent',
    spotPrice: 1682.00,
    futurePrice: 1686.50,
    basis: 4.50,
    changePercent: 1.15,
    oiChangePercent: -4.2,
    oiContracts: 89400,
    oiTrend: 'Short Covering',
    pcrRatio: 1.22,
    maxPainStrike: 1680.0,
    atmIV: 18.2,
    rsi14: 58.7,
    vwap: 1675.20,
    isAboveVwap: true,
    timing: {
      status: 'BUY_NOW',
      headline: 'RIGHT TIME TO BUY NOW - Short Covering Rally Confirmed',
      actionPrompt: 'Right time to buy. Bears forced to cover as spot trades comfortably above ₹1,680 max pain. Positive basis (+₹4.50) indicates derivative traders are turning aggressively net-long.',
      validityWindow: 'Active session timing (Momentum underway)',
      checklist: {
        candleSignal: 'Clean breakout above 1675 intraday pivot',
        vwapStatus: '+₹6.80 above VWAP with strong buying volume',
        volumeConfirmation: 'Highest 1-hour volume of the week',
        derivativesOrderFlow: '1680 CE open interest down -18% (Panicked short-covering)'
      }
    },
    recommendation: {
      action: 'BUY_ON_DIPS',
      confidencePercent: 82,
      entryRange: '₹1,670 - ₹1,680',
      targetPrice: 1740.0,
      stopLoss: 1645.0,
      riskRewardRatio: '1:2.0',
      timeHorizon: 'Positional (1-2 Weeks)',
      rationale: 'Short covering evidenced by rising price (+1.15%) with falling open interest (-4.2%). Highest weight in Nifty 50; strong support at 1660 strike where puts are heavily written.',
      rebalanceImpact: 'Anchor constituent; steady weight preservation in semi-annual review ensures stable ETF baseline.'
    }
  },
  {
    id: 'fo-reliance',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    sector: 'Conglomerate / Energy',
    nifty50Category: 'Existing Constituent',
    spotPrice: 2985.00,
    futurePrice: 2992.00,
    basis: 7.00,
    changePercent: 0.85,
    oiChangePercent: 5.6,
    oiContracts: 72100,
    oiTrend: 'Long Buildup',
    pcrRatio: 1.14,
    maxPainStrike: 2960.0,
    atmIV: 21.4,
    rsi14: 63.1,
    vwap: 2972.40,
    isAboveVwap: true,
    timing: {
      status: 'WAIT_FOR_DIP',
      headline: 'WAIT FOR DIP - Key Resistance at ₹3,000 Approaching',
      actionPrompt: 'Approaching major psychological hurdle at ₹3,000 round strike where maximum call open interest is concentrated. Wait for pullback towards ₹2,970 before initiating fresh long positions.',
      validityWindow: 'Wait for test of ₹2,970 support',
      checklist: {
        candleSignal: 'Doji candle on 15M chart showing hesitation near 3,000',
        vwapStatus: 'Holding above VWAP but distance narrowing',
        volumeConfirmation: 'Normalizing after early morning opening spike',
        derivativesOrderFlow: 'Heavy 3000 CE call writing capping immediate upside'
      }
    },
    recommendation: {
      action: 'BUY_ON_DIPS',
      confidencePercent: 85,
      entryRange: '₹2,965 - ₹2,980',
      targetPrice: 3120.0,
      stopLoss: 2910.0,
      riskRewardRatio: '1:2.1',
      timeHorizon: 'Positional (1-2 Weeks)',
      rationale: 'Long buildup supported by positive futures premium (+₹7). Bullish divergence on 1-hour chart with strong bounce off 2960 max pain strike.',
      rebalanceImpact: 'Core Nifty 50 bellwether with ~9.5% weight; benefit from overall passive market liquidity inflows.'
    }
  },
  {
    id: 'fo-wipro',
    symbol: 'WIPRO',
    name: 'Wipro Ltd',
    sector: 'IT Services',
    nifty50Category: 'Endangered Constituent',
    spotPrice: 532.10,
    futurePrice: 531.00,
    basis: -1.10,
    changePercent: -0.90,
    oiChangePercent: 7.4,
    oiContracts: 26800,
    oiTrend: 'Short Buildup',
    pcrRatio: 0.72,
    maxPainStrike: 540.0,
    atmIV: 26.1,
    rsi14: 42.0,
    vwap: 535.80,
    isAboveVwap: false,
    timing: {
      status: 'SELL_SHORT_NOW',
      headline: 'RIGHT TIME TO SELL / SHORT NOW - Weak Momentum Below ₹535',
      actionPrompt: 'Sell / Short window active. Stock rejected from 540 strike with fresh call open interest added. Negative basis and weak relative strength versus Nifty IT index.',
      validityWindow: 'Short trigger active below ₹535.80 VWAP',
      checklist: {
        candleSignal: 'Bearish continuation pattern on 1-hour time frame',
        vwapStatus: 'Trading -₹3.70 below VWAP; lower highs persisting',
        volumeConfirmation: 'Selling pressure on every intraday up-tick',
        derivativesOrderFlow: '540 CE call wall firmly established by institutional writers'
      }
    },
    recommendation: {
      action: 'SELL_SHORT',
      confidencePercent: 81,
      entryRange: '₹534 - ₹538',
      targetPrice: 508.0,
      stopLoss: 546.0,
      riskRewardRatio: '1:2.4',
      timeHorizon: 'Expiry Swing',
      rationale: 'Constant resistance at 540 strike with fresh call additions. Weak basis discount indicating derivative market caution.',
      rebalanceImpact: 'Candidate for replacement in next 1 month cycle with ₹2,210 Cr projected passive ETF outflow.'
    }
  }
];
