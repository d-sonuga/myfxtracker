import {OpenHourTableCalc, TimeAnalysisGraphCalc,
    TradeDurationTableCalc, TradingTimeAnalysisCalculations} from 'calculator';

const defaultTradeDurationTableCalc: TradeDurationTableCalc =  [];

const defaultOpenHourCalc: OpenHourTableCalc = [];

const defaultTimeAnalysisGraphCalc: TimeAnalysisGraphCalc = {
    todayGraphCalc: [],
    thisWeekGraphCalc: [],
    thisMonthGraphCalc: [],
    thisYearGraphCalc: [],
    allTimeGraphCalc: []
}

const defaultTradingTimeAnalysis: TradingTimeAnalysisCalculations = {
    timeAnalysisGraphCalc: defaultTimeAnalysisGraphCalc,
    tradeDurationTableCalc: defaultTradeDurationTableCalc,
    openHourTableCalc: defaultOpenHourCalc
}

export default defaultTradingTimeAnalysis   