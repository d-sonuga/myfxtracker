import historyImportsImg from '@visuals/svgs/history-imports.svg'
import BaseReasonCard from './base-reason-card'


const HistoryImportsCard = () => {
    return(
        <BaseReasonCard
            img={<img src={historyImportsImg} alt='' />}
            heading='History Imports'
            content='MyFxTracker automatically imports your trading history 
            and displays your account data from the very first trade to date.'
            />
    );
}

export default HistoryImportsCard