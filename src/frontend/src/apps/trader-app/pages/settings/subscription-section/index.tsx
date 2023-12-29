import {useContext, useState} from 'react'
import ReactGA from 'react-ga4'
import {UserData} from '@apps/trader-app/models/types'
import {ColumnBox, RowBox} from '@components/containers'
import {H6, P} from '@components/text'
import Dialog from '@components/dialog'
import {Button} from '@components/buttons'
import LoadingIcon from '@components/loading-icon'
import cancelSubscription from './cancel-subscription'
import {ToastContext} from '@components/toast'
import {useNavigate} from 'react-router-dom'
import {RouteConst} from '@conf/const'
import {SubscriptionCancelContext} from '@apps/trader-app'
import { ConfigConst } from '@conf/const'


const SubscriptionSection = ({subscriptionPlan, daysLeftBeforeFreeTrialExpires, userId}: {subscriptionPlan: UserData['subscription_plan'], daysLeftBeforeFreeTrialExpires: number | string, userId: number}) => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [subscriptionIsCancelling, setSubscriptionIsCancelling] = useState(false);
    const onSubscriptionCancel = useContext(SubscriptionCancelContext)
    const Toast = useContext(ToastContext);
    const navigate = useNavigate();
    const format = (plan: UserData['subscription_plan']): string => {
        switch(plan){
            case 'none':
                return 'None'
            case 'monthly':
                return 'Monthly'
            case 'yearly':
                return 'Yearly'
            case 'wba-yearly':
                return 'Wba-Yearly'
        }
    }
    return(
        <ColumnBox>
            <Dialog
                title='Cancel Subscription?'
                okButtonColor='error'
                okButtonContent={subscriptionIsCancelling ? <LoadingIcon /> : 'Cancel Subscription'}
                okButtonProps={{'data-testid': 'confirm-delete-account-button'}}
                onOkClick={() => {
                    setSubscriptionIsCancelling(true);
                    cancelSubscription(Toast, onSubscriptionCancel, () => {
                        setDialogIsOpen(false);
                        setSubscriptionIsCancelling(false)
                    })
                }}
                onCancelClick={() => setDialogIsOpen(false)}
                showCancelButton={!subscriptionIsCancelling}
                onClose={() => {
                    if(!subscriptionIsCancelling){
                        setDialogIsOpen(false);
                    }
                }}
                open={dialogIsOpen}>
                    <P>Are you sure you want to unsubscribe?</P>
            </Dialog>
            <RowBox>
                <H6>Subscription Plan: &nbsp;</H6>
                <H6>{format(subscriptionPlan)}</H6>
            </RowBox>
            <RowBox>
                {subscriptionPlan === 'none' ?
                    <FreeTrialInfo navigate={navigate}
                        userId={userId}
                        daysLeftBeforeFreeTrialExpires={daysLeftBeforeFreeTrialExpires} />
                    : <Button color='error'
                        disabled={ConfigConst.IS_ARCHIVE}
                        onClick={() => setDialogIsOpen(true)}>Cancel Subscription</Button>
                }
            </RowBox>
        </ColumnBox>
    )
}


const FreeTrialInfo = ({daysLeftBeforeFreeTrialExpires, navigate, userId}: {daysLeftBeforeFreeTrialExpires: number | string, navigate: Function, userId: number}) => {
    const {TRADER_APP_ROUTE, TRADER_SUBSCRIBE_NOW_ROUTE} = RouteConst;
    if(typeof(daysLeftBeforeFreeTrialExpires) === 'string' && daysLeftBeforeFreeTrialExpires.includes('not started')){
        return <P>Your free trial has not yet started</P>
    }
    if(daysLeftBeforeFreeTrialExpires !== 0){
        return(
            <P>You have {daysLeftBeforeFreeTrialExpires.toString()}&nbsp;
                more days before your free trial expires</P>
        )
    } else {
        return(
            <ColumnBox>
                <P>Your free trial has expired</P>
                <Button disabled={ConfigConst.IS_ARCHIVE} onClick={() => {
                    ReactGA.event('call_to_action_subscribe', {
                        'user_id': userId
                    })
                    navigate(`/${TRADER_APP_ROUTE}/${TRADER_SUBSCRIBE_NOW_ROUTE}`);
                }}>Subscribe</Button>
            </ColumnBox>
        )
    }
}

export default SubscriptionSection