import {ColumnBox} from '@components/containers'
import {H6} from '@components/text'
import {RouteConst} from '@conf/const'
import {getDimen} from '@conf/utils'
import Link from './link'


const PagesLinks = () => {
    const {INFO_FAQ_ROUTE, INFO_PRICING_ROUTE, INFO_SIGN_UP_ROUTE, INFO_LOGIN_ROUTE} = RouteConst;
    const formatRoute = (route: string): string => {
        return `/${route}`;
    }
    return(
        <ColumnBox>
            <H6 style={{marginBottom: getDimen('padding-xs')}}>Pages</H6>
            <Link to={formatRoute(INFO_FAQ_ROUTE)}>FAQ</Link>
            <Link to={formatRoute(INFO_PRICING_ROUTE)}>Features / Pricing</Link>
            <Link to={formatRoute(INFO_SIGN_UP_ROUTE)}>Sign Up</Link>
            <Link to={formatRoute(INFO_LOGIN_ROUTE)}>Login</Link>
        </ColumnBox>
    )
}

export default PagesLinks