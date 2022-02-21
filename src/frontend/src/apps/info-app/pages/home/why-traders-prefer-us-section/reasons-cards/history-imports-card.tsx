import historyImportsImg from '@visuals/svgs/history-imports.svg'
import BaseReasonCard from './base-reason-card'


const HistoryImportsCard = () => {
    return(
        <BaseReasonCard
            img={<img src={historyImportsImg} alt='' />}
            heading='History Imports'
            content='Lorem ipsum dolor sit amet. Avec moi pourquoi.'
            />
    );
}

export default HistoryImportsCard