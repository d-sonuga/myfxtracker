import BaseOverviewCard from './base-card'
import {getColor} from '@conf/utils'


const NoOfTradesCard = ({noOfTrades}: {noOfTrades: string}) => {
    return(
        <BaseOverviewCard
            heading='Number of Trades'
            content={noOfTrades}
            backgroundColor={getColor('light-green')} />
    )
}

export default NoOfTradesCard