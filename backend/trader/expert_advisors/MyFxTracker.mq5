//+------------------------------------------------------------------+
//|                                                MyFxTrackerEA.mq5 |
//|                                  Copyright 2022, MetaQuotes Ltd. |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2022, MetaQuotes Ltd."
#property link      "https://www.mql5.com"
#property version   "1.00"
#property strict
#include <JAson.mqh>
#include <unittest.mqh>

const string ERR_URL_NOT_ALLOWED_MSG = "Please add https://myfxtracker.com to the list of allowed urls and restart the EA";
const string ERR_INVALID_USERNAME_MSG = "Please input a valid username and restart the EA";
const string ERR_NOT_SUBSCRIBED_MSG = "Please for subscribe for continued service and restart the EA";

input string DSUsername="";
// state variables
bool currentAccountDataHasBeenSaved = false;
int noOfSavedTransactions = 0;

class Transaction {
   public:
      string pair;
      double openPrice;
      double closePrice;
      double profit;
      datetime openTime;
      datetime closeTime;
      long transactionId;
      string action;
      double swap;
      double commission;
      double stopLoss;
      double takeProfit;
      string comment;
      long magicNumber;
      Transaction(){}
      Transaction(ulong firstDealTicket, ulong secondDealTicket){
         ulong dealType;
         this.profit = 0.0;
         HistoryDealGetString(firstDealTicket, DEAL_SYMBOL, this.pair);
         HistoryDealGetDouble(firstDealTicket, DEAL_PRICE, this.openPrice);
         HistoryDealGetDouble(secondDealTicket, DEAL_PRICE, this.closePrice);
         HistoryDealGetDouble(secondDealTicket, DEAL_PROFIT, this.profit);
         HistoryDealGetInteger(firstDealTicket, DEAL_TIME, this.openTime);
         HistoryDealGetInteger(secondDealTicket, DEAL_TIME, this.closeTime);
         HistoryDealGetInteger(firstDealTicket, DEAL_POSITION_ID, this.transactionId);
         HistoryDealGetInteger(firstDealTicket, DEAL_TYPE, dealType);
         HistoryDealGetDouble(secondDealTicket, DEAL_SWAP, this.swap);
         HistoryDealGetDouble(secondDealTicket, DEAL_COMMISSION, this.commission);
         HistoryDealGetDouble(firstDealTicket, DEAL_SL, this.stopLoss);
         HistoryDealGetDouble(firstDealTicket, DEAL_TP, this.takeProfit);
         HistoryDealGetString(firstDealTicket, DEAL_COMMENT, this.comment);
         HistoryDealGetInteger(firstDealTicket, DEAL_MAGIC, this.magicNumber);
         this.action = dealTypeInString(dealType);
      }
      Transaction(ulong dealTicket){
         ulong dealType;
         this.profit = 0.0;
         HistoryDealGetString(dealTicket, DEAL_SYMBOL, this.pair);
         HistoryDealGetDouble(dealTicket, DEAL_PRICE, this.openPrice);
         HistoryDealGetDouble(dealTicket, DEAL_PRICE, this.closePrice);
         HistoryDealGetDouble(dealTicket, DEAL_PROFIT, this.profit);
         HistoryDealGetInteger(dealTicket, DEAL_TIME, this.openTime);
         HistoryDealGetInteger(dealTicket, DEAL_TIME, this.closeTime);
         HistoryDealGetInteger(dealTicket, DEAL_POSITION_ID, this.transactionId);
         HistoryDealGetInteger(dealTicket, DEAL_TYPE, dealType);
         HistoryDealGetDouble(dealTicket, DEAL_SWAP, this.swap);
         HistoryDealGetDouble(dealTicket, DEAL_COMMISSION, this.commission);
         HistoryDealGetDouble(dealTicket, DEAL_SL, this.stopLoss);
         HistoryDealGetDouble(dealTicket, DEAL_TP, this.takeProfit);
         HistoryDealGetString(dealTicket, DEAL_COMMENT, this.comment);
         HistoryDealGetInteger(dealTicket, DEAL_MAGIC, this.magicNumber);
         this.action = dealTypeInString(dealType);
      }
      CJAVal intoJson(){
         CJAVal inJson;
         inJson["pair"] = this.pair;
         inJson["open-price"] = this.openPrice;
         inJson["close-price"] = this.closePrice;
         inJson["profit"] = this.profit;
         inJson["open-time"] = TimeToString(this.openTime);
         inJson["close-time"] = TimeToString(this.closeTime);
         inJson["transaction-id"] = this.transactionId;
         inJson["action"] = this.action;
         inJson["swap"] = this.swap;
         inJson["commission"] = this.commission;
         inJson["stop-loss"] = this.stopLoss;
         inJson["take-profit"] = this.takeProfit;
         inJson["comment"] = this.comment;
         inJson["magic-number"] = this.magicNumber;
         return inJson;
      }
};

int OnInit(){
   CJAVal savedDataInfo = getSavedDataInfo();
   if(isValidResp(savedDataInfo)){
      updateStateVariables(savedDataInfo);
      if(!currentAccountDataHasBeenSaved){
         CJAVal initialData = assembleAllDataInJson();
         savedDataInfo = saveInitialData(initialData);
         if(!isValidResp(savedDataInfo)){
            ExpertRemove();
         }
         currentAccountDataHasBeenSaved = savedDataInfo["account-data-has-been-saved"].ToBool();
         noOfSavedTransactions = savedDataInfo["no-of-transactions"].ToInt();
         MessageBox(noOfSavedTransactions);
         EventSetTimer(1);
      }
   } else {
      ExpertRemove();
   }
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason){
   EventKillTimer();
}

void OnTimer(){
   Transaction transactions[];
   assembleTransactionDataInTransactions(transactions);
   int noOfActualTransactions = ArraySize(transactions);
   if(noOfSavedTransactions != noOfActualTransactions){
      
   MessageBox(noOfSavedTransactions);
   MessageBox(noOfActualTransactions);
      int noOfTransactionsNotYetSaved = noOfActualTransactions - noOfSavedTransactions;
      CJAVal dataToSave;
      for(int i=noOfSavedTransactions; i<noOfActualTransactions; i++){         
         dataToSave["account-transactions"][i - noOfSavedTransactions]
            .Set(transactions[i].intoJson());
      }
      CJAVal savedDataInfo = saveData(dataToSave);
      noOfSavedTransactions = savedDataInfo["no-of-transactions"].ToInt();
      MessageBox(noOfSavedTransactions);
      MessageBox(noOfActualTransactions);
   }
}

CJAVal assembleAllDataInJson(){
   CJAVal allData;
   Transaction transactions[];
   assembleTransactionDataInTransactions(transactions);
   allData["account-currency"] = AccountInfoString(ACCOUNT_CURRENCY);
   allData["account-company"] = AccountInfoString(ACCOUNT_COMPANY);
   allData["account-name"] = AccountInfoString(ACCOUNT_NAME);
   allData["account-server"] = AccountInfoString(ACCOUNT_SERVER);
   allData["account-credit"] = AccountInfoDouble(ACCOUNT_CREDIT);
   allData["account-profit"] = AccountInfoDouble(ACCOUNT_PROFIT);
   allData["account-equity"] = AccountInfoDouble(ACCOUNT_EQUITY);
   allData["account-margin"] = AccountInfoDouble(ACCOUNT_MARGIN);
   allData["account-free-margin"] = AccountInfoDouble(ACCOUNT_MARGIN_FREE);
   allData["account-margin-level"] = AccountInfoDouble(ACCOUNT_MARGIN_LEVEL);
   allData["account-margin-call-level"] = AccountInfoDouble(ACCOUNT_MARGIN_SO_CALL);
   allData["account-margin-stopout-level"] = AccountInfoDouble(ACCOUNT_MARGIN_SO_SO);
   allData["account-login-number"] = AccountInfoInteger(ACCOUNT_LOGIN);
   allData["account-leverage"] = AccountInfoInteger(ACCOUNT_LEVERAGE);
   allData["account-trade-mode"] = AccountInfoInteger(ACCOUNT_TRADE_MODE);
   allData["account-stopout-level-format"] = AccountInfoInteger(ACCOUNT_MARGIN_SO_MODE);
   for(int i=0; i<ArraySize(transactions); i++){
      allData["account-transactions"][i].Set(transactions[i].intoJson());
   }
   return allData;
}

void updateStateVariables(CJAVal &savedDataInfo){
   currentAccountDataHasBeenSaved = savedDataInfo["account-data-has-been-saved"].ToBool();
   noOfSavedTransactions = savedDataInfo["no-of-saved-transactions"].ToInt();
}

CJAVal getSavedDataInfo(){
   CJAVal accountInfo;
   accountInfo["account-name"] = AccountInfoString(ACCOUNT_NAME);
   accountInfo["account-company"] = AccountInfoString(ACCOUNT_COMPANY);
   accountInfo["account-login-number"] = AccountInfoInteger(ACCOUNT_LOGIN);
   return sendRequest("get-initial-info/", accountInfo);
}

CJAVal saveInitialData(CJAVal &initialData){
   return sendRequest("save-initial-data/", initialData);
}

CJAVal saveData(CJAVal &data){
   return sendRequest("save-data/", data); 
}

class Mapper {
   private:
      int keys[];
      int values[];
      int noOfItems;
   public:
      Mapper(){
         this.noOfItems = 0;
      }
      bool containsKey(int key){
         int index = ArrayBsearch(this.keys, key);
         if(index != -1 && this.keys[index] == key){
            return true;
         }
         return false;
      }
      int getValue(int key){
         int index = ArrayBsearch(this.keys, key);
         return this.values[index];
      }
      void deleteValue(int key){
         int index = ArrayBsearch(this.keys, key);
         this.keys[index] = 0;
         this.values[index] = 0;
      }
      void set(int key, int value){
         this.noOfItems += 1;
         ArrayResize(this.keys, this.noOfItems);
         ArrayResize(this.values, this.noOfItems);
         this.keys[this.noOfItems - 1] = key;
         this.values[this.noOfItems - 1] = value;
      }
};

void assembleTransactionDataInTransactions(Transaction &transactions[]){
   HistorySelect(0, TimeCurrent());
   int totalDeals = HistoryDealsTotal();
   Mapper posMap;
   for(int i=0; i<totalDeals; i++){
      ulong dealTicket = HistoryDealGetTicket(i);
      ulong dealType;
      ulong dealPosId;
      HistoryDealGetInteger(dealTicket, DEAL_POSITION_ID, dealPosId);
      HistoryDealGetInteger(dealTicket, DEAL_TYPE, dealType);
      // Is it a trade that must have an associated deal
      if(dealType == DEAL_TYPE_BUY || dealType == DEAL_TYPE_SELL){
         if(posMap.containsKey(dealPosId)){
            ulong firstTicket = posMap.getValue(dealPosId);
            posMap.deleteValue(dealPosId);
            Transaction newTransaction(firstTicket, dealTicket);
            ArrayResize(transactions, ArraySize(transactions) + 1);
            transactions[ArraySize(transactions) - 1] = newTransaction;
         } else {
            posMap.set(dealPosId, dealTicket);
         }
      } else {
         Transaction newTransaction(dealTicket);
         ArrayResize(transactions, ArraySize(transactions) + 1);
         transactions[ArraySize(transactions) - 1] = newTransaction;
      }
   }
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
      string reqDataInString = data.Serialize();
      StringToCharArray(reqDataInString, reqData, 0, StringLen(reqDataInString));
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
         if(lastError == 4060 || lastError == 4029 || lastError == 4006){
            showMessage(ERR_URL_NOT_ALLOWED_MSG);
         } else if(lastError == 5203){
            return sendRequest(url, data);
         } else if(lastError == 4000){
            return sendRequest(url, data);
         } else {
            MessageBox(lastError);
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

void showDealDetails(){
   HistorySelect(0, TimeCurrent());
   int totalDeals = HistoryDealsTotal();
   for(int i=0; i<totalDeals; i++){
      int dealTicket = HistoryDealGetTicket(i);
      ulong orderNumber;
      datetime dealTime;
      ulong dealType;
      string dealSymbol;
      string dealComment;
      double dealVolume;
      double dealCommission;
      double dealSwap;
      double dealPrice;
      double dealProfit;
      double dealSl;
      double dealTp;
      ulong dealPosId;
      ulong dealMagicNo;
      HistoryDealGetInteger(dealTicket, DEAL_ORDER, orderNumber);
      HistoryDealGetInteger(dealTicket, DEAL_TIME, dealTime);
      HistoryDealGetInteger(dealTicket, DEAL_TYPE, dealType);
      HistoryDealGetString(dealTicket, DEAL_SYMBOL, dealSymbol);
      HistoryDealGetString(dealTicket, DEAL_COMMENT, dealComment);
      HistoryDealGetDouble(dealTicket, DEAL_VOLUME, dealVolume);
      HistoryDealGetDouble(dealTicket, DEAL_COMMISSION, dealCommission);
      HistoryDealGetDouble(dealTicket, DEAL_SWAP, dealSwap);
      HistoryDealGetDouble(dealTicket, DEAL_PRICE, dealPrice);
      HistoryDealGetDouble(dealTicket, DEAL_PROFIT, dealProfit);
      HistoryDealGetDouble(dealTicket, DEAL_SL, dealSl);
      HistoryDealGetDouble(dealTicket, DEAL_TP, dealTp);
      HistoryDealGetInteger(dealTicket, DEAL_POSITION_ID, dealPosId);
      HistoryDealGetInteger(dealTicket, DEAL_MAGIC, dealMagicNo);
      string info = "";
      info += "Order number: " + orderNumber + "\n";
      info += "Deal Time: " + dealTime + "\n";
      info += "Deal Type: " + dealTypeInString(dealType) + "\n";
      info += "Deal Symbol: " + dealSymbol + "\n";
      info += "Deal Comment: " + dealComment + "\n";
      info += "Deal Volume: " + dealVolume + "\n";
      info += "Deal Commission: "  + dealCommission + "\n";
      info += "Deal Swap: " + dealSwap + "\n";
      info += "Deal Price: " + dealPrice + "\n";
      info += "Deal Profit: " + dealProfit + "\n";
      info += "Deal Stop Loss: " + dealSl + "\n";
      info += "Deal Take Profit: " + dealTp + "\n";
      info += "Deal Position Id: " + dealPosId + "\n";
      info += "Deal Magic Number: " + dealMagicNo + "\n";
      info += "Deal Ticket Number: " + dealTicket + "\n";
      MessageBox(info, "Deal Details", 0);
   }
}

string dealTypeInString(ulong dealType){
   switch(dealType){
      case DEAL_TYPE_BUY:
         return "buy";
      case DEAL_TYPE_SELL:
         return "sell";
      case DEAL_TYPE_BALANCE:
         return "deposit";
      default:
         return "undetermined for now";
   }
}