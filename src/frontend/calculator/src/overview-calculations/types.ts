import {PeriodGraph} from '../types'

type OverviewCalculations = {
    cardsCalc: OverviewCardsCalc,
    statsCalc: OverviewStatsCalc,
    weeklySummaryCalc: OverviewWeeklySummaryCalc,
    accountReturnsGraphCalc: OverviewAccountReturnsGraphCalc
}

type OverviewCardsCalc = {
    totalBalance: number,
    noOfTrades: number,
    winRate: number,
    absGain: number,
}

type OverviewStatsCalc = {
    aveProfit: number,
    aveLoss: number,
    longsWonPercent: number,
    noOfLongsWon: number,
    noOfLongs: number,
    shortsWonPercent: number,
    noOfShortsWon: number,
    noOfShorts: number,
    bestTrade: number,
    worstTrade: number,
    highestBalance:number,
    aveRRR: number,
    profitFactor: number,
    expectancy: number,
    lots: number,
    commissions: number
}

type OverviewWeeklySummaryCalc = {
    [key: string]: {
        trades: number,
        lots: number,
        result: number
    }
}

type OverviewAccountReturnsGraphCalc = PeriodGraph<OverviewAccountReturnsGraphItem>

type OverviewAccountReturnsGraphItem = {
    tradeNo: number,
    result: number
}



export type {
    OverviewCalculations,
    OverviewCardsCalc,
    OverviewStatsCalc,
    OverviewWeeklySummaryCalc,
    OverviewAccountReturnsGraphCalc,
    OverviewAccountReturnsGraphItem
}