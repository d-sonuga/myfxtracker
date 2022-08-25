import React from 'react'
import ReactGA from 'react-ga4'
import {useFlutterwave, closePaymentModal, FlutterWaveTypes} from 'flutterwave-react-v3'
import { FlutterwaveConfig } from 'flutterwave-react-v3/dist/types'
import {HttpConst} from '@conf/const'
import logo from '@visuals/images/logo.png'
import saveSubscriptionStatus from './save-subscription-status'
import {FLUTTERWAVE_PUBLIC_KEY} from './const'
import {BaseSubscriptionButtonPropTypes} from './types'

const BaseSubscriptionButton = React.forwardRef<HTMLButtonElement, BaseSubscriptionButtonPropTypes>((props, ref) => {
    const {config, abortSubscription, onSubscriptionFinished, onSubscriptionRecordFailed, userId} = props;
    const baseConfig: FlutterwaveConfig = {
        public_key: FLUTTERWAVE_PUBLIC_KEY,
        payment_plan: config.planId,
        tx_ref: `user-${userId}-date-${Date.now().toString()}`,
        amount: config.amount,
        currency: 'USD',
        payment_options: 'card',
        customer: {
            email: config.email,
            name: '',
            phonenumber: ''
        },
        customizations: {
            title: config.title,
            description: '',
            logo: `${HttpConst.BASE_URL}${logo}`
        }
    };
    const handleFlutterPayment = useFlutterwave(baseConfig);
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