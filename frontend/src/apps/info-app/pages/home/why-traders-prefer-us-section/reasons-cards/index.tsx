import {RowBox} from '@components/containers'
import SeamlessProcessCard from './seamless-process-card'
import LiveAndDemoAccountsCard from './live-and-demo-accounts-card'
import HistoryImportsCard from './history-imports-card'
import TraderSupportCard from './trader-support-card'
import './style.css'

const ReasonsCards = () => {
    return(
        <div className='apps-info-app-home-why-traders-prefer-us-reasons-cards-container'>
            <RowBox>
                <div>
                    <SeamlessProcessCard />
                    <LiveAndDemoAccountsCard />
                </div>
                <div>
                    <HistoryImportsCard />
                    <TraderSupportCard />
                </div>
            </RowBox>
        </div>
    );
}

export default ReasonsCards