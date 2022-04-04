import datetime as dt
from typing import TypedDict, Optional, Literal

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
    ma_account_id: str

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


class TradeData:
    def __init__(self, open_deal, close_deal):
        self.id = open_deal['positionId']
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
        self.stop_loss = close_deal.get('stopLoss', 0)
        self.take_profit = close_deal.get('takeProfit', 0)
        self.account_currency_exchange_rate = close_deal['accountCurrencyExchangeRate']
        self.action = (
            'buy' if close_deal['type'] == 'DEAL_TYPE_BUY' else 
            ('sell' if close_deal['type'] == 'DEAL_TYPE_SELL' else f'unknown-{close_deal["type"]}')
        )
        self.swap = close_deal['swap']
        self.commission = close_deal['commission']