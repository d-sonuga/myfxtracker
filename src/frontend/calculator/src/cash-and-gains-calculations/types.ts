import {PeriodGraph} from '../types'

type CashAndGainsCalculations = {
    cashGraphCalc: CashGraphCalc,
    gainsGraphCalc: GainsGraphCalc
}

type CashGraphCalc = PeriodGraph<CashGraphItem>

type CashGraphItem = {
    tradeNo: number,
    balance: number
}

type GainsGraphCalc = PeriodGraph<GainsGraphItem>

type GainsGraphItem = {
    tradeNo: number,
    gainsPercent: number
}

export type {
    CashAndGainsCalculations,
    CashGraphCalc,
    GainsGraphCalc,
    CashGraphItem,
    GainsGraphItem
}