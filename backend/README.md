# Overview
The role of the backend is to do the following:
1.  Serve the frontend app in production
2.  Authentication
3.  Persisting user info
4.  Persisting trader data
5.  Interacting with the trader data source (MT terminals)
7.  Handling interactions with payment processors

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
Requests with trade data will be coming from the data source continuously, and it is
that username that will be used to know that the trade data is associated with the user
When a user's free trial is over, his username is supposed to expire
When a user's monthly payment is over, his username is supposed to expire, if he doesn't pay
Hence, with every API key, there must be an associated user and an expiring date which corresponds to the day at which he ought to have paid, but defaulted

Interacting with the data source
--------------------------------
### Flow
(API key = data source username)
The data source (MT terminal) always initializes the communication
It gets its data (how it does it is not the backend's business), sends it along
with its API key
The backend receives the data and does one of the following
1.  In the case where the API key hasn't expired (meaning that the API key belongs to a user
    who is still in his valid free trial or a paying user)
    authenticates the request with the API key, figures out which user is sending it
    The backend takes that data and checks the database if there is another entry with the same ticket
    If there is no entry with the same ticket,
        save the trade
    If there is, ignore it, because the trade has already been saved, and the data is just a duplicate
    A success response is sent back
2.  In the case where the API key has expired
    The backend checks the key's expiring date and finds that it has expired
    An unauthorized response is sent back
3.  In the case where the API key isn't in the database at all / doesn't exist
    The backend takes the API key and checks for it in the db
    It finds thats it doesn't exist
    An unauthorized response is sent back

Interacting with payment processors
-----------------------------------
The payment processors are not yet a concern