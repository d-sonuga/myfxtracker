/**

Cases

1 Executor init
User opens EA, inputting both DSUsername and
allowing url in allowed urls list
EA should send a request to check if user has
saved account data in the backend
Backend returns a successful response, with a "we dont have the account data" response
EA should send a request to save the initial data
Backend responds with a "this is now what we have saved" response
The executor's no of saved transactions must now be equal to the number of actual transactions

2
The executor's init has already been executed successfully
The number of saved transactions isnt equal to the number of actual transactions
EA should send a request of the saved transactions
After backend's response, EA's no of saved transactions should now be equal to
no of actual transactions

3
The executor's init has already been executed successfully
The number of saved transactions is equal to the number of actual transactions
EA shouldnt send any request
After backend's response, EA's no of saved transactions should now be equal to
no of actual transactions

*/

#include <myfxtracker/tests/baseunittest.mqh>
#include <myfxtracker/errors.mqh>
#include <myfxtracker/alerter.mqh>
#include <myfxtracker/errorgetter.mqh>
#include <myfxtracker/errors.mqh>
#include <myfxtracker/http.mqh>
#include <myfxtracker/urls.mqh>
#include <myfxtracker/dataassembler.mqh>
#include <myfxtracker/executor.mqh>

UnitTest *unittest = new UnitTest();

// Unfinished tests

void testExecutorInit(){
    unittest.addTest(__FUNCTION__);
    string DSUsername = "dsusername";
    BaseRequester *requester = new TestRequesterExecutorInit();
    BaseAlerter *alerter = new TestAlerter();
    BaseErrorGetter *errorGetter = new ErrorGetter(0);
    BaseErrors *errors = new Errors();
    BaseHttp *http = new TestHttpExecutorInit();
    BaseDataAssembler = new TestDataAssembler();
    Executor executor(
        DSUsername,
        requester,
        alerter,
        errors,
        
    );
}

void runErrorTests(){
    testOnePlusOne();
}
