import {FlutterWaveTypes} from 'flutterwave-react-v3'
import {Http, HttpResponseType} from '@apps/trader-app/services'
import {HttpConst} from '@conf/const'

const saveSubscriptionStatus = (resp: FlutterWaveTypes.FlutterWaveResponse): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        Http.post({
            url: `${BASE_URL}/${RECORD_NEW_SUBSCRIPTION_URL}/`,
            data: {amount: resp.amount},
            successFunc: (resp: HttpResponseType) => {
                if(resp.data['status'] === 'pending'){
                    resolve(true);
                } else {
                    resolve(false);
                }
            },
            errorFunc: (err: any) => {
                console.log(err);
                reject();
            }
        })
        
    })
}

const {BASE_URL, RECORD_NEW_SUBSCRIPTION_URL} = HttpConst;

export default saveSubscriptionStatus