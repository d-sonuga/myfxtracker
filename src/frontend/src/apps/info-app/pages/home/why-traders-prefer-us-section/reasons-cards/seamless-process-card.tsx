import seamlessProcessImg from '@visuals/svgs/seamless-process.svg'
import BaseReasonCard from './base-reason-card';


const SeamlessProcessCard = () => {
    return(
        <BaseReasonCard
            img={<img src={seamlessProcessImg} alt='' />}
            heading='Seamless process'
            content='Easily connect your Metatrader to MyFxTracker and view your
            analytics in as little as 5 minutes.' />
    );
}

export default SeamlessProcessCard