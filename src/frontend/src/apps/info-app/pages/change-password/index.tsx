import Http from '@services/http'
import {HttpConst} from '@conf/const'
import {FormPageContainer} from '@apps/info-app/components'
import ChangePasswordForm from './change-password-form'
import {SubmitValues} from './types'


const ChangePasswordPage = () => {
    /** 
     * The function used by the form to submit values
     * @param config: object used to configure the Http client
     */
     const submitValues = (config: SubmitValues) => {
        const {BASE_URL, CHANGE_PASSWORD_URL} = HttpConst;
        Http.post({
            url: `${BASE_URL}/${CHANGE_PASSWORD_URL}/`,
            data: config.values,
            successFunc: config.successFunc,
            errorFunc: config.errorFunc,
            thenFunc: config.thenFunc
        });
    }

    return(
        <FormPageContainer
            form={<ChangePasswordForm submitValues={submitValues} />}
             />
    );
}

export default ChangePasswordPage