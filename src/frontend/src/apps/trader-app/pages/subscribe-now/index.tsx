import {ColumnBox, RowBox} from '@components/containers'
import {P, H6, H5, H4, H3, H2, BP} from '@components/text'
import {SubscribeNowPropTypes} from './types'
import './style.css'
import {getDimen} from '@conf/utils'
import {Button} from '@components/buttons'
import React, {useContext, useRef, useState} from 'react'
import LoadingIcon from '@components/loading-icon'
import MonthlySubscriptionButton from './monthly-subscription-button'
import YearlySubscriptionButton from './yearly-subscription-button'
import {NewSubscriptionContext} from '@apps/trader-app'
import {ToastContext} from '@components/toast'
import {YEARLY_SUBSCRIPTION_PRICE} from './const'
import {UserData} from '@apps/trader-app/models/types'
import { PricingPage } from '@apps/info-app/pages'


const SubscribeNow = ({userHasPaidOnce, email, userId}: SubscribeNowPropTypes) => {
    const [subscribing, setSubscribing] = useState('');
    const onNewSubscription = useContext(NewSubscriptionContext);
    const Toast = useContext(ToastContext)
    const monthlySubscriptionTrigger = React.createRef<HTMLButtonElement>();
    const yearlySubscriptionTrigger = React.createRef<HTMLButtonElement>();
    const subscriptionIsOngoing = () => {
        return subscribing.length !== 0
    }
    const abortSubscription = () => {
        setSubscribing('');
    }
    /**
     * @param postActionsPending this is set when the record subscription response returns a 
     * successful pending response because of some actions that the backend needed to take after
     * recording the user as subscribed (such as reconnecting the user's trading account).
     * In such a scenario the page loading page must be shown and user has to be alerted that
     * this could take a while
     */
    const onSubscriptionFinished = (postActionsPending: boolean, data: {[key: string]: any}) => {
        let subscriptionPlan: UserData['subscription_plan'] = 'monthly';
        if(data.amount === YEARLY_SUBSCRIPTION_PRICE){
            subscriptionPlan = 'yearly';
        }
        onNewSubscription(postActionsPending, data, subscriptionPlan);
    }
    const onSubscriptionRecordFailed = () => {
        setSubscribing('none')
        Toast.error('Your subscription was successful, but something went wrong on our end. Please contact support.');
    }
    return(
        <>
            <PricingPage navbar={null} 
                subscribeContent={{
                    monthly: subscribing.toLowerCase() === 'monthly' ?
                        <LoadingIcon />
                        : 'Subscribe Now',
                    yearly: subscribing.toLowerCase() === 'yearly' ?
                        <LoadingIcon />
                        :'Subscribe Now'
                }}
                subscribeEnabled={{
                    monthly: (subscriptionIsOngoing() && subscribing.toLowerCase()) === 'monthly' ||
                        !subscriptionIsOngoing(),
                    yearly: (subscriptionIsOngoing() && subscribing.toLowerCase()) === 'yearly' ||
                        !subscriptionIsOngoing()
                }}
                subscribeAction={{
                    monthly: () => {
                        setSubscribing('Monthly');
                        if(monthlySubscriptionTrigger && monthlySubscriptionTrigger.current){
                            monthlySubscriptionTrigger.current.click();
                        }
                    },
                    yearly: () => {
                        setSubscribing('Yearly');
                        if(yearlySubscriptionTrigger && yearlySubscriptionTrigger.current){
                            yearlySubscriptionTrigger.current.click();
                        }
                    }
                }}
                style={{
                    marginTop: getDimen('padding-md'),
                    marginLeft: getDimen('padding-xs'),
                    marginRight: getDimen('padding-xs')
                }} />
            <MonthlySubscriptionButton email={email}
                ref={monthlySubscriptionTrigger} userId={userId}
                abortSubscription={abortSubscription} onSubscriptionFinished={onSubscriptionFinished}
                onSubscriptionRecordFailed={onSubscriptionRecordFailed} />
            <YearlySubscriptionButton email={email} ref={yearlySubscriptionTrigger}
                    userId={userId} abortSubscription={abortSubscription}
                    onSubscriptionFinished={onSubscriptionFinished}
                    onSubscriptionRecordFailed={onSubscriptionRecordFailed} />
        </>
    )
}

export default SubscribeNow