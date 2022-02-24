declare type LongShortAnalysisCalculations = {
    longShortComparisonTableCalc: LongShortComparisonTableCalc;
    longShortComparisonGraphCalc: LongShortComparisonGraphCalc;
    longBalanceGraphCalc: LongBalanceGraphCalc;
    shortBalanceGraphCalc: ShortBalanceGraphCalc;
};
declare type LongShortComparisonTableCalc = {
    long: {
        noOfTrades: number;
        result: number;
        winRate: number;
        aveProfit: number;
        rrr: number;
    };
    short: {
        noOfTrades: number;
        result: number;
        winRate: number;
        aveProfit: number;
        rrr: number;
    };
};
declare type LongShortComparisonGraphCalc = [
    {
        label: 'long';
        result: number;
    },
    {
        label: 'short';
        result: number;
    }
];
declare type ShortBalanceGraphCalc = Array<BalanceGraphItem>;
declare type LongBalanceGraphCalc = Array<BalanceGraphItem>;
declare type BalanceGraphItem = {
    tradeNo: number;
    result: number;
};
export type { LongShortAnalysisCalculations, LongShortComparisonTableCalc, LongShortComparisonGraphCalc, LongBalanceGraphCalc, ShortBalanceGraphCalc };
//# sourceMappingURL=types.d.ts.map