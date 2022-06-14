import {ColumnBox, RowBox} from '@components/containers'
import {P, H6, H5, H4, H3, H2, BP} from '@components/text'
import {SubscribeNowPropTypes} from './types'
import './style.css'
import {getColor, getDimen} from '@conf/utils'
import {Button} from '@components/buttons'
import React, {useContext, useRef, useState} from 'react'
import LoadingIcon from '@components/loading-icon'
import MonthlySubscriptionButton from './monthly-subscription-button'
import YearlySubscriptionButton from './yearly-subscription-button'
import {NewSubscriptionContext} from '@apps/trader-app'
import {ToastContext} from '@components/toast'


const SubscribeNow = ({userHasPaidOnce, email, userId}: SubscribeNowPropTypes) => {
    const [subscribing, setSubscribing] = useState('');
    const onNewSubscription = useContext(NewSubscriptionContext);
    const Toast = useContext(ToastContext)
    const monthlySubscriptionTrigger = React.createRef<HTMLButtonElement>();
    const yearlySubscriptionTrigger = React.createRef<HTMLButtonElement>();
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
        onNewSubscription(postActionsPending, data);
    }
    const onSubscriptionRecordFailed = () => {
        setSubscribing('none')
        Toast.error('Your subscription was successful, but something went wrong on our end. Please contact support.');
    }
    /**
     * This is called when the timer started after a subscription button is clicked
     * reaches a timeout
     */
    const onFlutterwaveModalTimeout = () => {

    }
    return(
        <div style={{marginTop: getDimen('padding-xxbig')}}>
            <Heading userHasPaidOnce={userHasPaidOnce} />
            <div id='apps-trader-app-pages-subscribe-now'>
                <MonthlySubscriptionButton email={email}
                    ref={monthlySubscriptionTrigger} userId={userId}
                    abortSubscription={abortSubscription} onSubscriptionFinished={onSubscriptionFinished}
                    onSubscriptionRecordFailed={onSubscriptionRecordFailed} />
                <Subscription name='Monthly' price='24.99' subscribing={subscribing} subscribe={() => {
                    setSubscribing('Monthly');
                    if(monthlySubscriptionTrigger && monthlySubscriptionTrigger.current){
                        monthlySubscriptionTrigger.current.click();
                    }
                }} />
                <YearlySubscriptionButton email={email} ref={yearlySubscriptionTrigger}
                    userId={userId} abortSubscription={abortSubscription}
                    onSubscriptionFinished={onSubscriptionFinished}
                    onSubscriptionRecordFailed={onSubscriptionRecordFailed} />
                <Subscription name='Yearly' price='23.99' subscribing={subscribing} subscribe={() => {
                    setSubscribing('Yearly');
                    if(yearlySubscriptionTrigger && yearlySubscriptionTrigger.current){
                        yearlySubscriptionTrigger.current.click();
                    }
                }} />
            </div>
        </div>
    )
}

const Subscription = ({name, price, subscribe, subscribing}: {name: string, price: string, subscribe: Function, subscribing: string}) => {
    const subscriptionIsOngoing = () => subscribing.length !== 0
    return(
        <ColumnBox className={`apps-trader-app-pages-subscribe-now-subscription apps-trader-app-pages-subscribe-now-subscription-${name}`}>
            <H5>{name}</H5>
            <RowBox className='apps-trader-app-pages-subscribe-now-subscription-price'>
                <sup>$</sup>
                <RowBox style={{alignItems: 'baseline'}}>
                    <H5>{price} &nbsp;</H5>
                    <BP>per month</BP>
                </RowBox>
            </RowBox>
            <Button 
                style={{marginTop: getDimen('padding-xs')}}
                onClick={(e) => {
                    if(subscribing.length === 0){
                        subscribe()
                    }
                }}
                disabled={subscriptionIsOngoing() && subscribing !== name}>
                    {subscriptionIsOngoing() && subscribing === name ?  <LoadingIcon /> : 'Subscribe'}
                </Button>
        </ColumnBox>
    )
}

const Heading = ({userHasPaidOnce}: {userHasPaidOnce: boolean}) => {
    return(
        <ColumnBox style={{
            textAlign: 'center',
            marginTop: getDimen('padding-big'),
            marginBottom: getDimen('padding-big')
            }}>
        {userHasPaidOnce ?
            <>
                <H5>Your Subscription Has Expired</H5>
                <P>Please subscribe for continued access</P>
            </>
            :
            <>
                <H5>Your Free Trial Is Over</H5>
                <P>Please subscribe for continued access</P>
            </>
        }
        </ColumnBox>
    )
}

export default SubscribeNow