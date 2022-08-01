import {useContext, useState} from 'react'
import {useNavigate} from 'react-router'
import ReactGA from 'react-ga4'
import {Button} from '@components/buttons'
import {ColumnBox} from '@components/containers'
import {H6, P} from '@components/text'
import Dialog from '@components/dialog'
import {ToastContext} from '@components/toast'
import deleteAccount from './delete-account'
import LoadingIcon from '@components/loading-icon'


const DeleteAccountSection = ({userId}: {userId: number}) => {  
    const navigate = useNavigate();
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [accountIsDeleting, setAccountIsDeleting] = useState(false);
    const Toast = useContext(ToastContext);
    return(
        <ColumnBox>
            <Dialog
                title='Delete Account?'
                okButtonColor='error'
                okButtonContent={accountIsDeleting ? <LoadingIcon /> : 'Delete Account'}
                okButtonProps={{'data-testid': 'confirm-delete-account-button'}}
                onOkClick={() => {
                    ReactGA.event('delete_account_attempt', {
                        'user_id': userId
                    });
                    setAccountIsDeleting(true);
                    deleteAccount(userId, Toast, navigate, () => {
                        setDialogIsOpen(false);
                        setAccountIsDeleting(false)
                    })}
                }
                onCancelClick={() => {
                    ReactGA.event('delete_account_abort', {
                        'user_id': userId
                    });
                    setDialogIsOpen(false)
                }}
                showCancelButton={!accountIsDeleting}
                onClose={() => {
                    if(!accountIsDeleting){
                        setDialogIsOpen(false);
                    }
                }}
                open={dialogIsOpen}>
                    <P>Are you sure you want to delete your account.</P>
                    <P>All your data will be deleted.</P>
            </Dialog>
            <H6>Delete Account</H6>
            <P>Permanently delete your account. </P>
            <ColumnBox style={{display: 'inline'}}>
                <Button
                    onClick={() => setDialogIsOpen(true)}
                    color='error'
                    data-testid='delete-account-button'>Delete Account</Button>
            </ColumnBox>
        </ColumnBox>
    )
}

export default DeleteAccountSection