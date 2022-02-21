import {AccountData} from '@root/types'
import tradeDurationTableCalc from './trade-duration-table-calc'
import openHourTableCalc from './open-hour-table-calc'
import timeAnalysisGraphCalc from './time-analysis-graph-calc'
import {TradingTimeAnalysisCalculations} from './types'


const tradingTimeAnalysisCalculations = (accountData: AccountData) => {
    const calculations: TradingTimeAnalysisCalculations = {
        tradeDurationTableCalc: tradeDurationTableCalc(accountData),
        openHourTableCalc: openHourTableCalc(accountData),
        timeAnalysisGraphCalc: timeAnalysisGraphCalc(accountData)
    }
    return calculations
}

export default tradingTimeAnalysisCalculations