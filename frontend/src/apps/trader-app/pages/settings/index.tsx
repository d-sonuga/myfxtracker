import {useContext} from 'react'
import {GlobalDataContext} from '@apps/trader-app'
import {PageContainer, PageHeading} from '@apps/trader-app/components'
import EmailSection from './email-section'
import ChangePasswordSection from './change-password-section'
import SubscribeSection from './subscribe-section'
import DeleteAccountSection from './delete-account'
import DsUsernameSection from './ds-username-section'
import './style.css'


const Settings = () => {
    const globalData = useContext(GlobalDataContext);
    return(
        <PageContainer>
            <PageHeading heading='Settings' dontShowSelector={true} />
            <div id='apps-trader-app-pages-settings-sections'>
                <EmailSection email={globalData.getUserEmail()} />
                <DsUsernameSection dsUsername={globalData.getUserDsUsername()} />
                <ChangePasswordSection />
                <SubscribeSection />
                <DeleteAccountSection />
            </div>
        </PageContainer>
    )
}

export default Settings