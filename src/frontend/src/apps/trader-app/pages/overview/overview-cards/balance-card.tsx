import {getColor} from '@conf/utils'
import BaseOverviewCard from './base-card'


const BalanceCard = ({balance}: {balance: string}) => {
    return(
        <BaseOverviewCard
            heading='Balance'
            content={balance}
            backgroundColor={getColor('xlight-blue')} />
    )
}

export default BalanceCard