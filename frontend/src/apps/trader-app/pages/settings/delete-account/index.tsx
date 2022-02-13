import {useContext} from 'react'
import {useNavigate} from 'react-router'
import {Button} from '@components/buttons'
import {ColumnBox} from '@components/containers'
import {H6, P} from '@components/text'
import {Http} from '@apps/trader-app/services'
import {HttpConst, RouteConst} from '@conf/const'
import {ToastContext} from '@components/toast'


const DeleteAccountSection = () => {
    const navigate = useNavigate();
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
            <H6>Delete Account</H6>
            <P>Permanently delete your account. </P>
            <ColumnBox style={{display: 'inline'}}>
                <Button onClick={deleteAccount}>Delete Account</Button>
            </ColumnBox>
        </ColumnBox>
    )
}

export default DeleteAccountSection