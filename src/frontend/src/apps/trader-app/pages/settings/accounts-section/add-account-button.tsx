import {Button} from '@components/buttons'
import {RouteConst} from '@conf/const'
import {AccountDataWithId} from './types'

const AddAccountButton = ({noOfAccounts, navigate, maxAccounts}: {noOfAccounts: number, navigate: Function, maxAccounts: number}) => { 
    const {TRADER_APP_ROUTE, TRADER_ADD_ACCOUNT_ROUTE} = RouteConst;
    return(
        <Button
            disabled={noOfAccounts >= maxAccounts}
            onClick={() => navigate(`/${TRADER_APP_ROUTE}/${TRADER_ADD_ACCOUNT_ROUTE}`)}>
            Add Account
        </Button>
    )
}

export default AddAccountButton