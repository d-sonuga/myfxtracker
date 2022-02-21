# Datasource

# Preliminaries
Required
--------
*   Whenever a trader makes a new trade, the details of the trade ought 
    to be sent to the backend

Data that can be gotten from metatrader EA
------------------------------------------
For all trades in trader's history

*   trade pair
*   order open price
*   order close price
*   order profit
*   order open time
*   order close time
*   order ticket number
*   trade action (buy/sell)
*   order stop loss
*   order swap
*   order commission
*   order take profit
*   order comment
*   order magic number

*   account currency
*   name of broker
*   name of trade server
*   account balance
*   account credit value
*   account profit
*   account equity
*   account margin
*   account free margin
*   account leverage
*   account stopout level format (percentage or currency)
*   account type (demo, competition or real)

# Operation
Expectations
------------
For the flow to work, the following must have been done

*   Trader must have added the myfxtracker.com domain to the
    list of allowed domains in a metatrader setting
*   Trader must have a datasource_username stored on the backend for
    identification
*   The EA must have access to that identification, through some
    sort of input mechanism, so it can include it in the requests
    to the backend
*   On the backend, there must be an entry where the user's last stored
    trade on the backend can be retrieved, and the date the trade was
    taken can be gotten. If no trade is stored, then a good intializer
    like Jan 1, 1700 should be used

// When request encounters an error, it returns -1

Interaction And Flow With Backend
---------------------------------
Requirements: All trades the user takes must be immediately synced with the server
using the barest minimum amount of requests to do it
### Flow
A transaction - a trade, deposit or withdrawal
#### On Initial Launch
1.  Once the EA is launched by the user, a request is made to the backend, along with the
    datasource username and the account company, name, and login number, to get the number
    of saved transactions associated with the user's current account
    and a boolean that tells whether or not the user's account data has been saved, currentAccountDataHasBeenSaved.
2.  Right before the request is made, check the datasource-username to see if it is empty.
3.  If it is empty,
        alert the user that he/she should restart the EA with the correct username inputted
        wait a little (about 10 seconds), then recheck and repeat
4.  Make the request
    1.  If the request timesout,
        keep retrying until it doesn't timeout
    2.  If the request responds with a 401 or 403 error,
        then the only possibility is that the user's datasource-username is either invalid or expired.
        1.  Check the response body to see the details of the error.
        2.  If the details say the username is invalid, alert the user to enter a valid one
        3.  If the details say the username is expired, alert the user to subscribe for continued service
        wait a little (about 10 seconds), then remake the request
5.  The number of saved transactions on the backend are saved in variables
6.  If not currentAccountDataHasBeenSaved,
    1.  All account, trade, deposit and withdrawal data are assembled into a json format and sent to the backend (along with the DS-Username).
    2.  At this point, it is not necessary to check if the username is empty, because that has already been checked before. It is still necessary to check if the server responds with a 401 or 403 error because it is possible for the username to expire after the EA has already been launched.
    3.  If the request timesout,
            keep retrying until it doesn't timeout
    4.  If the request responds with a 401 or 403 error,
            then the only possibility is that the user's datasource-username is either invalid or expired.
            Check the response body to see the details of the error.
            If the details say the username is invalid, alert the user to enter a valid one
            If the details say the username is expired, alert the user to subscribe for continued service
            wait a little (about 10 seconds), then remake the request
    5.  The backend responds with the number of transactions it now has saved, and the variables that contains them are updated.
7.  A timer is then set to go off every 1 second.
#### On timeout
1.  When the timer goes off, the actual number of transactions the user has done
    is gotten and compared with the number of transactions on the server.
2.  If they are the same, don't make any requests.
3.  If they are different,
    1.  Find the difference between the number of transactions the user has actually done, n, with the number of transactions the backend has, m (which has been saved in a variable for each)
    2.  Get only the last n - m transactions, assemble them and some account info into
        a json formatted string, then send them to the backend, along with the user's datasource username in a header called "Datasource-Username"
    3.  If the request timesout,
        keep retrying until it doesn't timeout
    4.  If the request responds with a 401 or 403 error,
        then the only possibility is that the user's datasource-username is either invalid or expired.
    5.  Check the response body to see the details of the error.
    6.  If the details say the username is invalid, alert the user to enter a valid one
    7.  If the details say the username is expired, alert the user to subscribe for continued service
        wait a little (about 10 seconds), then remake the request
    8.  The server responds with the number of transactions it now has saved, and the variable that contains
        that is updated

#### Error handling
If the Datasource-Username string is empty, alert the user
Any error apart from network errors are sent to the backend to be saved, so
    they can be looked at
Any HTTP unauthorized or forbidden response can only result from
    an expired or non-existent Datasource-Username, so the user is alerted
Any other network errors are ignored. They will still be remade after the timeout
    occurs in the next 15 seconds

EA
----
An expert advisor is used for the data sending.
It has 4 functions OnInit, OnDeinit, OnTick and OnTimer.
The only ones of interest are OnInit and OnTimer.
OnInit is used to setup timers and OnTimer is used to handle the
sending of trades after every timeout.

Mql 4
-----
Reference: https://docs.mql4.com/trading
Note: OrdersHistoryTotal returns the number of trades, deposits and withdrawals

Function Used          |     Purpose
----------------------:|----------------------------------------------
OrdersHistoryTotal     |    get the number of all trades of the user
OrderSelect            |    get the data of a single trade
OrderSymbol            |    get the trade pair
OrderOpenPrice         |    get the trade open price
OrderClosePrice        |    get the trade close price
OrderProfit            |    get the trade profit
OrderOpenTime          |    get the open time of the trade
OrderCloseTime         |    get the close time of the trade
OrderTicket            |    get the ticket number of the trade, which will be used as a unique id on the server
OrderType              |    buy or sell
OrderSwap              |    get the trade swap
OrderCommission        |    get the trade commission
OrderStopLoss          |    get the trade stop loss
OrderTakeProfit        |    get the trade take profit
OrderComment           |    get the comment associated with the trade
OrderMagicNumber       |    get the trade id
AccountCurrency        |    get the currency of the account
AccountCompany         |    name of broker
AccountName            |    name of account
AccountServer          |    name of trade server
AccountBalance         |    current balance of account
AccountCredit          |    credit value of account
AccountProfit          |    profit on the account
AccountEquity          |    equity of the account
AccountMargin          |    margin value of current account
AccountFreeMargin      |    free margin value of current account
AccountInfoDouble(ACCOUNT_MARGIN_LEVEL)      |    account margin level in percents
AccountInfoDouble(ACCOUNT_MARGIN_SO_CALL)      |    account margin call level
AccountInfoDouble(ACCOUNT_MARGIN_SO_SO)      |    account margin stopout level
AccountInfoInteger(ACCOUNT_LOGIN)     | account number
AccountLeverage        |    leverage of account
AccountInfoInteger(ACCOUNT_TRADE_MODE)     |    tells whether account is a demo, competition or real account
AccountStopoutLevel    |    account stopout level
AccountStopoutMode   |    account stopout level format

### Errors
*   When the url isnt under allowed urls
    WebRequest returns -1 and 4060 is the last error code
*   When the server is not available
    WebRequest returns -1 and 5203 is the last error code
*   When the server connection is lost
    WebRequest returns -1 and 5203 is the last error code

### Note
Deposits are indicated with comment: "Deposit"
When the user running an EA in his MT terminal changes accounts, the EA restarts then stops
So the user has to keep restarting it when he changes accounts

Mql 5
-----
function used          |     purpose
----------------------:|:----------------------------------------------
OrdersDealsTotal     |     get the number of all trades of the user
HistoryDealGetTicket  |    get the deal ticket number which is used to get individual trade data
HistoryDealGetString(dealTicket, DEAL_SYMBOL, var)    |   get the trade pair
HistoryDealGetDouble(dealTicket, DEAL_PROFIT, var)   |   get the trade profit
HistoryDealGetInteger(dealTicket, DEAL_POSITION_ID, dealPosId)  |   to be used as a unique trade id on the server
HistoryDealGetDouble(dealTicket, DEAL_PRICE, var) of trade's openDeal |   get the trade open price
HistoryDealGetDouble(dealTicket, DEAL_PRICE, var) of trade's closeDeal |   get the trade close price
HistoryDealGetInteger(dealTicket, DEAL_TYPE, var)  |   buy or sell
HistoryDealGetDouble(dealTicket, DEAL_SWAP, var)   |   trade swap
HistoryDealGetDouble(dealTicket, DEAL_COMMISSION, var)   |   trade commission
HistoryDealGetDouble(dealTicket, DEAL_SL, var)  |   trade stop loss
HistoryDealGetDouble(dealTicket, DEAL_TP, var)   |  trade take profit
HistoryDealGetString(dealTicket, DEAL_COMMENT, var) of trade's openDeal |   trade comment
HistoryDealGetInteger(dealTicket, DEAL_TIME, var) of trade's openDeal   |   trade open time
HistoryDealGetInteger(dealTicket, DEAL_TIME, var) of trade's closeDeal  |   trade close time
AccountInfoString(ACCOUNT_CURRENCY)        |     get the currency of the account
AccountInfoString(ACCOUNT_COMPANY)         |     name of broker
AccountInfoString(ACCOUNT_NAME)            |     name of account
AccountInfoString(ACCOUNT_SERVER)          |     name of trade server
AccountInfoDouble(ACCOUNT_BALANCE)         |     current balance of account
AccountInfoDouble(ACCOUNT_CREDIT)          |     credit value of account
AccountInfoDouble(ACCOUNT_PROFIT)          |     profit on the account
AccountInfoDouble(ACCOUNT_EQUITY)          |     equity of the account
AccountInfoDouble(ACCOUNT_MARGIN)          |     margin value of current account
AccountInfoDouble(ACCOUNT_MARGIN_FREE)      |     free margin value of current account
AccountInfoDouble(ACCOUNT_MARGIN_LEVEL)    |    account margin level
AccountInfoDouble(ACCOUNT_MARGIN_SO_CALL)  |    account margin call level
AccountInfoDouble(ACCOUNT_MARGIN_SO_SO)    |    account margin stopout level
AccountInfoInteger(ACCOUNT_LOGIN)          |    account login number
AccountInfoInteger(ACCOUNT_LEVERAGE)       |    account leverage 
AccountInfoInteger(ACCOUNT_TRADE_MODE)   |    tells whether account is a demo, competition or real account
AccountInfoInteger(ACCOUNT_MARGIN_SO_MODE) |    account stopout level format

### Errors
*   When the url isnt under allowed urls
    WebRequest returns -1 and 4014 is the last error code
*   When the server is not available
    WebRequest returns 1001 and 5203 is the last error code
*   When the server connection is lost
    WebRequest returns 1001 and 5203 is the last error code

### Note
Deposits are indicated with "action":"deposit" instead of buy/sell and pair will be null
When the user running an EA in his MT terminal changes accounts, the EA restarts