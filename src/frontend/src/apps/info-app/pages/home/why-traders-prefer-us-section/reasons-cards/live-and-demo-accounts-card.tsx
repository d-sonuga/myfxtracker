import liveAndDemoAccountsImg from '@visuals/svgs/live-and-demo-accounts.svg'
import BaseReasonCard from './base-reason-card'


const LiveAndDemoAccountsCard = () => {
    return(
        <BaseReasonCard
            img={<img src={liveAndDemoAccountsImg} alt='' />}
            heading='Live & Demo Accounts'
            content='Lorem ipsum dolor sit amet. Avec moi pourquoi.'
            />
    );
}

export default LiveAndDemoAccountsCard