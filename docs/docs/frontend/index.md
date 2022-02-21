# Overview
apps - contains all apps
    - In each app, the following are used
    components - to configure components that are specific to the app
    pages - all the pages available in the app
visuals - contains all images, icons, svgs
components - contains all the global components to build on
            - buttons
            - inputs
            - containers
conf - contains all the global configuration constants and variables
        - styles
            - header styles
            - button styles
        - font sizes
        - colors
        - dimensions
services - contains all service providers
        - http
        - error validation
models - contains all blueprints of objects saved on server
        - user model
        - trader model
        - affiliate model
        - trade model


# For authentication
- a global user variable is passed down to all components through the main container
        There are 3 types of users:
                - anonymous users: a user not logged in
                - trader users: a trader logged in
                - admin users: an admin logged in
        on loading of the app, the main container checks if the key in the local storage
            has been set. if it has, a request is sent to get the user data

# For arbitrary user feedback
- A toast is used for network errors and other arbitrary user feedback
- There is one toast object available to the whole app.

# For data display
- Data is requested for on initial page load
- Data that is required:
     * user data is required globally
        - accounts
        - email
        - trade data

# Trader App data flow
* Calculator -> external package for all calculations
        functions for overview page
                overviewCalculations(accountData)
                        accountData: an object of all the account data
                        returns: an object of calculations for the overview page
                cashAndGainCalculations(accountData)
                longShortAnalysisCalculations(accountData)
                gainInPercent(?)
                        returns: gain in percent

* GlobalData -> A model holding all user data and trade data with operations to perform on it
        structures and variables ->
                rawData
                        role: holds the raw user data and trade data objects and all the
                                other related data gotten from the backend
        functions ->
                changeCurrentTradeAccountId(newCurrentAccountId)
                        newCurrentAccountId: the id of the account which should become 
                                the new current account
                        role: used to get a new global data instance with newCurrentAccountId
                                id as the current account id
                        returns: a new GlobalData instance
                        operation: 
                                creates a clone of the GlobalData instance's rawData object
                                sets the clone's trade_data.current_account_id to newCurrentAccountId
                                creates new instance of GlobalData passing the modified clone
                                    as the argument
                                // A new instance has to be returned because of the way react
                                // handles state updates. So the new current account id
                                // can be reflected in all data dependent components
                                // a completely new instance of GlobalData must be created
                                // and used as the new globalData in the TraderApp
                                returns the the GlobalData instance
                getCurrentTradeAccountData()
                        role: used to get the trades, deposits and other trade data associated
                                with an account from the rawData structure
                        returns: an object of the current account data
                        operation:
                                gets the current account id from the rawData.trade_data object
                                returns the object associated with the account id in the 
                                    rawData.trade_data.accounts object
                                

* TraderApp -> The app which holds all actual trader journaling capabilities
        - Needs to get the data to be used as global data from the backend
          on page load, all components needing global data have a loading icon, and the global data
            is requested from the backend using the user's token in the local storage
            If there is no token, redirect user to login page
            If there is token make request.
                If request comes back with an unauthorized error, redirect user to login
                Else, pass the global data down to all components
        * passes a global data context down to the pages
             the global data context consists of a GlobalData instance
             holding the user data and trade data, for pages that need them
        * passes an onCurrentAccountChange function which will be used to change the current
          account to the one whose id is specified in the argument passed to the function
        * contains the routes which lead to the seperate trader app pages
        states maintained ->
                globalData
                        role: an instance of GlobalData which is passed down to all 
                                TraderApp pages, for the data dependent components
        functions ->
                onCurrentAccountChange(newCurrentAccountId)
                        newCurrentAccountId: the id of the new current account,
                                passes to the function by the account selector
                        role: used by the AccountSelector to change the current account,
                                so the change in the current account will be reflected
                                in the data that is being displayed in the pages that 
                                display some calculations based on the data
                        operation:
                                calls globalData's changeCurrentAccountId(newCurrentAccountId)
                                    which returns a new GlobalData instance
                                changes the state of globalData to the new instance of
                                    GlobalData, so all data dependent components can be updated

* AccountSelector -> A component used to change the current account upon whose calculations
                    all data related pages are depending
        - Needs a function that can be used to make changes to the current account displayed
          which will then change the calculations being displayed to the one of the new
          current account.
          The only component that can give the account selector this function is the TraderApp
          because it provides the global data which is passed down to the components that need that data
          to calculate what they will display.
          Therefore it will receive an onCurrentAccountChange function from the TraderApp
          through a context, like the global data
        * Displays the current account whose calculated data is being used for the displays
        * Changes the current account whose calculated data is being used for the displays

* Overview ->
        * TraderApp page
        * Holds 4 card components, a graph and 2 tables
        Container
                * calls Calculator.overviewCalculations(), 
                    passing globalData.getCurrentTradeAccountData() as the argument
                * The resulting object of calculations is passed down to the components that need it
        Components ->
                1st card
                        - Needs to know the data calculated from the container
                        * displays total balance
                2nd card
                        - Needs to know the data calculated from the container
                        * displays number of trades
                3rd card
                        - Needs to know the data calculated from the container
                           current account id is in the trade data which is in the global data
                        * displays win rate
                4th card
                        - Needs to know the data calculated from the container
                           current account id is in the trade data which is in the global data
                        * displays absolute gain
                AccountReturnsChart
                        - Needs only data available in globalData
                        * displays a graph that maps a trade number (x axis) to the profit/loss of that
                            trade (y axis) for every trade in the account.
                        * calls globalData's getCurrentTradeAccountTrades to get an array of trade
                            objects for the current account. The ordering of the trades in the array
                            is already in chronological order which is the order in which it was
                            received from the backend
                StatisticsTable
                        - Needs to know the data calculated from the container
                        * displays a table of stats
                WeeklySummary
                        - Needs only globalData and results from Calculator in the container
                        * Displays some stats for the past week
                        * The total profit/losses per day in the summary are calculated by the
                           Calculator in the container
        
* TradingJournal
        * holds 1 table
        * only globalData and Calculator.gainInPercent(?) is required to display the data

* CashAndGains
        * holds 2 tables
        * only Calculator.cashAndGainCalculations() is required.

* LongShortAnalysis
        * holds 1 table and 3 graphs
        * only Calculator.longShortAnalysisCalculations() is required

* PairsAnalysis
        * 1 table and 2 graphs
        * only Calculator.pairsAnalysisCalculations() is required

