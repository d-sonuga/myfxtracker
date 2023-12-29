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
    "You can still create a user account but you will not be able to add any MetaTrader accounts for analytics, so it won't be useful",
    "You can delete your user account but you can't change your password after account creation",
    "But you can still view analytics in the dashboard by logging in with the pre-created dummy account: email \"dummy-account@gmail.com\" with password \"password\""
]

export default ArchiveInfoPage