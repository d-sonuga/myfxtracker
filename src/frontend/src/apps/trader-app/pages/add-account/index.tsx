import {useContext} from 'react'
import {CenterColumnBox} from '@components/containers'
import {HttpConst} from '@conf/const'
import Http, {HttpErrorType, HttpResponseType} from '@services/http'
import {getDimen} from '@conf/utils'
import {ToastContext} from '@components/toast'
import AddAccountForm from './add-account-form'
import {SubmitValuesTypes} from './types'


const AddAccount = ({onAccountAdded, noOfAccounts, userIsOnFreeTrial}: {onAccountAdded: Function, noOfAccounts: number, userIsOnFreeTrial: boolean}) => {
    const Toast = useContext(ToastContext);
    /** The function used by the form to submit values
     * @param config: object used to configure the Http client
     */
    const submitValues = (config: SubmitValuesTypes) => {
        const {BASE_URL, ADD_TRADING_ACCOUNT_URL} = HttpConst;
        Http.post({
            url: `${BASE_URL}/${ADD_TRADING_ACCOUNT_URL}/`,
            data: config.values,
            successFunc: (resp: any) => makeFollowUpRequests(
                config.values,
                config.successFunc,
                config.errorFunc,
                config.thenFunc
            ),
            errorFunc: (resp: HttpErrorType) => {
                config.errorFunc(resp);
                config.thenFunc();
            }
        });
    }
    const makeFollowUpRequests = (
        values: SubmitValuesTypes['values'],
        successFunc: SubmitValuesTypes['successFunc'],
        errorFunc: SubmitValuesTypes['errorFunc'],
        thenFunc: SubmitValuesTypes['thenFunc'],
        followUpNo: number = 1
    ) => {
        const {BASE_URL, PENDING_ADD_TRADING_ACCOUNT_URL} = HttpConst;
        setTimeout(() => Http.post({
            url: `${BASE_URL}/${PENDING_ADD_TRADING_ACCOUNT_URL}/`,
            data: values,
            successFunc: (resp: HttpResponseType) => {
                const data = resp.data;
                if(data['detail']){
                    if(followUpNo >= MAX_NO_OF_FOLLOW_UP_REQUESTS){
                        Toast.error('Sorry. This is taking longer than expected. Please try again later.');
                    } else {
                        makeFollowUpRequests(values, successFunc, errorFunc, thenFunc, followUpNo + 1);
                    }
                } else {
                    successFunc(resp.data);
                    thenFunc();
                }
            },
            errorFunc: (resp: HttpErrorType) => {
                errorFunc(resp);
                thenFunc();
            }
        }), TIME_TO_WAIT_BEFORE_NEXT_PENDING_REQUEST)
    }
    return(
        <CenterColumnBox style={{marginTop: getDimen('padding-big')}}>
            <AddAccountForm
                submitValues={submitValues}
                onAccountAdded={onAccountAdded}
                noOfAccounts={noOfAccounts}
                userIsOnFreeTrial={userIsOnFreeTrial} />
        </CenterColumnBox>
    )
}

const TIME_TO_WAIT_BEFORE_NEXT_PENDING_REQUEST = 5000;
const MAX_NO_OF_FOLLOW_UP_REQUESTS = 180;

export default AddAccount