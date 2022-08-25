# How the affiliate system works
* A person signs up for it, with a username and a password
* That person is given a link in the format https://myfxtracker.com/sign-up/(affiliate username)
* A person that signs up through that link is recorded in the db with the affiliate as his ref
* If the person pays, the affiliate is rewarded with some portion of the money

# For now
For now, the full system will not be implemented, but rather a subset to endorse a specific
affiliate, WBA.

## Things to put in place
This WBA affiliate is going to need the following
* A link for his affiliate sign ups with his username wba
* A way to log in and see progress
* A new payment plan for his students
* A way to receive his payments

### Breakdown
#### Link for affiliate sign ups
* WBA will be manually registered with the username wba
* On the frontend, a new link direction with extra /affiliate-username at the front will be considered
  and sent to the backend with the ref 'affiliate-username'
* On the backend, before the sign up commences, the ref field in the data is then checked
    * If the ref field is blank, no affiliate
    * If the ref field is not blank,
        * Check the db for a user with affiliate username ref
        * If such a user exists, record the affiliate username field under the user's ref field in the db
        * Else If such a user doesnt exists, then no affiliate
        * Sign up commences as usual, incorporating the above

#### Log in and see progress
* There will be an affiliate log in page at /aff/log-in where the affiliate can log in
  with the affiliate username and password
* To see progress, the following stats will be displayed:
  - Number of people signed up through the link
    * Gotten from the ref field of the user in the db
  - Number of active subscribers
    * Gotten from the is_subscribed field in SubscriptionInfo
  - How much payout due
    * 5 dollars per active subscriber

##### Breakdown
###### Scenarios to consider
1. Valid username and passwords are inputted and sent to the backend
2. Invalid username or password is inputted and sent to the backend
3. Empty username or passwords are inputted and sent to the backend
###### Frontend
Scenario 1
* User inputs valid username and password and clicks submit button
* A request is sent to the backend with the data
* The backend responds with a HTTP 200 response and the data for the affiliate dashboard
* The log in page is redirected to the affiliate page

Scenario 2
* User inputs a username that doesnt exists in the db and a password and clicks the submit button
* A request is sent to the backend with the data
* The backend responds with a HTTP 400 response and the 'invalid username' message
* The message is displayed in the dashboard

Scenario 3
* User leaves either the password or username or both fields empty and clicks the submit button
* The submit button is disabled, so nothing happens

#### Payment plan for students
A payment plan will be created manually with Flutterwave for the affiliate with 150 dollars per year
The payment plan will only be available to students whose referrer is WBA
So the init data sent on trader log ins should now have referrer information to determine
whether or not to display the new WBA plan
To integrate this payment plan:
* Create plan on Flutterwave dashboard
* Create plan option for students who signed up through wba

#### For the affiliate to receive payments
The payments will be sent manually for now.
