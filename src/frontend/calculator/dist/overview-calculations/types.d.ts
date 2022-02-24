import { PeriodGraph } from '../types';
declare type OverviewCalculations = {
    cardsCalc: OverviewCardsCalc;
    statsCalc: OverviewStatsCalc;
    weeklySummaryCalc: OverviewWeeklySummaryCalc;
    accountReturnsGraphCalc: OverviewAccountReturnsGraphCalc;
};
declare type OverviewCardsCalc = {
    totalBalance: number;
    noOfTrades: number;
    winRate: number;
    absGain: number;
};
declare type OverviewStatsCalc = {
    aveProfit: number;
    aveLoss: number;
    longsWonPercent: number;
    noOfLongsWon: number;
    noOfLongs: number;
    shortsWonPercent: number;
    noOfShortsWon: number;
    noOfShorts: number;
    bestTrade: number;
    worstTrade: number;
    highestBalance: number;
    aveRRR: number;
    profitFactor: number;
    expectancy: number;
    lots: number;
    commissions: number;
};
declare type OverviewWeeklySummaryCalc = {
    [key: string]: {
        trades: number;
        lots: number;
        result: number;
    };
};
declare type OverviewAccountReturnsGraphCalc = PeriodGraph<OverviewAccountReturnsGraphItem>;
declare type OverviewAccountReturnsGraphItem = {
    tradeNo: number;
    result: number;
};
export type { OverviewCalculations, OverviewCardsCalc, OverviewStatsCalc, OverviewWeeklySummaryCalc, OverviewAccountReturnsGraphCalc, OverviewAccountReturnsGraphItem };
//# sourceMappingURL=types.d.ts.map