import {useNavigate} from 'react-router'
import {RowBox} from '@components/containers'
import Navbar from '@components/navbar'
import {OutlinedButton, Button} from '@components/buttons'
import {getDimen} from '@conf/utils'
import {ConfigConst, RouteConst} from '@conf/const'


const InfoAppNavbar = () => {
    const navigate = useNavigate();
    const {INFO_LOGIN_ROUTE, INFO_PRICING_ROUTE, INFO_SIGN_UP_ROUTE, INFO_FAQ_ROUTE} = RouteConst;
    const formatRoute = (route: string): string => {
        return `/${route}`;
    }
    return(
        <Navbar
            links={[
                ['FAQ', formatRoute(INFO_FAQ_ROUTE)],
                ['Features', formatRoute(INFO_PRICING_ROUTE)]
            ]}
            sidebarOnlyLinks={[
                ['Sign Up', formatRoute(INFO_SIGN_UP_ROUTE)],
                ['Login', formatRoute(INFO_LOGIN_ROUTE)]
            ]}
            rightElement={
                <RowBox>
                    {localStorage.getItem(ConfigConst.TOKEN_KEY) ?
                        <Button onClick={() => navigate('/app')}>Go To Dashboard</Button>
                        : <>
                            <OutlinedButton
                                style={{marginRight: getDimen('padding-xs')}}
                                onClick={() => navigate(formatRoute(INFO_LOGIN_ROUTE))}>
                                    Login
                            </OutlinedButton>
                            <Button onClick={() => navigate(formatRoute(INFO_SIGN_UP_ROUTE))}>Start free trial</Button>
                        </>
                    }
                </RowBox>
            }/>
    );
}

export default InfoAppNavbar