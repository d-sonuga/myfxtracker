import {getColor} from '@conf/utils'
import BaseOverviewCard from './base-card'


const AbsGainCard = ({absGain}: {absGain: string}) => {
    return(
        <BaseOverviewCard
            heading='Absolute Gain'
            content={absGain}
            backgroundColor={getColor('light-purple')} />
    )
}

export default AbsGainCard