from datetime import timedelta
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
            'type': 'ACCOUNT_TRADE_MODE_CONTEST'
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