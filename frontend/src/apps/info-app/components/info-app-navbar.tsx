import {useNavigate} from 'react-router'
import {RowBox} from '@components/containers'
import Navbar from '@components/navbar'
import {OutlinedButton, Button} from '@components/buttons'
import {getDimen} from '@conf/utils'
import {RouteConst} from '@conf/const'


const InfoAppNavbar = () => {
    const navigate = useNavigate();
    const {INFO_LOGIN_ROUTE, INFO_PRICING_ROUTE, INFO_SIGN_UP_ROUTE, INFO_FAQ_ROUTE} = RouteConst;
    
    return(
        <Navbar
            links={[
                ['FAQ', INFO_FAQ_ROUTE],
                ['Features/Pricing', INFO_PRICING_ROUTE]
            ]}
            rightElement={
                <RowBox>
                    <OutlinedButton
                        style={{marginRight: getDimen('padding-xs')}}
                        onClick={() => navigate(INFO_LOGIN_ROUTE)}>
                            Login
                    </OutlinedButton>
                    <Button onClick={() => navigate(INFO_SIGN_UP_ROUTE)}>Start free trial</Button>
                </RowBox>
            }/>
    );
}

export default InfoAppNavbar