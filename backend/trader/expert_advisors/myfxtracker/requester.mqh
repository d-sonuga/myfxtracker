//+------------------------------------------------------------------+
//|                                                    requester.mqh |
//|                                                      MyFxTracker |
//|                                          https://myfxtracker.com |
//+------------------------------------------------------------------+
#property copyright "MyFxTracker"
#property link      "https://myfxtracker.com"
#include <JAson.mqh>
#include <myfxtracker/alerter.mqh>
#include <myfxtracker/errorgetter.mqh>
#include <myfxtracker/errors.mqh>
#include <myfxtracker/http.mqh>

const int RESP_CODE_UNAUTHORIZED = 401;
const int RESP_CODE_FORBIDDEN = 403;
const int RESP_CODE_SUCCESS = 200;

class Response {
   public:
      int respCode;
      CJAVal respData;
      Response(int respCode, string respData){
         this.respCode = respCode;
         this.respData.Deserialize(respData);
      }
      Response(const Response &resp){
         respCode = resp.respCode;
         respData = resp.respData;
      }
      CJAVal data(){
         return this.respData;
      }
};

interface BaseRequester {
   public:
      Response sendRequest(
         string url,
         string DSUsername,
         CJAVal &data,
         BaseAlerter *alerter,
         BaseErrorGetter *errorGetter,
         BaseErrors *errors,
         BaseHttp *http 
      );
};

class Requester: public BaseRequester {
   public:
      Response sendRequest(
         string url,
         string DSUsername,
         CJAVal &data,
         BaseAlerter *alerter,
         BaseErrorGetter *errorGetter,
         BaseErrors *errors,
         BaseHttp *http 
      ){
         if(StringLen(DSUsername) == 0){
            alerter.showMessage(errors.NO_DATASOURCE_USERNAME_MSG);
            Response resp(errors.NO_DATASOURCE_USERNAME_CODE, errors.NO_DATASOURCE_USERNAME_MSG);
            return resp;
         } else {
            char rawRespData[];
            string reqData = data.Serialize();
            int respCode = http.request(
                url,
                DSUsername,
                reqData,
                rawRespData
            );
            int lastError = errorGetter.getError();
            if(respCode == -1){
               if(lastError == errors.URL_NOT_ALLOWED_CODE){
                  alerter.showMessage(errors.URL_NOT_ALLOWED_MSG);
                  Response resp(errors.URL_NOT_ALLOWED_CODE, errors.URL_NOT_ALLOWED_MSG);
                  return resp;
               } else if(lastError == errors.SERVER_CONNECTION_LOST_CODE){
                  return this.sendRequest(
                     url,
                     DSUsername,
                     data,
                     alerter,
                     errorGetter,
                     errors,
                     http
                  );
               } else {
                  MessageBox(lastError);
                  return this.sendRequest(
                     url,
                     DSUsername,
                     data,
                     alerter,
                     errorGetter,
                     errors,
                     http
                  );
               }
            } else if(respCode == RESP_CODE_UNAUTHORIZED || respCode == RESP_CODE_FORBIDDEN){
               string respData = CharArrayToString(rawRespData);
               CJAVal resp;
               resp.Deserialize(respData);
               if(resp["detail"] == "invalid username"){
                  alerter.showMessage(errors.INVALID_USERNAME_MSG);
                  Response response(errors.INVALID_USERNAME_CODE, errors.INVALID_USERNAME_MSG);
                  return response;
               } else {
                  // only other detail is "expired username"
                  alerter.showMessage(errors.SUBSCRIPTION_EXPIRED_MSG);
                  Response response(errors.SUBSCRIPTION_EXPIRED_CODE, errors.SUBSCRIPTION_EXPIRED_MSG);
                  return response;
               }
            } else {
               string respData = CharArrayToString(rawRespData);
               // successful response
               Response resp(RESP_CODE_SUCCESS, respData);
               return resp;
            }
         }
      }
};