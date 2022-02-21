import seamlessProcessImg from '@visuals/svgs/seamless-process.svg'
import BaseReasonCard from './base-reason-card';


const SeamlessProcessCard = () => {
    return(
        <BaseReasonCard
            img={<img src={seamlessProcessImg} alt='' />}
            heading='Seamless process'
            content='Lorem ipsum dolor sit amet. Avec moi pourquoi.' />
    );
}

export default SeamlessProcessCard