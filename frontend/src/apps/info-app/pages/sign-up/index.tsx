import {Link} from 'react-router-dom'
import {RowBox} from '@components/containers'
import {SP, P} from '@components/text'
import Http from '@services/http'
import {getColor, getDimen} from '@conf/utils'
import {HttpConst, RouteConst} from '@conf/const'
import {FormPageContainer} from '@apps/info-app/components'
import SignUpForm from './sign-up-form'
import {SubmitValuesTypes} from './types'


const SignUpPage = () => {
    /** The function used by the form to submit values
     * @param config: object used to configure the Http client
     */
    const submitValues = (config: SubmitValuesTypes) => {
        const {BASE_URL, SIGN_UP_URL} = HttpConst;
        Http.post({
            url: `${BASE_URL}/${SIGN_UP_URL}/`,
            noToken: true,
            data: config.values,
            successFunc: config.successFunc,
            errorFunc: config.errorFunc,
            thenFunc: config.thenFunc
        });
    }
    const {INFO_LOGIN_ROUTE} = RouteConst;
    
    return(
        <FormPageContainer 
            form={<SignUpForm submitValues={submitValues} />}
            bottomText={
                <RowBox>
                    <SP>Already have an account? &nbsp;</SP>
                    <Link to={`/${INFO_LOGIN_ROUTE}`} style={{marginBottom: getDimen('padding-big')}}>
                        <SP style={{color: getColor('light-blue')}}>Sign In</SP>
                    </Link>
                </RowBox>
            }
            />
    )
}

export default SignUpPage