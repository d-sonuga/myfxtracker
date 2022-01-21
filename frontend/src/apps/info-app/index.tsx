import {Route} from 'react-router-dom'
import Routes from '@components/router'
import {RouteConst} from '@conf/const'
import {HomePage, SignUpPage, LoginPage, FAQPage, PricingPage} from './pages'


const InfoApp = () => {
    /*
    useEffect(() => {
        const {BASE_URL, GET_INIT_DATA_URL} = HttpConst;
        Http.get({
            url: `${BASE_URL}/${GET_INIT_DATA_URL}/`,
            successFunc: (resp: HttpResponseType) => {
                console.log(resp);
            },
            errorFunc: ((err: HttpErrorType) => {
                console.log(err);
            })
        })
    })*/
    const {INFO_HOME_ROUTE, INFO_SIGN_UP_ROUTE, 
        INFO_LOGIN_ROUTE, INFO_FAQ_ROUTE, INFO_PRICING_ROUTE} = RouteConst;
    return(
        <div style={{width: '100%'}}>
            <Routes>
                <Route path={INFO_HOME_ROUTE} element={<HomePage />} />
                <Route path={INFO_SIGN_UP_ROUTE} element={<SignUpPage />} />
                <Route path={INFO_LOGIN_ROUTE} element={<LoginPage />} />
                <Route path={INFO_FAQ_ROUTE} element={<FAQPage />} />
                <Route path={INFO_PRICING_ROUTE} element={<PricingPage />} />
            </Routes>
        </div>
    );
}

export default InfoApp