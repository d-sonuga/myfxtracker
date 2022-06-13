import React from 'react'
import {ColumnBox} from '@components/containers'
import {H6, P} from '@components/text'
import {useFlutterwave, closePaymentModal, FlutterWaveTypes} from 'flutterwave-react-v3'
import logo from '@visuals/images/logo.png'
import {HttpConst} from '@conf/const'
import {MutableRefObject} from 'react'
import {SubscriptionButtonPropTypes} from './types'
import BaseSubscriptionButton from './base-subscription-button'


const YearlySubscriptionButton = React.forwardRef<HTMLButtonElement, SubscriptionButtonPropTypes>((props, ref) => {
    const {email, userId, ...others} = props;
    const config = {
        public_key: 'FLWPUBK_TEST-abbddb271c00020e17219254c27054e5-X',
        payment_plan: '21029',
        tx_ref: `user-${userId}-date-${Date.now().toString()}`,
        amount: 23.99,
        currency: 'USD',
        payment_options: 'card',
        customer: {
            email,
            name: '',
            phonenumber: ''
        },
        text: '',
        customizations: {
            title: 'MyFxTracker-Yearly',
            description: '',
            logo: `${HttpConst.BASE_URL}${logo}`
        }
    };
    return(
        <BaseSubscriptionButton config={config} ref={ref} {...others} />
    )
})

export default YearlySubscriptionButton