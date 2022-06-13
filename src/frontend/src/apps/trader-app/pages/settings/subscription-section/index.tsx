import {useContext, useState} from 'react'
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


const SubscriptionSection = ({subscriptionPlan, daysLeftBeforeFreeTrialExpires}: {subscriptionPlan: UserData['subscription_plan'], daysLeftBeforeFreeTrialExpires: number}) => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [subscriptionIsCancelling, setSubscriptionIsCancelling] = useState(false);
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
        }
    }
    return(
        <ColumnBox>
            <Dialog
                title='Delete Account?'
                okButtonColor='error'
                okButtonContent={subscriptionIsCancelling ? <LoadingIcon /> : 'Cancel Subscription'}
                okButtonProps={{'data-testid': 'confirm-delete-account-button'}}
                onOkClick={() => {
                    setSubscriptionIsCancelling(true);
                    cancelSubscription(Toast, navigate, () => {
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
                        daysLeftBeforeFreeTrialExpires={daysLeftBeforeFreeTrialExpires} />
                    : <Button color='error' onClick={() => setDialogIsOpen(true)}>Cancel Subscription</Button>
                }
            </RowBox>
        </ColumnBox>
    )
}


const FreeTrialInfo = ({daysLeftBeforeFreeTrialExpires, navigate}: {daysLeftBeforeFreeTrialExpires: number, navigate: Function}) => {
    const {TRADER_APP_ROUTE} = RouteConst;
    if(daysLeftBeforeFreeTrialExpires !== 0){
        return(
            <P>You have {daysLeftBeforeFreeTrialExpires.toString()}&nbsp;
                more days before your free trial expires</P>
        )
    } else {
        return(
            <ColumnBox>
                <P>Your free trial has expired</P>
                <Button onClick={() => navigate(`/${TRADER_APP_ROUTE}`)}>Subscribe</Button>
            </ColumnBox>
        )
    }
}

export default SubscriptionSection