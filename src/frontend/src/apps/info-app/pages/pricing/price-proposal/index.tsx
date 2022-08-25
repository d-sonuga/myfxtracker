import {ReactNode} from 'react'
import ReactGA from 'react-ga4'
import {Tabs, Tab} from '@mui/material'
import {ColumnBox, RowBox} from '@components/containers'
import {H5, BP} from '@components/text'
import {ButtonWithArrow} from '@apps/info-app/components'
import {SyntheticEvent, useState} from 'react'
import {getDimen} from '@conf/utils'
import {PriceProposalPropTypes, Plan} from '../types'
import {PlanInfoPropTypes} from './types'
import './style.css'


const PriceProposal = ({plans, defaultPlanIndex}: PriceProposalPropTypes) => {
    const [currentTabIndex, setCurrentTabIndex] = useState(defaultPlanIndex);
    const onPlanInfoChange = (event: SyntheticEvent, newTabIndex: number) => {
        ReactGA.event('viewing_price', {
            'pricing_plan': newTabIndex === 0 ? 'monthly' : 'yearly'
        })
        setCurrentTabIndex(newTabIndex);
    }
    return(
        <ColumnBox>
            <Tabs value={currentTabIndex} onChange={onPlanInfoChange}>
                {plans.map((plan: Plan, i: number) => (
                    <Tab label={plan.name} />
                ))}
            </Tabs>
            {plans.map((plan: Plan, i: number) => (
                <PlanInfo
                    key={i}
                    show={currentTabIndex === i}
                    price={plan.price}
                    subscribeButtonContent={plan.subscribeButtonContent}
                    subscribeButtonAction={plan.subscribeButtonAction}
                    subscribeButtonEnabled={plan.subscribeButtonEnabled}
                    />
            ))}
        </ColumnBox>
    )
}

const PlanInfo = ({show, price, extraInfo, subscribeButtonContent, subscribeButtonAction, subscribeButtonEnabled}: PlanInfoPropTypes) => {
    const formatPrice = (price: number) => {
        let strPrice = price.toString();
        const priceIsOnlyOneDecimalPlace = () => strPrice.split('.').length > 1 && strPrice.split('.')[1].length === 1;
        if(priceIsOnlyOneDecimalPlace()){
            return price.toFixed(2)
        }
        return price.toString()
    }
    return(
        <ColumnBox style={{
            width: 'fit-content',
            display: show ? 'block' : 'none'
        }}>
            {renderExtraInfo(extraInfo)}
            <RowBox className='apps-info-app-pages-pricing-price'>
                <sup>$</sup>
                <RowBox style={{alignItems: 'baseline'}}>
                    <H5>{formatPrice(price)} &nbsp;</H5>
                    <BP>per month</BP>
                </RowBox>
            </RowBox>
            <ButtonWithArrow
                disabled={!subscribeButtonEnabled}
                style={{width: '100%'}}
                onClick={() => subscribeButtonAction()}>
                    {subscribeButtonContent}
            </ButtonWithArrow>
        </ColumnBox>
    )
}

const renderExtraInfo = (extraInfo: PlanInfoPropTypes['extraInfo']): ReactNode =>  {
    if(extraInfo === undefined){
        return null;
    }
    if(typeof(extraInfo) === 'string'){
        return <BP style={{marginTop: getDimen('padding-xs'), width: '100%'}}>{extraInfo}</BP>
    }
    return extraInfo.map((info) => (
        <BP style={{marginTop: getDimen('padding-xs'), maxWidth: '200px'}}>{info}</BP>
    ));
}

export default PriceProposal