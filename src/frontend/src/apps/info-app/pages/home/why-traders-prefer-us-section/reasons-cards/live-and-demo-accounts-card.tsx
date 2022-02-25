import liveAndDemoAccountsImg from '@visuals/svgs/live-and-demo-accounts.svg'
import BaseReasonCard from './base-reason-card'


const LiveAndDemoAccountsCard = () => {
    return(
        <BaseReasonCard
            img={<img src={liveAndDemoAccountsImg} alt='' />}
            heading='Live & Demo Accounts'
            content='Track and analyse your trading performance on both demo and live accounts.'
            />
    );
}

export default LiveAndDemoAccountsCard