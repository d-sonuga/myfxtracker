import Http from '@services/http'
import {HttpConst, RouteConst} from '@conf/const'
import {ToastFuncType} from '@components/toast/types'


/**
 * @param Toast toast object to alert user of errors
 * @param navigate function used to navigate to another page after successful account deletion
 * @param thenFunc function to be executed after attempt to delete, whether it ends in success or error
 * @param followUpNo number of times request has been remade
 */
const cancelSubscription = (
    Toast: ToastFuncType,
    navigate: Function,
    thenFunc: Function,
    followUpNo: number = 0
) => {
    const {BASE_URL, CANCEL_SUBSCRIPTION_URL} = HttpConst;
    setTimeout(() => Http.delete({
        url: `${BASE_URL}/${CANCEL_SUBSCRIPTION_URL}/`,
        successFunc: (resp: any) => {
            if('detail' in resp.data){
                if(resp.data['detail'] === 'not pending'){
                    const {TRADER_APP_ROUTE} = RouteConst;
                    navigate(`/${TRADER_APP_ROUTE}`);
                    thenFunc();
                } else {
                    if(followUpNo >= MAX_NO_OF_FOLLOW_UP_REQUESTS){
                        Toast.error('Sorry. Something went wrong.');
                        thenFunc();
                    } else {
                        cancelSubscription(Toast, navigate, thenFunc, followUpNo + 1);
                    }
                }
            } else {
                console.log('elseblock', resp.data);
                Toast.error('Sorry. Something went wrong.');
                thenFunc();
            }
        },
        errorFunc: (error: any) => {
            console.log('errfunc', error);
            Toast.error('Sorry. Something went wrong.');
            thenFunc();
        },
    }), firstRequest(followUpNo) ? 0 : TIME_TO_WAIT_BEFORE_NEXT_PENDING_REQUEST);
}

const firstRequest = (followUpNo: number) => followUpNo === 0

const TIME_TO_WAIT_BEFORE_NEXT_PENDING_REQUEST = 5000;
const MAX_NO_OF_FOLLOW_UP_REQUESTS = 120;

export default cancelSubscription