import {Link} from 'react-router-dom'
import {RowBox} from '@components/containers'
import {SP} from '@components/text'
import Http from '@services/http'
import {getColor, getDimen} from '@conf/utils'
import {HttpConst} from '@conf/const'
import {FormPageContainer} from '@apps/info-app/components'
import ChangePasswordForm from './change-password-form'
//import {SubmitValuesTypes} from './types'


const ChangePasswordPage = () => {
    /** 
     * The function used by the form to submit values
     * @param config: object used to configure the Http client
     */
     const submitValues = (config: any) => {
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
            form={<ChangePasswordForm submitValues={submitValues} />}
             />
    );
}

export default ChangePasswordPage