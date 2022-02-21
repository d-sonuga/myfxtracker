import {Link} from 'react-router-dom'
import {RowBox} from '@components/containers'
import {SP} from '@components/text'
import Http from '@services/http'
import {getColor, getDimen} from '@conf/utils'
import {HttpConst, RouteConst} from '@conf/const'
import {FormPageContainer} from '@apps/info-app/components'
import ResetPasswordForm from './reset-password-form'


const LoginPage = () => {
    /** 
     * The function used by the form to submit values
     * @param config: object used to configure the Http client
     */
     const submitValues = (config: any) => {
        const {BASE_URL, RESET_PASSWORD_URL} = HttpConst;
        Http.post({
            url: `${BASE_URL}/${RESET_PASSWORD_URL}/`,
            noToken: true,
            data: config.values,
            successFunc: config.successFunc,
            errorFunc: config.errorFunc,
            thenFunc: config.thenFunc
        });
    }
    const {INFO_SIGN_UP_ROUTE} = RouteConst;
    return(
        <FormPageContainer
            form={<ResetPasswordForm submitValues={submitValues} />}
            bottomText={
                <RowBox>
                    <SP>Don't have an account? &nbsp;</SP>
                    <Link to={`/${INFO_SIGN_UP_ROUTE}`} style={{marginBottom: getDimen('padding-big')}}>
                        <SP style={{color: getColor('light-blue')}}>Sign Up</SP>
                    </Link>
                </RowBox>
            } />
    );
}

export default LoginPage