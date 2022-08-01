import {useContext} from 'react'
import ReactGA from 'react-ga4'
import {CenterColumnBox} from '@components/containers'
import {HttpConst} from '@conf/const'
import Http, {HttpErrorType, HttpResponseType} from '@services/http'
import {getDimen} from '@conf/utils'
import {ToastContext} from '@components/toast'
import AddAccountForm from './add-account-form'
import {SubmitValuesTypes, AddAccountPropTypes} from './types'
import {PermissionsContext} from '@apps/trader-app'
import {GlobalData} from '@apps/trader-app/models'


const AddAccount = ({onAccountAdded, noOfAccounts, userIsOnFreeTrial, userId}: AddAccountPropTypes) => {
    const permissions = useContext(PermissionsContext)
    const Toast = useContext(ToastContext);
    /** The function used by the form to submit values
     * @param config: object used to configure the Http client
     */
    const submitValues = (config: SubmitValuesTypes) => {
        const {BASE_URL, ADD_TRADING_ACCOUNT_URL} = HttpConst;
        ReactGA.event('add_account_attempt', {
            'user_id': userId
        });
        let successFunc = (resp: HttpResponseType) => {
            ReactGA.event('add_account_success', {
                'user_id': userId
            })
            config.successFunc();
        };
        let errorFunc = (err: HttpErrorType) => {
            ReactGA.event('add_account_fail', {
                'user_id': userId
            });
            config.errorFunc();
        };
        Http.post({
            url: `${BASE_URL}/${ADD_TRADING_ACCOUNT_URL}/`,
            data: config.values,
            successFunc: (resp: any) => makeFollowUpRequests(
                config.values,
                successFunc,
                errorFunc,
                config.thenFunc
            ),
            errorFunc: (resp: HttpErrorType) => {
                ReactGA.event('add_account_fail', {
                    'user_id': userId
                });
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
            networkErrorFunc: (err: HttpErrorType) => {
                ReactGA.event('add_account_fail', {
                    'user_id': userId
                });
            },
            timeoutErrorFunc: (err: HttpErrorType) => {
                ReactGA.event('add_account_fail', {
                    'user_id': userId
                });
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
                userIsOnFreeTrial={userIsOnFreeTrial}
                permissions={permissions} />
        </CenterColumnBox>
    )
}

const TIME_TO_WAIT_BEFORE_NEXT_PENDING_REQUEST = 5000;
const MAX_NO_OF_FOLLOW_UP_REQUESTS = 180;

export default AddAccount