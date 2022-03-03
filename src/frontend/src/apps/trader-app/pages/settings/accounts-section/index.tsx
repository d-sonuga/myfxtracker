import {useNavigate} from 'react-router'
import {Button} from '@components/buttons'
import {ColumnBox} from '@components/containers'
import {H6, P} from '@components/text'
import {RouteConst} from '@conf/const'
import {getDimen} from '@conf/utils'


const AccountsSection = ({accountNames}: {accountNames: string[]}) => {
    const navigate = useNavigate();
    const {TRADER_APP_ROUTE, TRADER_ADD_ACCOUNT_ROUTE} = RouteConst;
    return(
        <ColumnBox>
            <H6 style={{marginBottom: getDimen('padding-xs')}}>Your Trading Accounts</H6>
            {accountNames.map((name) => (
                <P>{name}</P>
            ))}
            <div style={{marginTop: getDimen('padding-xs')}}>
                <Button 
                    onClick={() => navigate(`/${TRADER_APP_ROUTE}/${TRADER_ADD_ACCOUNT_ROUTE}`)}>
                    Add Account
                </Button>
            </div>
        </ColumnBox>
    )
}

export default AccountsSection