import automatedJournalImg from '@visuals/images/automated-journal.png'
import BaseFeatureCard from './base-feature-card'


const AutomatedJournalCard = () => {
    return(
        <BaseFeatureCard
            imgSrc={automatedJournalImg}
            header='Automated Journal'
            content='Focus on your trading while we do the journalling for you. 
            MyFxTracker removes the pain of manual journaling and makes the process faster,
            enjoyable & more efficient.' />
    );
}

export default AutomatedJournalCard