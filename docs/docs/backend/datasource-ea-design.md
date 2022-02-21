Roles to be played:
    data assembler - gather account and trader data and out them in a json format
    alerter - show messages to the user
    error getter - get errors
    requester - send http requests
    urls - store urls

Roles to be played: 
    request sender - send requests to the backend and handle errors related to the requests
    json parser - take json formatted strings and turn them into a more code friendly form
    json formatter - reverse of the json parser
    executor - main controller


# mt4
global vars: currentAccountDataHasBeenSaved, noOfSavedTransactions

Initial Launch
--------------
initialize currentAccountDataHasBeenSaved to false
initialize noOfSavedTransactions
call getSavedDataInfo() -> savedDataInfo
savedDataInfo['account-data-has-been-saved'] -> currentAccountDataHasbeenSaved
savedDataInfo['no-of-transactions'] -> noOfSavedTransactions
if not currentAccountDataHasBeenSaved
    assembleAllDataInJson() -> initialData
    saveInitialData(initialData) -> savedDataInfo
    savedDataInfo['account-data-has-been-saved'] -> currentAccountDataHasbeenSaved
    savedDataInfo['no-of-transactions'] -> noOfSavedTransactions
setUpTimer()

On Timeout
----------
OrderHistoryTotal() -> noOfActualTransactions
if noOfActualTransactions != noOfSavedTransactions
    noOfTransactionNotYetSaved = noOfActualTransactions - noOfSavedTransactions
    empty json object -> dataToSave
    iterate over the transactions, starting from index noOfSavedTransactions
        assembleCurrentTransactionInJson() -> transactionInJson
        call dataToSave[current index - noOfSavedTransactions].Set(transactionInJson)
    resp = saveData(dataToSave)
    resp["no-of-transactions"] -> noOfSavedTransactions
    
----------------------------------------------------------------

getSavedDataInfo()
    role: send request to backend to get info about the saved data
    operation:
        use json library to put account name, company and login number in appropriate json form
        return sendRequest(url, data)

saveInitialData(initialData)
    role: send initialData to the backend
    operation:
        use json library to serialize initialData
        return sendRequest(url, initialData)

saveData(dataToSave)
    role: save new transaction data on the server
    operation:
        use json library to serialize dataToSave
        return sendRequest(url, dataToSave)

sendRequest(url, data)
    role: interact with the backend and handle related errors
    operation:
        check if datasource username is empty
        if it is,
            show messageBox that tells the user
            return sendRequest(url, data)
        make the request with WebRequest()
        Error with code 4060 is returned when the url is not in listed urls
            show message telling user to place the url in allowed urls
        Error with code 5203 is returned when server is unreachable or connection is lost
            return sendRequest(url, data)
        Error with code 4000 is returned on connection timeout
            return sendRequest(url, data)
        if 401 or 403 is the response code
            deserialize response with json library -> response
            if response["detail"] says invalid username
                show message telling user to input correct ds-username and restart EA
            else if response["detail"] says expired username
                show message telling user to subscribe and restart EA
        deserialize response with json library -> parsedJson
        return parsedJson

assembleCurrentTransactionInJson()
    role: takes current transaction data and puts it in a Json format with the json library
    operation:
        initialize empty json object
        call all the data functions for the required data
        for each call, build the json object like so:
            the returned value -> jsonobject["the key"]
        return the jsonobject


# mt5
global vars: currentAccountDataHasBeenSaved, noOfSavedTransactions

Initial Launch
--------------
initialize currentAccountDataHasBeenSaved to false
initialize noOfSavedTransactions
call getSavedDataInfo() -> savedDataInfo
savedDataInfo['account-data-has-been-saved'] -> currentAccountDataHasbeenSaved
savedDataInfo['no-of-transactions'] -> noOfSavedTransactions
if not currentAccountDataHasBeenSaved
    assembleAllDataInJson() -> initialData
    saveInitialData(initialData) -> savedDataInfo
    savedDataInfo['account-data-has-been-saved'] -> currentAccountDataHasbeenSaved
    savedDataInfo['no-of-transactions'] -> noOfSavedTransactions
setUpTimer()

On Timeout
----------
OrderDealsTotal() -> noOfActualTransactions
if noOfActualTransactions != noOfSavedTransactions
    noOfTransactionsNotYetSaved = noOfActualTransactions - noOfSavedTransactions
    load all deals
    empty json object -> dataToSave
    assembleTransactionDataInTransactions() -> transactions
    iterate over the orders, starting from index noOfSavedTransactions till noOfActualTransactions - 1
        call dataToSave[current index - noOfSavedTransactions].Set(transactionInJson)
    resp = saveData(dataToSave)
    resp["no-of-transactions"] -> noOfSavedTransactions

----------------------------------------------------------------

getSavedDataInfo()
    role: send request to backend to get info about the saved data
    operation:
        use json library to put account name, company and login number in appropriate json form
        return sendRequest(url, data)

saveInitialData(initialData)
    role: send initialData to the backend
    operation:
        use json library to serialize initialData
        return sendRequest(url, initialData)

saveData(dataToSave)
    role: save new transaction data on the server
    operation:
        use json library to serialize dataToSave
        return sendRequest(url, dataToSave)

sendRequest(url, data)
    role: interact with the backend and handle related errors
    operation:
        check if datasource username is empty
        if it is,
            show messageBox that tells the user
            return sendRequest(url, data)
        make the request with WebRequest()
        Error with code 4060 is returned when the url is not in listed urls
            show message telling user to place the url in allowed urls
        Error with code 5203 is returned when server is unreachable or connection is lost
            return sendRequest(url, data)
        Error with code 4000 is returned on connection timeout
            return sendRequest(url, data)
        if 401 or 403 is the response code
            deserialize response with json library -> response
            if response["detail"] says invalid username
                show message telling user to input correct ds-username and restart EA
            else if response["detail"] says expired username
                show message telling user to subscribe and restart EA
        deserialize response with json library -> parsedJson
        return parsedJson

assembleTransactionDataInTransactions()
    role: assemble the deals into an array of transactions
    operation:
        intialize an empty dynamic array -> unpairedDeals
        initialize an empty dynamic array -> transactions
        load all deals
        iterate though the deals
            if deal's comment != deposit or withdrawal (must be a trade)
                check the unpairedDeals array if the deal's ticket is in there
                if it is
                    remove it from the array -> ticket1
                    newTransaction = call createTransaction(ticket1, current ticket)
                    transactions.append(newTransaction)
                else
                    add it to the unpairedDeals array
            else
                newTransaction = call createTransaction(current ticket)
                transactions.append(newTransaction)
        return transactions

assembleTransactionInJson(transaction)
    role: takes transaction instance and puts it in a Json format with the json library
    operation:
        initialize empty json object
        for each field in transaction
            create the proper entry in the json object like so:
                jsonobject['key'] = transaction.fieldWithKey's value
        return jsonobject

assembleAllDataInJson()
    role: puts all account and transaction data in a json format to send to the server
    operation:
        initialize empty json object
        assembleTransactionDataInTransactions() -> transactions
        call account data functions and assemble them into their proper fields in the json object
        for 'account-transactions' field, iterate over the transactions
            assembleTransactionInJson(current transaction) -> tInJson
            call jsonobject[current index].Set(tInJson)
        return jsonobject

createTransaction(ticket1, ticket2=0)
    role: gets the deal data of deals with ticket1 and ticket2, if it isn't 0, and 
        constructs a new transaction instance from them
    operation:
        deal1 = deal with ticket1
        deal2 = deal with ticket2, if it's not 0, else deal1
        transaction = new Transaction {
            pair: deal1's pair,
            openPrice: deal1's price,
            closePrice: deal2's price,
            profit: deal2's profit,
            openTime: deal1's open time,
            closeTime: deal2's close time,
            transactionId: deal1's position id,
            action: deal1's action,
            swap: deal2's swap,
            lots: deal2's lots,
            commission: deal2's commission,
            stopLoss: deal1's stop loss,
            takeProfit: deal1's take profit,
            comment: deal1's comment,
            magicNumber: deal1's magic number
        }

structure Transaction
    role: representing a transaction that is in a format the server expects
    fields:
        pair
        openPrice
        closePrice
        profit
        openTime
        closeTime
        transactionId
        action
        swap
        lots
        commission
        stopLoss
        takeProfit
        comment
        magicNumber
