import {useContext, useState} from 'react'
import {useNavigate} from 'react-router'
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


const AccountsSection = ({accounts, removeAccountFromData, userIsOnFreeTrial}: AccountsSectionPropTypes) => {
    const navigate = useNavigate();
    const [accountToDelete, setAccountToDelete] = useState<AccountDataWithId>(defaultAccountData);
    const [isDeleting, setIsDeleting] = useState(false);
    const Toast = useContext(ToastContext);
    const maxNoOfAccounts = userIsOnFreeTrial ?
        ConfigConst.MAX_NO_OF_TRADING_ACCOUNT_FREE_TRIAL_TRADER
        : ConfigConst.MAX_NO_OF_TRADING_ACCOUNT_SUBSCRIBED_TRADER;
    return(
        <ColumnBox>
            <Dialog
                title='Remove Account'
                onOkClick={() => {
                    removeAccount(accountToDelete.id, removeAccountFromData, Toast, () => {
                        setIsDeleting(false);
                        setAccountToDelete(defaultAccountData);
                    });
                    setIsDeleting(true);
                }}
                okButtonContent={isDeleting ? <LoadingIcon /> : 'ok'}
                showCancelButton={!isDeleting}
                onCancelClick={() => {
                    setAccountToDelete(defaultAccountData);
                    setIsDeleting(false);
                }}
                onClose={() => {}}
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
                    maxAccounts={maxNoOfAccounts} />
                <AddAccountButton
                    noOfAccounts={accounts.length}
                    navigate={navigate}
                    maxAccounts={maxNoOfAccounts} />
            </div>
        </ColumnBox>
    )
}

const defaultAccountData: AccountDataWithId = {
    id: -1,
    name: 'dummy',
    trades: [],
    deposits: [],
    withdrawals: []
}

export default AccountsSection