import {GainsGraphCalc, GainsGraphItem} from 'calculator'
import defaultCashAndGainsCalc from '../const'


/**
 * @param rawData: the raw calculations from the calculator
 * @returns: the calculations, but with numbers in only 2 decimal places
 */
const formatData = (rawData: GainsGraphCalc) => {
    const refinedData: GainsGraphCalc = defaultCashAndGainsCalc.gainsGraphCalc;
    Object.keys(refinedData).map((objKey) => {
        const key = objKey as GainsGraphCalcKey;
        refinedData[key] = rawData[key].map((graphItem: GainsGraphItem) => {
            return {
                ...graphItem,
                gainsPercent: parseFloat(graphItem.gainsPercent.toFixed(2))
            }
        })
    })
    return refinedData
}

type GainsGraphCalcKey = 'todayGraphCalc' |
'thisWeekGraphCalc' |
'thisMonthGraphCalc' |
'thisYearGraphCalc' |
'allTimeGraphCalc'

export default formatData