import {SubscribeNowPropTypes} from './types'
import {getDimen} from '@conf/utils'
import React, {useContext, useRef, useState} from 'react'
import ReactGA from 'react-ga4'
import LoadingIcon from '@components/loading-icon'
import MonthlySubscriptionButton from './monthly-subscription-button'
import YearlySubscriptionButton from './yearly-subscription-button'
import {NewSubscriptionContext} from '@apps/trader-app'
import {ToastContext} from '@components/toast'
import {UserData} from '@apps/trader-app/models/types'
import {PricingPage} from '@apps/info-app/pages'
import { WBA_PLAN_PRICE, AFFILIATE_WBA_USERNAME, MONTHLY_PLAN_PRICE, YEARLY_PLAN_PRICE, YEARLY_PLAN_PER_MONTH_PRICE, WBA_PLAN_PER_MONTH_PRICE } from '@apps/trader-app/const'
import WbaSubscriptionButton from './wba-subscription-button'
import './style.css'


const SubscribeNow = ({userHasPaidOnce, email, userId, referrerUsername}: SubscribeNowPropTypes) => {
    const [subscribing, setSubscribing] = useState<UserData['subscription_plan']>('none');
    const onNewSubscription = useContext(NewSubscriptionContext);
    const Toast = useContext(ToastContext)
    const monthlySubscriptionTrigger = React.createRef<HTMLButtonElement>();
    const yearlySubscriptionTrigger = React.createRef<HTMLButtonElement>();
    const wbaSubscriptionTrigger = React.createRef<HTMLButtonElement>();
    const subscriptionIsOngoing = (subscribing: UserData['subscription_plan']) => {
        return subscribing !== 'none'
    }
    const abortSubscription = () => {
        setSubscribing('none');
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
        if(data.amount === YEARLY_PLAN_PRICE){
            subscriptionPlan = 'yearly';
        } else if(data.amount === WBA_PLAN_PRICE){
            subscriptionPlan = 'wba-yearly'
        }
        onNewSubscription(postActionsPending, data, subscriptionPlan);
    }
    const onSubscriptionRecordFailed = () => {
        setSubscribing('none');
        Toast.error('Something went wrong on our end. Please contact support.');
    }
        
    if(referrerUsername === AFFILIATE_WBA_USERNAME) {
        return(
            <>
                <PricingPage navbar={null}
                    defaultPlanIndex={0}
                    plans={[
                        {
                            name: 'Wba-Yearly',
                            price: WBA_PLAN_PER_MONTH_PRICE,
                            subscribeButtonContent: subscribing.toLowerCase() === 'wba-yearly' ?
                                <LoadingIcon />
                                :'Subscribe Now',
                            subscribeButtonEnabled: (subscriptionIsOngoing(subscribing) && subscribing.toLowerCase()) === 'wba-yearly' ||
                                !subscriptionIsOngoing(subscribing),
                            subscribeButtonAction: () => {
                                ReactGA.event('subscribe_attempt', {
                                    'user_id': userId,
                                    'pricing_plan': 'yearly'
                                });
                                setSubscribing('wba-yearly');
                                if(wbaSubscriptionTrigger && wbaSubscriptionTrigger.current){
                                    wbaSubscriptionTrigger.current.click();
                                }
                            }
                        }
                    ]}
                    style={{
                        marginTop: getDimen('padding-md'),
                        marginLeft: getDimen('padding-xs'),
                        marginRight: getDimen('padding-xs')
                    }} />
                <WbaSubscriptionButton email={email} ref={wbaSubscriptionTrigger}
                        userId={userId} abortSubscription={abortSubscription}
                        onSubscriptionFinished={onSubscriptionFinished}
                        onSubscriptionRecordFailed={onSubscriptionRecordFailed} />
            </>
        )
    }

    return(
        <>
            <PricingPage navbar={null}
                defaultPlanIndex={1}
                plans={[
                    {
                        name: 'Monthly',
                        price: MONTHLY_PLAN_PRICE,
                        subscribeButtonContent: subscribing.toLowerCase() === 'monthly' ?
                            <LoadingIcon />
                            : 'Subscribe Now',
                        subscribeButtonEnabled: (subscriptionIsOngoing(subscribing) && subscribing.toLowerCase()) === 'monthly' ||
                            !subscriptionIsOngoing(subscribing),
                        subscribeButtonAction: () => {
                            setSubscribing('monthly');
                            ReactGA.event('subscribe_attempt', {
                                'user_id': userId,
                                'pricing_plan': 'monthly'
                            });
                            if(monthlySubscriptionTrigger && monthlySubscriptionTrigger.current){
                                monthlySubscriptionTrigger.current.click();
                            }
                        }
                    },
                    {
                        name: 'Yearly',
                        price: YEARLY_PLAN_PER_MONTH_PRICE,
                        subscribeButtonContent: subscribing.toLowerCase() === 'yearly' ?
                            <LoadingIcon />
                            :'Subscribe Now',
                        subscribeButtonEnabled: (subscriptionIsOngoing(subscribing) && subscribing.toLowerCase()) === 'yearly' ||
                            !subscriptionIsOngoing(subscribing),
                        subscribeButtonAction: () => {
                            ReactGA.event('subscribe_attempt', {
                                'user_id': userId,
                                'pricing_plan': 'yearly'
                            });
                            setSubscribing('yearly');
                            if(yearlySubscriptionTrigger && yearlySubscriptionTrigger.current){
                                yearlySubscriptionTrigger.current.click();
                            }
                        }
                    }
                ]}
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