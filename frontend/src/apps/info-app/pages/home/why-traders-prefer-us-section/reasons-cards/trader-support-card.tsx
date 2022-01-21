import traderSupportImg from '@visuals/svgs/247-trader-support.svg'
import BaseReasonCard from './base-reason-card'

const TraderSupportCard = () => {
    return(
        <BaseReasonCard
            img={<img src={traderSupportImg} alt=''  />}
            heading='24/7 Trader Support'
            content='Lorem ipsum dolor sit amet. Avec moi, pourquoi.'
            />
    );
}

export default TraderSupportCard