import { PeriodGraph } from '../types';
declare type CashAndGainsCalculations = {
    cashGraphCalc: CashGraphCalc;
    gainsGraphCalc: GainsGraphCalc;
};
declare type CashGraphCalc = PeriodGraph<CashGraphItem>;
declare type CashGraphItem = {
    tradeNo: number;
    balance: number;
};
declare type GainsGraphCalc = PeriodGraph<GainsGraphItem>;
declare type GainsGraphItem = {
    tradeNo: number;
    gainsPercent: number;
};
export type { CashAndGainsCalculations, CashGraphCalc, GainsGraphCalc, CashGraphItem, GainsGraphItem };
//# sourceMappingURL=types.d.ts.map