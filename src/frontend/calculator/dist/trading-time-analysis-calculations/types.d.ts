import { PeriodGraph } from "../types";
declare type TradingTimeAnalysisCalculations = {
    tradeDurationTableCalc: TradeDurationTableCalc;
    openHourTableCalc: OpenHourTableCalc;
    timeAnalysisGraphCalc: TimeAnalysisGraphCalc;
};
declare type TradeDurationTableCalc = Array<TradeDurationTableCalcItem>;
declare type TradeDurationTableCalcItem = {
    duration: string;
    noOfTrades: number;
    result: number;
};
declare type OpenHourTableCalc = Array<OpenHourTableCalcItem>;
declare type OpenHourTableCalcItem = {
    hour: string;
    noOfTrades: number;
    result: number;
};
declare type TimeAnalysisGraphCalc = PeriodGraph<TimeAnalysisGraphCalcItem>;
declare type TimeAnalysisGraphCalcItem = {
    openHour: string;
    result: number;
};
export type { TradingTimeAnalysisCalculations, TradeDurationTableCalc, TradeDurationTableCalcItem, OpenHourTableCalc, OpenHourTableCalcItem, TimeAnalysisGraphCalc, TimeAnalysisGraphCalcItem };
//# sourceMappingURL=types.d.ts.map