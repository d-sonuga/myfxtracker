import {useContext, useState} from 'react'
import {useNavigate} from 'react-router'
import ReactGA from 'react-ga4'
import {Button} from '@components/buttons'
import {ColumnBox, RowBox} from '@components/containers'
import {H6, P} from '@components/text'
import {getDimen} from '@conf/utils'
import Dialog from '@components/dialog'
import {ToastContext} from '@components/toast'
import {ConfigConst} from '@conf/const'
import LoadingIcon from '@components/loading-icon'
import AddAccountButton from './add-account-button'
import {AccountsSectionPropTypes, AccountDataWithId} from './types'
import NoOfAccountsLeftToAddStatus from './no-of-accounts-left-to-add-status'
import removeAccount from './remove-account'


const AccountsSection = ({accounts, removeAccountFromData, userIsOnFreeTrial, userIsSubscribed, userId}: AccountsSectionPropTypes) => {
    const navigate = useNavigate();
    const [accountToDelete, setAccountToDelete] = useState<AccountDataWithId>(defaultAccountData);
    const [isDeleting, setIsDeleting] = useState(false);
    const Toast = useContext(ToastContext);
    const maxNoOfAccounts = userIsOnFreeTrial ?
        ConfigConst.MAX_NO_OF_TRADING_ACCOUNT_FREE_TRIAL_TRADER
        : ConfigConst.MAX_NO_OF_TRADING_ACCOUNT_SUBSCRIBED_TRADER;
    const userCanAddAccount = accounts.length < maxNoOfAccounts && (userIsOnFreeTrial || userIsSubscribed);
    return(
        <ColumnBox>
            <Dialog
                title='Remove Account'
                onOkClick={() => {
                    ReactGA.event('remove_account_attempt', {
                        'user_id': userId
                    });
                    removeAccount(userId, accountToDelete.id, removeAccountFromData, Toast, () => {
                        setIsDeleting(false);
                        setAccountToDelete(defaultAccountData);
                    });
                    setIsDeleting(true);
                }}
                okButtonContent={isDeleting ? <LoadingIcon /> : 'ok'}
                showCancelButton={!isDeleting}
                onCancelClick={() => {
                    ReactGA.event('remove_account_abort', {
                        'user_id': userId
                    });
                    setAccountToDelete(defaultAccountData);
                    setIsDeleting(false);
                }}
                onClose={() => {
                    if(!isDeleting){
                       setAccountToDelete(defaultAccountData);
                    }
                }}
                open={accountToDelete != defaultAccountData || isDeleting}
                >
                    <ColumnBox>
                        <P>Are you sure you want to remove {accountToDelete ? accountToDelete.name : ''}</P>
                    </ColumnBox>
            </Dialog>
            <H6 style={{marginBottom: getDimen('padding-xs')}}>Your Trading Accounts</H6>
            {accounts.map((account) => (
                <RowBox style={{alignItems: 'baseline'}} key={account.id}>
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
                    maxAccounts={maxNoOfAccounts}
                    userCanAddAccount={userCanAddAccount} />
                <AddAccountButton
                    userCanAddAccount={userCanAddAccount}
                    navigate={navigate} />
            </div>
        </ColumnBox>
    )
}

const defaultAccountData: AccountDataWithId = {
    id: -1,
    name: '',
    trades: [],
    deposits: [],
    withdrawals: []
}

export default AccountsSection