import {ToastFuncType} from '@components/toast/types'
import {HttpConst} from '@conf/const'
import {HttpErrorType, HttpResponseType} from '@services/http'
import {GlobalData} from '../models'
import {Http} from '../services'


const makeFollowUpSubscriptionRequests = (
    Toast: ToastFuncType,
    data: {[key: string]: any},
    successFunc: Function,
    followUpNo: number = 1
) => {
    const {BASE_URL, RECORD_NEW_SUBSCRIPTION_URL} = HttpConst;
    setTimeout(() => Http.post({
        url: `${BASE_URL}/${RECORD_NEW_SUBSCRIPTION_URL}/`,
        data,
        successFunc: (resp: HttpResponseType) => {
            if(resp.data['detail'] === 'pending'){
                if(followUpNo >= MAX_NO_OF_FOLLOW_UP_REQUESTS){
                    Toast.error('Sorry. This is taking longer than expected. Please try again later.');
                } else {
                    makeFollowUpSubscriptionRequests(Toast, data, successFunc, followUpNo + 1);
                }
            } else {
                successFunc()
            }
        },
        errorFunc: (err: HttpErrorType) => {
            console.log(err);
            Toast.error('Sorry. Something went wrong. ' + 
                'Try refreshing the page. If this error persists, please contact support.'
            );
        }
    }), TIME_TO_WAIT_BEFORE_NEXT_PENDING_REQUEST);
}



const TIME_TO_WAIT_BEFORE_NEXT_PENDING_REQUEST = 5000;
const MAX_NO_OF_FOLLOW_UP_REQUESTS = 120;

export default makeFollowUpSubscriptionRequests