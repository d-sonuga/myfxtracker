import React from 'react'
import {AccountData} from 'calculator'
import {GlobalData} from '.'

type RawData = {
    user_data: UserData,
    trade_data: TradeData
}

type UserData = {
    id: number,
    email: string,
    ds_username: string,
    is_subscribed: boolean,
    on_free: boolean,
    logins_after_ask?: number,
    current_feedback_question?: number
}

type TradeData = {
    current_account_id: number,
    accounts: {
        [key: number]: AccountData
    }
}

type UseGlobalDataType = {
    (): [GlobalData, React.Dispatch<React.SetStateAction<GlobalData>>]
}

export type {
    RawData,
    UseGlobalDataType
}