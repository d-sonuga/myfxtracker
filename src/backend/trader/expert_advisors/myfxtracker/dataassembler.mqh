#include <JAson.mqh>

interface BaseDataAssembler {
    public:
        CJAVal assembleAccountInfo();
        CJAVal assembleAllDataInJson();
        int getNoOfActualTransactions();
        CJAVal getUnsavedTransactionsInJson(int noOfActualTransactions, int noOfSavedTransactions);
};

string accountTradeModeToString(int accountTradeMode){
    if(accountTradeMode == ACCOUNT_TRADE_MODE_DEMO){
        return "demo";
    } else if(accountTradeMode == ACCOUNT_TRADE_MODE_CONTEST) {
        return "contest";
    } else {
        return "real";
    }
}

string accountStopoutModeInString(int accountStopoutMode){
    if(accountStopoutMode == ACCOUNT_STOPOUT_MODE_PERCENT){
        return "percentage";
    } else {
        return "money";
    }
}

#ifdef __MQL4__

class DataAssembler: public BaseDataAssembler {
    private:
        string getTransactionAction(int orderType){
            switch(orderType){
                case OP_BUY:
                    return "buy";
                case OP_SELL:
                    return "sell";
                default:
                    return IntegerToString(orderType);
            }
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
            transaction["action"] = this.getTransactionAction(OrderType());
            transaction["swap"] = OrderSwap();
            transaction["commission"] = OrderCommission();
            transaction["stop-loss"] = OrderStopLoss();
            transaction["take-profit"] = OrderTakeProfit();
            transaction["comment"] = OrderComment();
            transaction["magic-number"] = OrderMagicNumber();
            return transaction;
        }
    public:
        CJAVal assembleAccountInfo(){
            CJAVal accountInfo;
            accountInfo["account-name"] = AccountInfoString(ACCOUNT_NAME);
            accountInfo["account-company"] = AccountInfoString(ACCOUNT_COMPANY);
            accountInfo["account-login-number"] = AccountInfoInteger(ACCOUNT_LOGIN);
            return accountInfo;
        }
        CJAVal assembleAllDataInJson(){
            CJAVal allData = this.assembleAccountInfo();
            allData["account-currency"] = AccountCurrency();
            allData["account-server"] = AccountServer();
            allData["account-credit"] = AccountCredit();
            allData["account-profit"] = AccountProfit();
            allData["account-equity"] = AccountEquity();
            allData["account-margin"] = AccountMargin();
            allData["account-free-margin"] = AccountFreeMargin();
            allData["account-margin-level"] = AccountInfoDouble(ACCOUNT_MARGIN_LEVEL);
            allData["account-margin-call-level"] = AccountInfoDouble(ACCOUNT_MARGIN_SO_CALL);
            allData["account-margin-stopout-level"] = AccountInfoDouble(ACCOUNT_MARGIN_SO_SO);
            allData["account-leverage"] = AccountLeverage();
            allData["account-trade-mode"] = accountTradeModeToString(AccountInfoInteger(ACCOUNT_TRADE_MODE));
            allData["account-stopout-level"] = AccountStopoutLevel();
            allData["account-stopout-level-format"] = accountStopoutModeInString(AccountStopoutMode());
            int noOfActualTransactions = OrdersHistoryTotal();
            for(int i=0; i<noOfActualTransactions; i++){
                OrderSelect(i, SELECT_BY_POS, MODE_HISTORY);
                CJAVal transaction = this.assembleTransaction();
                allData["account-transactions"][i].Set(transaction);
            }
            return allData;
        }
        int getNoOfActualTransactions(){
            return OrdersHistoryTotal();
        }
        CJAVal getUnsavedTransactionsInJson(int noOfActualTransactions, int noOfSavedTransactions){
            CJAVal dataToSave = this.assembleAccountInfo();
            for(int i=noOfSavedTransactions; i<noOfActualTransactions; i++){
                OrderSelect(i, SELECT_BY_POS, MODE_HISTORY);
                CJAVal transaction = this.assembleTransaction();
                dataToSave["account-transactions"][i - noOfSavedTransactions].Set(transaction);
            }
            return dataToSave;
        }
};

#else

// A trade consists of 2 deals with the same position id
// A deposit consists of only 1 deal

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
         long posid;
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
         this.action = this.dealTypeInString(dealType);
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
      string dealTypeInString(ulong dealType){
        switch(dealType){
            case DEAL_TYPE_BUY:
                return "buy";
            case DEAL_TYPE_SELL:
                return "sell";
            case DEAL_TYPE_BALANCE:
                return "deposit";
            default:
                return DoubleToString(dealType);
        }
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

class Mapper {
    // Maps position ids to tickets so they can be used
    // to remember the first deal in a trade when the second key is encountered
    // It works by keeping the position id as the key and the deal id as the value
    // with corresponding indexes
   private:
      
      
      int noOfItems;
      int findKeyIndex(ulong key){
        int keyIndex = 0;
        while(keyIndex < ArraySize(this.keys)){
            if(this.keys[keyIndex] == key){
                return keyIndex;
            }
            keyIndex += 1;
        }
        return -1;
      }
   public:
      ulong keys[];
      ulong values[];
      Mapper(){
         this.noOfItems = 0;
      }
      bool containsKey(ulong key){
         int keyIndex = this.findKeyIndex(key);
         if(keyIndex != -1){
             return true;
         }
         //////MessageBox("posMap doesnt contain key: " + key);
         return false;
      }
      ulong getValue(ulong key){ 
        int index = this.findKeyIndex(key);
        return this.values[index];
      }
      void deleteValue(ulong key){
         int index = this.findKeyIndex(key);
         this.keys[index] = -1;
         this.values[index] = -1;
      }
      void set(ulong key, ulong value){
         this.noOfItems += 1;
         ArrayResize(this.keys, this.noOfItems);
         ArrayResize(this.values, this.noOfItems);
         this.keys[this.noOfItems - 1] = key;
         this.values[this.noOfItems - 1] = value;
         //////MessageBox("posMap set key " + key + " at index " + (this.noOfItems - 1));
         //////MessageBox("posMap keys now holds key " + this.keys[this.noOfItems - 1]);
      }
      int getNoOfItems(){
          return this.noOfItems;
      }
};

class DataAssembler: public BaseDataAssembler {
    private:
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
    public:
        CJAVal assembleAccountInfo(){
            CJAVal accountInfo;
            accountInfo["account-name"] = AccountInfoString(ACCOUNT_NAME);
            accountInfo["account-company"] = AccountInfoString(ACCOUNT_COMPANY);
            accountInfo["account-login-number"] = AccountInfoInteger(ACCOUNT_LOGIN);
            return accountInfo;
        }
        CJAVal assembleAllDataInJson(){
            CJAVal allData = this.assembleAccountInfo();
            Transaction transactions[];
            this.assembleTransactionDataInTransactions(transactions);
            allData["account-currency"] = AccountInfoString(ACCOUNT_CURRENCY);
            allData["account-server"] = AccountInfoString(ACCOUNT_SERVER);
            allData["account-credit"] = AccountInfoDouble(ACCOUNT_CREDIT);
            allData["account-profit"] = AccountInfoDouble(ACCOUNT_PROFIT);
            allData["account-equity"] = AccountInfoDouble(ACCOUNT_EQUITY);
            allData["account-margin"] = AccountInfoDouble(ACCOUNT_MARGIN);
            allData["account-free-margin"] = AccountInfoDouble(ACCOUNT_MARGIN_FREE);
            allData["account-margin-level"] = AccountInfoDouble(ACCOUNT_MARGIN_LEVEL);
            allData["account-margin-call-level"] = AccountInfoDouble(ACCOUNT_MARGIN_SO_CALL);
            allData["account-margin-stopout-level"] = AccountInfoDouble(ACCOUNT_MARGIN_SO_SO);
            allData["account-leverage"] = AccountInfoInteger(ACCOUNT_LEVERAGE);
            allData["account-trade-mode"] = accountTradeModeToString(AccountInfoInteger(ACCOUNT_TRADE_MODE));
            allData["account-stopout-level-format"] = accountStopoutModeInString(
                AccountInfoInteger(ACCOUNT_MARGIN_SO_MODE)
            );
            for(int i=0; i<ArraySize(transactions); i++){
                allData["account-transactions"][i].Set(transactions[i].intoJson());
            }
            return allData;
        }
        int getNoOfActualTransactions(){
            Transaction transactions[];
            this.assembleTransactionDataInTransactions(transactions);
            return ArraySize(transactions);
        }
        CJAVal getUnsavedTransactionsInJson(int noOfActualTransactions, int noOfSavedTransactions){
            CJAVal dataToSave = this.assembleAccountInfo();
            Transaction transactions[];
            this.assembleTransactionDataInTransactions(transactions);
            for(int i=noOfSavedTransactions; i<noOfActualTransactions; i++){
                dataToSave["account-transactions"][i - noOfSavedTransactions]
                    .Set(transactions[i].intoJson());
            }
            return dataToSave;
        }
};

#endif

// Unfinished DataAssembler
class TestDataAssembler: public BaseDataAssembler {
    public:
        CJAVal assembleAccountInfo(){
            CJAVal accountInfo;
            accountInfo["account-name"] = "dummy account name";
            accountInfo["account-company"] = "dummy account company";
            accountInfo["account-login-number"] = 000000002343;
            return accountInfo;
        }
        CJAVal assembleAllDataInJson(){
            CJAVal allData = this.assembleAccountInfo();
            allData["account-currency"] = "USD";
            allData["account-server"] = "dummy server";
            allData["account-credit"] = 0.5;
            allData["account-profit"] = 10000;
            allData["account-equity"] = 20000;
            allData["account-margin"] = 20;
            allData["account-free-margin"] = 15;
            allData["account-margin-level"] = 23;
            allData["account-margin-call-level"] = 34;
            allData["account-margin-stopout-level"] = 34;
            allData["account-leverage"] = 32;
            allData["account-trade-mode"] = "demo";
            allData["account-stopout-level-format"] ="money";
            //allData["account-transactions"] = [];
            return allData;
        }

        int getNoOfActualTransactions(){
            return 0;
        }
        CJAVal getUnsavedTransactionsInJson(int noOfActualTransactions, int noOfSavedTransactions){
            CJAVal unsavedTransactions;
            return unsavedTransactions;
        }
};

