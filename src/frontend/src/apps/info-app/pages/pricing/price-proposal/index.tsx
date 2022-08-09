import {ReactNode} from 'react'
import ReactGA from 'react-ga4'
import {Tabs, Tab} from '@mui/material'
import {ColumnBox, RowBox} from '@components/containers'
import {H5, BP} from '@components/text'
import {ButtonWithArrow} from '@apps/info-app/components'
import {SyntheticEvent, useState} from 'react'
import {getDimen} from '@conf/utils'
import {PriceProposalPropTypes} from '../types'
import {PlanInfoPropTypes} from './types'
import './style.css'


const PriceProposal = ({subscribeContent, subscribeAction, subscribeEnabled}: PriceProposalPropTypes) => {
    const [MONTHLY, YEARLY] = [0, 1];
    const [currentTabIndex, setCurrentTabIndex] = useState(YEARLY);
    const onPlanInfoChange = (event: SyntheticEvent, newTabIndex: number) => {
        ReactGA.event('viewing_price', {
            'pricing_plan': newTabIndex === 0 ? 'monthly' : 'yearly'
        })
        setCurrentTabIndex(newTabIndex);
    }
    return(
        <ColumnBox>
            <Tabs value={currentTabIndex} onChange={onPlanInfoChange}>
                <Tab label='Monthly' />
                <Tab label='Yearly' />
            </Tabs>
            <PlanInfo
                show={currentTabIndex === MONTHLY}
                price={19.95}
                subscribeButtonContent={subscribeContent.monthly}
                subscribeButtonAction={subscribeAction.monthly}
                subscribeButtonEnabled={subscribeEnabled.monthly}
                />
            <PlanInfo
                show={currentTabIndex === YEARLY}
                price={16.6625}
                extraInfo={['Annually, you have 16% off ', 'You save $39.45 a year']}
                subscribeButtonContent={subscribeContent.yearly}
                subscribeButtonAction={subscribeAction.yearly}
                subscribeButtonEnabled={subscribeEnabled.yearly}
                />
        </ColumnBox>
    )
}

const PlanInfo = ({show, price, extraInfo, subscribeButtonContent, subscribeButtonAction, subscribeButtonEnabled}: PlanInfoPropTypes) => {
    return(
        <ColumnBox style={{
            width: 'fit-content',
            display: show ? 'block' : 'none'
        }}>
            {renderExtraInfo(extraInfo)}
            <RowBox className='apps-info-app-pages-pricing-price'>
                <sup>$</sup>
                <RowBox style={{alignItems: 'baseline'}}>
                    <H5>{price.toString()} &nbsp;</H5>
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