import {useContext} from 'react'
import {Divider} from '@mui/material'
import {GlobalDataContext} from '@apps/trader-app'
import {PageContainer, PageHeading} from '@apps/trader-app/components'
import EmailSection from './email-section'
import ChangePasswordSection from './change-password-section'
import SubscribeSection from './subscribe-section'


const Settings = () => {
    const globalData = useContext(GlobalDataContext);
    return(
        <PageContainer>
            <PageHeading heading='Settings' dontShowSelector={true} />
            <EmailSection email={globalData.getUserEmail()} />
            <ChangePasswordSection />
            <SubscribeSection />
        </PageContainer>
    )
}

export default Settings