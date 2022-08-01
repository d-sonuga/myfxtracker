import {Link} from 'react-router-dom'
import {useNavigate} from 'react-router'
import ReactGA from 'react-ga4'
import {ColumnBox, RowBox} from '@components/containers'
import {SP} from '@components/text'
import Http, { HttpErrorType, HttpResponseType } from '@services/http'
import {getColor, getDimen} from '@conf/utils'
import {ConfigConst, HttpConst} from '@conf/const'
import {FormPageContainer} from '@apps/info-app/components'
import LoginForm from './login-form'
import {SubmitValuesTypes} from './types'


const LoginPage = () => {
    /** 
     * The function used by the form to submit values
     * @param config: object used to configure the Http client
     */
     const navigate = useNavigate();
     const submitValues = (config: SubmitValuesTypes) => {
        const {BASE_URL, LOGIN_URL} = HttpConst;
        ReactGA.event('log_in_attempt');
        Http.post({
            url: `${BASE_URL}/${LOGIN_URL}/`,
            noToken: true,
            data: config.values,
            successFunc: (resp: HttpResponseType) => {
                ReactGA.event('log_in_success');
                config.successFunc(resp)
            },
            errorFunc: (err: HttpErrorType) => {
                ReactGA.event('log_in_fail');
                config.errorFunc(err);
            },
            networkErrorFunc: (err: HttpErrorType) => {
                ReactGA.event('log_in_fail');
            },
            timeoutErrorFunc: (err: HttpErrorType) => {
                ReactGA.event('log_in_fail')
            },
            thenFunc: config.thenFunc
        });
    }

    return(
        <FormPageContainer
            form={
                <LoginForm
                    submitValues={submitValues}
                    storageService={localStorage}
                    navigate={navigate}
                    />
            }
            bottomText={
                <ColumnBox>
                    <RowBox>
                        <SP>Don't have an account? &nbsp;</SP>
                        <Link to='/sign-up' style={{marginBottom: getDimen('padding-xs')}}>
                            <SP style={{color: getColor('light-blue')}}>Sign Up</SP>
                        </Link>
                    </RowBox>
                    <RowBox>
                        <SP>Forgot password? &nbsp;</SP>
                        <Link to='/reset-password' style={{marginBottom: getDimen('padding-big')}}>
                            <SP style={{color: getColor('light-blue')}}>Reset Password</SP>
                        </Link>
                    </RowBox>
                </ColumnBox>
            } />
    );
}

export default LoginPage