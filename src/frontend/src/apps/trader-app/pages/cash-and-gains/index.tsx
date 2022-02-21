import {useState} from 'react'
import {cashAndGainsCalculations} from 'calculator'
import {PageContainer, PageHeading, useRecalc} from '@apps/trader-app/components'
import CashGraph from './cash-graph'
import GainsGraph from './gains-graph'
import defaultCashAndGainsCalc from './const'
import './style.css'


const CashAndGains = () => {
    const [cashAndGainsCalc, setCashAndGainsCalc] = useState(defaultCashAndGainsCalc);
    useRecalc(cashAndGainsCalculations, setCashAndGainsCalc);
    return(
        <PageContainer className='apps-trader-app-pages-cash-and-gains-container'>
            <PageHeading heading='Cash and Gains' />
            <CashGraph data={cashAndGainsCalc.cashGraphCalc} />
            <GainsGraph data={cashAndGainsCalc.gainsGraphCalc} />
        </PageContainer>
    )
}

export default CashAndGains