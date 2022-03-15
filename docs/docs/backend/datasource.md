# Datasource
The datasource is now from the MetaApi servers, and not an EA

# Details Required From User
*   Account login number
*   Investor password
*   Account server name
*   Account name
*   Metatrader version
*   Magic number?

# Scenarios To be Considered
1.  User enters account details for the first time and waits for data to load on screen
2.  User loads page for already registered account without taking any more trades than before
3.  User loads page for already registered account after taking more trades than last load time
4.  User removes account from tracking on app

# Expectations
1.  App page loads should be fast
2.  When a user loads a page, the data displayed should be the latest, showing
    all transactions done till date
3.  When a user makes a transaction and loads the page immediately, the new transactions made should
    reflect on the page

# Approach
*   Periodic loading of data (per day)
*   Manual refreshing of data (by user), when requested
## Expectations Achieved
*   Expectation 1 is okay
*   Expectations 2 and 3 are compromised in a not too inconvenient way


# Scenarios Addressed
## Scenario 1
User enters account details for the 1st time, just registering, and waits for data to load
on screen
### Things that can go wrong
*   User's broker is not supported
*   User enters wrong details about account and needs to re-enter them
*   Network errors
*   Some random error occurs on the MA servers
*   Registering account takes too long and user cancels it and retries, fragmenting the process

### Stepping 1 - Nothing goes wrong
1.  User enters correct, well formed details at the frontend
2.  The request is made, reaches the backend
3.  The backend processes the request, deploys the user's account, retrieves
    all the required data, saves it in the database and sends the data to the frontend
    without taking too long and without the frontend cancelling the request
4.  The frontend receives the data correctly and displays it, showing the last data refresh time
    to be the current time

### Stepping 2 - User's broker is not supported
1.  User enters correct well formed details at the frontend
2.  The request is made, reaches the backend
3.  The backend processes the request, tries to deploy the account, receives a server not found request
    from the MA server and sends a server not supported response to the frontend
4.  The frontend displays a server not supported error, promting the user to check the details
    entered well

### Stepping 3 - User enters wrong details about account
1.  User enters bad details at the frontend
    (wrong server name, wrong terminal type, wrong login number, wrong password)
2.  The request is made, reaches the backend
3.  The backend processes the request, tries to deploy the account, receives a server not found request
    from the MA server and sends a server not supported response to the frontend
4.  The frontend displays a server not supported error

### Stepping 4a - Network errors
1.  User enters correct, well-formed details at the frontend
2.  The request is made, doesn't reach the backend
3.  Frontend retries request, showing user a response

### Stepping 4b - Network errors
1.  User enters correct, well-formed details at the frontend
2.  The request is made, reaches the backend
3.  The backend processes the request, tries to deploy the account but a network error occurs
    and the request never reaches the MA servers.
4.  The backend retries 2 more times before responding with a something went wrong, please try again
    later response
5.  On the frontend, the error is displayed and a try again later response is shown

### Stepping 5 - Random Error occurs
What happens here is the same as stepping 4b, but either a specific message,
like in the case of a known error, or a generic message, in the case of an
unknown error is shown

### Stepping 6 - Registering account is cancelled in process
1.  User enters correct, well-formed details at the frontend
2.  The request is made, reaches the backend
3.  The backend processes the request, tries to deploy the account
4.  In the process, on the frontend, the request is cancelled and retried
5.  The backend continues from wherever it stopped in the process


## Scenario 2
User loads page for already registered account without taking any more trades than before
### Things that can go wrong
*   An error occurs

### Stepping 1 - Nothing goes wrong
1.  Page loads with data in the database
2.  If user doesn't refresh data, end
3.  If user refreshes data, send data refresh request to the backend
4.  Backend receives and processes the request, connects to the MA servers, gets unsaved
    data from their servers, saves it in the database and sends the data back in the response
5.  The frontend displays it

### Stepping 2 - An error occurs
1.  Page loads with data in the database
2.  If user doesn't refresh data, end
3.  If user refreshes data, send data refresh request to the backend
4.  Backend receives and processes the request, connects to the MA servers, gets unsaved
    data from their servers, saves it in the database and sends the data back in the response
5.  An error occurs somewhere along the process in step 4.
5.  The frontend displays the error

## Scenario 2 and 3
The process of requesting and error handling is the same in the previous scenarios