import React from 'react'
import ReactGA from 'react-ga4'
import {useFlutterwave, closePaymentModal, FlutterWaveTypes} from 'flutterwave-react-v3'
import saveSubscriptionStatus from './save-subscription-status'
import {BaseSubscriptionButtonPropTypes} from './types'

const BaseSubscriptionButton = React.forwardRef<HTMLButtonElement, BaseSubscriptionButtonPropTypes>((props, ref) => {
    const {config, abortSubscription, onSubscriptionFinished, onSubscriptionRecordFailed, userId} = props;
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
                                ReactGA.event('subscribe_success', {
                                    'user_id': userId
                                });
                                onSubscriptionFinished(postActionsPending, {amount: resp.amount})
                            })
                            .catch((err) => {
                                console.log(err);
                                ReactGA.event('subscribe_fail', {
                                    'user_id': userId
                                });
                                onSubscriptionRecordFailed();
                            })
                        closePaymentModal();
                    },
                    onClose: () => {
                        ReactGA.event('subscribe_abort', {
                            'user_id': userId
                        })
                        abortSubscription();
                    }
                })
            }}></button>
    )
})

export default BaseSubscriptionButton