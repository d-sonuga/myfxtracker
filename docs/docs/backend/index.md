# Overview
The role of the backend is to do the following:

*  Serve the frontend app in production
*  Authentication
*  Persisting user info
*  Persisting trader data
*  Interacting with the trader data source (MetaApi)
*  Handling payment info
*  Handling interactions with payment processors

# Structure
For the backend to perform its role it must interact with the
frontend, data sources (MT terminals), and payment processors (paypal)
The apps for interacting with the frontend are:
1.  serve - For serving the app
2.  users - For handling genric user authentication, definition of structure and persisting of user info
3.  trader - For interacting with the frontend's trader app and persisting strictly
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
There is 1 main area where authentication is needed
1.  At the frontend, to know whether or not a trader is actually a trader,
    to know who is still paying, who is still on the free trial and whose free
    trial has expired

### Frontend authentication
Tokens are used for authentication.
With each request, a token, unique for each user, is sent to the server

Handling Payment Info
---------------------
When a trader signs up, next_billing_time field in the associated subscriptioninfo
db entry is null, meaning subscription not yet activated.
The subscription remains inactive until the trader finally connects a datasource.
When the user first connects a datasource, the next_billing_time on the subscriptioninfo
field is set to the next 35 days. (35 days is used because no month has up to 35 days)
Whenever the user makes a payment, the next_billing_time is changed to the next 35 days
again.

Interacting with payment processors
-----------------------------------
The payment processors are not yet a concern