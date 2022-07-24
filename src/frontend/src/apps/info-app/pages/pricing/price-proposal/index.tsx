import {ReactNode} from 'react'
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
                price={29.95}
                subscribeButtonContent={subscribeContent.monthly}
                subscribeButtonAction={subscribeAction.monthly}
                subscribeButtonEnabled={subscribeEnabled ? subscribeEnabled.monthly : true}
                />
            <PlanInfo
                show={currentTabIndex === YEARLY}
                price={24.95}
                extraInfo={['Annually, you have 16% off which is 2 months free ', 'You save $60 a year']}
                subscribeButtonContent={subscribeContent.yearly}
                subscribeButtonAction={subscribeAction.yearly}
                subscribeButtonEnabled={subscribeEnabled ? subscribeEnabled.yearly : true}
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