from metaapi_cloud_sdk import MetaApi as MainMetaApi
from django.conf import settings
from asgiref.sync import async_to_sync
from typing import List, Tuple, TypedDict, Optional, Union, Literal, Dict
import datetime as dt
from importlib import import_module


class RegisterAccountDetails(TypedDict):
    login: int
    server: str
    password: str
    name: Optional[str]
    platform: str


class AccountData(TypedDict):
    platform: str
    broker: str
    currency: str
    server: str
    balance: int
    equity: int
    margin: int
    freeMargin: int
    leverage: int
    name: str
    login: int
    credit: int
    tradeAllowed: bool
    investorMode: bool
    marginMode: str
    type: str

class RawTradeDealData(TypedDict):
    id: str
    platform: Literal['mt4'] | Literal['mt5']
    type: str
    time: dt.datetime
    brokerTime: str
    commission: float
    swap: float
    profit: float
    symbol: str
    magic: int
    orderId: str
    positionId: str
    reason: str
    entryType: str
    volume: float
    price: float
    stopLoss: float
    takeProfit: float
    accountCurrencyExchangeRate: int

class RawDepositWithdrawalDealData(TypedDict):
    id: int
    platform: Literal['mt4'] | Literal['mt5']
    type: str
    time: dt.datetime
    brokerTime: str
    commission: float
    swap: float
    profit: float
    comment: str
    accountCurrencyExchangeRate: int


class MetaApi:
    def __init__(self):
        mtapi_module_name = getattr(settings, 'META_API_CLASS_MODULE', 'trader.metaapi.main')
        mtapi_module = import_module(mtapi_module_name)
        self._api: MainMetaApi = getattr(mtapi_module, 'MainMetaApi')(settings.METAAPI_TOKEN)

    def create_account(self, account_details: RegisterAccountDetails) -> str:
        try:
            account = async_to_sync(self._api.metatrader_account_api.create_account)(account={
                'login': account_details['login'],
                'type': 'cloud',
                'password': account_details['password'],
                'server': 'TradersGlobalGroup-Demo',
                'application': 'MetaApi',
                'name': account_details.get('name', ''),
                'magic': 000000,
                'platform': account_details['platform']
            })
            return account.id
        except Exception as e:
            if hasattr(e, 'details'):
                if e.details == 'E_SRV_NOT_FOUND':
                    raise BrokerNotSupportedError
                elif e.details == 'E_AUTH':
                    raise UserAuthenticationError
                elif e.details == 'E_SERVER_TIMEZONE':
                    raise CurrentlyUnavailableError
                else:
                    raise UnknownError
            else:
                raise UnknownError
        
    def get_all_data(self, ma_account_id: str) -> Tuple[
        AccountData, List[Union[RawTradeDealData, RawDepositWithdrawalDealData]]
    ]:
        account_info, all_deals = async_to_sync(self._get_all_data)(ma_account_id)
        trade_data, deposit_data, withdrawal_data, unrecognized_deals = Transaction.from_raw_data(all_deals)
        return account_info, trade_data, deposit_data, withdrawal_data, unrecognized_deals

    async def _get_all_data(self, ma_account_id: str) -> Tuple[
        AccountData, List[Union[RawTradeDealData, RawDepositWithdrawalDealData]]
    ]:
        account = await self._api.metatrader_account_api.get_account(account_id=ma_account_id)
        connection = await account.get_rpc_connection()
        account_info = await connection.get_account_information()
        start = dt.datetime.now() - dt.timedelta(days=365*1000)
        end = dt.datetime.now()
        all_deals = await connection.get_deals_by_time_range(start, end)
        return account_info, all_deals


class TradeData:
    def __init__(self, open_deal, close_deal):
        self.id = open_deal['id']
        self.platform = open_deal['platform']
        self.open_time = open_deal['time']
        self.broker_open_time = open_deal['brokerTime']
        self.close_time = close_deal['time']
        self.broker_close_time = close_deal['brokerTime']
        self.profit = close_deal['profit']
        self.symbol = close_deal['symbol']
        self.magic = close_deal['magic']
        self.order_id = close_deal['orderId']
        self.position_id = close_deal['positionId']
        self.reason = close_deal['reason']
        self.entry_type = close_deal['entryType']
        self.volume = close_deal['volume']
        self.open_price = open_deal['price']
        self.close_price = close_deal['price']
        self.stop_loss = close_deal['stopLoss']
        self.take_profit = close_deal['takeProfit']
        self.account_currency_exchange_rate = close_deal['accountCurrencyExchangeRate']
        self.action = (
            'buy' if close_deal['type'] == 'DEAL_TYPE_BUY' else 
            ('sell' if close_deal['type'] == 'DEAL_TYPE_SELL' else f'unknown-{close_deal["type"]}')
        )
        self.swap = close_deal['swap']
        self.commission = close_deal['commission']


class Transaction:
    @staticmethod
    def from_raw_data(all_deals: List[Union[RawDepositWithdrawalDealData, RawTradeDealData]]):
        deals = all_deals.copy()
        trades: List[TradeData] = []
        deposits = []
        withdrawals = []
        unpaired_deals: Dict[str | int, RawTradeDealData | RawDepositWithdrawalDealData] = {}
        for i in range(len(deals)):
            raw_deal = deals[i]
            if raw_deal['type'] == 'DEAL_TYPE_BALANCE':
                if raw_deal['profit'] > 0:
                    deposits.append(raw_deal)
                    deals[i] = None
                else:
                    withdrawals.append(raw_deal)
                    deals[i] = None
            else:
                if raw_deal['id'] in unpaired_deals and raw_deal['entryType'] == 'DEAL_ENTRY_IN':
                    trade_data = TradeData(unpaired_deals[raw_deal['id']], raw_deal)
                    trades.append(trade_data)
                    del unpaired_deals[raw_deal['id']]
                else:
                    if raw_deal['entryType'] == 'DEAL_ENTRY_OUT':
                        unpaired_deals[raw_deal['id']] = raw_deal
                deals[i] = None
        unrecognized_deals = [deal for deal in deals if deal is not None]
        unrecognized_deals += [unpaired_deal for unpaired_deal in unpaired_deals.values()]
        return trades, deposits, withdrawals, unrecognized_deals


class BrokerNotSupportedError(Exception):
    detail = 'broker not supported'


class UserAuthenticationError(Exception):
    detail = 'wrong user details'


class CurrentlyUnavailableError(Exception):
    detail = 'currently unavailable'


class UnknownError(Exception):
    detail = 'unknown error'

    def __init__(self, detail=detail):
        self.detail = detail