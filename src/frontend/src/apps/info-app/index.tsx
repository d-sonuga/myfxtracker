import {Route, useNavigate} from 'react-router-dom'
import Routes from '@components/router'
import {RouteConst} from '@conf/const'
import {HomePage, SignUpPage, LoginPage, ResetPasswordPage, ResetPasswordConfirmPage,
    FAQPage, PricingPage, ChangePasswordPage} from './pages'
import { InfoAppNavbar } from './components'
import { MONTHLY_PLAN_PRICE, YEARLY_PLAN_PER_MONTH_PRICE, YEARLY_PLAN_PRICE } from '@apps/trader-app/const'

const InfoApp = () => {
    const navigate = useNavigate();
    const {INFO_HOME_ROUTE, INFO_SIGN_UP_ROUTE, INFO_CHANGE_PASSWORD_ROUTE, INFO_RESET_PASSWORD_ROUTE,
        INFO_LOGIN_ROUTE, INFO_FAQ_ROUTE, INFO_PRICING_ROUTE} = RouteConst;
    return(
        <div style={{width: '100%'}}>
            <Routes>
                <Route path={INFO_HOME_ROUTE} element={<HomePage />} />
                <Route path={INFO_SIGN_UP_ROUTE} element={<SignUpPage />} />
                <Route path={`${INFO_SIGN_UP_ROUTE}:ref`} element={<SignUpPage />} />
                <Route path={INFO_LOGIN_ROUTE} element={<LoginPage />} />
                <Route path={INFO_CHANGE_PASSWORD_ROUTE} element={<ChangePasswordPage />} />
                <Route path={INFO_RESET_PASSWORD_ROUTE} element={<ResetPasswordPage />} />
                <Route path={`${INFO_RESET_PASSWORD_ROUTE}/:token`} element={<ResetPasswordConfirmPage />} />
                <Route path={INFO_FAQ_ROUTE} element={<FAQPage />} />
                <Route path={INFO_PRICING_ROUTE}
                    element={
                        <PricingPage
                            navbar={<InfoAppNavbar />}
                            plans={[
                                {
                                    name: 'Monthly',
                                    price: MONTHLY_PLAN_PRICE,
                                    subscribeButtonContent: 'Get 7 days free',
                                    subscribeButtonAction: () => navigate(`/${RouteConst.INFO_SIGN_UP_ROUTE}`),
                                    subscribeButtonEnabled: true
                                },
                                {
                                    name: 'Yearly',
                                    price: YEARLY_PLAN_PER_MONTH_PRICE,
                                    subscribeButtonContent: 'Get 7 days free',
                                    subscribeButtonAction: () => navigate(`/${RouteConst.INFO_SIGN_UP_ROUTE}`),
                                    subscribeButtonEnabled: true
                                }
                            ]}
                            defaultPlanIndex={1}
                    />} />
            </Routes>
        </div>
    );
}

export default InfoApp