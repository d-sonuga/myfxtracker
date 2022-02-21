import {Link} from 'react-router-dom'
import {useNavigate} from 'react-router'
import {ColumnBox, RowBox} from '@components/containers'
import {SP} from '@components/text'
import Http from '@services/http'
import {getColor, getDimen} from '@conf/utils'
import {HttpConst} from '@conf/const'
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
        Http.post({
            url: `${BASE_URL}/${LOGIN_URL}/`,
            noToken: true,
            data: config.values,
            successFunc: config.successFunc,
            errorFunc: config.errorFunc,
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