import React from 'react'
import {ColumnBox} from '@components/containers'
import {H6, P} from '@components/text'
import logo from '@visuals/images/logo.png'
import {HttpConst} from '@conf/const'
import {MutableRefObject} from 'react'
import {SubscriptionButtonPropTypes} from './types'
import saveSubscriptionStatus from './save-subscription-status'
import BaseSubscriptionButton from './base-subscription-button'


const MonthlySubscriptionButton = React.forwardRef<HTMLButtonElement, SubscriptionButtonPropTypes>((props, ref) => {
    const {email, userId, ...others} = props;
    const config = {
        public_key: 'FLWPUBK_TEST-abbddb271c00020e17219254c27054e5-X',
        payment_plan: '21030',
        tx_ref: `user-${userId}-date-${Date.now().toString()}`,
        amount: 24.99,
        currency: 'USD',
        payment_options: 'card',
        customer: {
            email,
            name: '',
            phonenumber: ''
        },
        text: '',
        customizations: {
            title: 'MyFxTracker-Monthly',
            description: '',
            logo: `${HttpConst.BASE_URL}${logo}`
        }
    };
    
    return(
        <BaseSubscriptionButton config={config} ref={ref} {...others} />
    )
})

export default MonthlySubscriptionButton