import {PeriodGraph} from '@root/types'

type TradingTimeAnalysisCalculations = {
    tradeDurationTableCalc: TradeDurationTableCalc,
    openHourTableCalc: OpenHourTableCalc,
    timeAnalysisGraphCalc: TimeAnalysisGraphCalc
}

type TradeDurationTableCalc = Array<TradeDurationTableCalcItem>

type TradeDurationTableCalcItem = {
    duration: string,
    noOfTrades: number,
    result: number
}

type OpenHourTableCalc = Array<OpenHourTableCalcItem>

type OpenHourTableCalcItem = {
    hour: string,
    noOfTrades: number,
    result: number
}

type TimeAnalysisGraphCalc = PeriodGraph<TimeAnalysisGraphCalcItem>

type TimeAnalysisGraphCalcItem = {
    openHour: string,
    result: number
}

export type {
    TradingTimeAnalysisCalculations,
    TradeDurationTableCalc,
    TradeDurationTableCalcItem,
    OpenHourTableCalc,
    OpenHourTableCalcItem,
    TimeAnalysisGraphCalc,
    TimeAnalysisGraphCalcItem
}