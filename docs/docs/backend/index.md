# Overview
The role of the backend is to do the following:

*  Serve the frontend app in production
*  Authentication
*  Persisting user info
*  Persisting trader data
*  Interacting with the trader data source (MT terminals)
*  Handling payment info
*  Handling interactions with payment processors

# Structure
For the backend to perform its role it must interact with the
frontend, data sources (MT terminals), and payment processors (paypal)
The apps for interacting with the frontend are:
1.  serve - For serving the app
2.  users - For handling user authentication, persisting of user info
3.  apis - For interacting with the frontend's trader app and persisting strictly
        trader related info
4.  admin - For interacting with the frontend's admin app and persisting admin related info
        (not yet in op)
5.  affiliate - For interacting with the frontend's affiliate app and persisting affiliate related info
        (not yet in op)
6.  paypal_endpoint - For interacting with the paypal system and persisting all paypal related info
        (not yet in op)
7.  datasource_endpoint - For interacting with the mt terminals

# Overview breakdown
Serving the frontend
--------------------
To do this, the built production ready app's directory is added
to the static files directory in the project settings (core.settings)

Authentication
--------------
There are 2 main areas where authentication is needed
1.  At the frontend, to know whether or not a trader is actually a trader,
    to know who is still paying, who is still on the free trial and whose free
    trial has expired
2.  For the data source requests. They should have a valid API key (username) with every
    request.

### Frontend authentication
Tokens are used for authentication.
With each request, a token, unique for each user, is sent to the server

### Data Source authentication
Every trader, on sign up, has a data source username which is used to authenticate every request
that comes from the data source.
On sign up, the user is given the API key, with the list of instructions he must follow to set up the data source.
Requests with transaction data will be coming from the data source continuously, and it is
that username that will be used to know that the trade data is associated with the user
When a user's free trial is over, his username is supposed to expire
When a user's monthly payment is over, his username is supposed to expire, if he doesn't pay
Hence, with every API key, there must be an associated user and an expiring date which corresponds to the day at which he ought to have paid, but defaulted

Interacting with the data source
--------------------------------
### Types of datasource requests
*   Request for initial info - to get the number of saved transactions
    and to know whether or not the user's account data has been saved
*   Request to save initial data - to save all account data and transaction data on the server
*   Request to save only some transactions - to save new transactions on the server
*   Request to save any error - to save EA errors on the server so they can be addressed

#### Request for initial info
##### Expected request format:
{
    'account-name': ...,
    'acount-company': ...,
    'account-login-number': ...
}
##### Expected response format
{
    'account-data-has-been-saved': ...,
    'no-of-transactions': ...
}
##### Flow
1.  Check if datasource username is in the database
2.  If it is,
    1.  Check if it has expired
    2.  If it has expired,
        1.  return a 401 response with username expired as its body
    Else,
    1.  return a 401 response with invalid username as its body
3.  Check db for accounts associated with the user that has the username
4.  If the account data that has been sent with the request exists in the database,
    1.  The number of trades, deposits and withdrawals associated with the account is counted
    2.  A 200 success response is sent, along with the number of trades, deposits and withdrawals and a truth value indicating that the account data has been stored
    Else,
    1.  A 200 success response is sent, along with 0 trades and a false value for 
        the account has been created field

#### Request to save initial data
##### Expected request format
{
    'account-name': ...,
    'account-company': ...,
    ...,
    'account-transactions: [...]
}
##### Expected response format
{
    'no-of-transactions': ...
}
##### Flow
1.  Check if datasource username is in the database
2.  If it is,
    1.  Check if it has expired
    2.  If it has expired,
        1.  return a 401 response with username expired as its body
    Else,
    1.  return a 401 response with invalid username as its body
    2.  Take the data, serialize it
3.  The format will be an object with account data and account-transactions fields holding an array of json objects holding data
4.  Store it
5.  return a 200 success response with the total number of transactions associated with the account saved as its body

#### Request to save only some trades, deposits or/and withdrawals
Check if datasource username is in the database
If it is,
    check if it has expired
    If it has expired,
        return a 401 response with username expired as its body
Else,
    return a 401 response with invalid username as its body
Take the data, serialize it
The format of the data will be an array of json objects holding trade, deposit and withdrawal data
Since, there is a possibility that the trade sent is a duplicate, in the case of 
the datasource timing out when the trades have been saved, right before the success
response reaches it, there is a need to check if the trade, deposit or withdrawal is a duplicate
To do that,
    Each trade has a unique number(ticket number in mt4, position id in mt5) whose uniqueness is enforced by the db
    So if a trade with a number identical to that of a trade already saved
        is tried to be saved, an error will be raised.
    Therefore the trades will be stored by default and if the uniqueness error is raised
        it won't be stored because that means its a duplicate
    The exact time the deposit or withdrawal takes place is used to identify duplicates
return a 200 success response with the total number of trades, deposits and withdrawals associated
with the account saved as its body

#### Request to save any error
Check if datasource username is in the database
If it is,
    check if it has expired
    If it has expired,
        return a 401 response with username expired as its body
Else,
    return a 401 response with invalid username as its body
Take the error, serialize it
Its format will be a json object with the mt4-trade-function or mt5-trade-function
(depending on which mt version the function is running on) as a field and the name of
the function which threw the error as a value and the mt4-error-code or mt5-error-code
as a field with the error code as the value
A mail is sent to the site admin's
a success 200 response is sent back, with no body

Handling Payment Info
---------------------
When a trader signs up, next_billing_time field in the associated subscriptioninfo
db entry is null, meaning subscription not yet activated.
The subscription remains inactive until the trader finally connects a datasource.
When the user first connects a datasource, the next_billing_time on the subscriptioninfo
field is set to the next 35 days. (35 days is used because no month has up to 35 days)
Whenever the user makes a payment, the next_billing_time is changed to the next 35 days
again.
It is this next billing time that is used to determine whether or not the datasource-username
is expired.

Interacting with payment processors
-----------------------------------
The payment processors are not yet a concern