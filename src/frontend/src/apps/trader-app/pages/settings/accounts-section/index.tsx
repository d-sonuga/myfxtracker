import {useContext, useState} from 'react'
import {useNavigate} from 'react-router'
import {Button} from '@components/buttons'
import {ColumnBox, RowBox} from '@components/containers'
import {H6, P} from '@components/text'
import {HttpConst} from '@conf/const'
import {getDimen} from '@conf/utils'
import Http from '@services/http'
import Dialog from '@components/dialog'
import {ToastContext} from '@components/toast'
import {ConfigConst} from '@conf/const'
import LoadingIcon from '@components/loading-icon'
import AddAccountButton from './add-account-button'
import {AccountsSectionPropTypes, AccountDataWithId} from './types'
import NoOfAccountsLeftToAddStatus from './no-of-accounts-left-to-add-status'


const AccountsSection = ({accounts, removeAccountFromData, userIsOnFreeTrial}: AccountsSectionPropTypes) => {
    const navigate = useNavigate();
    const [accountToDelete, setAccountToDelete] = useState<AccountDataWithId | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [cancelDelete, setCancelDelete] = useState<any>(null);
    const Toast = useContext(ToastContext);
    const maxNoOfAccounts = userIsOnFreeTrial ?
        ConfigConst.MAX_NO_OF_TRADING_ACCOUNT_FREE_TRIAL_TRADER
        : ConfigConst.MAX_NO_OF_TRADING_ACCOUNT_SUBSCRIBED_TRADER;
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
                <NoOfAccountsLeftToAddStatus
                    noOfAccounts={accounts.length}
                    maxAccounts={maxNoOfAccounts} />
                <AddAccountButton
                    noOfAccounts={accounts.length}
                    navigate={navigate}
                    maxAccounts={maxNoOfAccounts} />
            </div>
        </ColumnBox>
    )
}

export default AccountsSection