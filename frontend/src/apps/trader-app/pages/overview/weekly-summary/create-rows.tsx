import {ReactNode} from 'react'
import {OverviewWeeklySummaryCalc} from 'calculator'
import {P} from '@components/text'
import {getColor} from '@conf/utils'


const createRows = (summary: OverviewWeeklySummaryCalc): Array<Array<ReactNode>> => {
    const rows = 
        Object.keys(summary).map((date) => (
            [
                <P>{date}</P>,
                <P>{summary[date].trades.toString()}</P>,
                <P>{summary[date].lots.toString()}</P>,
                resultInColor(summary[date].result),
            ]
        ));
    return rows
}

const resultInColor = (result: number): ReactNode => {
    return result === 0 ?
        <P>{`$${result}`}</P> 
        : result < 0 ? 
            <P style={{color: getColor('red')}}>{`-$${result}`}</P> 
            : <P style={{color: getColor('light-blue')}}>{`$${result}`}</P>
}

export default createRows