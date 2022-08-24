import { useEffect } from 'react'
import {Route, useNavigate, Navigate} from 'react-router-dom'
import Routes from '@components/router'
import {Http} from '@apps/trader-app/services'
import {Login, Overview} from './pages'
import { HttpConst, RouteConst } from '@conf/const'
import useAffiliateData from './use-affiliate-data'

const AffApp = () => {
    const [affiliateData, setAffiliateData] = useAffiliateData();
    const {AFF_APP_ROUTE, AFF_LOG_IN_ROUTE, AFF_OVERVIEW_ROUTE} = RouteConst;
    const navigate = useNavigate();
    useEffect(() => {
        Http.initNavigate(navigate);
    }, [])
    return(
        <Routes>
            <Route path={`${AFF_LOG_IN_ROUTE}`} element={<Login />} />
            <Route path={`${AFF_OVERVIEW_ROUTE}`} element={<Overview affiliateData={affiliateData} />} />
        </Routes>
    )
}

export default AffApp