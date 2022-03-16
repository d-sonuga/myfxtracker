from datetime import timedelta
from typing import TypedDict
from django.utils import timezone
import json


class SignUpDetails:
    '''
    The howYouHeard and yearsSpentTrading fields were added long after the
    initial tests were written. But they don't affect things
    The cases concerning them are not covered or even taken note of
    '''
    other_values = {
        'howYouHeard': 'on social media',
        'yearsSpentTrading': '3 - 5 years'
    }
    good_details = {
        'email': 'sonugademilade8703@gmail.com',
        'password1': 'password',
        'password2': 'password',
        **other_values
    }
    bad_details_only_email = {
        'email': 'sonugademilade8703@gmail.com',
        'howYouHeard': 'On social media',
        'yearsSpentTrading': '3 - 5 years'
    }
    bad_details_only_password1 = {
        'password1': 'password',
        **other_values
    }
    bad_details_only_password2 = {
        'password2': 'password' ,
        **other_values
    }
    bad_details_email_missing = {
        'password1': 'password',
        'password2': 'password',
        **other_values
    }
    bad_details_password2_missing = {
        'email': 'sonugademilade8703@gmail.com',
        'password1': 'password',
        **other_values
    }
    bad_details_password1_missing = {
        'email': 'sonugademilade8703@gmail.com',
        'password2': 'password',
        **other_values
    }
    bad_details_invalid_email = {
        'email': 'email.com',
        'password1': 'password',
        'password2': 'password',
        **other_values
    }
    bad_details_passwords_not_match = {
        'email': 'sonugademilade8703@gmail.com',
        'password1': 'password',
        'password2': 'password2',
        **other_values
    }
    bad_details_password_length = {
        'email': 'sonugademilade8703@gmail.com',
        'password1': 'pass',
        'password2': 'pass',
        **other_values
    }
    good_details_password_change = {
        'email': 'sonugademilade8703@gmail.com',
        'password1': 'newpassword',
        'password2': 'newpassword',
        **other_values
    }
    good_details_password_reset = {
        'email': 'sonugademilade8703@gmail.com',
        'password1': 'resettedpassword',
        'password2': 'resettedpassword',
        **other_values
    }

class LoginDetails:
    good_details = {
        'email': 'sonugademilade8703@gmail.com',
        'password': 'password',
    }
    bad_details_user_email_doesnt_exist = {
        'email': 'noexist@gmail.com',
        'password': 'password',
    }
    bad_details_wrong_password = {
        'email': 'sonugademilade8703@gmail.com',
        'password': 'wrongpassword'
    }
    bad_details_email_not_verified = {
        'email': 'unverified_email@gmail.com',
        'password': 'password'
    }
    bad_detail_email_missing = {
        'password': 'password'
    }
    bad_details_password_missing = {
        'email': 'sonugademilade8703@gmail.com'
    }
    bad_details_no_email_or_password = {}


class NoteData:
    existent_note = {
        'title': 'An Existent Note',
        'content': json.dumps([{'type': 'p', 'children': [{'text': 'An existent note'}]}]),
        'lastEdited': timezone.now().isoformat()
    }
    existent_note_to_delete = {
        'title': 'An Existent Note To Delete',
        'content': json.dumps([{'type': 'p', 'children': [{'text': 'An existent note'}]}]),
        'lastEdited': timezone.now().isoformat()
    }
    updated_existent_note = {
        'title': 'The title',
        'content': json.dumps([{'type': 'p', 'children': [{'text': 'An updated existent note'}]}]),
        'lastEdited': (timezone.now() - timedelta(days=1)).isoformat()
    }
    unsaved_note = {
        'title': 'Unsaved Note',
        'content': json.dumps([{'type': 'p', 'children': [{'text': 'An unsaved note'}]}, {'type': 'p', 'children': [{'text': 'An unsaved note'}]}]),
        'lastEdited': timezone.now().isoformat()
    }
    some_existent_notes = [
        {
            'title': 'An Existent Note 1',
            'content': json.dumps([{'type': 'p', 'children': [{'text': 'An existent note'}]}]),
            'last_edited': timezone.now().isoformat()
        },
        {
            'title': 'An Existent Note 2',
            'content': json.dumps([{'type': 'p', 'children': [{'text': 'An existent note'}]}]),
            'last_edited': timezone.now().isoformat()
        },
        {
            'title': 'An Existent Note 3',
            'content': json.dumps([{'type': 'p', 'children': [{'text': 'An existent note'}]}]),
            'last_edited': timezone.now().isoformat()
        }
    ]


class InitDataTestData:
    trader_with_no_data = {
        'email': 'withnodata@gmail.com',
        'password': 'password'
    }
    trader_with_data = {
        'email': 'withdata@gmail.com',
        'password': 'password'
    }


class AddTradingAccountTestData:
    good_account_details: dict = {
        'register-details': {
            'login': 129320,
            'password': 'password',
            'server': 'TradersGlobalGroup-Demo',
            'platform': 'mt4'
        },
        'account-info': {
            'platform': 'mt4',
            'broker': 'Traders Global Group Incorporated',
            'currency': 'USD',
            'server': 'TradersGlobalGroup-Demo', 
            'balance': 10823, 
            'equity': 10823,
            'margin': 0, 
            'freeMargin': 10823, 
            'leverage': 100, 
            'name': 'My Forex Funds - Evaluation Phase 1 Demo - Eyitemi Fadayomi', 
            'login': 129320, 
            'credit': 0, 
            'tradeAllowed': True, 
            'investorMode': False, 
            'marginMode': 'ACCOUNT_MARGIN_MODE_RETAIL_HEDGING', 
            'type': 'ACCOUNT_TRADE_MODE_CONTEST',
            'ma_account_id': 'nfmarozf,ewifhmzoieulf,nO48TU8WER9E-UD.Z'
        },
        'deals': [
            {
                "id": "1542994",
                "platform": "mt4", 
                "type": "DEAL_TYPE_BALANCE", 
                "time": "2022-01-14T17:54:34+00:00", 
                "brokerTime": "2022-01-14 19:54:34.000", 
                "commission": 0, 
                "swap": 0, 
                "profit": 10000, 
                "comment": "Initial Deposit", 
                "accountCurrencyExchangeRate": 1
            }, 
            {
                "id": "1590889", 
                "platform": "mt4", 
                "type": "DEAL_TYPE_BUY", 
                "time": "2022-01-17T05:30:14+00:00", 
                "brokerTime": "2022-01-17 07:30:14.000", 
                "commission": 0, 
                "swap": 0, 
                "profit": 0, 
                "symbol": "GBPJPY", 
                "magic": 0, 
                "orderId": "1590889", 
                "positionId": "1590889", 
                "reason": "DEAL_REASON_EXPERT", 
                "entryType": "DEAL_ENTRY_IN", 
                "volume": 0.57, 
                "price": 156.58, 
                "stopLoss": 156.38, 
                "takeProfit": 157.397, 
                "accountCurrencyExchangeRate": 1
            }, 
            {
                "id": "1590889", 
                "platform": "mt4", 
                "type": "DEAL_TYPE_SELL", 
                "time": "2022-01-17T11:30:22+00:00", 
                "brokerTime": "2022-01-17 13:30:22.000", 
                "commission": -1.71, 
                "swap": 0, 
                "profit": -18.93, 
                "symbol": "GBPJPY", 
                "magic": 0, 
                "orderId": "1590889", 
                "positionId": "1590889", 
                "reason": "DEAL_REASON_EXPERT", 
                "entryType": "DEAL_ENTRY_OUT", 
                "volume": 0.57, 
                "price": 156.542, 
                "stopLoss": 156.38, 
                "takeProfit": 157.397, 
                "accountCurrencyExchangeRate": 1
            }, 
            {
                "id": "1645835", 
                "platform": "mt4", 
                "type": "DEAL_TYPE_SELL", 
                "time": "2022-01-17T11:48:00+00:00", 
                "brokerTime": "2022-01-17 13:48:00.000", 
                "commission": 0, 
                "swap": 0, 
                "profit": 0, 
                "symbol": "GBPJPY", 
                "magic": 0, 
                "orderId": "1645835", 
                "positionId": "1645835", 
                "reason": "DEAL_REASON_CLIENT", 
                "entryType": "DEAL_ENTRY_IN", 
                "volume": 0.47, 
                "price": 156.432, 
                "stopLoss": 156.677, 
                "takeProfit": 155.076, 
                "accountCurrencyExchangeRate": 1
            },
            {
                "id": "1645835",
                "platform": "mt4", 
                "type": "DEAL_TYPE_BUY", 
                "time": "2022-01-17T15:37:38+00:00", 
                "brokerTime": "2022-01-17 17:37:38.000", 
                "commission": -1.41, 
                "swap": 0, "profit": 12.31, 
                "symbol": "GBPJPY", 
                "magic": 0, 
                "orderId": "1645835", 
                "positionId": "1645835", 
                "reason": "DEAL_REASON_CLIENT", 
                "entryType": "DEAL_ENTRY_OUT", 
                "volume": 0.47, 
                "price": 156.402, 
                "stopLoss": 156.677, 
                "takeProfit": 155.076, 
                "accountCurrencyExchangeRate": 1
            },
            {
                "id": "1759325",
                "platform": "mt4", 
                "type": "DEAL_TYPE_BUY", 
                "time": "2022-01-18T06:18:27+00:00", 
                "brokerTime": "2022-01-18 08:18:27.000", 
                "commission": 0, 
                "swap": 0, 
                "profit": 0, 
                "symbol": "GBPJPY", 
                "magic": 0, 
                "orderId": "1759325", 
                "positionId": "1759325", 
                "reason": "DEAL_REASON_EXPERT", 
                "entryType": "DEAL_ENTRY_IN", 
                "volume": 0.55, 
                "price": 156.652, 
                "stopLoss": 156.442, 
                "takeProfit": 157.4, 
                "accountCurrencyExchangeRate": 1
            }, 
            {
                "id": "1759325", 
                "platform": "mt4", 
                "type": "DEAL_TYPE_SELL", 
                "time": "2022-01-18T08:44:34+00:00", 
                "brokerTime": "2022-01-18 10:44:34.000", 
                "commission": -1.65, 
                "swap": 0, 
                "profit": -85.81, 
                "symbol": "GBPJPY", 
                "magic": 0, 
                "orderId": "1759325", 
                "positionId": "1759325", 
                "reason": "DEAL_REASON_EXPERT", 
                "entryType": "DEAL_ENTRY_OUT", 
                "volume": 0.55, 
                "price": 156.473, 
                "stopLoss": 156.442, 
                "takeProfit": 157.4, 
                "accountCurrencyExchangeRate": 1
            }
        ]
    }

    bad_details_no_login = {
        'password': 'password',
        'server': 'TradersGlobalGroup-Demo',
        'platform': 'mt4'
    }

    bad_details_empty_login = {
        'login': '',
        'password': 'password',
        'server': 'TradersGlobalGroup-Demo',
        'platform': 'mt4'
    }

    bad_details_invalid_login = {
        'login': 0,
        'password': 'password',
        'server': 'TradersGlobalGroup-Demo',
        'platform': 'mt4'
    }

    bad_details_no_password = {
        'login': 7366273,
        'server': 'TradersGlobalGroup-Demo',
        'platform': 'mt4'
    }

    bad_details_invalid_password = {
        'login': 7366273,
        # I'm guessing that MT passwords can't be lesser than 5
        'password': '1234',
        'server': 'TradersGlobalGroup-Demo',
        'platform': 'mt4'
    }

    bad_details_no_server = {
        'login': 7366273,
        'password': 'password',
        'platform': 'mt4'
    }

    bad_details_empty_server = {
        'login': 7366273,
        'password': 'password',
        'server': '',
        'platform': 'mt4'
    }

    bad_details_no_platform = {
        'login': 7366273,
        'password': 'password',
        'server': 'TradersGlobalGroup-Demo',
    }

    bad_details_empty_platform = {
        'login': 7366273,
        'password': 'password',
        'server': 'TradersGlobalGroup-Demo',
        'platform': ''
    }

    bad_details_invalid_platform = {
        'login': 7366273,
        'password': 'password',
        'server': 'TradersGlobalGroup-Demo',
        'platform': 'h'
    }

class RefreshAccountDataTestData:
    class OneAccountUserData:
        no_of_new_trades = 2
        no_of_new_deposits = 1
        no_of_new_withdrawals = 2
        no_of_new_unknown_transactions = 1
        original_account_info = {
            'platform': 'mt4',
            'broker': 'Traders Global Group Incorporated',
            'currency': 'USD',
            'server': 'TradersGlobalGroup-Demo', 
            'balance': 10823, 
            'equity': 10823,
            'margin': 0, 
            'freeMargin': 10823, 
            'leverage': 100, 
            'name': 'My Forex Funds - Evaluation Phase 1 Demo - Eyitemi Fadayomi', 
            'login': 129320, 
            'credit': 0, 
            'tradeAllowed': True, 
            'investorMode': False, 
            'marginMode': 'ACCOUNT_MARGIN_MODE_RETAIL_HEDGING', 
            'type': 'ACCOUNT_TRADE_MODE_CONTEST',
            'ma_account_id': 'nfmarozf,ewifhmzoieulf,nO48TU8WER9E-UD.Z'
        }
        new_account_info = {
            'platform': 'mt4',
            'broker': 'Traders Global Group Incorporated',
            'currency': 'USD',
            'server': 'TradersGlobalGroup-Demo', 
            'balance': 15823, 
            'equity': 15823,
            'margin': 0, 
            'freeMargin': 10823, 
            'leverage': 100, 
            'name': 'My Forex Funds - Evaluation Phase 1 Demo - Eyitemi Fadayomi', 
            'login': 129320, 
            'credit': 0, 
            'tradeAllowed': True, 
            'investorMode': False, 
            'marginMode': 'ACCOUNT_MARGIN_MODE_RETAIL_HEDGING', 
            'type': 'ACCOUNT_TRADE_MODE_CONTEST',
            'ma_account_id': 'nfmarozf,ewifhmzoieulf,nO48TU8WER9E-UD.Z'
        }
        original_deals = [
            {
                "id": "1542994",
                "platform": "mt4", 
                "type": "DEAL_TYPE_BALANCE", 
                "time": "2022-01-14T17:54:34+00:00", 
                "brokerTime": "2022-01-14 19:54:34.000", 
                "commission": 0, 
                "swap": 0, 
                "profit": 10000, 
                "comment": "Initial Deposit", 
                "accountCurrencyExchangeRate": 1
            }, 
            {
                "id": "1590889", 
                "platform": "mt4", 
                "type": "DEAL_TYPE_BUY", 
                "time": "2022-01-17T05:30:14+00:00", 
                "brokerTime": "2022-01-17 07:30:14.000", 
                "commission": 0, 
                "swap": 0, 
                "profit": 0, 
                "symbol": "GBPJPY", 
                "magic": 0, 
                "orderId": "1590889", 
                "positionId": "1590889", 
                "reason": "DEAL_REASON_EXPERT", 
                "entryType": "DEAL_ENTRY_IN", 
                "volume": 0.57, 
                "price": 156.58, 
                "stopLoss": 156.38, 
                "takeProfit": 157.397, 
                "accountCurrencyExchangeRate": 1
            }, 
            {
                "id": "1590889", 
                "platform": "mt4", 
                "type": "DEAL_TYPE_SELL", 
                "time": "2022-01-17T11:30:22+00:00", 
                "brokerTime": "2022-01-17 13:30:22.000", 
                "commission": -1.71, 
                "swap": 0, 
                "profit": -18.93, 
                "symbol": "GBPJPY", 
                "magic": 0, 
                "orderId": "1590889", 
                "positionId": "1590889", 
                "reason": "DEAL_REASON_EXPERT", 
                "entryType": "DEAL_ENTRY_OUT", 
                "volume": 0.57, 
                "price": 156.542, 
                "stopLoss": 156.38, 
                "takeProfit": 157.397, 
                "accountCurrencyExchangeRate": 1
            }, 
            {
                "id": "1645835", 
                "platform": "mt4", 
                "type": "DEAL_TYPE_SELL", 
                "time": "2022-01-17T11:48:00+00:00", 
                "brokerTime": "2022-01-17 13:48:00.000", 
                "commission": 0, 
                "swap": 0, 
                "profit": 0, 
                "symbol": "GBPJPY", 
                "magic": 0, 
                "orderId": "1645835", 
                "positionId": "1645835", 
                "reason": "DEAL_REASON_CLIENT", 
                "entryType": "DEAL_ENTRY_IN", 
                "volume": 0.47, 
                "price": 156.432, 
                "stopLoss": 156.677, 
                "takeProfit": 155.076, 
                "accountCurrencyExchangeRate": 1
            },
            {
                "id": "1645835",
                "platform": "mt4", 
                "type": "DEAL_TYPE_BUY", 
                "time": "2022-01-17T15:37:38+00:00", 
                "brokerTime": "2022-01-17 17:37:38.000", 
                "commission": -1.41, 
                "swap": 0, "profit": 12.31, 
                "symbol": "GBPJPY", 
                "magic": 0, 
                "orderId": "1645835", 
                "positionId": "1645835", 
                "reason": "DEAL_REASON_CLIENT", 
                "entryType": "DEAL_ENTRY_OUT", 
                "volume": 0.47, 
                "price": 156.402, 
                "stopLoss": 156.677, 
                "takeProfit": 155.076, 
                "accountCurrencyExchangeRate": 1
            },
            {
                "id": "1759325",
                "platform": "mt4", 
                "type": "DEAL_TYPE_BUY", 
                "time": "2022-01-18T06:18:27+00:00", 
                "brokerTime": "2022-01-18 08:18:27.000", 
                "commission": 0, 
                "swap": 0, 
                "profit": 0, 
                "symbol": "GBPJPY", 
                "magic": 0, 
                "orderId": "1759325", 
                "positionId": "1759325", 
                "reason": "DEAL_REASON_EXPERT", 
                "entryType": "DEAL_ENTRY_IN", 
                "volume": 0.55, 
                "price": 156.652, 
                "stopLoss": 156.442, 
                "takeProfit": 157.4, 
                "accountCurrencyExchangeRate": 1
            }, 
            {
                "id": "1759325", 
                "platform": "mt4", 
                "type": "DEAL_TYPE_SELL", 
                "time": "2022-01-18T08:44:34+00:00", 
                "brokerTime": "2022-01-18 10:44:34.000", 
                "commission": -1.65, 
                "swap": 0, 
                "profit": -85.81, 
                "symbol": "GBPJPY", 
                "magic": 0, 
                "orderId": "1759325", 
                "positionId": "1759325", 
                "reason": "DEAL_REASON_EXPERT", 
                "entryType": "DEAL_ENTRY_OUT", 
                "volume": 0.55, 
                "price": 156.473, 
                "stopLoss": 156.442, 
                "takeProfit": 157.4, 
                "accountCurrencyExchangeRate": 1
            }
        ]
        new_deals = [
            {
                "id": "1797524",
                "platform": "mt4",
                "type": "DEAL_TYPE_SELL",
                "time": "2022-01-18T09:00:22+00:00",
                "brokerTime": "2022-01-18 11:00:22.000",
                "commission": 0,
                "swap": 0,
                "profit": 0,
                "symbol": "GBPJPY",
                "magic": 0,
                "orderId": "1797524",
                "positionId": "1797524",
                "reason": "DEAL_REASON_CLIENT",
                "entryType": "DEAL_ENTRY_IN",
                "volume": 0.41,
                "price": 156.501,
                "stopLoss": 156.484,
                "takeProfit": 155.088,
                "accountCurrencyExchangeRate": 1
            },
            {
                "id": "1797524",
                "platform": "mt4",
                "type": "DEAL_TYPE_BUY",
                "time": "2022-01-18T10:55:45+00:00",
                "brokerTime": "2022-01-18 12:55:45.000",
                "commission": -1.23,
                "swap": 0,
                "profit": 112.96,
                "symbol": "GBPJPY",
                "magic": 0,
                "orderId": "1797524",
                "positionId": "1797524",
                "reason": "DEAL_REASON_CLIENT",
                "entryType": "DEAL_ENTRY_OUT",
                "volume": 0.41,
                "price": 156.185,
                "stopLoss": 156.484,
                "takeProfit": 155.088,
                "accountCurrencyExchangeRate": 1
            },
            {
                "id": "1967874",
                "platform": "mt4",
                "type": "DEAL_TYPE_BUY",
                "time": "2022-01-18T23:34:51+00:00",
                "brokerTime": "2022-01-19 01:34:51.000",
                "commission": 0,
                "swap": 0,
                "profit": 0,
                "symbol": "GBPJPY",
                "magic": 0,
                "orderId": "1967874",
                "positionId": "1967874",
                "reason": "DEAL_REASON_CLIENT",
                "entryType": "DEAL_ENTRY_IN",
                "volume": 0.5,
                "price": 155.83,
                "stopLoss": 155.83,
                "takeProfit": 156.06,
                "comment": "[tp] ",
                "brokerComment": "[tp] ",
                "accountCurrencyExchangeRate": 1
            },
            {
                "id": "1967874",
                "platform": "mt4",
                "type": "DEAL_TYPE_SELL",
                "time": "2022-01-19T01:16:19+00:00",
                "brokerTime": "2022-01-19 03:16:19.000",
                "commission": -1.5,
                "swap": 0, 
                "profit": 100.63, 
                "symbol": "GBPJPY", 
                "magic": 0, 
                "orderId": "1967874", 
                "positionId": "1967874", 
                "reason": "DEAL_REASON_CLIENT", 
                "entryType": "DEAL_ENTRY_OUT", 
                "volume": 0.5, 
                "price": 156.061, 
                "stopLoss": 155.83, 
                "takeProfit": 156.06, 
                "comment": "[tp] ", 
                "brokerComment": "[tp] ", 
                "accountCurrencyExchangeRate": 1
            },
            {
                "id": "1511134",
                "platform": "mt4", 
                "type": "DEAL_TYPE_BALANCE", 
                "time": "2022-01-14T17:54:34+00:00", 
                "brokerTime": "2022-01-14 19:54:34.000", 
                "commission": 0, 
                "swap": 0, 
                "profit": 2000, 
                "comment": "Initial Deposit", 
                "accountCurrencyExchangeRate": 1
            },
            {
                "id": "1111194",
                "platform": "mt4", 
                "type": "DEAL_TYPE_BALANCE", 
                "time": "2022-01-14T17:54:34+00:00", 
                "brokerTime": "2022-01-14 19:54:34.000", 
                "commission": 0, 
                "swap": 0, 
                "profit": -750, 
                "comment": "Initial Deposit", 
                "accountCurrencyExchangeRate": 1
            },
            {
                "id": "9999999",
                "platform": "mt4", 
                "type": "DEAL_TYPE_BALANCE", 
                "time": "2022-01-14T17:54:34+00:00", 
                "brokerTime": "2022-01-14 19:54:34.000", 
                "commission": 0, 
                "swap": 0, 
                "profit": -200, 
                "comment": "Initial Deposit", 
                "accountCurrencyExchangeRate": 1
            },
            {
                "id": "9999999",
                "platform": "mt4", 
                # intentionally unknown to test what happens when a deal with an unexpected deal type lands
                "type": "DEAL_TYPE_UNKNOWN-", 
                "time": "2022-01-14T17:54:34+00:00", 
                "brokerTime": "2022-01-14 19:54:34.000", 
                "commission": 0, 
                "swap": 0, 
                "profit": -200, 
                "comment": "Initial Deposit", 
                "accountCurrencyExchangeRate": 1
            }
        ]
    
    class MoreThanOneAccountUserData:
        account1_data  = {
            'no_of_new_trades': 2,
            'no_of_new_deposits': 1,
            'no_of_new_withdrawals': 2,
            'no_of_new_unknown_transactions': 1,
            'original_account_info': {
                'platform': 'mt4',
                'broker': 'Traders Global Group Incorporated',
                'currency': 'USD',
                'server': 'TradersGlobalGroup-Demo', 
                'balance': 10823, 
                'equity': 10823,
                'margin': 0, 
                'freeMargin': 10823, 
                'leverage': 100, 
                'name': 'My Forex Funds - Evaluation Phase 1 Demo - Eyitemi Fadayomi', 
                'login': 222320, 
                'credit': 0, 
                'tradeAllowed': True, 
                'investorMode': False, 
                'marginMode': 'ACCOUNT_MARGIN_MODE_RETAIL_HEDGING', 
                'type': 'ACCOUNT_TRADE_MODE_CONTEST',
                'ma_account_id': 'nfrozf,ewifhmzoieulf,nO48TU8WER9E-UD.Z'
            },
            'new_account_info': {
                'platform': 'mt4',
                'broker': 'Traders Global Group Incorporated',
                'currency': 'USD',
                'server': 'TradersGlobalGroup-Demo', 
                'balance': 15823, 
                'equity': 15823,
                'margin': 0, 
                'freeMargin': 10823, 
                'leverage': 100, 
                'name': 'My Forex Funds - Evaluation Phase 1 Demo - Eyitemi Fadayomi', 
                'login': 222320, 
                'credit': 0, 
                'tradeAllowed': True, 
                'investorMode': False, 
                'marginMode': 'ACCOUNT_MARGIN_MODE_RETAIL_HEDGING', 
                'type': 'ACCOUNT_TRADE_MODE_CONTEST',
                'ma_account_id': 'nfrozf,ewifhmzoieulf,nO48TU8WER9E-UD.Z'
            },
            'original_deals': [
                {
                    "id": "1542994",
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_BALANCE", 
                    "time": "2022-01-14T17:54:34+00:00", 
                    "brokerTime": "2022-01-14 19:54:34.000", 
                    "commission": 0, 
                    "swap": 0, 
                    "profit": 10000, 
                    "comment": "Initial Deposit", 
                    "accountCurrencyExchangeRate": 1
                }, 
                {
                    "id": "1590889", 
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_BUY", 
                    "time": "2022-01-17T05:30:14+00:00", 
                    "brokerTime": "2022-01-17 07:30:14.000", 
                    "commission": 0, 
                    "swap": 0, 
                    "profit": 0, 
                    "symbol": "GBPJPY", 
                    "magic": 0, 
                    "orderId": "1590889", 
                    "positionId": "1590889", 
                    "reason": "DEAL_REASON_EXPERT", 
                    "entryType": "DEAL_ENTRY_IN", 
                    "volume": 0.57, 
                    "price": 156.58, 
                    "stopLoss": 156.38, 
                    "takeProfit": 157.397, 
                    "accountCurrencyExchangeRate": 1
                }, 
                {
                    "id": "1590889", 
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_SELL", 
                    "time": "2022-01-17T11:30:22+00:00", 
                    "brokerTime": "2022-01-17 13:30:22.000", 
                    "commission": -1.71, 
                    "swap": 0, 
                    "profit": -18.93, 
                    "symbol": "GBPJPY", 
                    "magic": 0, 
                    "orderId": "1590889", 
                    "positionId": "1590889", 
                    "reason": "DEAL_REASON_EXPERT", 
                    "entryType": "DEAL_ENTRY_OUT", 
                    "volume": 0.57, 
                    "price": 156.542, 
                    "stopLoss": 156.38, 
                    "takeProfit": 157.397, 
                    "accountCurrencyExchangeRate": 1
                }, 
                {
                    "id": "1645835", 
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_SELL", 
                    "time": "2022-01-17T11:48:00+00:00", 
                    "brokerTime": "2022-01-17 13:48:00.000", 
                    "commission": 0, 
                    "swap": 0, 
                    "profit": 0, 
                    "symbol": "GBPJPY", 
                    "magic": 0, 
                    "orderId": "1645835", 
                    "positionId": "1645835", 
                    "reason": "DEAL_REASON_CLIENT", 
                    "entryType": "DEAL_ENTRY_IN", 
                    "volume": 0.47, 
                    "price": 156.432, 
                    "stopLoss": 156.677, 
                    "takeProfit": 155.076, 
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "1645835",
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_BUY", 
                    "time": "2022-01-17T15:37:38+00:00", 
                    "brokerTime": "2022-01-17 17:37:38.000", 
                    "commission": -1.41, 
                    "swap": 0, "profit": 12.31, 
                    "symbol": "GBPJPY", 
                    "magic": 0, 
                    "orderId": "1645835", 
                    "positionId": "1645835", 
                    "reason": "DEAL_REASON_CLIENT", 
                    "entryType": "DEAL_ENTRY_OUT", 
                    "volume": 0.47, 
                    "price": 156.402, 
                    "stopLoss": 156.677, 
                    "takeProfit": 155.076, 
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "1759325",
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_BUY", 
                    "time": "2022-01-18T06:18:27+00:00", 
                    "brokerTime": "2022-01-18 08:18:27.000", 
                    "commission": 0, 
                    "swap": 0, 
                    "profit": 0, 
                    "symbol": "GBPJPY", 
                    "magic": 0, 
                    "orderId": "1759325", 
                    "positionId": "1759325", 
                    "reason": "DEAL_REASON_EXPERT", 
                    "entryType": "DEAL_ENTRY_IN", 
                    "volume": 0.55, 
                    "price": 156.652, 
                    "stopLoss": 156.442, 
                    "takeProfit": 157.4, 
                    "accountCurrencyExchangeRate": 1
                }, 
                {
                    "id": "1759325", 
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_SELL", 
                    "time": "2022-01-18T08:44:34+00:00", 
                    "brokerTime": "2022-01-18 10:44:34.000", 
                    "commission": -1.65, 
                    "swap": 0, 
                    "profit": -85.81, 
                    "symbol": "GBPJPY", 
                    "magic": 0, 
                    "orderId": "1759325", 
                    "positionId": "1759325", 
                    "reason": "DEAL_REASON_EXPERT", 
                    "entryType": "DEAL_ENTRY_OUT", 
                    "volume": 0.55, 
                    "price": 156.473, 
                    "stopLoss": 156.442, 
                    "takeProfit": 157.4, 
                    "accountCurrencyExchangeRate": 1
                }
            ],
            'new_deals': [
                {
                    "id": "1797524",
                    "platform": "mt4",
                    "type": "DEAL_TYPE_SELL",
                    "time": "2022-01-18T09:00:22+00:00",
                    "brokerTime": "2022-01-18 11:00:22.000",
                    "commission": 0,
                    "swap": 0,
                    "profit": 0,
                    "symbol": "GBPJPY",
                    "magic": 0,
                    "orderId": "1797524",
                    "positionId": "1797524",
                    "reason": "DEAL_REASON_CLIENT",
                    "entryType": "DEAL_ENTRY_IN",
                    "volume": 0.41,
                    "price": 156.501,
                    "stopLoss": 156.484,
                    "takeProfit": 155.088,
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "1797524",
                    "platform": "mt4",
                    "type": "DEAL_TYPE_BUY",
                    "time": "2022-01-18T10:55:45+00:00",
                    "brokerTime": "2022-01-18 12:55:45.000",
                    "commission": -1.23,
                    "swap": 0,
                    "profit": 112.96,
                    "symbol": "GBPJPY",
                    "magic": 0,
                    "orderId": "1797524",
                    "positionId": "1797524",
                    "reason": "DEAL_REASON_CLIENT",
                    "entryType": "DEAL_ENTRY_OUT",
                    "volume": 0.41,
                    "price": 156.185,
                    "stopLoss": 156.484,
                    "takeProfit": 155.088,
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "1967874",
                    "platform": "mt4",
                    "type": "DEAL_TYPE_BUY",
                    "time": "2022-01-18T23:34:51+00:00",
                    "brokerTime": "2022-01-19 01:34:51.000",
                    "commission": 0,
                    "swap": 0,
                    "profit": 0,
                    "symbol": "GBPJPY",
                    "magic": 0,
                    "orderId": "1967874",
                    "positionId": "1967874",
                    "reason": "DEAL_REASON_CLIENT",
                    "entryType": "DEAL_ENTRY_IN",
                    "volume": 0.5,
                    "price": 155.83,
                    "stopLoss": 155.83,
                    "takeProfit": 156.06,
                    "comment": "[tp] ",
                    "brokerComment": "[tp] ",
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "1967874",
                    "platform": "mt4",
                    "type": "DEAL_TYPE_SELL",
                    "time": "2022-01-19T01:16:19+00:00",
                    "brokerTime": "2022-01-19 03:16:19.000",
                    "commission": -1.5,
                    "swap": 0, 
                    "profit": 100.63, 
                    "symbol": "GBPJPY", 
                    "magic": 0, 
                    "orderId": "1967874", 
                    "positionId": "1967874", 
                    "reason": "DEAL_REASON_CLIENT", 
                    "entryType": "DEAL_ENTRY_OUT", 
                    "volume": 0.5, 
                    "price": 156.061, 
                    "stopLoss": 155.83, 
                    "takeProfit": 156.06, 
                    "comment": "[tp] ", 
                    "brokerComment": "[tp] ", 
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "120011134",
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_BALANCE", 
                    "time": "2022-01-14T17:54:34+00:00", 
                    "brokerTime": "2022-01-14 19:54:34.000", 
                    "commission": 0, 
                    "swap": 0, 
                    "profit": 2000, 
                    "comment": "Initial Deposit", 
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "1001194",
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_BALANCE", 
                    "time": "2022-01-14T17:54:34+00:00", 
                    "brokerTime": "2022-01-14 19:54:34.000", 
                    "commission": 0, 
                    "swap": 0, 
                    "profit": -750, 
                    "comment": "Initial Deposit", 
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "9999888429",
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_BALANCE", 
                    "time": "2022-01-14T17:54:34+00:00", 
                    "brokerTime": "2022-01-14 19:54:34.000", 
                    "commission": 0, 
                    "swap": 0, 
                    "profit": -200, 
                    "comment": "Initial Deposit", 
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "9989999",
                    "platform": "mt4", 
                    # intentionally unknown to test what happens when a deal with an unexpected deal type lands
                    "type": "DEAL_TYPE_UNKNOWN-", 
                    "time": "2022-01-14T17:54:34+00:00", 
                    "brokerTime": "2022-01-14 19:54:34.000", 
                    "commission": 0, 
                    "swap": 0, 
                    "profit": -200, 
                    "comment": "Initial Deposit", 
                    "accountCurrencyExchangeRate": 1
                }
            ]
        }
        account2_data  = {
            'no_of_new_trades': 2,
            'no_of_new_deposits': 1,
            'no_of_new_withdrawals': 2,
            'no_of_new_unknown_transactions': 1,
            'original_account_info': {
                'platform': 'mt4',
                'broker': 'Traders Global Group Incorporated',
                'currency': 'USD',
                'server': 'TradersGlobalGroup-Demo', 
                'balance': 10823, 
                'equity': 10823,
                'margin': 0, 
                'freeMargin': 10823, 
                'leverage': 100, 
                'name': 'My Forex Funds - Evaluation Phase 1 Demo - Eyitemi Fadayomi', 
                'login': 33433320, 
                'credit': 0, 
                'tradeAllowed': True, 
                'investorMode': False, 
                'marginMode': 'ACCOUNT_MARGIN_MODE_RETAIL_HEDGING', 
                'type': 'ACCOUNT_TRADE_MODE_CONTEST',
                'ma_account_id': 'nfmarozf,ewifhmzoieulf,nO48TU8WER9E-UD.Z'
            },
            'new_account_info': {
                'platform': 'mt4',
                'broker': 'Traders Global Group Incorporated',
                'currency': 'USD',
                'server': 'TradersGlobalGroup-Demo', 
                'balance': 15823, 
                'equity': 15823,
                'margin': 0, 
                'freeMargin': 10823, 
                'leverage': 100, 
                'name': 'My Forex Funds - Evaluation Phase 1 Demo - Eyitemi Fadayomi', 
                'login': 33433320, 
                'credit': 0, 
                'tradeAllowed': True, 
                'investorMode': False, 
                'marginMode': 'ACCOUNT_MARGIN_MODE_RETAIL_HEDGING', 
                'type': 'ACCOUNT_TRADE_MODE_CONTEST',
                'ma_account_id': 'nfmarozf,ewifhmzoieulf,nO48TU8WER9E-UD.Z'
            },
            'original_deals': [
                {
                    "id": "1500994",
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_BALANCE", 
                    "time": "2022-01-14T17:54:34+00:00", 
                    "brokerTime": "2022-01-14 19:54:34.000", 
                    "commission": 0, 
                    "swap": 0, 
                    "profit": 10000, 
                    "comment": "Initial Deposit", 
                    "accountCurrencyExchangeRate": 1
                }, 
                {
                    "id": "10090889", 
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_BUY", 
                    "time": "2022-01-17T05:30:14+00:00", 
                    "brokerTime": "2022-01-17 07:30:14.000", 
                    "commission": 0, 
                    "swap": 0, 
                    "profit": 0, 
                    "symbol": "GBPJPY", 
                    "magic": 0, 
                    "orderId": "159000889", 
                    "positionId": "159000889", 
                    "reason": "DEAL_REASON_EXPERT", 
                    "entryType": "DEAL_ENTRY_IN", 
                    "volume": 0.57, 
                    "price": 156.58, 
                    "stopLoss": 156.38, 
                    "takeProfit": 157.397, 
                    "accountCurrencyExchangeRate": 1
                }, 
                {
                    "id": "10090889", 
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_SELL", 
                    "time": "2022-01-17T11:30:22+00:00", 
                    "brokerTime": "2022-01-17 13:30:22.000", 
                    "commission": -1.71, 
                    "swap": 0, 
                    "profit": -18.93, 
                    "symbol": "GBPJPY", 
                    "magic": 0, 
                    "orderId": "1599990889", 
                    "positionId": "1599990889", 
                    "reason": "DEAL_REASON_EXPERT", 
                    "entryType": "DEAL_ENTRY_OUT", 
                    "volume": 0.57, 
                    "price": 156.542, 
                    "stopLoss": 156.38, 
                    "takeProfit": 157.397, 
                    "accountCurrencyExchangeRate": 1
                }, 
                {
                    "id": "16458352323", 
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_SELL", 
                    "time": "2022-01-17T11:48:00+00:00", 
                    "brokerTime": "2022-01-17 13:48:00.000", 
                    "commission": 0, 
                    "swap": 0, 
                    "profit": 0, 
                    "symbol": "GBPJPY", 
                    "magic": 0, 
                    "orderId": "164583775", 
                    "positionId": "164583775", 
                    "reason": "DEAL_REASON_CLIENT", 
                    "entryType": "DEAL_ENTRY_IN", 
                    "volume": 0.47, 
                    "price": 156.432, 
                    "stopLoss": 156.677, 
                    "takeProfit": 155.076, 
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "16458352323",
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_BUY", 
                    "time": "2022-01-17T15:37:38+00:00", 
                    "brokerTime": "2022-01-17 17:37:38.000", 
                    "commission": -1.41, 
                    "swap": 0, "profit": 12.31, 
                    "symbol": "GBPJPY", 
                    "magic": 0, 
                    "orderId": "163345835", 
                    "positionId": "163345835", 
                    "reason": "DEAL_REASON_CLIENT", 
                    "entryType": "DEAL_ENTRY_OUT", 
                    "volume": 0.47, 
                    "price": 156.402, 
                    "stopLoss": 156.677, 
                    "takeProfit": 155.076, 
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "1750325",
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_BUY", 
                    "time": "2022-01-18T06:18:27+00:00", 
                    "brokerTime": "2022-01-18 08:18:27.000", 
                    "commission": 0, 
                    "swap": 0, 
                    "profit": 0, 
                    "symbol": "GBPJPY", 
                    "magic": 0, 
                    "orderId": "1755559325", 
                    "positionId": "1755559325", 
                    "reason": "DEAL_REASON_EXPERT", 
                    "entryType": "DEAL_ENTRY_IN", 
                    "volume": 0.55, 
                    "price": 156.652, 
                    "stopLoss": 156.442, 
                    "takeProfit": 157.4, 
                    "accountCurrencyExchangeRate": 1
                }, 
                {
                    "id": "1750325", 
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_SELL", 
                    "time": "2022-01-18T08:44:34+00:00", 
                    "brokerTime": "2022-01-18 10:44:34.000", 
                    "commission": -1.65, 
                    "swap": 0, 
                    "profit": -85.81, 
                    "symbol": "GBPJPY", 
                    "magic": 0, 
                    "orderId": "17593205", 
                    "positionId": "17593205", 
                    "reason": "DEAL_REASON_EXPERT", 
                    "entryType": "DEAL_ENTRY_OUT", 
                    "volume": 0.55, 
                    "price": 156.473, 
                    "stopLoss": 156.442, 
                    "takeProfit": 157.4, 
                    "accountCurrencyExchangeRate": 1
                }
            ],
            'new_deals': [
                {
                    "id": "17457524",
                    "platform": "mt4",
                    "type": "DEAL_TYPE_SELL",
                    "time": "2022-01-18T09:00:22+00:00",
                    "brokerTime": "2022-01-18 11:00:22.000",
                    "commission": 0,
                    "swap": 0,
                    "profit": 0,
                    "symbol": "GBPJPY",
                    "magic": 0,
                    "orderId": "1793752",
                    "positionId": "1793752",
                    "reason": "DEAL_REASON_CLIENT",
                    "entryType": "DEAL_ENTRY_IN",
                    "volume": 0.41,
                    "price": 156.501,
                    "stopLoss": 156.484,
                    "takeProfit": 155.088,
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "17457524",
                    "platform": "mt4",
                    "type": "DEAL_TYPE_BUY",
                    "time": "2022-01-18T10:55:45+00:00",
                    "brokerTime": "2022-01-18 12:55:45.000",
                    "commission": -1.23,
                    "swap": 0,
                    "profit": 112.96,
                    "symbol": "GBPJPY",
                    "magic": 0,
                    "orderId": "179724",
                    "positionId": "179724",
                    "reason": "DEAL_REASON_CLIENT",
                    "entryType": "DEAL_ENTRY_OUT",
                    "volume": 0.41,
                    "price": 156.185,
                    "stopLoss": 156.484,
                    "takeProfit": 155.088,
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "1967874444",
                    "platform": "mt4",
                    "type": "DEAL_TYPE_BUY",
                    "time": "2022-01-18T23:34:51+00:00",
                    "brokerTime": "2022-01-19 01:34:51.000",
                    "commission": 0,
                    "swap": 0,
                    "profit": 0,
                    "symbol": "GBPJPY",
                    "magic": 0,
                    "orderId": "967874",
                    "positionId": "967874",
                    "reason": "DEAL_REASON_CLIENT",
                    "entryType": "DEAL_ENTRY_IN",
                    "volume": 0.5,
                    "price": 155.83,
                    "stopLoss": 155.83,
                    "takeProfit": 156.06,
                    "comment": "[tp] ",
                    "brokerComment": "[tp] ",
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "1967874444",
                    "platform": "mt4",
                    "type": "DEAL_TYPE_SELL",
                    "time": "2022-01-19T01:16:19+00:00",
                    "brokerTime": "2022-01-19 03:16:19.000",
                    "commission": -1.5,
                    "swap": 0, 
                    "profit": 100.63, 
                    "symbol": "GBPJPY", 
                    "magic": 0, 
                    "orderId": "197874", 
                    "positionId": "167874", 
                    "reason": "DEAL_REASON_CLIENT", 
                    "entryType": "DEAL_ENTRY_OUT", 
                    "volume": 0.5, 
                    "price": 156.061, 
                    "stopLoss": 155.83, 
                    "takeProfit": 156.06, 
                    "comment": "[tp] ", 
                    "brokerComment": "[tp] ", 
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "1555134",
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_BALANCE", 
                    "time": "2022-01-14T17:54:34+00:00", 
                    "brokerTime": "2022-01-14 19:54:34.000", 
                    "commission": 0, 
                    "swap": 0, 
                    "profit": 2000, 
                    "comment": "Initial Deposit", 
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "1155194",
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_BALANCE", 
                    "time": "2022-01-14T17:54:34+00:00", 
                    "brokerTime": "2022-01-14 19:54:34.000", 
                    "commission": 0, 
                    "swap": 0, 
                    "profit": -750, 
                    "comment": "Initial Deposit", 
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "99222299",
                    "platform": "mt4", 
                    "type": "DEAL_TYPE_BALANCE", 
                    "time": "2022-01-14T17:54:34+00:00", 
                    "brokerTime": "2022-01-14 19:54:34.000", 
                    "commission": 0, 
                    "swap": 0, 
                    "profit": -200, 
                    "comment": "Initial Deposit", 
                    "accountCurrencyExchangeRate": 1
                },
                {
                    "id": "9222212299",
                    "platform": "mt4", 
                    # intentionally unknown to test what happens when a deal with an unexpected deal type lands
                    "type": "DEAL_TYPE_UNKNOWN-", 
                    "time": "2022-01-14T17:54:34+00:00", 
                    "brokerTime": "2022-01-14 19:54:34.000", 
                    "commission": 0, 
                    "swap": 0, 
                    "profit": -200, 
                    "comment": "Initial Deposit", 
                    "accountCurrencyExchangeRate": 1
                }
            ]
        }
        

class AddTradingAccountRegisterDetails(TypedDict):
    login: int
    password: str
    server: str
    platform: str