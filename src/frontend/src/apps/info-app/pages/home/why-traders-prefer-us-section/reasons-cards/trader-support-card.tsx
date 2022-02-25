import traderSupportImg from '@visuals/svgs/247-trader-support.svg'
import BaseReasonCard from './base-reason-card'

const TraderSupportCard = () => {
    return(
        <BaseReasonCard
            img={<img src={traderSupportImg} alt=''  />}
            heading='24/7 Trader Support'
            content='Get 24/7 access to our support team if you have any questions or need any help.'
            />
    );
}

export default TraderSupportCard