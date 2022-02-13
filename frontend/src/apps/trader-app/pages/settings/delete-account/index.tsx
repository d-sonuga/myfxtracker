import {Button} from '@components/buttons'
import {ColumnBox} from '@components/containers'
import {H6, P} from '@components/text'


const DeleteAccountSection = () => {
    return(
        <ColumnBox>
            <H6>Delete Account</H6>
            <P>Permanently delete your account. </P>
            <ColumnBox style={{display: 'inline'}}>
                <Button>Delete Account</Button>
            </ColumnBox>
        </ColumnBox>
    )
}

export default DeleteAccountSection