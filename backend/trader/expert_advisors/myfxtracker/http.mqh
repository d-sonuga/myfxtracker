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
