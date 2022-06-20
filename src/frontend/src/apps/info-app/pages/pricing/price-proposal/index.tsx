import {ReactNode} from 'react'
import {Tabs, Tab} from '@mui/material'
import {ColumnBox, RowBox} from '@components/containers'
import {H5, BP} from '@components/text'
import {ButtonWithArrow} from '@apps/info-app/components'
import './style.css'
import {SyntheticEvent, useState} from 'react'
import {getDimen} from '@conf/utils'
import {PriceProposalPropTypes} from '../types'


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
                price={29.99}
                subscribeButtonContent={subscribeContent.monthly}
                subscribeButtonAction={subscribeAction.monthly}
                subscribeButtonEnabled={subscribeEnabled ? subscribeEnabled.monthly : true}
                />
            <PlanInfo
                show={currentTabIndex === YEARLY}
                price={24.99}
                extraInfo='You get save 2 months'
                subscribeButtonContent={subscribeContent.yearly}
                subscribeButtonAction={subscribeAction.yearly}
                subscribeButtonEnabled={subscribeEnabled ? subscribeEnabled.yearly : true}
                />
        </ColumnBox>
    )
}

const PlanInfo = ({show, price, extraInfo, subscribeButtonContent, subscribeButtonAction, subscribeButtonEnabled}: {show: boolean, price: number, extraInfo?: string, subscribeButtonContent: ReactNode, subscribeButtonAction: Function, subscribeButtonEnabled: boolean}) => {
    return(
        <ColumnBox style={{
            width: 'fit-content',
            display: show ? 'block' : 'none'
        }}>
            {extraInfo ?
                <BP style={{marginTop: getDimen('padding-xs')}}>You save 2 months</BP>
                : null
            }
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

export default PriceProposal