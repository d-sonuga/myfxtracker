import {useContext, useState} from 'react'
import {useNavigate} from 'react-router'
import {Button} from '@components/buttons'
import {ColumnBox, RowBox} from '@components/containers'
import {H6, P, SBP} from '@components/text'
import {RouteConst, HttpConst} from '@conf/const'
import {getDimen} from '@conf/utils'
import Http from '@services/http'
import Dialog from '@components/dialog'
import {ToastContext} from '@components/toast'
import {AccountsSectionPropTypes, AccountDataWithId} from './types'
import LoadingIcon from '@components/loading-icon'


const AccountsSection = ({accounts, removeAccountFromData}: AccountsSectionPropTypes) => {
    const navigate = useNavigate();
    const [accountToDelete, setAccountToDelete] = useState<AccountDataWithId | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [cancelDelete, setCancelDelete] = useState<any>(null);
    const {TRADER_APP_ROUTE, TRADER_ADD_ACCOUNT_ROUTE} = RouteConst;
    const Toast = useContext(ToastContext);
    const removeAccount = () => {
        setIsDeleting(true);
        const idOfAccount = accountToDelete !== null ? accountToDelete.id : -1;
        const {BASE_URL, REMOVE_TRADING_ACCOUNT_URL} = HttpConst;
        const cancelToken = Http.createCancelRequestToken();
        setCancelDelete(cancelToken);
        Http.delete({
            url: `${BASE_URL}/${REMOVE_TRADING_ACCOUNT_URL}/${idOfAccount}/`,
            successFunc: (resp: any) => {
                if(accountToDelete !== null){
                    removeAccountFromData(idOfAccount);
                }
                // Remove account from the global data
                // If account is current account, change the current account
                // If account was the only account, show the add account page again
                // Like the user just signed up
            },
            errorFunc: (error: any) => {
                console.log(error);
                Toast.error('Sorry. Something went wrong. Your account was not deleted');
            },
            thenFunc: () => {
                setIsDeleting(false);
                setAccountToDelete(null);
                setCancelDelete(null);
            },
            // 10 minutes because contacting the MA servers can take a lot of time
            timeout: 1000 * 60 * 10,
            extras: {
                cancelToken: cancelToken.token
            }
        });
    }
    return(
        <ColumnBox>
            <Dialog
                title='Remove Account'
                onOkClick={() => removeAccount()}
                okButtonContent={isDeleting ? <LoadingIcon /> : 'ok'}
                showCancelButton={!isDeleting}
                onCancelClick={() => {
                    setAccountToDelete(null);
                    if(isDeleting && cancelDelete){
                        cancelDelete.cancel();
                    }
                    setIsDeleting(false);
                    setAccountToDelete(null);
                    setCancelDelete(null);
                }}
                onClose={() => {}}
                open={accountToDelete != null || isDeleting}
                >
                    <ColumnBox>
                        <P>Are you sure you want to remove {accountToDelete ? accountToDelete.name : ''}</P>
                    </ColumnBox>
            </Dialog>
            <H6 style={{marginBottom: getDimen('padding-xs')}}>Your Trading Accounts</H6>
            {accounts.map((account) => (
                <RowBox style={{alignItems: 'baseline'}}>
                    <P style={{marginRight: getDimen('padding-sm')}}>{account.name}</P>
                    <Button 
                        size='small' 
                        variant='outlined' 
                        onClick={() => {
                            setAccountToDelete(account);
                        }}>Remove Account</Button>
                </RowBox>
            ))}
            <div style={{marginTop: getDimen('padding-xs')}}>
                {
                    accounts.length >= 3 ?
                        <SBP style={{marginBottom: '10px'}}>
                            You have reached the maximum number of accounts
                        </SBP>
                    :
                        <SBP style={{marginBottom: '10px'}}>
                            You can add only {(3 - accounts.length).toString()} more accounts
                        </SBP>
                }
                <Button
                    disabled={accounts.length >= 3}
                    onClick={() => navigate(`/${TRADER_APP_ROUTE}/${TRADER_ADD_ACCOUNT_ROUTE}`)}>
                    Add Account
                </Button>
            </div>
        </ColumnBox>
    )
}

export default AccountsSection