import {AccountData} from '@root/types'
import {TimeAnalysisGraphCalc} from './types'


const timeAnalysisGraphCalc = (accountData: AccountData) => {
    const calculations: TimeAnalysisGraphCalc = {
        todayGraphCalc: [],
        thisWeekGraphCalc: [],
        thisMonthGraphCalc: [],
        thisYearGraphCalc: [],
        allTimeGraphCalc: []
    }
    return calculations
}

export default timeAnalysisGraphCalc