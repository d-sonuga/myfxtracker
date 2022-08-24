import {Route, useNavigate, Navigate} from 'react-router-dom'
import Routes from '@components/router'
import {Login} from './pages'
import { HttpConst, RouteConst } from '@conf/const'

const AffApp = () => {
    const {AFF_APP_ROUTE, AFF_LOG_IN_ROUTE, AFF_OVERVIEW_ROUTE} = RouteConst;
    return(
        <Routes>
            <Route path={`${AFF_LOG_IN_ROUTE}`} element={<Login />} />
        </Routes>
    )
}

export default AffApp