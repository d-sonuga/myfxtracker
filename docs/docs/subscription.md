### How subscription works
* The first time the user pays successfully, the plan id is specified with the payment
* The next payments will be made automatically by Flutterwave
* Any change in a user's email address has to reflect in the subscription
  because subscriptions are attached to a user's email address
* When a subscription is cancelled or when a charge fails or succeeds, a
  webhook notification is sent

### Webhooks
The webhook events that are sent for new subscriptions and for re-billing of subscriptions
are the same: 'charge.completed'
But the event for cancelling is 'subscription.cancelled'

### Things to consider
* User's free trial isn't over
* User's free trial is over
* User is subscribed
* User is re-billed at the end of a subscription period
* User deletes account

#### User's free trial isn't over
When the user's free trial isn't over, the settings page should be showing the user's stage
in his free trial and when it will be over.

#### User's free trial is over
When the user's free trial is over, no page should be accessible (except the settings page),
but rather a free trial over subscribe monthly or yearly page should be shown

##### Flow of free trial over page
* User with free trial over opens app and sees only free trial over page
* On the free trial over page, there are 2 options, yearly and monthly
* User clicks monthly subscription
* A form pops up for the user to enter his phone number and name
* User enters both phone number and name
* User clicks button and the flutterwave modal comes up
* When the process is done and the callback is called, it is either a success or a failure
    * If it is a success, a request is sent to the backend to update the user's payment status
      then all the user's frontend state is updated and all pages become accessible again
    * If it is a failure, the error messaging is handled by Flutterwave and is shown on the
      Flutterwave modal
    
##### Webhook for new subscription is received
* Webhook of unsubscription reaches backend
* Webhook is verified with by checking the veri-hash header in the payload against
  the secret hash specified by you and kept in an environment variable
* Status field in payload is checked to verify that it is successful
* The 'updated at' field is saved to keep track of when next user's subscription should expire
* A HTTP 200 response is returned, as any other response is treated as a failure by Flutterwave

#### User is subscribed
When the user is subscribed, the subscription section in the settings page should show the state of
the subscription and a cancel button to cancel his subscription

##### User cancels subscription from frontend
* User clicks cancel subscription button
* An 'are you sure message comes up'
* If user clicks continue, continue
* If user clicks no, stop here and close
* Open another form to ask the user for the reason of the unsubscription
* A request is sent to the backend to cancel the request, along with the reason
* Backend receives request and sends a request to the Flutterwave guys
* If Flutterwave guys respond with a success
    * Mark user as unsubscribed
    * Undeploy user's accounts on metaapi
    * Return successful unsubscription
    * On the frontend, change user's status to unsubscribed
    * Redirect to the subscribe view of the trader app
* Else, respond with failed unsubscription
    * On the frontend, show error message of the failed unsubscription

##### User cancels subscription from other place
* Webhook of unsubscription reaches backend
* Webhook is verified with by checking the veri-hash header in the payload against
  the secret hash specified by you and kept in an environment variable
* The user is marked as unsubscribed
* User's account is undeployed on metaapi
* A HTTP 200 response is returned, as any other response is treated as a failure by Flutterwave

### Flows
Specific frontend and backend flows to handle
* User's free trial is over and is subscribed and opens app
* User's free trial is not over and is not subscribed and opens app
* User's free trial is over and is not subscribed and opens app
* User subscribes to monthly subscription on subscribe page
* User subscribes to yearly subscription on subscribe page
* User's re-billing fails
* User's re-billing succeeds
* User cancels subscription on the settings page
* User cancels subscription off app
* User deletes account
* User manages to load subscribe page, when already subscribed
* How to figure out if user's free trial is over and undeploy the account

#### User's free trial is over and is subscribed and opens app
* All pages should be accessible

#### User's free trial is not over and is not subscribed and opens app
* All pages should be accessible

#### User's free trial is over and is not subscribed and opens app
* Only settings page should be accessible
* Every other page should redirect to the free trial is over, subscribe now page
* On the ubscribe now page, there should be a view with a button for monthly subscription
  and another with a view for yearly subscription

#### User subscribes
##### Frontend Perspective
* User opens the subscribe now page
* User clicks monthly subscription or yearly
* The button shows a loading icon and the other subscription button becomes disabled, to avoid conflict
* Place a loading icon on the selected subscription's button
* Disable the other subscription button to avoid conflicts
* The Flutterwave modal eventually opens and user continues payment flow
* If any error goes on with the Flutterwave flow,
    * The Flutterwave modal will handle and display the error
* Else if user cancels payment,
    * Remove loading icon from selected button and enable the other
* Else if not error occurs in Flutterwave modal flow,
    * The modal will close and trigger a callback that will initiate an attempt to save the info on the backend
    * If the backend responds successfully,
        * Change the user's frontend status to subscribed
        * Allow the user access to all the pages
        * Check the body of the response to see if it is says 'pending' (meaning that accounts are 
          being redeployed)
        * If it does,
          * Show the user a page loading icon and a 'please wait, this might take a while' message
          * Make follow up requests at certain intervals to see if the thing has been resolved
          * If a follow up request returns a success 'not pending',
            * Initiate a referesh account operation
            * Make the necessary follow up requests for that
          * Else, if it still returns 'pending',
            * Repeat follow up requests until a timeout
        * If it doesn't,
          * Continue
    * Else if request timesout,
        * Alert the user that the request is taking longer than expected, please wait
        * Retry the request with a higher timeout number
        * If after 3 timeouts, the request timesout, alert the user of the disconnection from the server
    * Else if user disconnects from network right after Flutterwave modal closes,
        * No need to be handled because the Flutterwave webhook will still reach the backend
            and update the user's status
    * Else if user closes page right after Flutterwave modal closes,
        * No need to be handled because the Flutterwave webhook will still reach the backend
            and update the user's status
    * Else if an unknown error occured
        * Alert user that an unknown error occured, contact support

##### Backend Perspective
###### First request to record subscription
* A request arrives with the amount and user id of the trader who successfully subscribed
* Check the user's is_subscribed field in the db to see if this process has already been done, and the
  user is just sending follow up requests for re-deploying of his accounts
* If the is_subscribed field is false, (then this is the user's first request to subscribe)
  * If the next time has not been recorded in the last 1 hour (that is, if the webhook has not
    been processed (that is, if the last billed time (a column in the SubscriptionInfo table) is not within 1 hour))
      * The user's last billed time is changed to the current time (will be updated to the more precise
      time when the webhook lands)
      * The user's subscribed status is renewed
      * The user's subscription type is set to monthly or yearly depending on the amount of money
      * Continue to the next section
  * Check the db to see if the user has any accounts in it, related to the user
  * If there are any, (they must have been undeployed)
    * Put a procedure on a queue to deploy it
    * Create an entry in the UnresolvedDeployAccount table with the user id
    * Return a successful 'pending' response
  * Else If there aren't any (there are no undeployed accounts),
    * Return a successful 'not pending' response
* Else If the is_subscribed field is set to true, (then this must have been for a follow up request to monitor
  the state of the redeployment of the user's accounts)
    * A request arrives with the amount and user id of the trader who successfully subscribed
    * The UnresolvedDeployAccount table is checked in the db to see if it has a row containing the user id
    * If it does,
      * Return a successful 'pending' response
    * Else If it doesn't,
      * Check the DeployAccountError table to see if the user's id is in it
      * If it is there,
        * Return an error with the message of whatever was in the table
        * Delete the error from the table
      * Else If there isn't,
        * Return successful 'not pending' response
      
###### Flutterwave webhook for new subscription arrives
* Webhook of completed charge reaches backend
* A sample webhook looks like this:
  {
    "event": "charge.completed",
    "data": {
      "id": 3479452,
      "tx_ref": "user-1-date-1655118816524",
      "flw_ref": "FLW-MOCK-d03a652eca9bae8bc62893c22a69f8a4",
      "device_fingerprint": "8a9f902753da6e97a6d799774fbca1f4",
      "amount": 23.99,
      "currency": "USD",
      "charged_amount": 23.99,
      "app_fee": 0.92,
      "merchant_fee": 0,
      "processor_response": "Approved. Successful",
      "auth_model": "VBVSECURECODE",
      "ip": "169.239.48.195",
      "narration": "CARD Transaction ",
      "status": "successful",
      "payment_type": "card",
      "created_at": "2022-06-13T11:13:50.000Z",
      "account_id": 753905,
      "customer": {
        "id": 1655705,
        "name": "Anonymous customer",
        "phone_number": null,
        "email": "sonugademilade8703@gmail.com",
        "created_at": "2022-06-13T11:13:50.000Z"
      },
      "card": {
        "first_6digits": "553188",
        "last_4digits": "2950",
        "issuer": "MASTERCARD  CREDIT",
        "country": "NG",
        "type": "MASTERCARD",
        "expiry": "09/32"
      }
    },
    "event.type": "CARD_TRANSACTION"
  }
* Webhook is verified with by checking the veri-hash header in the payload against
  the secret hash specified by you and kept in an environment variable
* The user is specified by the value in tx_ref, which has the following format: 'user-{user_id}-date-{timestamp}'
* The user's last billed time is changed to the 'created_at' time specified in the webhook
* The user's subscribed status is renewed
* The user's subscription type is set to monthly or yearly depending on the amount of money


#### User's re-billing succeeds
Ref: https://developer.flutterwave.com/docs/recurring-payments/payment-plans/#webhooks
* Webhook of re-billing reaches backend
* A sample webhook looks like this:
    {
        "event": "charge.completed",
        "data": {
            "id": 285959875,
            "tx_ref": "Links-616626414629",
            "flw_ref": "PeterEkene/FLW270177170",
            "device_fingerprint": "a42937f4a73ce8bb8b8df14e63a2df31",
            "amount": 100,
            "currency": "NGN",
            "charged_amount": 100,
            "app_fee": 1.4,
            "merchant_fee": 0,
            "processor_response": "Approved by Financial Institution",
            "auth_model": "PIN",
            "ip": "197.210.64.96",
            "narration": "CARD Transaction ",
            "status": "successful",
            "payment_type": "card",
            "created_at": "2020-07-06T19:17:04.000Z",
            "account_id": 17321,
            "customer": {
            "id": 215604089,
            "name": "Yemi Desola",
            "phone_number": null,
            "email": "user@gmail.com",
            "created_at": "2020-07-06T19:17:04.000Z"
            },
            "card": {
            "first_6digits": "123456",
            "last_4digits": "7889",
            "issuer": "VERVE FIRST CITY MONUMENT BANK PLC",
            "country": "NG",
            "type": "VERVE",
            "expiry": "02/23"
            }
        }
    }
* Webhook is verified with by checking the veri-hash header in the payload against
  the secret hash specified by you and kept in an environment variable
* Since the re-billing is successful, the status field of the payload will be 'successful'
* User's last billing time is updated
* A HTTP 200 response is returned, as any other response is treated as a failure by Flutterwave

#### User's re-billing fails
* Webhook of re-billing reaches backend
* Webhook is verified with by checking the veri-hash header in the payload against
  the secret hash specified by you and kept in an environment variable
* A mail of unsuccessful re-billing is sent to the user
* The user's 'subscribed' status is set to false in the db
* A procedure to undeploy the user's account is placed on a queue
    * Any errors in this procedure should be logged and saved to the db
    * Procedure to cancel user's subscription is carried out so as to allow
      the user to re-subscribe from the frontend
* A HTTP 200 response is returned, as any other response is treated as a failure by Flutterwave

#### User cancels subscription on settings page
##### Frontend Perspective
* User loads settings page
* User clicks on unsubscribe button
* An 'are you sure?' dialog appears
* If no is clicked, stop and close the dialog
* If yes is clicked, continue
* A request is sent to the backend, to initiate unsubscription
* Every 5 seconds, a follow up request is sent to check the state of the unsubscription
* If the response says the unsubscription is still pending, re-request in 5 seconds
* Else If the response unsubscription is successful,
    * Change the user's frontend state to unsubscribed
    * Allow only settings page to be visible
    * Redirect all other pages to the 'subscribe' view
* Else if response is unsuccessful,
    * Alert user that the subscription was not cancelled and if the error persists,
      support should be contacted
* Else if request timeout occurs,
    * Alert user that the request was taking too long and timed out and that it should be manually retried
* Else if an unforseen event occurs,
    * Alert the user that 'an error occured' and 'contact support if this persists'

##### Backend Perspective
* A request reaches the backend to unsubscribe
* The UnresolvedUnsubscription table is checked to see if the user has an entry in it
* If the user does, send back a 'pending' request
* Else If the user doesn't, create an entry and carry out the following procedure on a background queue,
  and return a successful 'pending' response
* If the user associated with this request is subscribed
    * Call Flutterwave's Rave.Subscription.fetch sdk function, passing the user's email as the
      subscription_email keyword argument
      (A successful fetch:
        {'error': False, 'returnedData': {'status': 'success', 'message': 'SUBSCRIPTIONS-FETCHED', 'data': {'page_info': {'total': 1, 'current_page': 1, 'total_pages': 1}, 'plansubscriptions': [{'id': 17111, 'amount': 25, 'next_due': '2022-07-11T06:19:28.000Z', 'customer': {'id': 1653948, 'customer_email': 'user@gmail.com'}, 'plan': 20974, 'status': 'active', 'date_created': '2022-06-11T06:19:28.000Z'}]}}}
        In the above, obj['returnedData']['data']['plansubscriptions'][0]['id'] is the user's subscription id
      )
    * If the call raises a PlanStatusError e, save the e.type string and e.err JSON object in the db
      along with the time of the error and log it and return server error 'error occured'
    * Else If the call raises a connection error, return a server error 'unable to reach Flutterwave server'
    * Else If some other unexpected error is thrown, log it, save the time and associated user
      an return server error 'unexpected error'
    * Else if it was successful, Retrieve the subscription id from the information gotten
    * If Flutterwave returned more than one active subscription, log it as an unexpected occurence
      and save the user id, time and subscription info in the db
    * Call Flutterwave's Rave.Subscription.cancel sdk function, passing the retrieved subscription id as
      the argument
      (A successful cancel:
        {'error': False, 'returnedData': {'status': 'success', 'message': 'SUBSCRIPTION-CANCELLED', 'data': {'id': 17110, 'amount': 25, 'next_due': '2022-07-11T06:03:52.000Z', 'customer': {'id': 1653941, 'customer_email': 'user@gmail.com'}, 'plan': 20974, 'status': 'cancelled', 'date_created': '2022-06-11T06:03:52.000Z'}}}
      )
    * If a connection error is thrown, return server error 'unable to connect'
    * Else if a PlanStatusError e is thrown, save the e.type string and e.err JSON object in the db
      along with the time of the error and log it and return server error 'error occured'
    * Else if the cancel was successful, return a successful response
* Else, return successful 'not pending' response

#### User cancels subscription off settings page
No need to worry about as long as cancelling subscriptions from email is disabled
Ref: https://developer.flutterwave.com/docs/recurring-payments/payment-plans

#### User deletes account
* The procedure for cancelling subscriptions should be followed after undeploying of trading accounts
* If anything goes wrong along the way, return an error 'contact support'
##### Scenarios to consider
* No error occurs and the account undeployment, subscription cancelling 

#### User manages to load subscribe page when already subscribed
* The buttons to make a subscription should be disabled

#### How to figure out if user's free trial is over and undeploy the account
Note: A user's free trial starts only when the user has added a trading account to track
But what if the user deletes the account immediately afterwards, or what if the user deletes the
account every free trial period and adds it back afterwards.
To circumvent this, a 'time_of_free_trial_start' column is in the SubscriptionInfo table and this
column will remain null for every user until they add their first account and afterwards, it will remain
the same.
It is this column that will be checked to determine whether or not a free trial is over.
* A procedure will be scheduled to run every 1 day
* In the procedure, every user with attribute on_free set to true is loaded from the db and the period
  between the user's 'time_of_free_trial_start' and current time is checked to see
  if the difference is greater than the free trial period
* If if is greater than or equal to, the user's 'on_free' is set to false and the account is undeployed
  (and has to be redeployed when the user subscribes)
* Else, do nothing


## New Deployment Checklist Items
* Set the following environment variables:
  * FLUTTERWAVE_VERIF_HASH, generated by you and has to be set in a webhook setting
    on the Flutterwave dashboard
  * RAVE_PUBLIC_KEY, from Flutterwave
  * RAVE_SECRET_KEY, from Flutterwave