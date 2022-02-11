//+------------------------------------------------------------------+
//|                                                  MyFxTracker.mq4 |
//|                                      Copyright 2021, MyFxTracker |
//|                                          https://myfxtracker.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2021, MyFxTracker"
#property link      "https://myfxtracker.com"
#property version   "1.00"
#property strict
#include <JAson.mqh>

const string ERR_URL_NOT_ALLOWED_MSG = "Please add https://myfxtracker.com to the list of allowed urls and restart the EA";
const string ERR_INVALID_USERNAME_MSG = "Please input a valid username and restart the EA";
const string ERR_NOT_SUBSCRIBED_MSG = "Please for subscribe for continued service and restart the EA";

extern string DSUsername = "";
// state variables
bool currentAccountDataHasBeenSaved = false;
int noOfSavedTransactions = 0;

int OnInit(){
   CJAVal savedDataInfo = getSavedDataInfo();
   if(isValidResp(savedDataInfo)){
      updateStateVariables(savedDataInfo);
      if(!currentAccountDataHasBeenSaved){
         CJAVal initialData = assembleAllDataInJson();
         CJAVal savedDataInfo = saveInitialData(initialData);
         if(!isValidResp(savedDataInfo)){
            ExpertRemove();
         }
         updateStateVariables(savedDataInfo);
      }
      EventSetTimer(1);
   } else {
      ExpertRemove();
   }
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason){
   EventKillTimer();
}

void OnTimer(){
   int noOfActualTransactions = OrdersHistoryTotal();
   if(noOfActualTransactions != noOfSavedTransactions){
      CJAVal dataToSave = assembleDataToSave();
      CJAVal resp = saveData(dataToSave);
      if(!isValidResp(resp)){
         ExpertRemove();
      }
      noOfSavedTransactions = resp["no-of-transactions"].ToInt();
   }
}

CJAVal assembleDataToSave(){
   CJAVal dataToSave;
   dataToSave["account-name"] = AccountName();
   dataToSave["account-company"] = AccountCompany();
   dataToSave["account-login-number"] = AccountInfoInteger(ACCOUNT_LOGIN);
   int noOfActualTransactions = OrdersHistoryTotal();
   
   for(int i=noOfSavedTransactions; i<noOfActualTransactions; i++){
      OrderSelect(i, SELECT_BY_POS, MODE_HISTORY);
      CJAVal transaction = assembleTransaction();
      dataToSave["account-transactions"][i - noOfSavedTransactions].Set(transaction);
   }
   return dataToSave;
}

void updateStateVariables(CJAVal &savedDataInfo){
   currentAccountDataHasBeenSaved = savedDataInfo["account-data-has-been-saved"].ToBool();
   noOfSavedTransactions = savedDataInfo["no-of-saved-transactions"].ToInt();
}

CJAVal getSavedDataInfo(){
   CJAVal accountInfo;
   accountInfo["account-name"] = AccountName();
   accountInfo["account-company"] = AccountCompany();
   accountInfo["account-login-number"] = AccountInfoInteger(ACCOUNT_LOGIN);
   return sendRequest("get-initial-info/", accountInfo);
}

CJAVal saveInitialData(CJAVal &initialData){
   return sendRequest("save-initial-data/", initialData);
}

CJAVal saveData(CJAVal &data){
   return sendRequest("save-data/", data); 
}

CJAVal sendRequest(string url, CJAVal &data){
   CJAVal respJson;
   if(StringLen(DSUsername) == 0){
      showMessage("Please restart the EA with your MT username");
      respJson["error"] = "no username";
   } else {
      char rawRespData[];
      string rawRespHeaders;
      int requestTimeout = 10000;
      char reqData[];
      string reqHeaders = "Content-Type: application/json\r\nDatasource-Username: " + DSUsername + "\r\n";
      StringToCharArray(data.Serialize(), reqData, 0, StringLen(data.Serialize()));
      int respCode = WebRequest(
          "POST",
          "http://localhost/" + url,
          reqHeaders,
          10000,
          reqData,
          rawRespData,
          rawRespHeaders
      );
      string respData = CharArrayToString(rawRespData);
      int lastError = GetLastError();
      if(respCode == -1){
         respJson["error"] = "network or configuration";
         if(lastError == 4060 || lastError == 4029){
            showMessage(ERR_URL_NOT_ALLOWED_MSG);
         } else if(lastError == 5203){
            return sendRequest(url, data);
         } else if(lastError == 4000){
            return sendRequest(url, data);
         }
      } else if(respCode == 401 || respCode == 403){
         CJAVal resp;
         resp.Deserialize(respData);
         if(resp["detail"] == "invalid username"){
            showMessage(ERR_INVALID_USERNAME_MSG);
         } else {
            // only other detail is "expired username"
            showMessage(ERR_NOT_SUBSCRIBED_MSG);
         }
         respJson["error"] = "invalid username or unsubscribed";
      } else {
         // successful response
         respJson.Deserialize(respData);
      }
   }
   return respJson;
}

void showMessage(string message, string title="MyFxTracker"){
   MessageBox(message, title);
}

bool isValidResp(CJAVal &data){
   return data["error"].ToStr() == "";
}

CJAVal assembleAllDataInJson(){
   CJAVal allData;
   allData["account-currency"] = AccountCurrency();
   allData["account-company"] = AccountCompany();
   allData["account-name"] = AccountName();
   allData["account-server"] = AccountServer();
   allData["account-credit"] = AccountCredit();
   allData["account-profit"] = AccountProfit();
   allData["account-equity"] = AccountEquity();
   allData["account-margin"] = AccountMargin();
   allData["account-free-margin"] = AccountFreeMargin();
   allData["account-margin-level"] = AccountInfoDouble(ACCOUNT_MARGIN_LEVEL);
   allData["account-margin-call-level"] = AccountInfoDouble(ACCOUNT_MARGIN_SO_CALL);
   allData["account-margin-stopout-level"] = AccountInfoDouble(ACCOUNT_MARGIN_SO_SO);
   allData["account-login-number"] = AccountInfoInteger(ACCOUNT_LOGIN);
   allData["account-leverage"] = AccountLeverage();
   allData["account-trade-mode"] = AccountInfoInteger(ACCOUNT_TRADE_MODE);
   allData["account-stopout-level"] = AccountStopoutLevel();
   allData["account-stopout-level-format"] = AccountStopoutMode();
   int noOfActualTransactions = OrdersHistoryTotal();
   for(int i=0; i<noOfActualTransactions; i++){
      OrderSelect(i, SELECT_BY_POS, MODE_HISTORY);
      CJAVal transaction = assembleTransaction();
      allData["account-transactions"][i].Set(transaction);
   }
   return allData;
}

CJAVal assembleTransaction(){
   CJAVal transaction;
   transaction["pair"] = OrderSymbol();
   transaction["open-price"] = OrderOpenPrice();
   transaction["close-price"] = OrderClosePrice();
   transaction["profit"] = OrderProfit();
   transaction["open-time"] = TimeToString(OrderOpenTime());
   transaction["close-time"] = TimeToString(OrderCloseTime());
   transaction["transaction-id"] = OrderTicket();
   transaction["action"] = OrderType() == OP_BUY ? "buy" : "sell";
   transaction["swap"] = OrderSwap();
   transaction["commission"] = OrderCommission();
   transaction["stop-loss"] = OrderStopLoss();
   transaction["take-profit"] = OrderTakeProfit();
   transaction["comment"] = OrderComment();
   transaction["magic-number"] = OrderMagicNumber();
   return transaction;
}

void OnTick(){}
