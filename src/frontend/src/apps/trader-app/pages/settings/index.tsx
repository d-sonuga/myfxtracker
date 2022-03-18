import {useContext} from 'react'
import {H5} from '@components/text'
import {GlobalDataContext} from '@apps/trader-app'
import {PageContainer, PageHeading} from '@apps/trader-app/components'
import EmailSection from './email-section'
import ChangePasswordSection from './change-password-section'
import DeleteAccountSection from './delete-account'
import AccountsSection from './accounts-section'
import './style.css'


const Settings = ({removeAccountFromGlobalData}: {removeAccountFromGlobalData: Function}) => {
    const globalData = useContext(GlobalDataContext);
    return(
        <PageContainer>
            <PageHeading heading='Settings' dontShowSelector={true} />
            <div id='apps-trader-app-pages-settings-sections'>
                <H5>Profile</H5>
                <div>
                    <EmailSection email={globalData.getUserEmail()} />
                    <ChangePasswordSection />
                    <DeleteAccountSection />
                </div>
                <div>
                    <H5>Accounts</H5>
                    <AccountsSection 
                        accounts={globalData.getAllAccounts()}
                        removeAccountFromData={removeAccountFromGlobalData}
                        />
                </div>
            </div>
        </PageContainer>
    )
}

export default Settings