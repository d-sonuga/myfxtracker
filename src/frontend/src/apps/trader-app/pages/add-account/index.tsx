import {CenterColumnBox} from '@components/containers'
import AddAccountForm from './add-account-form'
import {HttpConst} from '@conf/const'
import Http from '@services/http'
import {SubmitValuesTypes} from './types'
import {getDimen} from '@conf/utils'


const AddAccount = ({onAccountAdded, noOfAccounts}: {onAccountAdded: Function, noOfAccounts: number}) => {
    /** The function used by the form to submit values
     * @param config: object used to configure the Http client
     */
     const submitValues = (config: SubmitValuesTypes) => {
        const {BASE_URL, ADD_TRADING_ACCOUNT_URL} = HttpConst;
        /**
         * The timeout is 10 minutes because the creation of an account
         * can actually take a long time
         */
        Http.post({
            url: `${BASE_URL}/${ADD_TRADING_ACCOUNT_URL}/`,
            data: config.values,
            successFunc: config.successFunc,
            errorFunc: config.errorFunc,
            thenFunc: config.thenFunc,
            timeout: 1000 * 60 * 10
        });
    }
    return(
        <CenterColumnBox style={{marginTop: getDimen('padding-big')}}>
            <AddAccountForm
                submitValues={submitValues}
                onAccountAdded={onAccountAdded}
                noOfAccounts={noOfAccounts} />
        </CenterColumnBox>
    )
}

export default AddAccount