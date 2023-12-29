import {Button} from '@components/buttons'
import {RouteConst} from '@conf/const'
import { ConfigConst } from '@conf/const'

const AddAccountButton = ({userCanAddAccount, navigate}: {userCanAddAccount: boolean, navigate: Function}) => { 
    const {TRADER_APP_ROUTE, TRADER_ADD_ACCOUNT_ROUTE} = RouteConst;
    return(
        <Button
            disabled={ConfigConst.IS_ARCHIVE || !userCanAddAccount}
            onClick={() => navigate(`/${TRADER_APP_ROUTE}/${TRADER_ADD_ACCOUNT_ROUTE}`)}>
            Add Account
        </Button>
    )
}

export default AddAccountButton