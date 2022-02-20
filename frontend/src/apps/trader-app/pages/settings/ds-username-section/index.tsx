import {ColumnBox} from '@components/containers'
import {H6, P} from '@components/text'


const DsUsernameSection = ({dsUsername}: {dsUsername: string}) => {
    return(
        <ColumnBox>
            <H6>Your Metatrader Username</H6>
            <P>{dsUsername}</P>
        </ColumnBox>
    )
}

export default DsUsernameSection