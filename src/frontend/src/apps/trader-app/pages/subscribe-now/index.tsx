import {SubscribeNowPropTypes} from './types'
import {getDimen} from '@conf/utils'
import React, {useContext, useRef, useState} from 'react'
import ReactGA from 'react-ga4'
import LoadingIcon from '@components/loading-icon'
import MonthlySubscriptionButton from './monthly-subscription-button'
import YearlySubscriptionButton from './yearly-subscription-button'
import {NewSubscriptionContext} from '@apps/trader-app'
import {ToastContext} from '@components/toast'
import {YEARLY_SUBSCRIPTION_PRICE} from './const'
import {UserData} from '@apps/trader-app/models/types'
import {PricingPage} from '@apps/info-app/pages'
import './style.css'


const SubscribeNow = ({userHasPaidOnce, email, userId}: SubscribeNowPropTypes) => {
    const [subscribing, setSubscribing] = useState('');
    const onNewSubscription = useContext(NewSubscriptionContext);
    const Toast = useContext(ToastContext)
    const monthlySubscriptionTrigger = React.createRef<HTMLButtonElement>();
    const yearlySubscriptionTrigger = React.createRef<HTMLButtonElement>();
    const subscriptionIsOngoing = (subscribing: string) => {
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
        setSubscribing('none');
        Toast.error('Something went wrong on our end. Please contact support.');
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
                    monthly: (subscriptionIsOngoing(subscribing) && subscribing.toLowerCase()) === 'monthly' ||
                        !subscriptionIsOngoing(subscribing),
                    yearly: (subscriptionIsOngoing(subscribing) && subscribing.toLowerCase()) === 'yearly' ||
                        !subscriptionIsOngoing(subscribing)
                }}
                subscribeAction={{
                    monthly: () => {
                        setSubscribing('Monthly');
                        ReactGA.event('subscribe_attempt', {
                            'user_id': userId,
                            'pricing_plan': 'monthly'
                        });
                        if(monthlySubscriptionTrigger && monthlySubscriptionTrigger.current){
                            monthlySubscriptionTrigger.current.click();
                        }
                    },
                    yearly: () => {
                        ReactGA.event('subscribe_attempt', {
                            'user_id': userId,
                            'pricing_plan': 'yearly'
                        });
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