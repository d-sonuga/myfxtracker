import React from 'react'
import {SubscriptionButtonPropTypes} from './types'
import BaseSubscriptionButton from './base-subscription-button'
import {WBA_PLAN_ID, WBA_PLAN_PRICE} from './const'


const WbaSubscriptionButton = React.forwardRef<HTMLButtonElement, SubscriptionButtonPropTypes>((props, ref) => {
    const {email, userId, ...others} = props;
    const config = {
        planId: WBA_PLAN_ID,
        txRef: `user-${userId}-date-${Date.now().toString()}`,
        amount: WBA_PLAN_PRICE,
        email,
        title: 'MyFxTracker-wba'
    };
    return(
        <BaseSubscriptionButton config={config} ref={ref} userId={userId} {...others} />
    )
})

export default WbaSubscriptionButton