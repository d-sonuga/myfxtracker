import {P, BP} from '@components/text'
import {getColor} from '@conf/utils'
import {formatMoney, to2dpstring} from '@apps/trader-app/utils'
import {OverviewStatsCalc} from 'calculator'


const createRows = (stats: OverviewStatsCalc) => {
    const rows = [
        [   
            createCell(
                'Average Profit',
                formatMoney(stats.aveProfit),
                getColor('light-blue')
            ),
            createCell('Average Loss', formatMoney(stats.aveLoss), getColor('red'))
        ],
        [   
            createCell('Longs Won', `${to2dpstring(stats.longsWonPercent)}% (${stats.noOfLongsWon}/${stats.noOfLongs})`),
            createCell('Shorts Won', `${to2dpstring(stats.shortsWonPercent)}% (${stats.noOfShortsWon}/${stats.noOfShorts})`)
        ],
        [
            createCell(
                'Best Trade',
                formatMoney(stats.bestTrade)
            ),
            createCell(
                'Worst Trade',
                formatMoney(stats.worstTrade)
            )
        ],
        [
            createCell(
                'Highest Balance',
                to2dpstring(stats.highestBalance)
            ),
            createCell('Average RRR', to2dpstring(stats.aveRRR))
        ],
        [
            createCell('Profit Factor', to2dpstring(stats.profitFactor)),
            createCell(
                'Expectancy',
                to2dpstring(stats.expectancy)
            )
        ],
        [
            createCell(
                'Commission',
                formatMoney(stats.commissions)
            )
        ]
    ]
    return rows;
}

const createCell = (heading: string, content: string, color: string | undefined = undefined) => {
    return(
        <StatsTableCell
            heading={heading}
            content={content}
            color={color} />
    )
}

const StatsTableCell = ({heading, content, color}: any) => {
    return(
        <div>
            <BP style={{color: getColor('dark-gray')}}>{heading}</BP>
            <P style={{color: color}}>{content}</P>
        </div>
    )
}

export default createRows