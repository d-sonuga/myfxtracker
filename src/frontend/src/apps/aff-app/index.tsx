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
    const setNewBankAccountNumber = (newNumber: number): void => {
        const newAffiliateData = affiliateData.setBankAccountNumber(newNumber);
        setAffiliateData(newAffiliateData);
    }
    const setNewBankAccountName = (newName: string): void => {
        const newAffiliateData = affiliateData.setBankAccountName(newName);
        setAffiliateData(newAffiliateData);
    }
    const setNewBankName = (newName: string): void => {
        const newAffiliateData = affiliateData.setBankName(newName);
        setAffiliateData(newAffiliateData);
    }
    const navigate = useNavigate();
    useEffect(() => {
        Http.initNavigate(navigate, `/${AFF_APP_ROUTE}/${AFF_LOG_IN_ROUTE}/`);
    }, [])
    return(
        <Routes>
            <Route path={`${AFF_LOG_IN_ROUTE}`} element={<Login setAffiliateData={setAffiliateData} />} />
            <Route path={`${AFF_OVERVIEW_ROUTE}`} element={
                <Overview affiliateData={affiliateData} 
                    setNewBankAccountNumber={setNewBankAccountNumber}
                    setNewBankAccountName={setNewBankAccountName}
                    setNewBankName={setNewBankName} />
                    } />
        </Routes>
    )
}

export default AffApp