import {ColumnBox} from '@components/containers'
import {H6, P} from '@components/text'


const EmailSection = ({email}: {email: string}) => {
    return(
        <ColumnBox>
            <H6>Your Email</H6>
            <P>{email}</P>
        </ColumnBox>
    )
}

export default EmailSection