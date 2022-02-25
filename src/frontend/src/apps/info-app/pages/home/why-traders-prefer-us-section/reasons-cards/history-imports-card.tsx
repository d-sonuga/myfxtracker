import historyImportsImg from '@visuals/svgs/history-imports.svg'
import BaseReasonCard from './base-reason-card'


const HistoryImportsCard = () => {
    return(
        <BaseReasonCard
            img={<img src={historyImportsImg} alt='' />}
            heading='History Imports'
            content='Import and view trade analytics from your trading account as far back as a year ago.'
            />
    );
}

export default HistoryImportsCard