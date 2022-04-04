from metaapi_cloud_sdk import MetaApi as MainMetaApi
from django.conf import settings
from django.db import models
from asgiref.sync import async_to_sync
from typing import List, Tuple, TypedDict, Optional, Union, Literal, Dict
import datetime as dt
from copy import deepcopy
from importlib import import_module
import time
from trader.models import Account
from users.models import Trader
from trader.metaapi_types import (
    RegisterAccountDetails, TradeData,
    RawTradeDealData, RawDepositWithdrawalDealData, AccountData
)


class MetaApi:
    def __init__(self):
        mtapi_module_name = getattr(settings, 'META_API_CLASS_MODULE', 'trader.metaapi.main')
        mtapi_module = import_module(mtapi_module_name)
        self._api: MainMetaApi = getattr(mtapi_module, 'MainMetaApi')(settings.METAAPI_TOKEN)
        self.NO_OF_MAX_RETRIES = 3
        self.SECS_TO_SLEEP_BEFORE_RETRY = 3

    def create_account(self, account_details: RegisterAccountDetails) -> Tuple[str, str]:
        try:
            account = async_to_sync(self._api.metatrader_account_api.create_account)(account={
                'login': account_details['login'],
                'type': 'cloud',
                'password': account_details['password'],
                'server': account_details['server'],
                'application': 'MetaApi',
                # Have to do this because MA keeps the name up to the first space
                'name': account_details['name'],
                'magic': 000000,
                'platform': account_details['platform']
            })
            return account.id, account_details['name'].strip()
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
        
    def get_all_data(
        self,
        ma_account_id: str,
        account_name: str,
        no_of_retries: int = 0
    ) -> Tuple[
        AccountData,
        TradeData,
        RawDepositWithdrawalDealData,
        RawDepositWithdrawalDealData,
        RawDepositWithdrawalDealData | RawTradeDealData
    ]:
        try:
            account_info, all_deals = async_to_sync(self._get_all_data)(ma_account_id)
        except Exception as e:
            if no_of_retries < self.NO_OF_MAX_RETRIES:
                time.sleep(self.SECS_TO_SLEEP_BEFORE_RETRY + (no_of_retries * 2))
                return self.get_all_data(ma_account_id, no_of_retries + 1)
            raise UnknownError
        trade_data, deposit_data, withdrawal_data, unrecognized_deals = Transaction.from_raw_data(all_deals)
        return (
            {**account_info, 'ma_account_id': ma_account_id, 'name': account_name},
            trade_data,
            deposit_data,
            withdrawal_data,
            unrecognized_deals
        )
    
    def get_all_unsaved_data(
        self,
        trader: Trader
    ) -> List[
        Tuple[
            Account,
            Tuple[
                AccountData,
                TradeData,
                RawDepositWithdrawalDealData,
                RawDepositWithdrawalDealData,
                RawDepositWithdrawalDealData | RawTradeDealData
            ]
        ]
    ]:
        try:
            unsaved_account_data = []
            for account in trader.get_all_accounts():
                latest_saved_trade_close_time = (account.trade_set
                    .aggregate(models.Max('close_time'))['close_time__max'])
                account_info, unsaved_deals = async_to_sync(self._get_all_unsaved_data)(
                    account.ma_account_id, latest_saved_trade_close_time
                )
                (trade_data, deposit_data, withdrawal_data, 
                    unrecognized_deals) = Transaction.from_raw_data(unsaved_deals)
                unsaved_account_data.append((account, (
                    account_info,
                    trade_data,
                    deposit_data,
                    withdrawal_data,
                    unrecognized_deals
                )))
            return unsaved_account_data
        except Exception:
            raise UnknownError
    
    def remove_account(self, ma_account_id: Account):
        try:
            async_to_sync(self._remove_account)(ma_account_id)
        except Exception:
            raise UnknownError

    async def _get_all_data(self, ma_account_id: str, start_time: dt.datetime = None) -> Tuple[
        AccountData, List[Union[RawTradeDealData, RawDepositWithdrawalDealData]]
    ]:
        account = await self._api.metatrader_account_api.get_account(account_id=ma_account_id)
        connection = account.get_rpc_connection()
        account_info = await connection.get_account_information()
        start = dt.datetime.now() - dt.timedelta(days=365*1000) if start_time is None else start_time
        end = dt.datetime.now()
        all_deals = await connection.get_deals_by_time_range(start, end)
        return account_info, all_deals


    async def _get_all_unsaved_data(self, ma_account_id: str, latest_saved_trade_close_time: dt.datetime):
        return await self._get_all_data(ma_account_id, latest_saved_trade_close_time)

    async def _remove_account(self, ma_account_id: str):
        account = await self._api.metatrader_account_api.get_account(account_id=ma_account_id)
        await account.remove()


class Transaction:
    @staticmethod
    def from_raw_data(all_deals: List[Union[RawDepositWithdrawalDealData, RawTradeDealData]]):
        deals = deepcopy(all_deals['deals'])
        trades: List[TradeData] = []
        deposits = []
        withdrawals = []
        unpaired_deals: Dict[str | int, RawTradeDealData | RawDepositWithdrawalDealData] = {}
        for i in range(len(deals)):

            raw_deal = deals[i]
            if raw_deal.get('type') == 'DEAL_TYPE_BALANCE':
                if raw_deal.get('profit') > 0:
                    deposits.append(raw_deal)
                    deals[i] = None
                else:
                    withdrawals.append(raw_deal)
                    deals[i] = None
            else:
                if raw_deal.get('positionId') in unpaired_deals and raw_deal.get('entryType') == 'DEAL_ENTRY_OUT':
                    try:
                        trade_data = TradeData(unpaired_deals[raw_deal['positionId']], raw_deal)
                        trades.append(trade_data)
                        del unpaired_deals[raw_deal['positionId']]
                        deals[i] = None
                    except KeyError:
                        from django.core.mail import mail_admins
                        import json
                        mail_admins(
                            'Weird Trade Data',
                            json.dumps({
                                'open_deal': unpaired_deals[raw_deal['positionId']],
                                'close_deal': raw_deal
                            })
                        )
                else:
                    if raw_deal.get('entryType') == 'DEAL_ENTRY_IN':
                        unpaired_deals[raw_deal['positionId']] = raw_deal
                        deals[i] = None
        unrecognized_deals = [deal for deal in deals if deal is not None]
        unrecognized_deals += [unpaired_deal for unpaired_deal in unpaired_deals.values()]
        return trades, deposits, withdrawals, unrecognized_deals


class BrokerNotSupportedError(Exception):
    detail = 'Your broker is not supported'


class UserAuthenticationError(Exception):
    detail = 'User details are invalid'


class CurrentlyUnavailableError(Exception):
    detail = 'Account addition is currently unavailable'


class UnknownError(Exception):
    detail = 'Sorry. An unknown error occured.'

    def __init__(self, detail=detail):
        self.detail = detail