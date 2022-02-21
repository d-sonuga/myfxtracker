import {OverviewCalculations, OverviewCardsCalc, OverviewStatsCalc,
    OverviewWeeklySummaryCalc, OverviewAccountReturnsGraphCalc} from 'calculator'
import {OverviewAccountReturnsGraphItem} from 'calculator/dist/overview-calculations/types'

const defaultCardsCalc: OverviewCardsCalc = {
    totalBalance: 0,
    noOfTrades: 0,
    winRate: 0,
    absGain: 0
}

const defaultStatsCalc: OverviewStatsCalc = {
    aveProfit: 0,
    aveLoss: 0,
    longsWonPercent: 0,
    noOfLongsWon: 0,
    noOfLongs: 0,
    shortsWonPercent: 0,
    noOfShortsWon: 0,
    noOfShorts: 0,
    bestTrade: 0,
    worstTrade: 0,
    highestBalance:0,
    aveRRR: 0,
    profitFactor: 0,
    expectancy: 0,
    lots: 0,
    commissions: 0
}

const defaultWeeklySummaryCalc: OverviewWeeklySummaryCalc = {
    
}

const defaultAccountReturnsGraphItem: OverviewAccountReturnsGraphItem[] = [];
const defaultAccountReturnsGraphCalc: OverviewAccountReturnsGraphCalc = {
    todayGraphCalc: defaultAccountReturnsGraphItem,
    thisWeekGraphCalc: defaultAccountReturnsGraphItem,
    thisMonthGraphCalc: defaultAccountReturnsGraphItem,
    thisYearGraphCalc: defaultAccountReturnsGraphItem,
    allTimeGraphCalc: defaultAccountReturnsGraphItem
}

const defaultOverviewCalc: OverviewCalculations = {
    cardsCalc: defaultCardsCalc,
    statsCalc: defaultStatsCalc,
    weeklySummaryCalc: defaultWeeklySummaryCalc,
    accountReturnsGraphCalc: defaultAccountReturnsGraphCalc
}

export default defaultOverviewCalc