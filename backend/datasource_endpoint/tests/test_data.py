class DatasourceInitialInfoData:
    trader_with_no_transaction_details = {
        'email': 'atrader1@gmail.com',
        'password': 'password',
        'how_you_heard_about_us': 'on social media',
        'trading_time_before_joining': '3 - 5 years'
    }
    trader_with_transactions_details = {
        'email': 'atrader2@gmail.com',
        'password': 'password',
        'how_you_heard_about_us': 'on social media',
        'trading_time_before_joining': '3 - 5 years'
    }
    trader_with_expired_ds_username_details = {
        'email': 'atrader3@gmail.com',
        'password': 'password',
        'how_you_heard_about_us': 'on social media',
        'trading_time_before_joining': '3 - 5 years'
    }
    good_details_with_transactions = {
        # The username will be filled in the test
        'datasource_username': '',
        'data': {
            'account-currency':'USD',
            'account-company':'KOT LTD',
            'account-name':'Human',
            'account-server':'KOT-Demo',
            'account-credit':'0',
            'account-profit':'0',
            'account-equity':'4055.13',
            'account-margin':'0',
            'account-free-margin':'4055.13',
            'account-margin-level':'0',
            'account-margin-call-level':'100',
            'account-margin-stopout-level':'70',
            'account-login-number':'2054973',
            'account-leverage':'500',
            'account-trade-mode':'demo',
            'account-stopout-level':'70',
            'account-stopout-level-format': 'percent',
            'account-transactions':[
                {
                    'pair':'USDJPY',
                    'open-price':'114.74200000',
                    'close-price':'114.77200000',
                    'profit':'0.52000000',
                    'open-time':'2022.02.01 18:04',
                    'close-time':'2022.02.01 18:22',
                    'transaction-id':'75981325',
                    'action':'buy',
                    'swap':'0.00000000',
                    'lots':'0.02000000',
                    'commission':'-0.14000000',
                    'stop-loss':'0.00000000',
                    'take-profit':'0.00000000',
                    'comment':None,
                    'magic-number':'0.00000000'
                },
                {
                    'pair':'USDJPY',
                    'open-price':'114.77900000',
                    'close-price':'114.77000000',
                    'profit':'-0.16000000',
                    'open-time':'2022.02.01 18:34',
                    'close-time':'2022.02.01 18:34',
                    'transaction-id':'25988514',
                    'action':'buy',
                    'swap':'0.00000000',
                    'lots':'0.02000000',
                    'commission':'-0.14000000',
                    'stop-loss':'0.00000000',
                    'take-profit':'0.00000000',
                    'comment':None,
                    'magic-number':'0.00000000'
                },
                {
                    "pair":None,
                    "open-price":"0.00000000",
                    "close-price":"0.00000000",
                    "profit":"500.00000000",
                    "open-time":"2022.02.04 07:33",
                    "close-time":"2022.02.04 07:33",
                    "transaction-id":"73508415",
                    "action":"sell",
                    "swap":"0.00000000",
                    "lots":"0.01000000",
                    "commission":"0.00000000",
                    "stop-loss":"0.00000000",
                    "take-profit":"0.00000000",
                    "comment":"Deposit",
                    "magic-number":"0.00000000"
                },
                {
                    "pair":None,
                    "open-price":"0.00000000",
                    "close-price":"0.00000000",
                    "profit":"20.00000000",
                    "open-time":"2022.02.04 08:33",
                    "close-time":"2022.02.04 08:33",
                    "transaction-id":"16508415",
                    "action":"sell",
                    "swap":"0.00000000",
                    "lots":"0.01000000",
                    "commission":"0.00000000",
                    "stop-loss":"0.00000000",
                    "take-profit":"0.00000000",
                    "comment":"Deposit",
                    "magic-number":"0.00000000"
                },
                {
                    "pair":None,
                    "open-price":"0.00000000",
                    "close-price":"0.00000000",
                    "profit":"450.00000000",
                    "open-time":"2022.02.04 18:03",
                    "close-time":"2022.02.04 18:03",
                    "transaction-id":"96508415",
                    "action":"sell",
                    "swap":"0.00000000",
                    "lots":"0.01000000",
                    "commission":"0.00000000",
                    "stop-loss":"0.00000000",
                    "take-profit":"0.00000000",
                    "comment":"Deposit",
                    "magic-number":"0.00000000"
                },
                {
                    "pair":None,
                    "open-price":"0.00000000",
                    "close-price":"0.00000000",
                    "profit":"222.00000000",
                    "open-time":"2022.02.04 19:03",
                    "close-time":"2022.02.04 19:03",
                    "transaction-id":"42508415",
                    "action":"sell",
                    "swap":"0.00000000",
                    "lots":"0.01000000",
                    "commission":"0.00000000",
                    "stop-loss":"0.00000000",
                    "take-profit":"0.00000000",
                    "comment":"Withdrawal",
                    "magic-number":"0.00000000"
                },
                {
                    "pair":None,
                    "open-price":"0.00000000",
                    "close-price":"0.00000000",
                    "profit":"200.0000000",
                    "open-time":"2022.02.04 19:04",
                    "close-time":"2022.02.04 19:04",
                    "transaction-id":"666666666",
                    "action":"sell",
                    "swap":"0.00000000",
                    "lots":"0.01000000",
                    "commission":"0.00000000",
                    "stop-loss":"0.00000000",
                    "take-profit":"0.00000000",
                    "comment":"Withdrawal",
                    "magic-number":"0.00000000"
                },
                {
                    "pair":None,
                    "open-price":"0.00000000",
                    "close-price":"0.00000000",
                    "profit":"227.32000000",
                    "open-time":"2022.02.04 19:04",
                    "close-time":"2022.02.04 19:04",
                    "transaction-id":"33308415",
                    "action":"sell",
                    "swap":"0.00000000",
                    "lots":"0.01000000",
                    "commission":"0.00000000",
                    "stop-loss":"0.00000000",
                    "take-profit":"0.00000000",
                    "comment":"Withdrawal",
                    "magic-number":"0.00000000"
                }
            ],
        }
    }
    good_details_with_no_transactions = {
        # The username will be filled in the test
        'datasource_username': '',
        'data': {
            'account-currency':'USD',
            'account-company':'KOT LTD',
            'account-name':'Fellow',
            'account-server':'KOT-Demo',
            'account-credit':'0',
            'account-profit':'0',
            'account-equity':'4055.13',
            'account-margin':'0',
            'account-free-margin':'4055.13',
            'account-margin-level':'0',
            'account-margin-call-level':'100',
            'account-margin-stopout-level':'70',
            'account-login-number':'2054973',
            'account-leverage':'500',
            'account-trade-mode':'demo',
            'account-stopout-level':'70',
            'account-stopout-level-format': 'percent',
            'account-transactions':[]
        }
    }
    bad_details_expired_username = {
        'username': 'expiredusername'
    }
    bad_details_non_existent_username = {
        'username': 'nonexistentusername'
    }


class SaveInitialDataTestData:
    trader_details = {
        'email': 'atrader1@gmail.com',
        'password': 'password',
        'how_you_heard_about_us': 'on social media',
        'trading_time_before_joining': '3 - 5 years'
    }
    account_transaction_data1 = DatasourceInitialInfoData.good_details_with_transactions['data']
    account_transaction_data2 = DatasourceInitialInfoData.good_details_with_no_transactions['data']


class SaveDataTestData:
    trader_details = {
        'email': 'atrader1@gmail.com',
        'password': 'password',
        'how_you_heard_about_us': 'on social media',
        'trading_time_before_joining': '3 - 5 years'
    }
    account_transaction_data1 = DatasourceInitialInfoData.good_details_with_no_transactions['data']
    account_transaction_data2 = {
        'account-currency':'USD',
        'account-company':'KOT LTD',
        'account-name':'Fellow',
        'account-server':'KOT-Demo',
        'account-credit':'0',
        'account-profit':'0',
        'account-equity':'4055.13',
        'account-margin':'0',
        'account-free-margin':'4055.13',
        'account-margin-level':'0',
        'account-margin-call-level':'100',
        'account-margin-stopout-level':'70',
        'account-login-number':'2014073',
        'account-leverage':'500',
        'account-trade-mode':'demo',
        'account-stopout-level':'70',
        'account-stopout-level-format': 'percent',
        'account-transactions':[]
    }
    new_data = {
        'account-name': account_transaction_data1['account-name'],
        'account-company': account_transaction_data1['account-company'],
        'account-login-number': account_transaction_data1['account-login-number'],
        'account-transactions': [
            {
                'pair':'USDJPY',
                'open-price':'114.74200000',
                'close-price':'114.77200000',
                'profit':'0.52000000',
                'open-time':'2022.02.01 18:04',
                'close-time':'2022.02.01 18:22',
                'transaction-id':'12431345',
                'action':'buy',
                'swap':'0.00000000',
                'lots':'0.02000000',
                'commission':'-0.14000000',
                'stop-loss':'0.00000000',
                'take-profit':'0.00000000',
                'comment':None,
                'magic-number':'0.00000000'
            },
            {
                'pair':'USDJPY',
                'open-price':'114.74200000',
                'close-price':'114.77200000',
                'profit':'0.52000000',
                'open-time':'2022.02.01 18:04',
                'close-time':'2022.02.01 18:22',
                'transaction-id':'23914545',
                'action':'buy',
                'swap':'0.00000000',
                'lots':'0.02000000',
                'commission':'-0.14000000',
                'stop-loss':'0.00000000',
                'take-profit':'0.00000000',
                'comment':None,
                'magic-number':'0.00000000'
            },
            {
                "pair":None,
                "open-price":"0.00000000",
                "close-price":"0.00000000",
                "profit":"500.00000000",
                "open-time":"2022.02.04 07:33",
                "close-time":"2022.02.04 07:33",
                "transaction-id":"36508415",
                "action":"sell",
                "swap":"0.00000000",
                "lots":"0.01000000",
                "commission":"0.00000000",
                "stop-loss":"0.00000000",
                "take-profit":"0.00000000",
                "comment":"Deposit",
                "magic-number":"0.00000000"
            },
            {
                "pair":None,
                "open-price":"0.00000000",
                "close-price":"0.00000000",
                "profit":"20.00000000",
                "open-time":"2022.02.04 08:33",
                "close-time":"2022.02.04 08:33",
                "transaction-id":"46508415",
                "action":"sell",
                "swap":"0.00000000",
                "lots":"0.01000000",
                "commission":"0.00000000",
                "stop-loss":"0.00000000",
                "take-profit":"0.00000000",
                "comment":"Deposit",
                "magic-number":"0.00000000"
            },
            {
                "pair":None,
                "open-price":"0.00000000",
                "close-price":"0.00000000",
                "profit":"450.00000000",
                "open-time":"2022.02.04 18:03",
                "close-time":"2022.02.04 18:03",
                "transaction-id":"56508415",
                "action":"sell",
                "swap":"0.00000000",
                "lots":"0.01000000",
                "commission":"0.00000000",
                "stop-loss":"0.00000000",
                "take-profit":"0.00000000",
                "comment":"Deposit",
                "magic-number":"0.00000000"
            },
            {
                "pair":None,
                "open-price":"0.00000000",
                "close-price":"0.00000000",
                "profit":"222.00000000",
                "open-time":"2022.02.04 19:03",
                "close-time":"2022.02.04 19:03",
                "transaction-id":"66508415",
                "action":"sell",
                "swap":"0.00000000",
                "lots":"0.01000000",
                "commission":"0.00000000",
                "stop-loss":"0.00000000",
                "take-profit":"0.00000000",
                "comment":"Withdrawal",
                "magic-number":"0.00000000"
            },
            {
                "pair":None,
                "open-price":"0.00000000",
                "close-price":"0.00000000",
                "profit":"200.0000000",
                "open-time":"2022.02.04 19:04",
                "close-time":"2022.02.04 19:04",
                "transaction-id":"77508415",
                "action":"sell",
                "swap":"0.00000000",
                "lots":"0.01000000",
                "commission":"0.00000000",
                "stop-loss":"0.00000000",
                "take-profit":"0.00000000",
                "comment":"Withdrawal",
                "magic-number":"0.00000000"
            },
            {
                "pair":None,
                "open-price":"0.00000000",
                "close-price":"0.00000000",
                "profit":"227.32000000",
                "open-time":"2022.02.04 19:04",
                "close-time":"2022.02.04 19:04",
                "transaction-id":"96508415",
                "action":"sell",
                "swap":"0.00000000",
                "lots":"0.01000000",
                "commission":"0.00000000",
                "stop-loss":"0.00000000",
                "take-profit":"0.00000000",
                "comment":"Withdrawal",
                "magic-number":"0.00000000"
            }
        ]
    }


class SaveErrorTestData:
    trader_details = {
        'email': 'atrader1@gmail.com',
        'password': 'password',
        'how_you_heard_about_us': 'on social media',
        'trading_time_before_joining': '3 - 5 years'
    }
    account_transaction_data = DatasourceInitialInfoData.good_details_with_no_transactions['data']
    error_data = {
        'datasource': 'mt4',
        'function_name': 'TotalHistoryCount',
        'error_code': 9
    }    