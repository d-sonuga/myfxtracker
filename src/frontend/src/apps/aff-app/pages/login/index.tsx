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
import {AffiliateData} from '@apps/aff-app/use-affiliate-data'


const LoginPage = ({setAffiliateData}: {setAffiliateData: (data: AffiliateData) => void}) => {
    /** 
     * The function used by the form to submit values
     * @param config: object used to configure the Http client
     */
     const navigate = useNavigate();
     const submitValues = (config: SubmitValuesTypes) => {
        const {BASE_URL, AFF_LOGIN_URL} = HttpConst;
        Http.post({
            url: `${BASE_URL}/${AFF_LOGIN_URL}/`,
            noToken: true,
            data: config.values,
            successFunc: (resp: HttpResponseType) => {
                config.successFunc(resp)
            },
            errorFunc: (err: HttpErrorType) => {
                config.errorFunc(err);
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
                    setAffiliateData={setAffiliateData}
                    />
            } />
    );
}

export default LoginPage