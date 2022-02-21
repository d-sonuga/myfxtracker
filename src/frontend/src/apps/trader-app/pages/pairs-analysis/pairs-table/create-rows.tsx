import {BP, P} from '@components/text'
import {getColor} from '@conf/utils'
import {formatPercent, to2dp} from '@apps/trader-app/utils'
import {PairsTableCalc} from './types'


const createRows = (calcs: Array<PairsTableCalc>) => {
    const rows = calcs.map((calc) => ([
        <BP style={{color: getColor('dark-gray')}}>{calc.pair}</BP>,
        <P>{calc.noOfTradesOnPair.toString()}</P>,
        <P>{noWithPercent(calc.noOfProfitableTradesOnPair, calc.profitableTradesOnPairPercent)}</P>,
        <P>{noWithPercent(calc.noOfLosingTradesOnPair, calc.losingTradesOnPairPercent)}</P>,
        <P>{noWithPercent(calc.noOfShortsOnPair, calc.shortsOnPairPercent)}</P>,
        <P>{noWithPercent(calc.noOfLongsOnPair, calc.longsOnPairPercent)}</P>,
        <P>{noWithPercent(to2dp(calc.noOfTpOnPair), calc.tpOnPairPercent)}</P>,
        <P>{noWithPercent(to2dp(calc.noOfSlOnPair), calc.slOnPairPercent)}</P>,
    ]));
    return rows;
}

const noWithPercent = (n: number, percent: number) => {
    return `${n} (${formatPercent(percent)})`
}

export default createRows