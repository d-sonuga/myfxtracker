import {useContext, useState} from 'react'
import {useNavigate} from 'react-router'
import {Button} from '@components/buttons'
import {ColumnBox} from '@components/containers'
import {H6, P} from '@components/text'
import {Http} from '@apps/trader-app/services'
import {HttpConst, RouteConst} from '@conf/const'
import Dialog from '@components/dialog'
import {ToastContext} from '@components/toast'


const DeleteAccountSection = () => {
    const navigate = useNavigate();
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const Toast = useContext(ToastContext);
    const deleteAccount = () => {
        const {BASE_URL, DELETE_ACCOUNT_URL} = HttpConst;
        const {INFO_LOGIN_ROUTE} = RouteConst;
        Http.delete({
            url: `${BASE_URL}/${DELETE_ACCOUNT_URL}/`,
            successFunc: () => {
                navigate(`/${INFO_LOGIN_ROUTE}`);
            },
            errorFunc: () => {
                Toast.error('Sorry. Something went wrong');
            }
        })
    }
    return(
        <ColumnBox>
            <Dialog
                title='Delete Account?'
                okButtonColor='error'
                okButtonText='Delete Account'
                okButtonProps={{'data-testid': 'confirm-delete-account-button'}}
                onOkClick={() => deleteAccount()}
                onCancelClick={() => setDialogIsOpen(false)}
                onClose={() => setDialogIsOpen(false)}
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