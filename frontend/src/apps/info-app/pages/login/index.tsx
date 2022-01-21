import {Link} from 'react-router-dom'
import {RowBox} from '@components/containers'
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
            form={<LoginForm submitValues={submitValues} storageService={localStorage} />}
            bottomText={
                <RowBox>
                    <SP>Don't have an account? &nbsp;</SP>
                    <Link to='/sign-up' style={{marginBottom: getDimen('padding-big')}}>
                        <SP style={{color: getColor('light-blue')}}>Sign Up</SP>
                    </Link>
                </RowBox>
            } />
    );
}

export default LoginPage