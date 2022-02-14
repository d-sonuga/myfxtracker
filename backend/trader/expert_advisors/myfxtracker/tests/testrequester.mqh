/**

Cases

1 No DSUsername
alert of the no username should be made

2 Url not allowed
alert of the url not allowed error should be made

3 401 unauthorized, invalid username
alert of the invalid username should be made

4 401 unauthorized, expired username
alert of the expired username should be made

5 403 unauthorized, invalid username
alert of the invalid username should be made

6 403 unauthorized, expired username
alert of the expired username should be made

7 Connection lost
should retry until it works



*/

#include <myfxtracker/tests/baseunittest.mqh>
#include <myfxtracker/requester.mqh>
#include <myfxtracker/alerter.mqh>
#include <myfxtracker/errorgetter.mqh>
#include <myfxtracker/errors.mqh>
#include <myfxtracker/http.mqh>

UnitTest *unittest = new UnitTest();

CJAVal dummyData;
BaseErrors *errors = new Errors();

void testNoDSUsername(){
    unittest.addTest(__FUNCTION__);
    string emptyDSUsername = "";
    BaseAlerter *alerter = new TestAlerter();
    BaseErrorGetter *errorGetter = new TestErrorGetter(0);
    BaseHttp *http = new TestHttpDummy();
    Requester requester;
    Response resp = requester.sendRequest(
        "",
        emptyDSUsername,
        dummyData,
        alerter,
        errorGetter,
        errors,
        http
    );
    unittest.assertEquals(
        __FUNCTION__,
        "response error code should be the code for no DSUsername",
        errors.NO_DATASOURCE_USERNAME_CODE, resp.respCode
    );
    unittest.assertEquals(
        __FUNCTION__,
        "alerter's showMessage should have been called with the msg for no DSUsername",
        errors.NO_DATASOURCE_USERNAME_MSG, alerter.getMessage()
    );
}

void testUrlNotAllowed(){
    unittest.addTest(__FUNCTION__);
    string DSUsername = "dsusername";
    BaseAlerter *alerter = new TestAlerter();
    BaseErrorGetter *errorGetter = new TestErrorGetter(errors.URL_NOT_ALLOWED_CODE);
    BaseHttp *http = new TestHttpRespMinus1();
    Requester requester;
    Response resp = requester.sendRequest(
        "",
        DSUsername,
        dummyData,
        alerter,
        errorGetter,
        errors,
        http
    );
    unittest.assertEquals(
        __FUNCTION__,
        "response error code should be the code for url not allowed",
        errors.URL_NOT_ALLOWED_CODE, resp.respCode
    );
    unittest.assertEquals(
        __FUNCTION__,
        "alerter's showMessage should have been called with the msg for url not allowed",
        errors.URL_NOT_ALLOWED_MSG, alerter.getMessage()
    );
}

void test401InvalidUsername(){
    unittest.addTest(__FUNCTION__);
    string DSUsername = "dsusername";
    BaseAlerter *alerter = new TestAlerter();
    BaseErrorGetter *errorGetter = new TestErrorGetter(0);
    BaseHttp *http = new TestHttpResp401InvalidUsername();
    Requester requester;
    Response resp = requester.sendRequest(
        "",
        DSUsername,
        dummyData,
        alerter,
        errorGetter,
        errors,
        http
    );
    unittest.assertEquals(
        __FUNCTION__,
        "response error code should be the code for invalid username",
        errors.INVALID_USERNAME_CODE, resp.respCode
    );
    unittest.assertEquals(
        __FUNCTION__,
        "alerter's showMessage should have been called with the msg for invalid username",
        errors.INVALID_USERNAME_MSG, alerter.getMessage()
    );
}

void test401ExpiredUsername(){
    unittest.addTest(__FUNCTION__);
    string DSUsername = "dsusername";
    BaseAlerter *alerter = new TestAlerter();
    BaseErrorGetter *errorGetter = new TestErrorGetter(0);
    BaseHttp *http = new TestHttpResp401ExpiredUsername();
    Requester requester;
    Response resp = requester.sendRequest(
        "",
        DSUsername,
        dummyData,
        alerter,
        errorGetter,
        errors,
        http
    );
    unittest.assertEquals(
        __FUNCTION__,
        "response error code should be the code for expired username",
        errors.SUBSCRIPTION_EXPIRED_CODE, resp.respCode
    );
    unittest.assertEquals(
        __FUNCTION__,
        "alerter's showMessage should have been called with the msg for expired username",
        errors.SUBSCRIPTION_EXPIRED_MSG, alerter.getMessage()
    );
}

void test403InvalidUsername(){
    unittest.addTest(__FUNCTION__);
    string DSUsername = "dsusername";
    BaseAlerter *alerter = new TestAlerter();
    BaseErrorGetter *errorGetter = new TestErrorGetter(0);
    BaseHttp *http = new TestHttpResp403InvalidUsername();
    Requester requester;
    Response resp = requester.sendRequest(
        "",
        DSUsername,
        dummyData,
        alerter,
        errorGetter,
        errors,
        http
    );
    unittest.assertEquals(
        __FUNCTION__,
        "response error code should be the code for invalid username",
        errors.INVALID_USERNAME_CODE, resp.respCode
    );
    unittest.assertEquals(
        __FUNCTION__,
        "alerter's showMessage should have been called with the msg for invalid username",
        errors.INVALID_USERNAME_MSG, alerter.getMessage()
    );
}

void test403ExpiredUsername(){
    unittest.addTest(__FUNCTION__);
    string DSUsername = "dsusername";
    BaseAlerter *alerter = new TestAlerter();
    BaseErrorGetter *errorGetter = new TestErrorGetter(0);
    BaseHttp *http = new TestHttpResp403ExpiredUsername();
    Requester requester;
    Response resp = requester.sendRequest(
        "",
        DSUsername,
        dummyData,
        alerter,
        errorGetter,
        errors,
        http
    );
    unittest.assertEquals(
        __FUNCTION__,
        "response error code should be the code for expired username",
        errors.SUBSCRIPTION_EXPIRED_CODE, resp.respCode
    );
    unittest.assertEquals(
        __FUNCTION__,
        "alerter's showMessage should have been called with the msg for expired username",
        errors.SUBSCRIPTION_EXPIRED_MSG, alerter.getMessage()
    );
}

void testConnectionLost(){
    unittest.addTest(__FUNCTION__);
    string DSUsername = "dsusername";
    BaseAlerter *alerter = new TestAlerter();
    BaseErrorGetter *errorGetter = new TestErrorGetter(errors.SERVER_CONNECTION_LOST_CODE);
    BaseHttp *http = new TestHttpRespMinus1Once();
    Requester requester;
    Response resp = requester.sendRequest(
        "",
        DSUsername,
        dummyData,
        alerter,
        errorGetter,
        errors,
        http
    );
    unittest.assertEquals(
        __FUNCTION__,
        "response code should be successful",
        RESP_CODE_SUCCESS, resp.respCode
    );
    unittest.assertEquals(
        __FUNCTION__,
        "alerter's showMessage should have been called with the msg for expired username",
        "no message here", alerter.getMessage()
    );
}
