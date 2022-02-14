#include <JAson.mqh>

interface BaseDataAssembler {
    public:
        CJAVal assembleAccountInfo();
        CJAVal assembleAllDataInJson();
        int getNoOfActualTransactions();
        CJAVal getUnsavedTransactionsInJson(int noOfActualTransactions, int noOfSavedTransactions);
};

#ifdef __MQL4__

class DataAssembler: public BaseDataAssembler {
    private:
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
    public:
        CJAVal assembleAccountInfo(){
            CJAVal accountInfo;
            accountInfo["account-name"] = AccountInfoString(ACCOUNT_NAME);
            accountInfo["account-company"] = AccountInfoString(ACCOUNT_COMPANY);
            accountInfo["account-login-number"] = AccountInfoInteger(ACCOUNT_LOGIN);
            return accountInfo;
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
                return "undetermined for now";
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
            CJAVal allData;
            Transaction transactions[];
            this.assembleTransactionDataInTransactions(transactions);
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