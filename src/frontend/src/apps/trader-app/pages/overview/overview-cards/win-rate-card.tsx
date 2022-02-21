import BaseOverviewCard from './base-card'
import {getColor} from '@conf/utils'


const WinRateCard = ({winRate}: {winRate: string}) => {
    return(
        <BaseOverviewCard
            heading='Win Rate'
            content={winRate}
            backgroundColor={getColor('light-orange')} />
    )
}

export default WinRateCard