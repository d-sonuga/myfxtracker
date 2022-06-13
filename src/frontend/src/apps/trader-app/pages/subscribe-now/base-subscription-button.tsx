import React from 'react'
import {useFlutterwave, closePaymentModal, FlutterWaveTypes} from 'flutterwave-react-v3'
import saveSubscriptionStatus from './save-subscription-status'
import {BaseSubscriptionButtonPropTypes} from './types'

const BaseSubscriptionButton = React.forwardRef<HTMLButtonElement, BaseSubscriptionButtonPropTypes>((props, ref) => {
    const {config, abortSubscription, onSubscriptionFinished, onSubscriptionRecordFailed} = props;
    const handleFlutterPayment = useFlutterwave(config);
    return(
        <button style={{display: 'none'}}
            ref={ref}
            onClick={(e) => {
                handleFlutterPayment({
                    callback: (resp: FlutterWaveTypes.FlutterWaveResponse) => {
                        console.log('in callback', resp);
                        saveSubscriptionStatus(resp)
                            .then((postActionsPending: boolean) => {
                                onSubscriptionFinished(postActionsPending, {amount: resp.amount})
                            })
                            .catch((err) => {
                                console.log(err);
                                onSubscriptionRecordFailed();
                            })
                        closePaymentModal();
                    },
                    onClose: () => {
                        abortSubscription();
                    }
                })
            }}></button>
    )
})

export default BaseSubscriptionButton