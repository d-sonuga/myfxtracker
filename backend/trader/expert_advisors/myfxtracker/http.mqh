interface BaseHttp {
    public:
        int request(
            string url,
            string DSUsername,
            string reqData,
            char &respData[]
        );
            
};

class Http: public BaseHttp {
    public:
        int request(
            string url,
            string DSUsername,
            string reqData,
            char &respData[]
        ){
            char reqDataArray[];
            string rawRespHeaders;
            StringToCharArray(reqData, reqDataArray, 0, StringLen(reqData));
            string reqHeaders = "Content-Type: application/json\r\nDatasource-Username: "
               + DSUsername + "\r\n";
            int respCode = WebRequest(
                    "POST",
                    "http://localhost/" + url,
                    reqHeaders,
                    10000,
                    reqDataArray,
                    respData,
                    rawRespHeaders
                );
            return respCode;
        }
};

class TestHttpDummy: public BaseHttp {
    public:
        int request(
            string url,
            string DSUsername,
            string reqData,
            char &respData[]
        ){
            return 0;
        }
};

class TestHttpRespMinus1: public BaseHttp {
    public:
        int request(
            string url,
            string DSUsername,
            string reqData,
            char &respData[]
        ){
            return -1;
        }
};

class TestHttpRespMinus1Once: public BaseHttp {
    private:
        int noOfRequests;
    public:
        TestHttpRespMinus1Once(){
            this.noOfRequests = 0;
        }
        int request(
            string url,
            string DSUsername,
            string reqData,
            char &respData[]
        ){
            noOfRequests += 1;
            if(noOfRequests == 2){
                return 200;
            }
            return -1;
        }
};

class TestHttpResp401InvalidUsername: public BaseHttp {
    public:
        int request(
            string url,
            string DSUsername,
            string reqData,
            char &respData[]
        ){
            CJAVal resp;
            resp["detail"] = "invalid username";
            string respInString = resp.Serialize();
            StringToCharArray(respInString, respData, 0, StringLen(respInString));
            return 401;
        }
};

class TestHttpResp401ExpiredUsername: public BaseHttp {
    public:
        int request(
            string url,
            string DSUsername,
            string reqData,
            char &respData[]
        ){
            CJAVal resp;
            resp["detail"] = "expired username";
            string respInString = resp.Serialize();
            StringToCharArray(respInString, respData, 0, StringLen(respInString));
            return 401;
        }
};

class TestHttpResp403InvalidUsername: public BaseHttp {
    public:
        int request(
            string url,
            string DSUsername,
            string reqData,
            char &respData[]
        ){
            CJAVal resp;
            resp["detail"] = "invalid username";
            string respInString = resp.Serialize();
            StringToCharArray(respInString, respData, 0, StringLen(respInString));
            return 403;
        }
};

class TestHttpResp403ExpiredUsername: public BaseHttp {
    public:
        int request(
            string url,
            string DSUsername,
            string reqData,
            char &respData[]
        ){
            CJAVal resp;
            resp["detail"] = "expired username";
            string respInString = resp.Serialize();
            StringToCharArray(respInString, respData, 0, StringLen(respInString));
            return 403;
        }
};