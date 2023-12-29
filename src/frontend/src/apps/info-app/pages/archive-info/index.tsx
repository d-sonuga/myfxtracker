import {InfoAppNavbar} from '@apps/info-app/components'
import {CenterColumnBox} from '@components/containers'
import {H6, H4, P} from '@components/text'
import { getDimen } from '@conf/utils'


const ArchiveInfoPage = () => {
    return(
        <div>
            <InfoAppNavbar />
            <CenterColumnBox className='apps-info-app-faq-container'>
                <H4 style={{
                    textTransform: 'capitalize',
                    marginBottom: getDimen('padding-md'),
                    textAlign: 'center'
                    }}>Archive Info</H4>
                {info.map((line, i) => (
                    <P key={i}
                        style={{textAlign: "center"}}>{line}</P>
                ))}
            </CenterColumnBox>
        </div>
    )
}

const info = [
    "MyFxTracker is no longer active.",
    "This is a version with limited functionality",
    "You can still create a user account (if you do, don't bother checking your mail because no email will be sent) but you will not be able to add any MetaTrader accounts for analytics, so it won't be useful",
    "You can't delete your user account or change your password after account creation",
    "And if you create or edit any note, it won't be saved",
    "But you can still view analytics in the dashboard by logging in with the pre-created dummy account: email \"i-hope-this-account-doenst-exist@gmail.com\" with password \"password\""
]

export default ArchiveInfoPage
