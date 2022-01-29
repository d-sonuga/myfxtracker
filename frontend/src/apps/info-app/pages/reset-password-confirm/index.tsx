import Http from '@services/http'
import {HttpConst} from '@conf/const'
import {FormPageContainer} from '@apps/info-app/components'
import ResetPasswordConfirmForm from './reset-password-form'
import {SubmitValues} from './types'


const ResetPasswordConfirmPage = () => {
    /** 
     * The function used by the form to submit values
     * @param config: object used to configure the Http client
     */
     const submitValues = (config: SubmitValues) => {
        const {BASE_URL, RESET_PASSWORD_CONFIRM_URL} = HttpConst;
        Http.post({
            url: `${BASE_URL}/${RESET_PASSWORD_CONFIRM_URL}/`,
            data: config.values,
            noToken: true,
            successFunc: config.successFunc,
            errorFunc: config.errorFunc,
            thenFunc: config.thenFunc
        });
    }

    return(
        <FormPageContainer
            form={<ResetPasswordConfirmForm submitValues={submitValues} />}
             />
    );
}

export default ResetPasswordConfirmPage