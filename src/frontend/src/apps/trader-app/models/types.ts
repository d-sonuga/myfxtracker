import React from 'react'
import {AccountData} from 'calculator'
import {GlobalData} from '.'
import { PermissionsObj } from '../services/types'

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
    current_feedback_question?: number,
    subscription_plan: 'none' | 'monthly' | 'yearly',
    days_left_before_free_trial_expires: number | string,
    /**
     * Tells whether or not the user has ever subscribed
     * Used to determine whether to show a 'Free Trial Is Over' message
     * or a 'Subscription Has Expired'
     */
    has_paid?: boolean
}

type TradeData = {
    current_account_id: number,
    last_data_refresh_time: Date,
    accounts: {
        [key: number]: AccountData
    }
}

type UseGlobalDataType = {
    (): [GlobalData, (gd: GlobalData) => void, PermissionsObj]
}

export type {
    RawData,
    UseGlobalDataType,
    UserData
}