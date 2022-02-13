/**
 * Hook to set global data in TraderApp
 */

import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {GlobalData} from '@apps/trader-app/models'
import {Http, HttpErrorType, HttpResponseType} from '@apps/trader-app/services'
import {HttpConst} from '@conf/const'
import {RawData, UseGlobalDataType} from './types'
import {AccountData} from 'calculator/dist'


const useGlobalData: UseGlobalDataType = () => {
    const [globalData, setGlobalData] = useState<GlobalData>(new GlobalData(null));
    useEffect(() => {
        /* The real thing to be used.
            Going to use dummy data just for development*/
        // Request init data from backend
        const {BASE_URL, GET_INIT_DATA_URL} = HttpConst;
        Http.get({
            url: `${BASE_URL}/${GET_INIT_DATA_URL}/`,
            successFunc: (resp: HttpResponseType) => {
                setGlobalData(new GlobalData(resp.data));
            },
            errorFunc: (err: HttpErrorType) => {}
        })
    }, [])
    return [globalData, setGlobalData];
}

const noAccountsRawData  = {
    user_data: {
        id: 1,
        email: 'newuser@email.com',
        is_subscribed: false,
        on_free: true,
        logins_after_ask: 2,
        current_feedback_question: 1
    },
    trade_data: {
        no_of_trades: 0,
        current_account_id: -1,
        accounts: {}
    }
}

const someAccounts: {[key: string]: AccountData} = {
    2: {
        name: 'kot-demo',
        trades: [
            {
                pair: 'USDGPY',
                action: 'buy',
                openTime: '2021-03-21 12:30:00+00:00',
                closeTime: '2021-06-01 12:30:00+00:00',
                profitLoss: 320,
                pips: 3,
                takeProfit: 20,
                stopLoss: 13
            }
        ],
        deposits: [
            {
                account: 2, 
                amount: 300, 
                time: '2021-02-30 12:30:00+00:00'
            },
            {
                account: 2, 
                amount: 300, 
                time: '2021-02-30 12:30:00+00:00'
            }
        ],
        withdrawals: [
            {
                account: 2,
                amount: 20, 
                time: '2021-02-30 12:30:00+00:00'
            },
            {
                account: 2,
                amount: 50, 
                time: '2021-02-30 12:30:00+00:00'
            }
        ]
    },
    4: {
        name: 'kot-live',
        trades: [
            {
                pair: 'USDGPY',
                action: 'buy',
                openTime: '2021-12-03 12:30:00+00:00',
                closeTime: '2022-05-02 12:30:00+00:00',
                profitLoss: 320,
                pips: 3,
                takeProfit: 2,
                stopLoss: 323
            }
        ],
        deposits: [
            {
                account: 2, 
                amount: 300, 
                time: '2021-02-03 12:30:00+00:00'
            },
            {
                account: 2, 
                amount: 300, 
                time: '2021-02-03 12:30:00+00:00'
            }
        ],
        withdrawals: [
            {
                account: 2,
                amount: 20, 
                time: '2021-02-03 12:30:00+00:00'
            },
            {
                account: 2,
                amount: 50, 
                time: '2021-02-03 12:30:00+00:00'
            }
        ]
    }
}

const dummyRawData: RawData = {
    user_data: {
        id: 3,
        email: 'sonugademilade8703@gmail.com',
        is_subscribed: false,
        on_free: true,
        logins_after_ask: 2,
        current_feedback_question: 1
    },
    trade_data: {
        current_account_id: 2,
        accounts: someAccounts
    }
}

export default useGlobalData