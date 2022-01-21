import {useContext, useState} from 'react'
import {SelectInput} from '@components/inputs'
import {GlobalDataContext, CurrentAccountChangerContext} from '@apps/trader-app'


const AccountSelector = () => {
    const globalData = useContext(GlobalDataContext);
    const accounts = globalData.getTradeAccountNames();
    const currentAccountName = globalData.getCurrentTradeAccountName();
    const onCurrentAccountChange = useContext(CurrentAccountChangerContext);
    
    return(
        <SelectInput
            value={currentAccountName}
            onChange={(e) => onCurrentAccountChange(globalData.getTradeAccountIdOf(e.target.value))}
            options={accounts}
            placeholder='Accounts' />
    )
}

export default AccountSelector