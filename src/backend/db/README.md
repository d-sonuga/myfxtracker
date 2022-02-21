# Description
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

### auth_user
The user model
Has a lot of columns including email, password
Reference: https://docs.djangoproject.com/en/4.0/ref/contrib/auth/#django.contrib.auth.models.User

### authtoken_token
A token model provided by djangorestframework (https://www.django-rest-framework.org/)
Used for authentication
Has 3 columns
*   key - the actual token
*   created - the date the token was created
*   user_id
Reference: 

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

### users_userinfo
A table used to hold info that determines the role of a user
Columns
*   id
*   user_id
*   is_affiliate
*   is_trader
*   is_admin

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

### affiliate_affiliate
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

### apis_deletedimages
A table that holds was supposed to hold urls of images user has deleted

### apis_account
A table that holds data concerning a trader's trading accounts
Columns
*   id
*   name
*   user_id

### apis_deposit
A table that holds data concerning a trader's deposits into an account
Columns
*   id
*   amount
*   date
*   account_id

### apis_withdrawal
A table that holds data concerning a trader's deposits into an account
Columns
*   id
*   amount
*   date
*   account_id

### apis_preferences
A table that holds data concerning a trader's app preferences
*   id
*   user_id
*   current_account_id - id of account the user has currently selected in the app

### apis_trade
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