# Database Layout
The folders in changes contain sql scripts written to perform changes
directly on the database
The names of the folders are in the format year-month-date-time, for the
date and time the script in it was executed
Each folder contains a reason why the script in it was written
and the script itself
The file description contains a full description of the database
layout

Database layout
---------------
The table names given below are not all the tables in the db
The others are mostly django defaults and can be checked out in the
documentation (https://docs.djangoproject.com/en/4.0/)

django_site
auth_user
authtoken_token
django_rest_passwordreset_resetpasswordtoken
account_emailaddress
users_subscriptioninfo
users_paystacksubscription
users_paypalsubscription
users_userinfo
users_traderinfo
affiliate_affiliate
affiliate_failedpayout
apis_deleteimages
apis_account
apis_deposit
apis_withdrawal
apis_preferences
apis_trade

### django_site
A django provided table
Used in the password reset to determine the domain the mail is sent from
Has 3 columns
*   id
*   name
*   domain
Reference: https://docs.djangoproject.com/en/4.0/ref/contrib/sites/

### users_user (Formerly auth_user)
The user model
Has a lot of columns including email, password
Reference: https://docs.djangoproject.com/en/4.0/ref/contrib/auth/#django.contrib.auth.models.User
#### Replacement
users_user
##### New fields
*   is_trader
*   is_affiliate

### authtoken_token
A token model provided by djangorestframework (https://www.django-rest-framework.org/)
Used for authentication
Has 3 columns
*   key - the actual token
*   created - the date the token was created
*   user_id

### django_rest_passwordreset_resetpasswordtoken
A password reset token model provided by django-rest-passwordreset (https://pypi.org/project/django-rest-passwordreset/)
Used for keeping track of token used for password reset
Columns include created_at, key, user_id

### account_emailaddress
A table provided by django-allauth (https://django-allauth.readthedocs.io/en/latest/)
Used for keeping track of verified emails and email
that need confirming

### users_subscriptioninfo
A table that holds information about a user's subscription
regardless of his/her payment methods
Columns
*   id
*   is_subscribed - is the user currently on an active subscription
*   referrer_id - user id of the affiliate that got the user to the site, if any
*   user_id - id of the user whose subscription information is stored
*   payment_method - a string telling which method the user used to pay (paypal, paystack)
*   on_free - is the user still on his free trial
*   next_billing_time - when next should the user pay

### users_paystacksubscription
A table that was supposed to hold user subscription info specifically
for users that paid with paystack, but since paystack didn't allow payment in dollars
it is no longer being used. Although, it is still here, just in case.

### users_paypalsubscription
A table to hold subscription info specifically for users that paid with paypal
Columns
*   id
*   subscription_id - the paypal subscription id
*   paypal_email - the email the user is using to pay
*   subscription_info_id - the id of the user's entry in users_subscriptioninfo
*   next_billing_time - the time paypal says is the next billing time

### users_traderinfo
A table used to hold trader's user data that is specific to traders
Columns
*   id
*   user_id
*   current_feedback_question - was used to determine which question to 
    ask the user in a feedback program
*   logins_after_ask - was used to determine how many logins the user has 
    had after their feedback question has been asked. To space questions
*   how_you_heard_about_us - hoe the trader heard about the site
*   trading_time_before_joining - experience time the user has as a trader
#### New columns
*   datasource_username - a string used for authenticating requests from the datasource 

### users_affiliate
A table used to hold user data specific to affiliates
Columns
*   id
*   user_id
*   payment_email - the (paypal?) email to be used to pay the user
*   amount_earned - the amount the affiliate has earned
*   next_payout - the time the affiliate must be paid his amount_earned

### affiliate_failedpayout
A table used to hold data about failed payments
Columns
*   id
*   affiliate_id
*   amount

### trader_deletedimages (Formerly apis_deletedimages)
A table that holds was supposed to hold urls of images user has deleted

### trader_account (Formerly apis_account)
A table that holds data concerning a trader's trading accounts
Columns
*   id
*   name
*   user_id
#### New Columns
*   currency
*   broker
*   trade_server
*   balance
*   credit
*   profit_loss
*   equity
*   margin
*   free_margin
*   leverage
*   stopout_level_format
*   type

### trader_deposit
A table that holds data concerning a trader's deposits into an account
Columns
*   id
*   amount
*   date
*   account_id

### trader_withdrawal
A table that holds data concerning a trader's deposits into an account
Columns
*   id
*   amount
*   date
*   account_id

### trader_preferences
A table that holds data concerning a trader's app preferences
*   id
*   user_id
*   current_account_id - id of account the user has currently selected in the app

### trader_trade
A table that holds a trader's trade data
*   id
*   pair
*   action
*   entry_date
*   exit_date
*   risk_reward_ratio
*   profit_loss
*   pips
*   notes
*   entry_image_link
*   exit_image_link
*   entry_image
*   exit_image
*   date_added
*   account_id
#### New columns
*   open_price
*   close_price
*   open_time
*   close_time
*   ticket_number
*   stop_loss
*   swap
*   commission
*   lots
*   take_profit
*   comment
*   magic_number

### datasource_endpoint_datasourceerrors
A table that holds data related to error thrown by functions on datasources
*   id
*   datasource - an mt4 or mt5 terminal
*   function_name - which function threw the error
*   error_code - the mt error code associated with the error
*   user_id - the user the error came from