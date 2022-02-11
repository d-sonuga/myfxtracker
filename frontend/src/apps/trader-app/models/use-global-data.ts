/**
 * Hook to set global data in TraderApp
 */

 import {useState, useEffect} from 'react'
 import {useNavigate} from 'react-router-dom'
 import {GlobalData} from '@apps/trader-app/models'
 import Http, {HttpErrorType, HttpResponseType} from '@services/http'
 import {HttpConst, RouteConst} from '@conf/const'
 import {RawData, UseGlobalDataType} from './types'


const useGlobalData: UseGlobalDataType = () => {
    const [globalData, setGlobalData] = useState<GlobalData>(new GlobalData(null));

    useEffect(() => {
        /* The real thing to be used.
            Going to use dummy data just for development
        // Request init data from backend
        const {BASE_URL, GET_INIT_DATA_URL} = HttpConst;
        Http.get({
            url: `${BASE_URL}/${GET_INIT_DATA_URL}`,
            successFunc: (resp: HttpResponseType) => {
                setGlobalData(new GlobalData(resp.data));
            },
            errorFunc: (err: HttpErrorType) => {
                if(err.response && (err.response.status === 401 || err.response.status === 403)){
                    const {TOKEN_KEY} = ConfigConst;
                    localStorage.removeItem(TOKEN_KEY);
                    const {LOGIN_ROUTE} = RouteConst;
                    navigate(LOGIN_ROUTE);
                }
            }
        })
        */
        setGlobalData(new GlobalData(dummyRawData));
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

const someAccounts = {
    2: {
        name: 'kot-demo',
        trades: [
            {
                pair: 'USDGPY',
                action: 'buy',
                entry_date: '2021-03-21',
                exit_date: '2021-06-01',
                risk_reward_ratio: 3,
                profit_loss: 320,
                pips: 3,
                notes: 'A note',
                entry_image_link: '',
                exit_image_link: '',
                date_added: '12-04-21'
            }
        ],
        deposits: [
            {
                account: 2, 
                amount: 300, 
                date: '2021-02-30'
            },
            {
                account: 2, 
                amount: 300, 
                date: '2021-02-30'
            }
        ],
        withdrawals: [
            {
                account: 2,
                amount: 20, 
                date: '2021-02-30'
            },
            {
                account: 2,
                amount: 50, 
                date: '2021-02-30'
            }
        ]
    },
    4: {
        name: 'kot-live',
        trades: [
            {
                pair: 'USDGPY',
                action: 'buy',
                entry_date: '2021-12-03',
                exit_date: '2022-05-02',
                risk_reward_ratio: 3,
                profit_loss: 320,
                pips: 3,
                notes: 'A note',
                entry_image_link: '',
                exit_image_link: '',
                date_added: '12-04-21'
            }
        ],
        deposits: [
            {
                account: 2, 
                amount: 300, 
                date: '2021-02-03'
            },
            {
                account: 2, 
                amount: 300, 
                date: '2021-02-03'
            }
        ],
        withdrawals: [
            {
                account: 2,
                amount: 20, 
                date: '2021-02-03'
            },
            {
                account: 2,
                amount: 50, 
                date: '2021-02-03'
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
        no_of_trades: 2,
        current_account_id: 2,
        accounts: someAccounts
    }
}

export default useGlobalData