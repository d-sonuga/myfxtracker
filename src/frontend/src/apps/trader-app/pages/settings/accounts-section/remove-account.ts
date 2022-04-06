import Http from '@services/http'
import {HttpConst} from '@conf/const'
import {ToastFuncType} from '@components/toast/types'


/**
 * @param accountId id of account to delete
 * @param removeAccountFromData function from trader app index to update state after successful deletion
 * @param Toast toast object to alert user of errors
 * @param thenFunc function to be executed after attempt to delete, whether it ends in success or error
 */
const removeAccount = (
    accountId: number,
    removeAccountFromData: Function,
    Toast: ToastFuncType,
    thenFunc: Function,
    followUpNo: number = 0
) => {
    const {BASE_URL, REMOVE_TRADING_ACCOUNT_URL} = HttpConst;
    setTimeout(() => Http.delete({
        url: `${BASE_URL}/${REMOVE_TRADING_ACCOUNT_URL}/${accountId}/`,
        successFunc: (resp: any) => {
            if('detail' in resp.data){
                if(resp.data['detail'] === 'removed'){
                    removeAccountFromData(accountId);
                    thenFunc();
                } else {
                    if(followUpNo >= MAX_NO_OF_FOLLOW_UP_REQUESTS){
                        Toast.error('Sorry. Something went wrong.');
                        thenFunc();
                    } else {
                        removeAccount(accountId, removeAccountFromData, Toast, thenFunc, followUpNo + 1);
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
        },
    }), firstRequest(followUpNo) ? 0 : TIME_TO_WAIT_BEFORE_NEXT_PENDING_REQUEST);
}

const firstRequest = (followUpNo: number) => followUpNo === 0

const TIME_TO_WAIT_BEFORE_NEXT_PENDING_REQUEST = 5000;
const MAX_NO_OF_FOLLOW_UP_REQUESTS = 120;

export default removeAccount