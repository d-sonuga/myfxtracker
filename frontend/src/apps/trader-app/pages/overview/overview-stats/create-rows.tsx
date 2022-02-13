import {P, BP} from '@components/text'
import {getColor} from '@conf/utils'
import {OverviewStatsCalc} from 'calculator'


const createRows = (stats: OverviewStatsCalc) => {
    const rows = [
        [   
            createCell(
                'Average Profit',
                stats.aveProfit < 0 ? `-$${-1 *stats.aveProfit}` : `$${stats.aveProfit}`,
                getColor('light-blue')
            ),
            createCell('Average Loss', `$${stats.aveLoss}`, getColor('red'))
        ],
        [   
            createCell('Longs Won', `${stats.longsWonPercent}% (${stats.noOfLongsWon}/${stats.noOfLongs})`),
            createCell('Shorts Won', `${stats.shortsWonPercent}% (${stats.noOfShortsWon}/${stats.noOfShorts})`)
        ],
        [
            createCell(
                'Best Trade',
                stats.bestTrade < 0 ? `-$${-1 * stats.bestTrade}` : `$${stats.bestTrade}`
            ),
            createCell(
                'Worst Trade',
                stats.worstTrade < 0 ? `-$${-1 * stats.worstTrade}` : `$${stats.worstTrade}`
            )
        ],
        [
            createCell(
                'Highest Balance',
                stats.highestBalance < 0 ? `-$${-1 * stats.highestBalance}` : `$${stats.highestBalance}`
            ),
            createCell('Average RRR', `${stats.aveRRR}`)
        ],
        [
            createCell('Profit Factor', `${stats.profitFactor}`),
            createCell(
                'Expectancy',
                stats.expectancy < 0 ? `-$${-1 * stats.expectancy}` : `$${stats.expectancy}`
            )
        ],
        [
            createCell('Lots', `${stats.lots}`),
            createCell(
                'Commission',
                stats.commissions < 0 ? `-$${-1 * stats.commissions}` : `$${stats.commissions}`
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