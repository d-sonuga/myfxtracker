import {ColumnBox} from '@components/containers'
import {H6, P} from '@components/text'
import { getDimen } from '@conf/utils'


const EmailSection = ({email}: {email: string}) => {
    return(
        <ColumnBox
            style={{
                marginBottom: getDimen('padding-md')
            }}>
            <H6>Your Email</H6>
            <P>{email}</P>
        </ColumnBox>
    )
}

export default EmailSection