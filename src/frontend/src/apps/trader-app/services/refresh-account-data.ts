import {ToastFuncType} from '@components/toast/types'
import {HttpConst} from '@conf/const'
import {HttpErrorType, HttpResponseType} from '@services/http'
import {GlobalData} from '../models'
import {Http} from '../services'


const refreshAccountData = (Toast: ToastFuncType, setGlobalData: Function, setDataIsRefreshing: Function, successFunc: Function = () => {}) => {
    const {BASE_URL, REFRESH_DATA_URL} = HttpConst;
    setDataIsRefreshing(true);
    Http.get({
        url: `${BASE_URL}/${REFRESH_DATA_URL}/`,
        successFunc: (resp: HttpResponseType) => {
            makeFollowUpRequests(Toast, setGlobalData, setDataIsRefreshing, successFunc);
        },
        errorFunc: (err: HttpErrorType) => {
            Toast.error('Sorry but something went wrong.');
            setDataIsRefreshing(false)
        }
    })
}

const makeFollowUpRequests = (
    Toast: ToastFuncType,
    setGlobalData: Function,
    setDataIsRefreshing: Function,
    successFunc: Function,
    followUpNo: number = 1
) => {
    const {BASE_URL, PENDING_REFRESH_DATA_URL} = HttpConst;
    setTimeout(() => Http.get({
        url: `${BASE_URL}/${PENDING_REFRESH_DATA_URL}/`,
        successFunc: (resp: HttpResponseType) => {
            if('detail' in resp.data){
                if(followUpNo >= MAX_NO_OF_FOLLOW_UP_REQUESTS){
                    Toast.error('Sorry. This is taking longer than expected. Please try again later.');
                    setDataIsRefreshing(false);
                } else {
                    makeFollowUpRequests(Toast, setGlobalData, setDataIsRefreshing, successFunc, followUpNo + 1);
                }
            } else {
                const newGlobalData = new GlobalData(resp.data);
                setGlobalData(newGlobalData);
                setDataIsRefreshing(false);
                successFunc();
            }
        },
        errorFunc: (err: HttpErrorType) => {
            console.log(err);
            Toast.error('Sorry but something went wrong');
            setDataIsRefreshing(false);
        }
    }), TIME_TO_WAIT_BEFORE_NEXT_PENDING_REQUEST);
}



const TIME_TO_WAIT_BEFORE_NEXT_PENDING_REQUEST = 5000;
const MAX_NO_OF_FOLLOW_UP_REQUESTS = 120;

export default refreshAccountData