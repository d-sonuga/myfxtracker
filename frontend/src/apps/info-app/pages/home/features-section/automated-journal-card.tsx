import automatedJournalImg from '@visuals/images/automated-journal.png'
import BaseFeatureCard from './base-feature-card'


const AutomatedJournalCard = () => {
    return(
        <BaseFeatureCard
            imgSrc={automatedJournalImg}
            header='Automated Journal'
            content='Greetings from the other side. Lorem ipsum dolor sit amet. Avec to pourqui
            tu faus' />
    );
}

export default AutomatedJournalCard